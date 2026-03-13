import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { OAuth2Client, TokenPayload } from "google-auth-library";
import { IAuthConfig } from "../configs/configs.interface";
import { GoogleLoginUseCase } from "@app/auth/google-login/google-login.use-case";
import { GoogleLoginDto } from "./dtos/google-login.dto";
import { ValidateAndRemoveRefreshTokenUseCase } from "@app/auth/validate-and-remove-refresh-token/validate-and-remove-refresh-token.use-case";
import { ICurrentSession } from "../shared/decorators/current-session.decorator";
import { ValidateAndRemoveRefreshTokenInput } from "@app/auth/validate-and-remove-refresh-token/validate-and-remove-refresh-token.input";
import { validateSync } from "class-validator";

@Injectable()
export class AuthService {
  private client: OAuth2Client;
  private clientId: string;

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private googleLoginUseCase: GoogleLoginUseCase,
    private validateRefreshTokenUseCase: ValidateAndRemoveRefreshTokenUseCase,
  ) {
    const clientId = this.configService.get("auth.googleClientId") as string;

    this.clientId = clientId;

    this.client = new OAuth2Client(clientId);
  }

  async googleLogin(loginDto: GoogleLoginDto) {
    let payload: TokenPayload | undefined;

    try {
      const ticket = await this.client.verifyIdToken({
        idToken: loginDto.googleToken,
        audience: this.clientId,
      });

      payload = ticket.getPayload();
    } catch (e) {
      console.error("Error verifying Google token:", e);
    }

    if (!payload) {
      throw new UnauthorizedException("Invalid Google token");
    }

    const { accessToken, refreshToken } = await this.getAuthTokens({
      name: payload.name,
      email: payload.email,
      googleId: payload.sub,
    });

    const output = await this.googleLoginUseCase.execute({
      googleId: payload.sub,
      email: payload.email!,
      name: payload.name!,
      refreshToken,
    });

    return {
      user: {
        id: output.userId,
        name: output.name,
        email: output.email,
        googleId: output.googleId,
      },
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(session: ICurrentSession) {
    const input = new ValidateAndRemoveRefreshTokenInput({
      googleId: session.googleId,
      refreshToken: session.refreshToken,
    });

    // TODO: TESTAR
    validateSync(input);

    const isValid = await this.validateRefreshTokenUseCase.execute(input);

    if (!isValid) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    const tokens = await this.getAuthTokens({
      name: session.name,
      email: session.email,
      googleId: session.googleId,
    });

    // TODO: SALVAR REFRESH TOKEN

    return tokens;
  }

  // biome-ignore lint/suspicious/noExplicitAny: <Payload can be any>
  private async getAuthTokens(payload: any) {
    const authConfig = this.configService.get<IAuthConfig>("auth")!;

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: authConfig.jwtSecret,
        expiresIn: authConfig.jwtExpirationTime,
      }),

      this.jwtService.signAsync(payload, {
        secret: authConfig.jwtRefreshSecret,
        expiresIn: authConfig.jwtRefreshExpirationTime,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
