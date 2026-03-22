import { CreateEndpointUseCase } from "../../core/app/endpoint/use-cases/create-endpoint/create-endpoint.use-case";
import { UpdateEndpointUseCase } from "../../core/app/endpoint/use-cases/update-endpoint/update-endpoint.use-case";
import { FindEndpointByIdUseCase } from "../../core/app/endpoint/use-cases/find-endpoint-by-id/find-endpoint-by-id.use-case";
import { IEndpointRepository } from "../../core/domain/endpoint/endpoint.repository";
import { EndpointTypeOrmRepository } from "../../core/infra/endpoint/db/typeorm/endpoint-typeorm.repository";
import { FactoryProvider } from "@nestjs/common";
import { DataSource } from "typeorm";
import { ListEndpointsSummaryUseCase } from "../../core/app/endpoint/use-cases/list-endpoints-summary/list-endpoints-summary.use-case";
import { UserTypeOrmRepository } from "../../core/infra/user/db/typeorm/user-typeorm.repository";
import { IUserRepository } from "../../core/domain/user/user.repository";

const REPOSITORIES = {
  ENDPOINT: {
    provide: EndpointTypeOrmRepository,
    useFactory: (dataSource: DataSource) =>
      new EndpointTypeOrmRepository(dataSource),
    inject: [DataSource],
  } as FactoryProvider,

  USER: {
    provide: UserTypeOrmRepository,
    useFactory: (dataSource: DataSource) =>
      new UserTypeOrmRepository(dataSource),
    inject: [DataSource],
  },
};

const USE_CASES = {
  CREATE_ENDPOINT: {
    provide: CreateEndpointUseCase,
    useFactory: (
      endpointRepository: IEndpointRepository,
      userRepository: IUserRepository,
    ) => new CreateEndpointUseCase(endpointRepository, userRepository),
    inject: [REPOSITORIES.ENDPOINT.provide, REPOSITORIES.USER.provide],
  } as FactoryProvider,

  UPDATE_ENDPOINT: {
    provide: UpdateEndpointUseCase,
    useFactory: (endpointRepository: IEndpointRepository) =>
      new UpdateEndpointUseCase(endpointRepository),
    inject: [REPOSITORIES.ENDPOINT.provide],
  } as FactoryProvider,

  FIND_ENDPOINT: {
    provide: FindEndpointByIdUseCase,
    useFactory: (endpointRepository: IEndpointRepository) =>
      new FindEndpointByIdUseCase(endpointRepository),
    inject: [REPOSITORIES.ENDPOINT.provide],
  } as FactoryProvider,

  LIST_ENDPOINTS_SUMMARY: {
    provide: ListEndpointsSummaryUseCase,
    useFactory: (endpointRepository: IEndpointRepository) =>
      new ListEndpointsSummaryUseCase(endpointRepository),
    inject: [REPOSITORIES.ENDPOINT.provide],
  } as FactoryProvider,
};

export const ENDPOINT_PROVIDERS = {
  REPOSITORIES,
  USE_CASES,
};
