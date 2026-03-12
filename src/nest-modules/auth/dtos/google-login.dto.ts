import { GoogleLoginInput } from "@app/auth/google-login/google-login.input";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class GoogleLoginDto extends GoogleLoginInput {
  @IsOptional()
  declare refreshToken: string;

  @IsNotEmpty()
  @IsString()
  googleToken: string;
}
