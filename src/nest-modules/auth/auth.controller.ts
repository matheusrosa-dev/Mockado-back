import { Body, Controller, Post, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { OAuth2Client } from "google-auth-library";
import { GoogleLoginDto } from "./dtos/google-login.dto";

@Controller("auth")
export class AuthController {
  private client: OAuth2Client;

  constructor(configService: ConfigService) {
    const clientId = configService.get("googleAuth.clientId") as string;

    this.client = new OAuth2Client(clientId);
  }

  @Post("google")
  async googleLogin(@Body() loginDto: GoogleLoginDto) {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken: loginDto.googleToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();

      console.log("Google login payload:", payload);

      return {
        googleId: payload?.sub,
        email: payload?.email,
        name: payload?.name,
        picture: payload?.picture,
      };
    } catch {
      throw new UnauthorizedException("Invalid Google token");
    }
  }
}
