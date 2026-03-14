import { Uuid } from "@domain/shared/value-objects/uuid.vo";
import { EndpointFactory } from "@domain/endpoint/endpoint.entity";
import { setupTypeOrm } from "../../../../shared/testing/helpers";
import { EndpointModel } from "../endpoint-typeorm.model";
import { EndpointTypeOrmRepository } from "../endpoint-typeorm.repository";
import { UserModel } from "@infra/user/db/typeorm/user-typeorm.model";
import { RefreshTokenModel } from "@infra/refresh-token/db/typeorm/refresh-token-typeorm.model";
import { UserFactory } from "@domain/user/user.entity";
import { UserTypeOrmRepository } from "@infra/user/db/typeorm/user-typeorm.repository";

describe("Endpoint TypeOrm Repository - Integration Tests", () => {
  const { dataSource } = setupTypeOrm({
    entities: [EndpointModel, UserModel, RefreshTokenModel],
  });

  let endpointRepository: EndpointTypeOrmRepository;
  let userRepository: UserTypeOrmRepository;

  beforeEach(() => {
    endpointRepository = new EndpointTypeOrmRepository(dataSource);
    userRepository = new UserTypeOrmRepository(dataSource);
  });

  describe("findSummaryByUserId()", () => {
    it("should return empty array when userId has no endpoints", async () => {
      const user = UserFactory.fake().oneUser().build();
      const endpoint = EndpointFactory.fake()
        .oneEndpoint()
        .withUserId(user.userId)
        .build();

      await userRepository.insert(user);
      await endpointRepository.insert(endpoint);

      const endpoints = await endpointRepository.findSummaryByUserId({
        userId: new Uuid(),
      });

      expect(endpoints).toHaveLength(0);
    });

    it("should return empty array when googleId has no endpoints", async () => {
      const user = UserFactory.fake().oneUser().build();
      const endpoint = EndpointFactory.fake()
        .oneEndpoint()
        .withUserId(user.userId)
        .build();

      await userRepository.insert(user);
      await endpointRepository.insert(endpoint);

      const endpoints = await endpointRepository.findSummaryByUserId({
        googleId: "non-existent-google-id",
      });

      expect(endpoints).toHaveLength(0);
    });

    it("should return endpoints when userId has endpoints", async () => {
      const user = UserFactory.fake().oneUser().build();
      const endpoint = EndpointFactory.fake()
        .oneEndpoint()
        .withUserId(user.userId)
        .build();

      await userRepository.insert(user);
      await endpointRepository.insert(endpoint);

      const endpoints = await endpointRepository.findSummaryByUserId({
        userId: user.userId,
      });

      expect(endpoints).toHaveLength(1);
      expect(endpoints[0]).toEqual({
        endpointId: new Uuid(endpoint.endpointId.toString()),
        title: endpoint.title,
        method: endpoint.method,
      });
    });

    it("should return endpoints when googleId has endpoints", async () => {
      const user = UserFactory.fake().oneUser().build();
      const endpoint = EndpointFactory.fake()
        .oneEndpoint()
        .withUserId(user.userId)
        .build();

      await userRepository.insert(user);
      await endpointRepository.insert(endpoint);

      const endpoints = await endpointRepository.findSummaryByUserId({
        googleId: user.googleId,
      });

      expect(endpoints).toHaveLength(1);
      expect(endpoints[0]).toEqual({
        endpointId: new Uuid(endpoint.endpointId.toString()),
        title: endpoint.title,
        method: endpoint.method,
      });
    });

    it("should throw error when neither userId nor googleId is provided", async () => {
      await expect(endpointRepository.findSummaryByUserId({})).rejects.toThrow(
        "Either userId or googleId must be provided",
      );
    });
  });

  describe("findByIdWithUserId()", () => {
    it("should throw error when neither userId nor googleId is provided", async () => {
      await expect(
        endpointRepository.findByIdWithUserId({
          endpointId: new Uuid(),
        }),
      ).rejects.toThrow("Either userId or googleId must be provided");
    });

    it("should return null if no endpoint is found with the given endpointId and userId", async () => {
      const user = UserFactory.fake().oneUser().build();
      const endpoint = EndpointFactory.fake()
        .oneEndpoint()
        .withUserId(user.userId)
        .build();

      await userRepository.insert(user);
      await endpointRepository.insert(endpoint);

      const result = await endpointRepository.findByIdWithUserId({
        endpointId: new Uuid(),
        userId: new Uuid(),
      });

      expect(result).toBeNull();
    });

    it("should return null if no endpoint is found with the given endpointId and googleId", async () => {
      const user = UserFactory.fake().oneUser().build();
      const endpoint = EndpointFactory.fake()
        .oneEndpoint()
        .withUserId(user.userId)
        .build();

      await userRepository.insert(user);
      await endpointRepository.insert(endpoint);

      const result = await endpointRepository.findByIdWithUserId({
        endpointId: new Uuid(),
        googleId: "non-existent-google-id",
      });

      expect(result).toBeNull();
    });

    it("should return endpoint if found with the given endpointId and userId", async () => {
      const user = UserFactory.fake().oneUser().build();
      const endpoint = EndpointFactory.fake()
        .oneEndpoint()
        .withUserId(user.userId)
        .build();

      await userRepository.insert(user);
      await endpointRepository.insert(endpoint);

      const result = await endpointRepository.findByIdWithUserId({
        endpointId: endpoint.endpointId,
        userId: user.userId,
      });

      expect(result!.toJSON()).toEqual(endpoint.toJSON());
    });

    it("should return endpoint if found with the given endpointId and googleId", async () => {
      const user = UserFactory.fake().oneUser().build();
      const endpoint = EndpointFactory.fake()
        .oneEndpoint()
        .withUserId(user.userId)
        .build();

      await userRepository.insert(user);
      await endpointRepository.insert(endpoint);

      const result = await endpointRepository.findByIdWithUserId({
        endpointId: endpoint.endpointId,
        googleId: user.googleId,
      });

      expect(result!.toJSON()).toEqual(endpoint.toJSON());
    });
  });
});
