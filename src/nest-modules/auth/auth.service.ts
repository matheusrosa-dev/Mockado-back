import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { OAuth2Client, TokenPayload } from "google-auth-library";
import { IAuthConfig } from "../configs/configs.interface";
import { GoogleLoginUseCase } from "@app/auth/google-login/google-login.use-case";
import { GoogleLoginDto } from "./dtos/google-login.dto";

@Injectable()
export class AuthService {
  private client: OAuth2Client;
  private clientId: string;

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private googleLoginUseCase: GoogleLoginUseCase,
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
    } catch {
      throw new UnauthorizedException("Invalid Google token");
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

  async refreshTokens(userId: string, refreshToken: string) {}

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
