import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-jwt";
import { Request } from "express";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  "jwt-refresh",
) {
  constructor(configService: ConfigService) {
    const jwtRefreshSecret = configService.get(
      "auth.jwtRefreshSecret",
    ) as string;

    super({
      jwtFromRequest: (req: Request) => req?.cookies?.refresh_token ?? null,
      secretOrKey: jwtRefreshSecret,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload) {
    const refreshToken = req?.cookies?.refresh_token ?? null;

    return {
      ...payload,
      refreshToken,
    };
  }
}
