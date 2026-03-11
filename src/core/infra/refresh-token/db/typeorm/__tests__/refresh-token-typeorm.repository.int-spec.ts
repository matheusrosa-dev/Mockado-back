import { setupTypeOrm } from "@infra/shared/testing/helpers";
import { RefreshTokenModel } from "../refresh-token-typeorm.model";
import { UserModel } from "@infra/user/db/typeorm/user-typeorm.model";
import { UserTypeOrmRepository } from "@infra/user/db/typeorm/user-typeorm.repository";
import { RefreshTokenTypeOrmRepository } from "../refresh-token-typeorm.repository";
import { UserFactory } from "@domain/user/user.entity";
import { RefreshTokenFactory } from "@domain/refresh-token/refresh-token.entity";

describe("Refresh Token TypeOrm Repository - Integration Tests", () => {
  const { dataSource } = setupTypeOrm({
    entities: [RefreshTokenModel, UserModel],
  });

  let refreshTokenRepository: RefreshTokenTypeOrmRepository;
  let userRepository: UserTypeOrmRepository;

  beforeEach(() => {
    userRepository = new UserTypeOrmRepository(dataSource);
    refreshTokenRepository = new RefreshTokenTypeOrmRepository(dataSource);
  });

  describe("insert()", () => {
    it("should insert a refresh token", async () => {
      const user = UserFactory.fake().oneUser().build();
      await userRepository.insert(user);

      const refreshToken = RefreshTokenFactory.fake()
        .oneRefreshToken()
        .withUserId(user.userId)
        .build();

      await refreshTokenRepository.insert(refreshToken);

      const foundRefreshTokens = await refreshTokenRepository.findManyByUserId(
        refreshToken.userId,
      );

      expect(foundRefreshTokens).toHaveLength(1);
      expect(
        foundRefreshTokens[0].refreshTokenId.equals(
          refreshToken.refreshTokenId,
        ),
      ).toBe(true);
      expect(foundRefreshTokens[0].userId.equals(refreshToken.userId)).toBe(
        true,
      );
      expect(foundRefreshTokens[0].refreshTokenHash).toBe(
        refreshToken.refreshTokenHash,
      );
      expect(foundRefreshTokens[0].createdAt).toEqual(refreshToken.createdAt);
    });
  });

  describe("findManyByUserId()", () => {
    it("should return empty array when user has no refresh tokens", async () => {
      const user = UserFactory.fake().oneUser().build();
      await userRepository.insert(user);

      const foundTokens = await refreshTokenRepository.findManyByUserId(
        user.userId,
      );

      expect(foundTokens).toHaveLength(0);
    });

    it("should return all refresh tokens for a user", async () => {
      const user = UserFactory.fake().oneUser().build();
      await userRepository.insert(user);

      const [firstRefreshToken, secondRefreshToken] = RefreshTokenFactory.fake()
        .manyRefreshTokens(2)
        .withUserId(user.userId)
        .build();

      await refreshTokenRepository.insert(firstRefreshToken);
      await refreshTokenRepository.insert(secondRefreshToken);

      const foundTokens = await refreshTokenRepository.findManyByUserId(
        user.userId,
      );

      expect(foundTokens).toHaveLength(2);
      const ids = foundTokens.map((refreshToken) =>
        refreshToken.refreshTokenId.toString(),
      );
      expect(ids).toContain(firstRefreshToken.refreshTokenId.toString());
      expect(ids).toContain(secondRefreshToken.refreshTokenId.toString());
    });

    it("should not return tokens from other users", async () => {
      const firstUser = UserFactory.fake().oneUser().build();
      const secondUser = UserFactory.fake().oneUser().build();
      await userRepository.insert(firstUser);
      await userRepository.insert(secondUser);

      const refreshToken = RefreshTokenFactory.fake()
        .oneRefreshToken()
        .withUserId(firstUser.userId)
        .build();
      await refreshTokenRepository.insert(refreshToken);

      const foundTokens = await refreshTokenRepository.findManyByUserId(
        secondUser.userId,
      );

      expect(foundTokens).toHaveLength(0);
    });
  });
});
