import { IGoogleAuthService } from "@app/auth/services/google-auth.service";
import { OAuth2Client, TokenPayload } from "google-auth-library";
import { AuthenticationError } from "@domain/shared/errors/authentication.error";

export class GoogleAuthService implements IGoogleAuthService {
  private client: OAuth2Client;
  private clientId: string;

  constructor(clientId: string) {
    this.clientId = clientId;
    this.client = new OAuth2Client(clientId);
  }

  async verifyToken(token: string) {
    let payload: TokenPayload | undefined;

    try {
      const ticket = await this.client.verifyIdToken({
        idToken: token,
        audience: this.clientId,
      });

      payload = ticket.getPayload();
    } catch (e) {
      console.error("Error verifying Google token:", e);
    }

    if (!payload) {
      throw new AuthenticationError("Invalid Google token");
    }

    return {
      googleId: payload.sub,
      email: payload.email!,
      name: payload.name!,
    };
  }
}
