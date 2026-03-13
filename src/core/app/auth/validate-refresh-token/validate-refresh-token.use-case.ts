import { IUseCase } from "@app/shared/use-case.interface";
import { IRefreshTokenRepository } from "@domain/refresh-token/refresh-token.repository";
import { ValidateRefreshTokenInput } from "./validate-refresh-token.input";
import bcrypt from "bcrypt";

export class ValidateRefreshTokenUseCase
  implements IUseCase<ValidateRefreshTokenInput, ValidateRefreshTokenOutput>
{
  constructor(
    private readonly refreshTokenRepository: IRefreshTokenRepository,
  ) {}

  async execute(
    input: ValidateRefreshTokenInput,
  ): Promise<ValidateRefreshTokenOutput> {
    const refreshTokens = await this.refreshTokenRepository.findManyByAnyId({
      googleId: input.googleId,
    });

    const hasValidRefreshToken = refreshTokens.some((refreshToken) => {
      const isHashValid = bcrypt.compareSync(
        input.refreshToken,
        refreshToken.refreshTokenHash,
      );

      return isHashValid;
    });

    return hasValidRefreshToken;
  }
}

type ValidateRefreshTokenOutput = boolean;
