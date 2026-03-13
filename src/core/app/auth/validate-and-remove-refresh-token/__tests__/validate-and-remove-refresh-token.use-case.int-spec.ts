import { IRefreshTokenRepository } from "@domain/refresh-token/refresh-token.repository";
import { ValidateAndRemoveRefreshTokenUseCase } from "../validate-and-remove-refresh-token.use-case";
import { RefreshTokenFactory } from "@domain/refresh-token/refresh-token.entity";
import bcrypt from "bcrypt";
import { RefreshTokenTypeOrmRepository } from "@infra/refresh-token/db/typeorm/refresh-token-typeorm.repository";
import { setupTypeOrm } from "@infra/shared/testing/helpers";
import { RefreshTokenModel } from "@infra/refresh-token/db/typeorm/refresh-token-typeorm.model";
import { UserModel } from "@infra/user/db/typeorm/user-typeorm.model";
import { UserTypeOrmRepository } from "@infra/user/db/typeorm/user-typeorm.repository";
import { UserFactory } from "@domain/user/user.entity";

describe("Validate And Remove Refresh Token Use Case - Integration Tests", () => {
  const { dataSource } = setupTypeOrm({
    entities: [RefreshTokenModel, UserModel],
  });

  let useCase: ValidateAndRemoveRefreshTokenUseCase;
  let refreshTokenRepository: IRefreshTokenRepository;
  let userRepository: UserTypeOrmRepository;

  beforeEach(() => {
    userRepository = new UserTypeOrmRepository(dataSource);
    refreshTokenRepository = new RefreshTokenTypeOrmRepository(dataSource);
    useCase = new ValidateAndRemoveRefreshTokenUseCase(refreshTokenRepository);
  });

  describe("execute()", () => {
    it("should return true for a valid refresh token and remove it", async () => {
      const user = UserFactory.fake().oneUser().build();
      await userRepository.insert(user);

      const refreshToken = "refresh-token-123";
      const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

      const refreshTokenEntity = RefreshTokenFactory.create({
        googleId: user.googleId,
        refreshTokenHash,
        userId: user.userId,
      });

      await refreshTokenRepository.insert(refreshTokenEntity);

      const result = await useCase.execute({
        googleId: refreshTokenEntity.googleId,
        refreshToken: refreshToken,
      });

      const deletedToken = await refreshTokenRepository.findManyByAnyId({
        googleId: refreshTokenEntity.googleId,
      });

      expect(deletedToken).toHaveLength(0);
      expect(result).toBe(true);
    });

    it("should return false for an invalid refresh token", async () => {
      const user = UserFactory.fake().oneUser().build();
      await userRepository.insert(user);

      const refreshToken = "refresh-token-123";
      const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

      const refreshTokenEntity = RefreshTokenFactory.create({
        googleId: user.googleId,
        refreshTokenHash,
        userId: user.userId,
      });

      await refreshTokenRepository.insert(refreshTokenEntity);

      const result = await useCase.execute({
        googleId: refreshTokenEntity.googleId,
        refreshToken: "invalid-refresh-token",
      });

      expect(result).toBe(false);
    });

    it("should return false if there are no refresh tokens for the googleId", async () => {
      const result = await useCase.execute({
        googleId: "non-existent-google-id",
        refreshToken: "any-refresh-token",
      });

      expect(result).toBe(false);
    });
  });
});
