import { IsNotEmpty, IsString, Length, Matches } from "class-validator";

type ConstructorProps = {
  googleId: string;
  refreshToken: string;
};

export class ValidateAndRemoveRefreshTokenInput {
  @IsNotEmpty()
  @IsString()
  @Matches(/^\d+$/)
  @Length(21, 21, {
    message: "googleId must be exactly 21 digits",
  })
  googleId: string;

  @IsNotEmpty()
  @IsString()
  refreshToken: string;

  constructor(props: ConstructorProps) {
    if (!props) return;

    Object.assign(this, props);
  }
}
