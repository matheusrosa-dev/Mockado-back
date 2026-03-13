/** biome-ignore-all lint/suspicious/noExplicitAny: <It has to allow any in tests> */
import { validateSync } from "class-validator";
import { ValidateRefreshTokenInput } from "../validate-refresh-token.input";

const validProps = {
  googleId: "123456789012345678901",
  refreshToken: "some-refresh-token",
};

function validate(props: object) {
  const input = new ValidateRefreshTokenInput(props as any);
  return validateSync(input);
}

describe("Validate Refresh Token Input - Unit Tests", () => {
  describe("valid input", () => {
    it("should pass with valid props", () => {
      const errors = validate(validProps);
      expect(errors).toHaveLength(0);
    });
  });

  describe("googleId", () => {
    it("should fail when googleId is empty", () => {
      const errors = validate({ ...validProps, googleId: "" });
      const fields = errors.map((error) => error.property);
      expect(fields).toContain("googleId");
    });

    it("should fail when googleId is missing", () => {
      const { googleId: _, ...rest } = validProps;
      const errors = validate(rest);
      const fields = errors.map((error) => error.property);
      expect(fields).toContain("googleId");
    });

    it("should fail when googleId is not a string", () => {
      const errors = validate({ ...validProps, googleId: 123 });
      const fields = errors.map((error) => error.property);
      expect(fields).toContain("googleId");
    });

    it("should fail when googleId contains non-digit characters", () => {
      const errors = validate({
        ...validProps,
        googleId: "12345678901234567890a",
      });
      const fields = errors.map((error) => error.property);
      expect(fields).toContain("googleId");
    });

    it("should fail when googleId is shorter than 21 digits", () => {
      const errors = validate({
        ...validProps,
        googleId: "12345678901234567890",
      });
      const fields = errors.map((error) => error.property);
      expect(fields).toContain("googleId");
    });

    it("should fail when googleId is longer than 21 digits", () => {
      const errors = validate({
        ...validProps,
        googleId: "1234567890123456789012",
      });
      const fields = errors.map((error) => error.property);
      expect(fields).toContain("googleId");
    });
  });

  describe("refreshToken", () => {
    it("should fail when refreshToken is empty", () => {
      const errors = validate({ ...validProps, refreshToken: "" });
      const fields = errors.map((error) => error.property);
      expect(fields).toContain("refreshToken");
    });

    it("should fail when refreshToken is missing", () => {
      const { refreshToken: _, ...rest } = validProps;
      const errors = validate(rest);
      const fields = errors.map((error) => error.property);
      expect(fields).toContain("refreshToken");
    });

    it("should fail when refreshToken is not a string", () => {
      const errors = validate({ ...validProps, refreshToken: 123 });
      const fields = errors.map((error) => error.property);
      expect(fields).toContain("refreshToken");
    });
  });
});
