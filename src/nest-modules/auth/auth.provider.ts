import { DataSource } from "typeorm";
import { UserTypeOrmRepository } from "@infra/user/db/typeorm/user-typeorm.repository";
import { RefreshTokenTypeOrmRepository } from "@infra/refresh-token/db/typeorm/refresh-token-typeorm.repository";
import { IUserRepository } from "@domain/user/user.repository";
import { IRefreshTokenRepository } from "@domain/refresh-token/refresh-token.repository";
import { GoogleLoginUseCase } from "@app/auth/google-login/google-login.use-case";
import { FactoryProvider } from "@nestjs/common";

const REPOSITORIES = {
  USER: {
    provide: UserTypeOrmRepository,
    useFactory: (dataSource: DataSource) =>
      new UserTypeOrmRepository(dataSource),
    inject: [DataSource],
  } as FactoryProvider,
  REFRESH_TOKEN: {
    provide: RefreshTokenTypeOrmRepository,
    useFactory: (dataSource: DataSource) =>
      new RefreshTokenTypeOrmRepository(dataSource),
    inject: [DataSource],
  } as FactoryProvider,
};

const USE_CASES = {
  GOOGLE_LOGIN: {
    provide: GoogleLoginUseCase,
    useFactory: (
      endpointRepository: IUserRepository,
      refreshTokenRepository: IRefreshTokenRepository,
    ) => {
      return new GoogleLoginUseCase(endpointRepository, refreshTokenRepository);
    },
    inject: [REPOSITORIES.USER.provide, REPOSITORIES.REFRESH_TOKEN.provide],
  } as FactoryProvider,
};

export const AUTH_PROVIDERS = {
  REPOSITORIES,
  USE_CASES,
};
