import { CreateEndpointUseCase } from "@app/endpoint/create-endpoint/create-endpoint.use-case";
import { UpdateEndpointUseCase } from "@app/endpoint/update-endpoint/update-endpoint.use-case";
import { FindEndpointUseCase } from "@app/endpoint/find-endpoint/find-endpoint.use-case";
import { DeleteEndpointUseCase } from "@app/endpoint/delete-endpoint/delete-endpoint.use-case";
import { ListEndpointsUseCase } from "@app/endpoint/list-endpoints/list-endpoints.use-case";
import { IEndpointRepository } from "@domain/endpoint/endpoint.repository";
import { EndpointInMemoryRepository } from "@infra/endpoint/db/in-memory/endpoint-in-memory.repository";
import { EndpointTypeOrmRepository } from "@infra/endpoint/db/typeorm/endpoint-typeorm.repository";
import {
  ClassProvider,
  ExistingProvider,
  FactoryProvider,
} from "@nestjs/common";
import { DataSource } from "typeorm";

const REPOSITORIES = {
  ENDPOINT_REPOSITORY: {
    provide: "EndpointRepository",
    useExisting: EndpointTypeOrmRepository,
  } as ExistingProvider,

  ENDPOINT_IN_MEMORY_REPOSITORY: {
    provide: EndpointInMemoryRepository,
    useClass: EndpointInMemoryRepository,
  } as ClassProvider,

  ENDPOINT_TYPEORM_REPOSITORY: {
    provide: EndpointTypeOrmRepository,
    useFactory: (dataSource: DataSource) =>
      new EndpointTypeOrmRepository(dataSource),
    inject: [DataSource],
  } as FactoryProvider,
};

const useCases = [
  ListEndpointsUseCase,
  CreateEndpointUseCase,
  UpdateEndpointUseCase,
  FindEndpointUseCase,
  DeleteEndpointUseCase,
];

const USE_CASES_PROVIDERS: FactoryProvider[] = useCases.map((useCase) => ({
  provide: useCase,
  useFactory: (endpointRepository: IEndpointRepository) =>
    new useCase(endpointRepository),
  inject: [REPOSITORIES.ENDPOINT_REPOSITORY.provide],
}));

export const ENDPOINT_PROVIDERS = {
  REPOSITORIES,
  USE_CASES: USE_CASES_PROVIDERS,
};
