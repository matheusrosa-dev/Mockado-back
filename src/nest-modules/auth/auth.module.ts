import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AUTH_PROVIDERS } from "./auth.provider";
import { AccessTokenStrategy } from "./strategies/access-token.strategy";
import { RefreshTokenStrategy } from "./strategies/refresh-token.strategy";

@Module({
  controllers: [AuthController],
  providers: [
    ...Object.values(AUTH_PROVIDERS.REPOSITORIES),
    ...Object.values(AUTH_PROVIDERS.UNIT_OF_WORKS),
    ...Object.values(AUTH_PROVIDERS.SERVICES),
    ...Object.values(AUTH_PROVIDERS.USE_CASES),
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
})
export class AuthModule {}
