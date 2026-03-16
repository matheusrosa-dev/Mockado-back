import { IHashService } from "@app/auth/services/hash.service";
import { RefreshToken } from "@domain/refresh-token/refresh-token.entity";
import { IRefreshTokenRepository } from "@domain/refresh-token/refresh-token.repository";
import { Either } from "@domain/shared/either";
import { NotFoundError } from "@domain/shared/errors/not-found.error";
import { Uuid } from "@domain/shared/value-objects/uuid.vo";

type RefreshTokenExistsValidatorResponse = Either<
  {
    refreshTokenId: string;
    userId: string;
    refreshTokenHash: string;
    createdAt: Date;
    user: {
      userId: string;
      name: string;
      email: string;
    };
  },
  NotFoundError
>;

export class RefreshTokenExistsValidator {
  constructor(
    private refreshTokenRepository: IRefreshTokenRepository,
    private hashService: IHashService,
  ) {}

  async validate(props: {
    userId: Uuid;
    refreshToken: string;
  }): Promise<RefreshTokenExistsValidatorResponse> {
    const refreshTokens = await this.refreshTokenRepository.findManyByUserId(
      props.userId,
    );

    for (const refreshToken of refreshTokens) {
      const isMatch = await this.hashService.compare(
        props.refreshToken,
        refreshToken.refreshTokenHash,
      );

      if (!isMatch) continue;

      return Either.ok(refreshToken);
    }

    return Either.fail(
      new NotFoundError(props.userId.toString(), RefreshToken),
    );
  }
}
