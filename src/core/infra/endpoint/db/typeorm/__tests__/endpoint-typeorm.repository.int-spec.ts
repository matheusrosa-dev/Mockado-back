import { NotFoundError } from "@domain/shared/errors/not-found.error";
import { Uuid } from "@domain/shared/value-objects/uuid.vo";
import { EndpointFactory } from "@domain/endpoint/endpoint.entity";
import { ResponseBodyType } from "@domain/endpoint/endpoint.types";
import { setupTypeOrm } from "../../../../shared/testing/helpers";
import { EndpointModel } from "../endpoint-typeorm.model";
import { EndpointTypeOrmRepository } from "../endpoint-typeorm.repository";
import { StatusCode } from "@domain/endpoint/value-objects/status-code.vo";

describe("EndpointTypeOrmRepository - Integration Tests", () => {
  const { dataSource } = setupTypeOrm({ entities: [EndpointModel] });

  let repository: EndpointTypeOrmRepository;

  beforeEach(() => {
    repository = new EndpointTypeOrmRepository(dataSource);
  });

  describe("insert()", () => {
    it("should insert an endpoint without body", async () => {
      const endpoint = EndpointFactory.fake()
        .oneEndpoint()
        .withStatusCode(new StatusCode(204))
        .build();

      await repository.insert(endpoint);

      const found = await repository.findById(endpoint.entity_id);

      expect(found).not.toBeNull();
      expect(found!.entity_id.id).toBe(endpoint.entity_id.id);
      expect(found!.title).toBe(endpoint.title);
      expect(found!.method).toBe(endpoint.method);
      expect(found!.statusCode.statusCode).toBe(204);
      expect(found!.responseBodyType).toBeUndefined();
    });

    it("should insert an endpoint with JSON body", async () => {
      const endpoint = EndpointFactory.fake()
        .oneEndpoint()
        .withStatusCode(new StatusCode(200))
        .withResponseBodyType(ResponseBodyType.JSON)
        .withResponseJson('{"key":"value"}')
        .build();

      await repository.insert(endpoint);

      const found = await repository.findById(endpoint.entity_id);

      expect(found).not.toBeNull();
      expect(found!.responseBodyType).toBe(ResponseBodyType.JSON);
      expect(found!.responseJson).toBe('{"key":"value"}');
    });

    it("should insert an endpoint with TEXT body", async () => {
      const endpoint = EndpointFactory.fake()
        .oneEndpoint()
        .withStatusCode(new StatusCode(200))
        .withResponseBodyType(ResponseBodyType.TEXT)
        .withResponseText("hello world")
        .build();

      await repository.insert(endpoint);

      const found = await repository.findById(endpoint.entity_id);

      expect(found).not.toBeNull();
      expect(found!.responseBodyType).toBe(ResponseBodyType.TEXT);
      expect(found!.responseText).toBe("hello world");
    });
  });

  describe("findById()", () => {
    it("should return null when endpoint does not exist", async () => {
      const found = await repository.findById(new Uuid());

      expect(found).toBeNull();
    });

    it("should return the endpoint when it exists", async () => {
      const endpoint = EndpointFactory.fake()
        .oneEndpoint()
        .withStatusCode(new StatusCode(204))
        .build();

      await repository.insert(endpoint);

      const found = await repository.findById(endpoint.entity_id);

      expect(found).not.toBeNull();
      expect(found!.entity_id.id).toBe(endpoint.entity_id.id);
      expect(found!.createdAt).toEqual(endpoint.createdAt);
    });
  });

  describe("findAll()", () => {
    it("should return empty array when no endpoints exist", async () => {
      const endpoints = await repository.findAll();

      expect(endpoints).toHaveLength(0);
    });

    it("should return all inserted endpoints", async () => {
      const [endpoint1, endpoint2, endpoint3] = EndpointFactory.fake()
        .manyEndpoints(3)
        .withStatusCode(new StatusCode(204))
        .build();

      await repository.insert(endpoint1);
      await repository.insert(endpoint2);
      await repository.insert(endpoint3);

      const allEndpoints = await repository.findAll();

      expect(allEndpoints).toHaveLength(3);
      const ids = allEndpoints.map((e) => e.entity_id.id);
      expect(ids).toContain(endpoint1.entity_id.id);
      expect(ids).toContain(endpoint2.entity_id.id);
      expect(ids).toContain(endpoint3.entity_id.id);
    });
  });

  describe("findAllSummary()", () => {
    it("should return empty array when no endpoints exist", async () => {
      const endpoints = await repository.findAllSummary();

      expect(endpoints).toHaveLength(0);
    });

    it("should return all inserted endpoints with summary fields", async () => {
      const [endpoint1, endpoint2] = EndpointFactory.fake()
        .manyEndpoints(2)
        .build();

      await repository.insert(endpoint1);
      await repository.insert(endpoint2);

      const allEndpoints = await repository.findAllSummary();

      expect(allEndpoints).toHaveLength(2);

      expect(allEndpoints[0]).toEqual({
        entity_id: new Uuid(endpoint1.entity_id.id),
        title: endpoint1.title,
        method: endpoint1.method,
      });

      expect(allEndpoints[1]).toEqual({
        entity_id: new Uuid(endpoint2.entity_id.id),
        title: endpoint2.title,
        method: endpoint2.method,
      });
    });
  });

  describe("update()", () => {
    it("should update an existing endpoint", async () => {
      const endpoint = EndpointFactory.fake()
        .oneEndpoint()
        .withStatusCode(new StatusCode(204))
        .withTitle("original title")
        .build();

      await repository.insert(endpoint);

      endpoint.changeTitle("updated title");
      await repository.update(endpoint);

      const found = await repository.findById(endpoint.entity_id);

      expect(found!.title).toBe("updated title");
    });

    it("should throw NotFoundError when updating non-existent endpoint", async () => {
      const endpoint = EndpointFactory.fake()
        .oneEndpoint()
        .withStatusCode(new StatusCode(204))
        .build();

      await expect(repository.update(endpoint)).rejects.toThrow(NotFoundError);
      await expect(repository.update(endpoint)).rejects.toThrow(
        `Endpoint Not Found using ID: ${endpoint.entity_id.id}`,
      );
    });
  });

  describe("delete()", () => {
    it("should delete an existing endpoint", async () => {
      const endpoint = EndpointFactory.fake()
        .oneEndpoint()
        .withStatusCode(new StatusCode(204))
        .build();

      await repository.insert(endpoint);
      await repository.delete(endpoint.entity_id);

      const found = await repository.findById(endpoint.entity_id);

      expect(found).toBeNull();
    });

    it("should throw NotFoundError when deleting non-existent endpoint", async () => {
      const id = new Uuid();

      await expect(repository.delete(id)).rejects.toThrow(NotFoundError);
      await expect(repository.delete(id)).rejects.toThrow(
        `Endpoint Not Found using ID: ${id.id}`,
      );
    });
  });
});
