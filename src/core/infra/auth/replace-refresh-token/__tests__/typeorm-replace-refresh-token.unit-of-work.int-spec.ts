import { RefreshTokenFactory } from "../../../../domain/refresh-token/refresh-token.entity";
import { setupTypeOrm } from "../../../../infra/shared/testing/helpers";
import { RefreshTokenModel } from "../../../../infra/refresh-token/db/typeorm/refresh-token-typeorm.model";
import { UserModel } from "../../../../infra/user/db/typeorm/user-typeorm.model";
import { TypeOrmReplaceRefreshTokenUnitOfWork } from "../typeorm-replace-refresh-token.unit-of-work";
import { UserFactory } from "../../../../domain/user/user.entity";
import { UserTypeOrmRepository } from "../../../../infra/user/db/typeorm/user-typeorm.repository";
import { RefreshTokenTypeOrmRepository } from "../../../../infra/refresh-token/db/typeorm/refresh-token-typeorm.repository";
import { EndpointModel } from "../../../../infra/endpoint/db/typeorm/endpoint-typeorm.model";

describe("TypeOrm Replace Refresh Token Unit Of Work - Integration Tests", () => {
  const { dataSource } = setupTypeOrm({
    entities: [RefreshTokenModel, UserModel, EndpointModel],
  });

  let unitOfWork: TypeOrmReplaceRefreshTokenUnitOfWork;
  let userRepository: UserTypeOrmRepository;
  let refreshTokenRepository: RefreshTokenTypeOrmRepository;

  beforeEach(() => {
    unitOfWork = new TypeOrmReplaceRefreshTokenUnitOfWork(dataSource);
    userRepository = new UserTypeOrmRepository(dataSource);
    refreshTokenRepository = new RefreshTokenTypeOrmRepository(dataSource);
  });

  it("should commit all writes when transaction succeeds", async () => {
    const user = UserFactory.fake().oneUser().build();
    await userRepository.insert(user);

    const refreshToken = RefreshTokenFactory.fake()
      .oneRefreshToken()
      .withUserId(user.userId)
      .build();

    await unitOfWork.runInTransaction(async (repositories) => {
      await repositories.refreshTokenRepository.insert(refreshToken);
    });

    const savedTokens = await refreshTokenRepository.findManyByUserId(
      user.userId,
    );

    expect(savedTokens).toHaveLength(1);
  });

  it("should rollback all writes when transaction fails", async () => {
    const user = UserFactory.fake().oneUser().build();
    await userRepository.insert(user);

    const refreshToken = RefreshTokenFactory.fake()
      .oneRefreshToken()
      .withUserId(user.userId)
      .build();

    await expect(
      unitOfWork.runInTransaction(async (repositories) => {
        await repositories.refreshTokenRepository.insert(refreshToken);
        throw new Error("force rollback");
      }),
    ).rejects.toThrow("force rollback");

    const savedTokens = await refreshTokenRepository.findManyByUserId(
      user.userId,
    );

    expect(savedTokens).toHaveLength(0);
  });
});
