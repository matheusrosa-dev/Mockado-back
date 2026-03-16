import { IHashService } from "@app/auth/services/hash.service";
import { RefreshTokenExistsValidator } from "@app/auth/validations/refresh-token-exists/refresh-token-exists.validator";
import { IUseCase } from "@app/shared/use-case.interface";
import { IRefreshTokenRepository } from "@domain/refresh-token/refresh-token.repository";
import { Uuid } from "@domain/shared/value-objects/uuid.vo";

export class LogoutUseCase implements IUseCase<LogoutInput, LogoutOutput> {
  private refreshTokenExistsValidator: RefreshTokenExistsValidator;

  constructor(
    private refreshTokenRepository: IRefreshTokenRepository,
    private hashService: IHashService,
  ) {
    this.refreshTokenExistsValidator = new RefreshTokenExistsValidator(
      this.refreshTokenRepository,
      this.hashService,
    );
  }

  async execute(input: LogoutInput): Promise<LogoutOutput> {
    const [refreshTokenExists] = (
      await this.refreshTokenExistsValidator.validate({
        userId: new Uuid(input.userId),
        refreshToken: input.refreshToken,
      })
    ).asArray();

    if (refreshTokenExists) {
      await this.refreshTokenRepository.delete(
        new Uuid(refreshTokenExists.refreshTokenId),
      );
    }
  }
}

type LogoutInput = {
  userId: string;
  refreshToken: string;
};

type LogoutOutput = void;
