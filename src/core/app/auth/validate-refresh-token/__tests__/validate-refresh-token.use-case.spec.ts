import { IRefreshTokenRepository } from "@domain/refresh-token/refresh-token.repository";
import { ValidateRefreshTokenUseCase } from "../validate-refresh-token.use-case";
import { RefreshTokenInMemoryRepository } from "@infra/refresh-token/db/in-memory/refresh-token-in-memory.repository";
import { RefreshTokenFactory } from "@domain/refresh-token/refresh-token.entity";
import bcrypt from "bcrypt";

describe("Validate Refresh Token Use Case - Unit Tests", () => {
  let useCase: ValidateRefreshTokenUseCase;
  let repository: IRefreshTokenRepository;

  beforeEach(() => {
    repository = new RefreshTokenInMemoryRepository();
    useCase = new ValidateRefreshTokenUseCase(repository);
  });

  describe("execute()", () => {
    it("should return true for a valid refresh token", async () => {
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
