import { IRefreshTokenRepository } from "@domain/refresh-token/refresh-token.repository";

export const REPLACE_REFRESH_TOKEN_UNIT_OF_WORK =
  "REPLACE_REFRESH_TOKEN_UNIT_OF_WORK";

export type ReplaceRefreshTokenRepositories = {
  refreshTokenRepository: IRefreshTokenRepository;
};

export interface IReplaceRefreshTokenUnitOfWork {
  runInTransaction<T>(
    work: (repositories: ReplaceRefreshTokenRepositories) => Promise<T>,
  ): Promise<T>;
}
