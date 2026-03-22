import { IUserRepository } from "../../../../../domain/user/user.repository";
import { IRefreshTokenRepository } from "../../../../../domain/refresh-token/refresh-token.repository";
import { UserFactory } from "../../../../../domain/user/user.entity";
import { RefreshTokenFactory } from "../../../../../domain/refresh-token/refresh-token.entity";
import { setupTypeOrm } from "../../../../../infra/shared/testing/helpers";
import { RefreshTokenModel } from "../../../../../infra/refresh-token/db/typeorm/refresh-token-typeorm.model";
import { UserModel } from "../../../../../infra/user/db/typeorm/user-typeorm.model";
import { UserTypeOrmRepository } from "../../../../../infra/user/db/typeorm/user-typeorm.repository";
import { RefreshTokenTypeOrmRepository } from "../../../../../infra/refresh-token/db/typeorm/refresh-token-typeorm.repository";
import { EndpointModel } from "../../../../../infra/endpoint/db/typeorm/endpoint-typeorm.model";
import { LogoutUseCase } from "../logout.use-case";
import { BcryptHashService } from "../../../../../infra/auth/services/bcrypt-hash.service";

describe("Logout Use Case - Integration Tests", () => {
  let useCase: LogoutUseCase;
  let userRepository: IUserRepository;
  let refreshTokenRepository: IRefreshTokenRepository;

  const { dataSource } = setupTypeOrm({
    entities: [RefreshTokenModel, UserModel, EndpointModel],
  });

  const hashService = new BcryptHashService();

  beforeEach(() => {
    userRepository = new UserTypeOrmRepository(dataSource);
    refreshTokenRepository = new RefreshTokenTypeOrmRepository(dataSource);
    useCase = new LogoutUseCase(refreshTokenRepository, hashService);
  });

  describe("execute()", () => {
    it("should logout the user successfully", async () => {
      const user = UserFactory.fake().oneUser().build();

      const tokenHash = await hashService.hash("refresh-token");

      const token = RefreshTokenFactory.fake()
        .oneRefreshToken()
        .withUserId(user.userId)
        .withRefreshTokenHash(tokenHash)
        .build();

      await userRepository.insert(user);
      await refreshTokenRepository.insert(token);

      await useCase.execute({
        refreshToken: "refresh-token",
        userId: user.userId.toString(),
      });

      const tokens = await refreshTokenRepository.findManyByUserId(
        token.userId,
      );

      expect(tokens).toHaveLength(0);
    });
  });
});
