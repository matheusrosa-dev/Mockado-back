import { Body, Controller, Post } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { OAuth2Client } from "google-auth-library";

@Controller("google-auth")
export class GoogleAuthController {
  private client: OAuth2Client;

  constructor(configService: ConfigService) {
    const clientId = configService.get("googleAuth.clientId");

    this.client = new OAuth2Client(clientId);
  }

  @Post()
  async login(@Body() loginDto: { token: string }) {
    const ticket = await this.client.verifyIdToken({
      idToken: loginDto.token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    return {
      googleId: payload?.sub,
      email: payload?.email,
      name: payload?.name,
      picture: payload?.picture,
    };
  }
}
