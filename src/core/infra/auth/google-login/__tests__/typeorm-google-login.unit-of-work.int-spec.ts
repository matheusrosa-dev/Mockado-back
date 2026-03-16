import { RefreshTokenFactory } from "@domain/refresh-token/refresh-token.entity";
import { setupTypeOrm } from "@infra/shared/testing/helpers";
import { RefreshTokenModel } from "@infra/refresh-token/db/typeorm/refresh-token-typeorm.model";
import { UserModel } from "@infra/user/db/typeorm/user-typeorm.model";
import { TypeOrmGoogleLoginUnitOfWork } from "../typeorm-google-login.unit-of-work";
import { UserFactory } from "@domain/user/user.entity";
import { UserTypeOrmRepository } from "@infra/user/db/typeorm/user-typeorm.repository";
import { RefreshTokenTypeOrmRepository } from "@infra/refresh-token/db/typeorm/refresh-token-typeorm.repository";
import { EndpointModel } from "@infra/endpoint/db/typeorm/endpoint-typeorm.model";
import { EndpointFactory } from "@domain/endpoint/endpoint.entity";
import { EndpointTypeOrmRepository } from "@infra/endpoint/db/typeorm/endpoint-typeorm.repository";

describe("TypeOrm Google Login Unit Of Work - Integration Tests", () => {
  const { dataSource } = setupTypeOrm({
    entities: [RefreshTokenModel, UserModel, EndpointModel],
  });

  let unitOfWork: TypeOrmGoogleLoginUnitOfWork;
  let userRepository: UserTypeOrmRepository;
  let refreshTokenRepository: RefreshTokenTypeOrmRepository;
  let endpointRepository: EndpointTypeOrmRepository;

  beforeEach(() => {
    unitOfWork = new TypeOrmGoogleLoginUnitOfWork(dataSource);
    userRepository = new UserTypeOrmRepository(dataSource);
    refreshTokenRepository = new RefreshTokenTypeOrmRepository(dataSource);
    endpointRepository = new EndpointTypeOrmRepository(dataSource);
  });

  it("should commit all writes when transaction succeeds", async () => {
    const user = UserFactory.fake().oneUser().build();
    const refreshToken = RefreshTokenFactory.create({
      userId: user.userId,
      refreshTokenHash: "hashed-token",
    });
    const endpoint = EndpointFactory.fake()
      .oneEndpoint()
      .withUserId(user.userId)
      .build();

    await unitOfWork.runInTransaction(async (repositories) => {
      await repositories.userRepository.insert(user);
      await repositories.refreshTokenRepository.insert(refreshToken);
      await repositories.endpointRepository.insert(endpoint);
    });

    const savedUser = await userRepository.findById(user.userId);
    const savedTokens = await refreshTokenRepository.findManyByUserId(
      user.userId,
    );
    const savedEndpoint = await endpointRepository.findByIdWithUserId({
      endpointId: endpoint.endpointId,
      userId: user.userId,
    });

    expect(savedUser).not.toBeNull();
    expect(savedTokens).toHaveLength(1);
    expect(savedEndpoint).not.toBeNull();
  });

  it("should rollback all writes when transaction fails", async () => {
    const user = UserFactory.fake().oneUser().build();
    const refreshToken = RefreshTokenFactory.create({
      userId: user.userId,
      refreshTokenHash: "hashed-token",
    });
    const endpoint = EndpointFactory.fake()
      .oneEndpoint()
      .withUserId(user.userId)
      .build();

    await expect(
      unitOfWork.runInTransaction(async (repositories) => {
        await repositories.userRepository.insert(user);
        await repositories.refreshTokenRepository.insert(refreshToken);
        await repositories.endpointRepository.insert(endpoint);

        throw new Error("force rollback");
      }),
    ).rejects.toThrow("force rollback");

    const savedUser = await userRepository.findById(user.userId);
    const savedTokens = await refreshTokenRepository.findManyByUserId(
      user.userId,
    );
    const savedEndpoint = await endpointRepository.findByIdWithUserId({
      endpointId: endpoint.endpointId,
      userId: user.userId,
    });

    expect(savedUser).toBeNull();
    expect(savedTokens).toHaveLength(0);
    expect(savedEndpoint).toBeNull();
  });
});
