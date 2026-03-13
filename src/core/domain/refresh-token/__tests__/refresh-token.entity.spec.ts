/** biome-ignore-all lint/suspicious/noExplicitAny: <It has to allow any in tests> */
import { Uuid } from "../../shared/value-objects/uuid.vo";
import { RefreshTokenFactory, RefreshToken } from "../refresh-token.entity";

describe("Refresh Token Entity - Unit Tests", () => {
  describe("constructor", () => {
    it("should instance a refresh token with all properties", () => {
      const refreshTokenProps = {
        refreshTokenId: new Uuid(),
        userId: new Uuid(),
        googleId: "123456789012345678901",
        refreshTokenHash: "refresh-token-hash",
        createdAt: new Date(),
      };

      const refreshToken = new RefreshToken(refreshTokenProps);

      expect(refreshToken).toBeInstanceOf(RefreshToken);
      expect(
        refreshToken.refreshTokenId.equals(refreshTokenProps.refreshTokenId),
      ).toBe(true);
      expect(refreshToken.userId.equals(refreshTokenProps.userId)).toBe(true);
      expect(refreshToken.googleId).toBe(refreshTokenProps.googleId);
      expect(refreshToken.refreshTokenHash).toBe(
        refreshTokenProps.refreshTokenHash,
      );
      expect(refreshToken.createdAt).toEqual(refreshTokenProps.createdAt);
    });

    it("should instance a refresh token with only required properties", () => {
      const refreshTokenProps = {
        userId: new Uuid(),
        googleId: "123456789012345678901",
        refreshTokenHash: "refresh-token-hash",
      };

      const refreshToken = new RefreshToken(refreshTokenProps);

      expect(refreshToken).toBeInstanceOf(RefreshToken);
      expect(refreshToken.refreshTokenId).toBeInstanceOf(Uuid);
      expect(refreshToken.userId.equals(refreshTokenProps.userId)).toBe(true);
      expect(refreshToken.googleId).toBe(refreshTokenProps.googleId);
      expect(refreshToken.refreshTokenHash).toBe(
        refreshTokenProps.refreshTokenHash,
      );
      expect(refreshToken.createdAt).toBeInstanceOf(Date);
    });
  });

  describe("entityId", () => {
    it("should return the entityId", () => {
      const id = new Uuid();
      const refreshToken = RefreshTokenFactory.fake()
        .oneRefreshToken()
        .withRefreshTokenId(id)
        .build();

      expect(refreshToken.entityId.equals(id)).toBe(true);
    });
  });

  describe("toJSON()", () => {
    it("should return a plain object with all fields", () => {
      const refreshToken = RefreshTokenFactory.fake().oneRefreshToken().build();

      expect(refreshToken.toJSON()).toEqual({
        refreshTokenId: refreshToken.refreshTokenId.toString(),
        userId: refreshToken.userId.toString(),
        googleId: refreshToken.googleId,
        refreshTokenHash: refreshToken.refreshTokenHash,
        createdAt: refreshToken.createdAt,
      });
    });
  });

  describe("validate()", () => {
    it("should call validate on create with factory", () => {
      const spyValidate = jest.spyOn(RefreshToken.prototype, "validate");

      RefreshTokenFactory.fake().oneRefreshToken().build();

      expect(spyValidate).toHaveBeenCalled();
    });

    it("should have no errors for valid props", () => {
      const refreshToken = RefreshTokenFactory.fake().oneRefreshToken().build();

      expect(refreshToken.notification.hasErrors()).toBe(false);
    });

    it("should add error when refreshTokenHash is empty", () => {
      const refreshToken = RefreshTokenFactory.fake()
        .oneRefreshToken()
        .withRefreshTokenHash("")
        .build();

      expect(refreshToken.notification.hasErrors()).toBe(true);
      expect(refreshToken.notification.errors.size).toBe(1);
      expect(
        refreshToken.notification.errors.get("refreshTokenHash"),
      ).toContain("refreshTokenHash should not be empty");

      const refreshToken2 = RefreshTokenFactory.fake()
        .oneRefreshToken()
        .withRefreshTokenHash(null as any)
        .build();

      expect(refreshToken2.notification.hasErrors()).toBe(true);
      expect(refreshToken2.notification.errors.size).toBe(1);
      expect(
        refreshToken2.notification.errors.get("refreshTokenHash"),
      ).toContain("refreshTokenHash should not be empty");
    });

    it("should add error when googleId is empty", () => {
      const refreshToken = RefreshTokenFactory.fake()
        .oneRefreshToken()
        .withGoogleId("")
        .build();

      expect(refreshToken.notification.hasErrors()).toBe(true);
      expect(refreshToken.notification.errors.get("googleId")).toContain(
        "googleId should not be empty",
      );

      const refreshToken2 = RefreshTokenFactory.fake()
        .oneRefreshToken()
        .withGoogleId(null as any)
        .build();

      expect(refreshToken2.notification.hasErrors()).toBe(true);
      expect(refreshToken2.notification.errors.get("googleId")).toContain(
        "googleId should not be empty",
      );
    });

    it("should add error when googleId contains non-digit characters", () => {
      const refreshToken = RefreshTokenFactory.fake()
        .oneRefreshToken()
        .withGoogleId("12345678901234567890a")
        .build();

      expect(refreshToken.notification.hasErrors()).toBe(true);
      expect(refreshToken.notification.errors.get("googleId")).toContain(
        "Only digits are allowed in googleId",
      );
    });

    it("should add error when googleId is not exactly 21 digits", () => {
      const tooShort = RefreshTokenFactory.fake()
        .oneRefreshToken()
        .withGoogleId("12345678901234567890")
        .build();

      expect(tooShort.notification.hasErrors()).toBe(true);
      expect(tooShort.notification.errors.get("googleId")).toContain(
        "googleId must be exactly 21 digits",
      );

      const tooLong = RefreshTokenFactory.fake()
        .oneRefreshToken()
        .withGoogleId("1234567890123456789012")
        .build();

      expect(tooLong.notification.hasErrors()).toBe(true);
      expect(tooLong.notification.errors.get("googleId")).toContain(
        "googleId must be exactly 21 digits",
      );
    });
  });
});
