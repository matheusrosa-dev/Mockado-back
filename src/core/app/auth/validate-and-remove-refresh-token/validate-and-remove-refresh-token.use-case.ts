import { IUseCase } from "@app/shared/use-case.interface";
import { IRefreshTokenRepository } from "@domain/refresh-token/refresh-token.repository";
import { ValidateAndRemoveRefreshTokenInput } from "./validate-and-remove-refresh-token.input";
import bcrypt from "bcrypt";

export class ValidateAndRemoveRefreshTokenUseCase
  implements
    IUseCase<
      ValidateAndRemoveRefreshTokenInput,
      ValidateAndRemoveRefreshTokenOutput
    >
{
  constructor(
    private readonly refreshTokenRepository: IRefreshTokenRepository,
  ) {}

  async execute(
    input: ValidateAndRemoveRefreshTokenInput,
  ): Promise<ValidateAndRemoveRefreshTokenOutput> {
    const refreshTokens = await this.refreshTokenRepository.findManyByAnyId({
      googleId: input.googleId,
    });

    for (const refreshToken of refreshTokens) {
      const isMatch = await bcrypt.compare(
        input.refreshToken,
        refreshToken.refreshTokenHash,
      );

      if (!isMatch) continue;

      await this.refreshTokenRepository.delete(refreshToken.refreshTokenId);

      return true;
    }

    return false;
  }
}

type ValidateAndRemoveRefreshTokenOutput = boolean;
