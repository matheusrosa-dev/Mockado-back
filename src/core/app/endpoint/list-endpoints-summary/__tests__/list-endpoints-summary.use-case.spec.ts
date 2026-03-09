import { EndpointInMemoryRepository } from "@infra/endpoint/db/in-memory/endpoint-in-memory.repository";
import { IEndpointRepository } from "@domain/endpoint/endpoint.repository";
import { ListEndpointsSummaryUseCase } from "../list-endpoints-summary.use-case";
import { EndpointFactory } from "@domain/endpoint/endpoint.entity";

describe("List Endpoints Summary Use Case - Unit Tests", () => {
  let useCase: ListEndpointsSummaryUseCase;
  let repository: IEndpointRepository;

  beforeEach(() => {
    repository = new EndpointInMemoryRepository();
    useCase = new ListEndpointsSummaryUseCase(repository);
  });

  describe("execute()", () => {
    it("should list all endpoints summary", async () => {
      const endpoints = [
        EndpointFactory.fake().oneEndpoint().withStatusCode(204).build(),
        EndpointFactory.fake().oneEndpoint().withStatusCode(204).build(),
      ];

      const inMemoryRepository = repository as EndpointInMemoryRepository;

      inMemoryRepository.items = endpoints;

      const endpointsList = await useCase.execute();

      expect(endpointsList).toEqual(
        endpoints.map((endpoint) => ({
          id: endpoint.entity_id.id,
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
