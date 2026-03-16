import { IsNotEmpty, IsString } from "class-validator";

export class GoogleLoginDto {
  @IsNotEmpty()
  @IsString()
  googleToken: string;

  constructor(props: GoogleLoginDto) {
    if (!props) return;

    Object.assign(this, props);
  }
}
