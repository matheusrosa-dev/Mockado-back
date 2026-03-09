import { InvalidStatusCodeError, StatusCode } from "../status-code.vo";

const STATUS_CODES_WITHOUT_BODY = [
  ...Array.from({ length: 100 }, (_, i) => i + 100),
  204,
  205,
  304,
];

const STATUS_CODES_WITH_BODY = Array.from(
  { length: 412 },
  (_, i) => i + 100,
).filter((code) => !STATUS_CODES_WITHOUT_BODY.includes(code));

describe("Status Code Value Object - Unit Tests", () => {
  describe("validate()", () => {
    it("should return false for status codes that do not allow body", () => {
      STATUS_CODES_WITHOUT_BODY.forEach((statusCode) => {
        const allowBody = new StatusCode(statusCode).allowsBody();

        expect(allowBody).toBe(false);
      });
    });

    it("should return true for status codes that allow body", () => {
      STATUS_CODES_WITH_BODY.forEach((statusCode) => {
        const allowBody = new StatusCode(statusCode).allowsBody();

        expect(allowBody).toBe(true);
      });
    });
  });

  it("should add error when statusCode is below 100", () => {
    expect(() => new StatusCode(99)).toThrow(InvalidStatusCodeError);
  });

  it("should add error when statusCode exceeds 511", () => {
    expect(() => new StatusCode(512)).toThrow(InvalidStatusCodeError);
  });
});
