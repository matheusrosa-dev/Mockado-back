import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AUTH_PROVIDERS } from "./auth.provider";

@Module({
  controllers: [AuthController],
  providers: [
    ...Object.values(AUTH_PROVIDERS.REPOSITORIES),
    ...Object.values(AUTH_PROVIDERS.USE_CASES),
  ],
})
export class AuthModule {}
