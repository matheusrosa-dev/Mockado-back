import jwt from "jsonwebtoken";
import { JwtTokenService } from "../jwt-token.service";
import type { AuthTokenPayload } from "../../../../app/auth/services/auth-token.service";

const config = {
  jwtSecret: "access-secret",
  jwtExpirationTime: 3600,
  jwtRefreshSecret: "refresh-secret",
  jwtRefreshExpirationTime: 86400,
};

const payload: AuthTokenPayload = {
  userId: "user-id-123",
  email: "user@example.com",
  name: "John Doe",
};

describe("Jwt Token Service - Unit Tests", () => {
  let service: JwtTokenService;

  beforeEach(() => {
    service = new JwtTokenService(config);
  });

  describe("generate()", () => {
    it("should return an accessToken and a refreshToken", async () => {
      const result = await service.generate(payload);

      expect(result).toHaveProperty("accessToken");
      expect(result).toHaveProperty("refreshToken");
      expect(typeof result.accessToken).toBe("string");
      expect(typeof result.refreshToken).toBe("string");
    });

    it("should sign the accessToken with the jwtSecret", async () => {
      const { accessToken } = await service.generate(payload);

      expect(() => jwt.verify(accessToken, config.jwtSecret)).not.toThrow();
    });

    it("should sign the refreshToken with the jwtRefreshSecret", async () => {
      const { refreshToken } = await service.generate(payload);

      expect(() =>
        jwt.verify(refreshToken, config.jwtRefreshSecret),
      ).not.toThrow();
    });

    it("should embed the payload in the accessToken", async () => {
      const { accessToken } = await service.generate(payload);

      const decoded = jwt.verify(
        accessToken,
        config.jwtSecret,
      ) as AuthTokenPayload;

      expect(decoded.userId).toBe(payload.userId);
      expect(decoded.email).toBe(payload.email);
      expect(decoded.name).toBe(payload.name);
    });

    it("should embed the payload in the refreshToken", async () => {
      const { refreshToken } = await service.generate(payload);

      const decoded = jwt.verify(
        refreshToken,
        config.jwtRefreshSecret,
      ) as AuthTokenPayload;

      expect(decoded.userId).toBe(payload.userId);
      expect(decoded.email).toBe(payload.email);
      expect(decoded.name).toBe(payload.name);
    });

    it("should set the correct expiration on the accessToken", async () => {
      const before = Math.floor(Date.now() / 1000);
      const { accessToken } = await service.generate(payload);
      const after = Math.floor(Date.now() / 1000);

      const decoded = jwt.decode(accessToken) as jwt.JwtPayload;

      expect(decoded.exp).toBeGreaterThanOrEqual(
        before + config.jwtExpirationTime,
      );
      expect(decoded.exp).toBeLessThanOrEqual(after + config.jwtExpirationTime);
    });

    it("should set the correct expiration on the refreshToken", async () => {
      const before = Math.floor(Date.now() / 1000);
      const { refreshToken } = await service.generate(payload);
      const after = Math.floor(Date.now() / 1000);

      const decoded = jwt.decode(refreshToken) as jwt.JwtPayload;

      expect(decoded.exp).toBeGreaterThanOrEqual(
        before + config.jwtRefreshExpirationTime,
      );
      expect(decoded.exp).toBeLessThanOrEqual(
        after + config.jwtRefreshExpirationTime,
      );
    });

    it("should fail to verify accessToken with the wrong secret", async () => {
      const { accessToken } = await service.generate(payload);

      expect(() => jwt.verify(accessToken, "wrong-secret")).toThrow();
    });

    it("should fail to verify refreshToken with the wrong secret", async () => {
      const { refreshToken } = await service.generate(payload);

      expect(() => jwt.verify(refreshToken, "wrong-secret")).toThrow();
    });
  });
});
