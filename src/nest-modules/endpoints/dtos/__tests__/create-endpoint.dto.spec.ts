/** biome-ignore-all lint/suspicious/noExplicitAny: <It has to allow any in tests> */
import { validateSync } from "class-validator";
import { HttpMethod, ResponseBodyType } from "@domain/endpoint/endpoint.types";
import { Uuid } from "@domain/shared/value-objects/uuid.vo";
import { CreateEndpointDto } from "../create-endpoint.dto";

function validate(props: any) {
  const input = new CreateEndpointDto(props);
  return validateSync(input);
}

const validBase = {
  title: "My Endpoint",
  userId: new Uuid().id,
  method: HttpMethod.GET,
  statusCode: 200,
};

describe("Create Endpoint DTO - Unit Tests", () => {
  it("should pass with valid props", () => {
    const errors = validate(validBase);
    expect(errors).toHaveLength(0);
  });

  describe("title", () => {
    it("should fail when title is empty", () => {
      const errors = validate({ ...validBase, title: "" });

      const titleError = errors.find((e) => e.property === "title")!;
      expect(titleError).toBeDefined();
      expect(Object.keys(titleError.constraints as object)).toContain(
        "isNotEmpty",
      );
    });

    it("should fail when title is not a string", () => {
      const errors = validate({ ...validBase, title: 123 });

      const titleError = errors.find((e) => e.property === "title")!;
      expect(titleError).toBeDefined();
      expect(Object.keys(titleError.constraints as object)).toContain(
        "isString",
      );
    });

    it("should pass with a valid title", () => {
      const errors = validate(validBase);
      const titleError = errors.find((e) => e.property === "title");
      expect(titleError).toBeUndefined();
    });
  });

  describe("method", () => {
    it("should fail when method is not a valid HttpMethod", () => {
      const errors = validate({ ...validBase, method: "INVALID" });

      const methodError = errors.find((e) => e.property === "method")!;
      expect(methodError).toBeDefined();
      expect(Object.keys(methodError.constraints as object)).toContain(
        "isEnum",
      );
    });

    it("should pass for each valid HttpMethod value", () => {
      for (const method of Object.values(HttpMethod)) {
        const errors = validate({ ...validBase, method });
        const methodError = errors.find((e) => e.property === "method");
        expect(methodError).toBeUndefined();
      }
    });
  });

  describe("description", () => {
    it("should fail when description is not a string", () => {
      const errors = validate({ ...validBase, description: 123 });

      const descriptionError = errors.find(
        (e) => e.property === "description",
      )!;
      expect(descriptionError).toBeDefined();
      expect(Object.keys(descriptionError.constraints as object)).toContain(
        "isString",
      );
    });

    it("should pass when description is absent", () => {
      const errors = validate(validBase);
      const descriptionError = errors.find((e) => e.property === "description");
      expect(descriptionError).toBeUndefined();
    });

    it("should pass with a valid description", () => {
      const errors = validate({ ...validBase, description: "A description" });
      const descriptionError = errors.find((e) => e.property === "description");
      expect(descriptionError).toBeUndefined();
    });
  });

  describe("delay", () => {
    it("should fail when delay is not an integer", () => {
      const errors = validate({ ...validBase, delay: 1.5 });

      const delayError = errors.find((e) => e.property === "delay")!;
      expect(delayError).toBeDefined();
      expect(Object.keys(delayError.constraints as object)).toContain("isInt");
    });

    it("should pass when delay is absent", () => {
      const errors = validate(validBase);
      const delayError = errors.find((e) => e.property === "delay");
      expect(delayError).toBeUndefined();
    });

    it("should pass with a valid integer delay", () => {
      const errors = validate({ ...validBase, delay: 500 });
      const delayError = errors.find((e) => e.property === "delay");
      expect(delayError).toBeUndefined();
    });
  });

  describe("statusCode", () => {
    it("should fail when statusCode is below 100", () => {
      const errors = validate({ ...validBase, statusCode: 99 });

      const statusCodeError = errors.find((e) => e.property === "statusCode")!;
      expect(statusCodeError).toBeDefined();
      expect(Object.keys(statusCodeError.constraints as object)).toContain(
        "min",
      );
    });

    it("should fail when statusCode is above 511", () => {
      const errors = validate({ ...validBase, statusCode: 512 });

      const statusCodeError = errors.find((e) => e.property === "statusCode")!;
      expect(statusCodeError).toBeDefined();
      expect(Object.keys(statusCodeError.constraints as object)).toContain(
        "max",
      );
    });

    it("should fail when statusCode is not an integer", () => {
      const errors = validate({ ...validBase, statusCode: 200.5 });

      const statusCodeError = errors.find((e) => e.property === "statusCode")!;
      expect(statusCodeError).toBeDefined();
      expect(Object.keys(statusCodeError.constraints as object)).toContain(
        "isInt",
      );
    });

    it("should pass at the boundary values 100 and 511", () => {
      const errors100 = validate({ ...validBase, statusCode: 100 });
      expect(
        errors100.find((e) => e.property === "statusCode"),
      ).toBeUndefined();

      const errors511 = validate({ ...validBase, statusCode: 511 });
      expect(
        errors511.find((e) => e.property === "statusCode"),
      ).toBeUndefined();
    });
  });

  describe("responseBodyType", () => {
    it("should fail when responseBodyType is not a valid ResponseBodyType", () => {
      const errors = validate({ ...validBase, responseBodyType: "INVALID" });

      const responseBodyTypeError = errors.find(
        (e) => e.property === "responseBodyType",
      )!;
      expect(responseBodyTypeError).toBeDefined();
      expect(
        Object.keys(responseBodyTypeError.constraints as object),
      ).toContain("isEnum");
    });

    it("should pass when responseBodyType is absent", () => {
      const errors = validate(validBase);
      const responseBodyTypeError = errors.find(
        (e) => e.property === "responseBodyType",
      );
      expect(responseBodyTypeError).toBeUndefined();
    });

    it("should pass for each valid ResponseBodyType value", () => {
      for (const responseBodyType of Object.values(ResponseBodyType)) {
        const errors = validate({ ...validBase, responseBodyType });
        const responseBodyTypeError = errors.find(
          (e) => e.property === "responseBodyType",
        );
        expect(responseBodyTypeError).toBeUndefined();
      }
    });
  });

  describe("responseJson", () => {
    it("should fail when responseJson is not valid JSON", () => {
      const errors = validate({ ...validBase, responseJson: "not-json" });

      const responseJsonError = errors.find(
        (e) => e.property === "responseJson",
      )!;
      expect(responseJsonError).toBeDefined();
      expect(Object.keys(responseJsonError.constraints as object)).toContain(
        "isJson",
      );
    });

    it("should pass when responseJson is absent", () => {
      const errors = validate(validBase);
      const responseJsonError = errors.find(
        (e) => e.property === "responseJson",
      );
      expect(responseJsonError).toBeUndefined();
    });

    it("should pass with a valid JSON string", () => {
      const errors = validate({
        ...validBase,
        responseJson: JSON.stringify({ key: "value" }),
      });
      const responseJsonError = errors.find(
        (e) => e.property === "responseJson",
      );
      expect(responseJsonError).toBeUndefined();
    });
  });

  describe("responseText", () => {
    it("should fail when responseText is not a string", () => {
      const errors = validate({ ...validBase, responseText: 123 });

      const responseTextError = errors.find(
        (e) => e.property === "responseText",
      )!;
      expect(responseTextError).toBeDefined();
      expect(Object.keys(responseTextError.constraints as object)).toContain(
        "isString",
      );
    });

    it("should pass when responseText is absent", () => {
      const errors = validate(validBase);
      const responseTextError = errors.find(
        (e) => e.property === "responseText",
      );
      expect(responseTextError).toBeUndefined();
    });

    it("should pass with a valid responseText", () => {
      const errors = validate({ ...validBase, responseText: "some text" });
      const responseTextError = errors.find(
        (e) => e.property === "responseText",
      );
      expect(responseTextError).toBeUndefined();
    });
  });
});
