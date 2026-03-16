/** biome-ignore-all lint/suspicious/noExplicitAny: <It has to allow any in tests> */
import { validateSync } from "class-validator";
import { GoogleLoginDto } from "../google-login.dto";

function validate(props: any) {
  const input = new GoogleLoginDto(props);
  return validateSync(input);
}

describe("Google Login DTO - Unit Tests", () => {
  it("should pass with valid props", () => {
    const errors = validate({ googleToken: "validToken" });
    expect(errors).toHaveLength(0);
  });

  describe("googleToken", () => {
    it("should fail when googleToken is empty", () => {
      const errors = validate({ googleToken: "" });

      const googleTokenError = errors.find(
        (e) => e.property === "googleToken",
      )!;
      expect(googleTokenError).toBeDefined();
      expect(Object.keys(googleTokenError.constraints as object)).toContain(
        "isNotEmpty",
      );
    });

    it("should fail when googleToken is not a string", () => {
      const errors = validate({ googleToken: 123 });

      const googleTokenError = errors.find(
        (e) => e.property === "googleToken",
      )!;
      expect(googleTokenError).toBeDefined();
      expect(Object.keys(googleTokenError.constraints as object)).toContain(
        "isString",
      );
    });
  });
});
