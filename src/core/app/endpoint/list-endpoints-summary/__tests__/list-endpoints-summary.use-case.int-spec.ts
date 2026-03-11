import { IEndpointRepository } from "@domain/endpoint/endpoint.repository";
import { ListEndpointsSummaryUseCase } from "../list-endpoints-summary.use-case";
import { EndpointFactory } from "@domain/endpoint/endpoint.entity";
import { setupTypeOrm } from "@infra/shared/testing/helpers";
import { EndpointTypeOrmRepository } from "@infra/endpoint/db/typeorm/endpoint-typeorm.repository";
import { EndpointModel } from "@infra/endpoint/db/typeorm/endpoint-typeorm.model";

describe("List Endpoints Summary Use Case - Integration Tests", () => {
  let useCase: ListEndpointsSummaryUseCase;
  let repository: IEndpointRepository;

  const { dataSource } = setupTypeOrm({
    entities: [EndpointModel],
  });

  beforeEach(() => {
    repository = new EndpointTypeOrmRepository(dataSource);
    useCase = new ListEndpointsSummaryUseCase(repository);
  });

  describe("execute()", () => {
    it("should list all endpoints summary", async () => {
      const endpoints = [
        EndpointFactory.fake().oneEndpoint().build(),
        EndpointFactory.fake().oneEndpoint().build(),
      ];

      for (const endpoint of endpoints) {
        await repository.insert(endpoint);
      }

      const endpointsList = await useCase.execute();

      expect(endpointsList).toEqual(
        endpoints.map((endpoint) => ({
          id: endpoint.endpointId.toString(),
          title: endpoint.title,
          method: endpoint.method,
        })),
      );
    });

    it("should return an empty array if no endpoints found", async () => {
      const endpointsList = await useCase.execute();
      expect(endpointsList).toEqual([]);
    });
  });
});
