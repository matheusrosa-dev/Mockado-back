import { DataSource } from "typeorm";
import { UserTypeOrmRepository } from "../../core/infra/user/db/typeorm/user-typeorm.repository";
import { FactoryProvider } from "@nestjs/common";
import { GenerateApiKeyUseCase } from "../../core/app/me/use-cases/generate-api-key/generate-api-key.use-case";
import { IUserRepository } from "../../core/domain/user/user.repository";
import { IApiKeyService } from "../../core/app/me/services/api-key.service";
import { CryptoApiKeyService } from "../../core/infra/me/services/crypto-api-key.service";

const REPOSITORIES = {
  USER: {
    provide: UserTypeOrmRepository,
    useFactory: (dataSource: DataSource) =>
      new UserTypeOrmRepository(dataSource),
    inject: [DataSource],
  } as FactoryProvider,
};

const SERVICES = {
  API_KEY: {
    provide: CryptoApiKeyService,
    useFactory: () => new CryptoApiKeyService(),
  } as FactoryProvider,
};

const USE_CASES = {
  GENERATE_API_KEY: {
    provide: GenerateApiKeyUseCase,
    useFactory: (
      userRepository: IUserRepository,
      apiKeyService: IApiKeyService,
    ) => {
      return new GenerateApiKeyUseCase(userRepository, apiKeyService);
    },
    inject: [REPOSITORIES.USER.provide, SERVICES.API_KEY.provide],
  } as FactoryProvider,
};

export const ME_PROVIDERS = {
  REPOSITORIES,
  USE_CASES,
  SERVICES,
};
