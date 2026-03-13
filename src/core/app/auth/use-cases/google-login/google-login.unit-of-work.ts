import { IRefreshTokenRepository } from "@domain/refresh-token/refresh-token.repository";
import { IUserRepository } from "@domain/user/user.repository";

export const GOOGLE_LOGIN_UNIT_OF_WORK = "GOOGLE_LOGIN_UNIT_OF_WORK";

export type GoogleLoginRepositories = {
  userRepository: IUserRepository;
  refreshTokenRepository: IRefreshTokenRepository;
};

export interface IGoogleLoginUnitOfWork {
  runInTransaction<T>(
    work: (repositories: GoogleLoginRepositories) => Promise<T>,
  ): Promise<T>;
}
