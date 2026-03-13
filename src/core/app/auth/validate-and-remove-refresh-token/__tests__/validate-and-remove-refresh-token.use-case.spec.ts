import { IRefreshTokenRepository } from "@domain/refresh-token/refresh-token.repository";
import { ValidateAndRemoveRefreshTokenUseCase } from "../validate-and-remove-refresh-token.use-case";
import { RefreshTokenInMemoryRepository } from "@infra/refresh-token/db/in-memory/refresh-token-in-memory.repository";
import { RefreshTokenFactory } from "@domain/refresh-token/refresh-token.entity";
import bcrypt from "bcrypt";

describe("Validate And Remove Refresh Token Use Case - Unit Tests", () => {
  let useCase: ValidateAndRemoveRefreshTokenUseCase;
  let repository: IRefreshTokenRepository;

  beforeEach(() => {
    repository = new RefreshTokenInMemoryRepository();
    useCase = new ValidateAndRemoveRefreshTokenUseCase(repository);
  });

  describe("execute()", () => {
    it("should return true for a valid refresh token and remove it", async () => {
      const refreshToken = "refresh-token-123";

      const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

      const refreshTokenEntity = RefreshTokenFactory.fake()
        .oneRefreshToken()
        .withRefreshTokenHash(refreshTokenHash)
        .build();

      await repository.insert(refreshTokenEntity);

      const result = await useCase.execute({
        googleId: refreshTokenEntity.googleId,
        refreshToken: refreshToken,
      });

      const deletedToken = await repository.findManyByAnyId({
        googleId: refreshTokenEntity.googleId,
      });

      expect(deletedToken).toHaveLength(0);
      expect(result).toBe(true);
    });

    it("should return false for an invalid refresh token", async () => {
      const refreshToken = "refresh-token-123";

      const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

      const refreshTokenEntity = RefreshTokenFactory.fake()
        .oneRefreshToken()
        .withRefreshTokenHash(refreshTokenHash)
        .build();

      await repository.insert(refreshTokenEntity);

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
