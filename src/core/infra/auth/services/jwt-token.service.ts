import jwt from "jsonwebtoken";
import {
  AuthTokenPayload,
  IAuthTokenService,
} from "../../../app/auth/services/auth-token.service";

type Config = {
  jwtSecret: string;
  jwtExpirationTime: number;
  jwtRefreshSecret: string;
  jwtRefreshExpirationTime: number;
};

export class JwtTokenService implements IAuthTokenService {
  constructor(private config: Config) {}

  async generate(payload: AuthTokenPayload) {
    const accessToken = jwt.sign(payload, this.config.jwtSecret, {
      expiresIn: this.config.jwtExpirationTime,
    });

    const refreshToken = jwt.sign(payload, this.config.jwtRefreshSecret, {
      expiresIn: this.config.jwtRefreshExpirationTime,
    });

    return { accessToken, refreshToken };
  }
}
