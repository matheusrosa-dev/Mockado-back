import { DataSource } from "typeorm";
import { UserTypeOrmRepository } from "../../core/infra/user/db/typeorm/user-typeorm.repository";
import { RefreshTokenTypeOrmRepository } from "../../core/infra/refresh-token/db/typeorm/refresh-token-typeorm.repository";
import { IRefreshTokenRepository } from "../../core/domain/refresh-token/refresh-token.repository";
import { GoogleLoginUseCase } from "../../core/app/auth/use-cases/google-login/google-login.use-case";
import { ReplaceRefreshTokenUseCase } from "../../core/app/auth/use-cases/replace-refresh-token/replace-refresh-token.use-case";
import {
  GOOGLE_LOGIN_UNIT_OF_WORK,
  IGoogleLoginUnitOfWork,
} from "../../core/app/auth/use-cases/google-login/google-login.unit-of-work";
import { TypeOrmGoogleLoginUnitOfWork } from "../../core/infra/auth/google-login/typeorm-google-login.unit-of-work";
import { JwtTokenService } from "../../core/infra/auth/services/jwt-token.service";
import { IAuthConfig } from "../configs/configs.interface";
import { IGoogleAuthService } from "../../core/app/auth/services/google-auth.service";
import { IHashService } from "../../core/app/auth/services/hash.service";
import { GoogleAuthService } from "../../core/infra/auth/services/google-auth.service";
import { IAuthTokenService } from "../../core/app/auth/services/auth-token.service";
import { BcryptHashService } from "../../core/infra/auth/services/bcrypt-hash.service";
import { LogoutUseCase } from "../../core/app/auth/use-cases/logout/logout.use-case";
import {
  IReplaceRefreshTokenUnitOfWork,
  REPLACE_REFRESH_TOKEN_UNIT_OF_WORK,
} from "../../core/app/auth/use-cases/replace-refresh-token/replace-refresh-token.unit-of-work";
import { TypeOrmReplaceRefreshTokenUnitOfWork } from "../../core/infra/auth/replace-refresh-token/typeorm-replace-refresh-token.unit-of-work";
import { ConfigService } from "@nestjs/config";
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

const UNIT_OF_WORKS = {
  GOOGLE_LOGIN: {
    provide: GOOGLE_LOGIN_UNIT_OF_WORK,
    useFactory: (dataSource: DataSource) => {
      return new TypeOrmGoogleLoginUnitOfWork(dataSource);
    },
    inject: [DataSource],
  } as FactoryProvider,

  REPLACE_REFRESH_TOKEN: {
    provide: REPLACE_REFRESH_TOKEN_UNIT_OF_WORK,
    useFactory: (dataSource: DataSource) => {
      return new TypeOrmReplaceRefreshTokenUnitOfWork(dataSource);
    },
    inject: [DataSource],
  } as FactoryProvider,
};

const SERVICES = {
  JWT_TOKEN: {
    provide: JwtTokenService,
    useFactory: (configService: ConfigService) => {
      const authConfig = configService.get<IAuthConfig>("auth")!;

      return new JwtTokenService(authConfig);
    },
    inject: [ConfigService],
  } as FactoryProvider,

  GOOGLE_AUTH: {
    provide: GoogleAuthService,
    useFactory: (configService: ConfigService) => {
      const googleClientId = configService.get<string>("auth.googleClientId")!;

      return new GoogleAuthService(googleClientId);
    },
    inject: [ConfigService],
  } as FactoryProvider,

  BCRYPT_HASH: {
    provide: BcryptHashService,
    useFactory: () => new BcryptHashService(),
  } as FactoryProvider,
};

const USE_CASES = {
  GOOGLE_LOGIN: {
    provide: GoogleLoginUseCase,
    useFactory: (
      googleLoginUnitOfWork: IGoogleLoginUnitOfWork,
      authTokenService: IAuthTokenService,
      googleAuthService: IGoogleAuthService,
      hashService: IHashService,
    ) => {
      return new GoogleLoginUseCase(
        googleLoginUnitOfWork,
        authTokenService,
        googleAuthService,
        hashService,
      );
    },
    inject: [
      UNIT_OF_WORKS.GOOGLE_LOGIN.provide,
      SERVICES.JWT_TOKEN.provide,
      SERVICES.GOOGLE_AUTH.provide,
      SERVICES.BCRYPT_HASH.provide,
    ],
  } as FactoryProvider,

  REPLACE_REFRESH_TOKEN: {
    provide: ReplaceRefreshTokenUseCase,
    useFactory: (
      replaceRefreshTokenUnitOfWork: IReplaceRefreshTokenUnitOfWork,
      hashService: IHashService,
      authTokenService: IAuthTokenService,
    ) => {
      return new ReplaceRefreshTokenUseCase(
        replaceRefreshTokenUnitOfWork,
        hashService,
        authTokenService,
      );
    },
    inject: [
      UNIT_OF_WORKS.REPLACE_REFRESH_TOKEN.provide,
      SERVICES.BCRYPT_HASH.provide,
      SERVICES.JWT_TOKEN.provide,
    ],
  } as FactoryProvider,

  LOGOUT: {
    provide: LogoutUseCase,
    useFactory: (
      refreshTokenRepository: IRefreshTokenRepository,
      hashService: IHashService,
    ) => {
      return new LogoutUseCase(refreshTokenRepository, hashService);
    },
    inject: [REPOSITORIES.REFRESH_TOKEN.provide, SERVICES.BCRYPT_HASH.provide],
  } as FactoryProvider,
};

export const AUTH_PROVIDERS = {
  REPOSITORIES,
  UNIT_OF_WORKS,
  USE_CASES,
  SERVICES,
};
