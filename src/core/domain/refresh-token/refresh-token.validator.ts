import { IsNotEmpty, IsString, Length, Matches } from "class-validator";
import { ClassValidatorFields } from "../shared/validators/class-validator-fields";
import { Notification } from "../shared/notification";
import { RefreshToken } from "./refresh-token.entity";

const refreshTokenValidationGroups = ["refreshTokenHash", "googleId"] as const;

export type RefreshTokenValidationGroup =
  (typeof refreshTokenValidationGroups)[number];

class RefreshTokenRules {
  @IsNotEmpty({ groups: ["refreshTokenHash"] as RefreshTokenValidationGroup[] })
  @IsString({ groups: ["refreshTokenHash"] as RefreshTokenValidationGroup[] })
  _refreshTokenHash: string;

  @IsNotEmpty({ groups: ["googleId"] as RefreshTokenValidationGroup[] })
  @IsString({ groups: ["googleId"] as RefreshTokenValidationGroup[] })
  @Matches(/^\d+$/, {
    groups: ["googleId"] as RefreshTokenValidationGroup[],
    message: "Only digits are allowed in googleId",
  })
  @Length(21, 21, {
    groups: ["googleId"] as RefreshTokenValidationGroup[],
    message: "googleId must be exactly 21 digits",
  })
  _googleId: string;

  // TODO: VERIFICAR SE PRECISA DESSE OBJECT ASSIGN EM TODA A APLICACAO
  constructor(entity: RefreshToken) {
    Object.assign(this, entity);
  }
}

export class RefreshTokenValidator extends ClassValidatorFields {
  validate(
    notification: Notification,
    data: RefreshToken,
    fields?: RefreshTokenValidationGroup[],
  ): boolean {
    const fieldsToValidate = fields?.length
      ? fields
      : refreshTokenValidationGroups;

    return super.validate(
      notification,
      new RefreshTokenRules(data),
      fieldsToValidate as string[],
    );
  }
}
