/** biome-ignore-all lint/suspicious/noExplicitAny: <It has to allow any in tests> */
import { validateSync } from "class-validator";
import { HttpMethod, ResponseBodyType } from "@domain/endpoint/endpoint.types";
import { Uuid } from "@domain/shared/value-objects/uuid.vo";
import {
  UpdateEndpointBodyDto,
  UpdateEndpointParamsDto,
} from "../update-endpoint.dto";

function validateBody(props: any) {
  const input = new UpdateEndpointBodyDto(props);
  return validateSync(input);
}

function validateParams(props: any) {
  const input = new UpdateEndpointParamsDto(props);
  return validateSync(input);
}

const validBodyBase = {
  endpointId: new Uuid().id,
  userId: new Uuid().id,
};

describe("Update Endpoint DTO - Unit Tests", () => {
  describe("Update Endpoint Params DTO", () => {
    it("should pass with valid props", () => {
      const errors = validateParams({
        endpointId: new Uuid().id,
      });

      expect(errors).toHaveLength(0);
    });

    describe("endpointId", () => {
      it("should fail when endpointId is empty", () => {
        const errors = validateParams({ endpointId: "" });

        const endpointIdError = errors.find(
          (e) => e.property === "endpointId",
        )!;
        expect(endpointIdError).toBeDefined();
        expect(Object.keys(endpointIdError.constraints as object)).toContain(
          "isNotEmpty",
        );
        expect(Object.keys(endpointIdError.constraints as object)).toContain(
          "isUuid",
        );
      });

      it("should fail when endpointId is not a UUID", () => {
        const errors = validateParams({ endpointId: "invalid-uuid" });

        const endpointIdError = errors.find(
          (e) => e.property === "endpointId",
        )!;
        expect(endpointIdError).toBeDefined();
        expect(Object.keys(endpointIdError.constraints as object)).toContain(
          "isUuid",
        );
      });
    });
  });

  describe("Update Endpoint Body DTO", () => {
    it("should pass with valid props", () => {
      const errors = validateBody(validBodyBase);
      expect(errors).toHaveLength(0);
    });

    describe("title", () => {
      it("should fail when title is not a string", () => {
        const errors = validateBody({ ...validBodyBase, title: 123 });

        const titleError = errors.find((e) => e.property === "title")!;
        expect(titleError).toBeDefined();
        expect(Object.keys(titleError.constraints as object)).toContain(
          "isString",
        );
      });

      it("should pass when title is absent", () => {
        const errors = validateBody(validBodyBase);
        const titleError = errors.find((e) => e.property === "title");
        expect(titleError).toBeUndefined();
      });

      it("should pass with a valid title", () => {
        const errors = validateBody({ ...validBodyBase, title: "My Endpoint" });
        const titleError = errors.find((e) => e.property === "title");
        expect(titleError).toBeUndefined();
      });
    });

    describe("method", () => {
      it("should fail when method is not a valid HttpMethod", () => {
        const errors = validateBody({ ...validBodyBase, method: "INVALID" });

        const methodError = errors.find((e) => e.property === "method")!;
        expect(methodError).toBeDefined();
        expect(Object.keys(methodError.constraints as object)).toContain(
          "isEnum",
        );
      });

      it("should pass when method is absent", () => {
        const errors = validateBody(validBodyBase);
        const methodError = errors.find((e) => e.property === "method");
        expect(methodError).toBeUndefined();
      });

      it("should pass for each valid HttpMethod value", () => {
        for (const method of Object.values(HttpMethod)) {
          const errors = validateBody({ ...validBodyBase, method });
          const methodError = errors.find((e) => e.property === "method");
          expect(methodError).toBeUndefined();
        }
      });
    });

    describe("description", () => {
      it("should fail when description is not a string", () => {
        const errors = validateBody({ ...validBodyBase, description: 123 });

        const descriptionError = errors.find(
          (e) => e.property === "description",
        )!;
        expect(descriptionError).toBeDefined();
        expect(Object.keys(descriptionError.constraints as object)).toContain(
          "isString",
        );
      });

      it("should pass when description is absent", () => {
        const errors = validateBody(validBodyBase);
        const descriptionError = errors.find(
          (e) => e.property === "description",
        );
        expect(descriptionError).toBeUndefined();
      });

      it("should pass with a valid description", () => {
        const errors = validateBody({
          ...validBodyBase,
          description: "A description",
        });
        const descriptionError = errors.find(
          (e) => e.property === "description",
        );
        expect(descriptionError).toBeUndefined();
      });
    });

    describe("delay", () => {
      it("should fail when delay is not an integer", () => {
        const errors = validateBody({ ...validBodyBase, delay: 1.5 });

        const delayError = errors.find((e) => e.property === "delay")!;
        expect(delayError).toBeDefined();
        expect(Object.keys(delayError.constraints as object)).toContain(
          "isInt",
        );
      });

      it("should pass when delay is absent", () => {
        const errors = validateBody(validBodyBase);
        const delayError = errors.find((e) => e.property === "delay");
        expect(delayError).toBeUndefined();
      });

      it("should pass with a valid integer delay", () => {
        const errors = validateBody({ ...validBodyBase, delay: 500 });
        const delayError = errors.find((e) => e.property === "delay");
        expect(delayError).toBeUndefined();
      });
    });

    describe("statusCode", () => {
      it("should fail when statusCode is below 100", () => {
        const errors = validateBody({ ...validBodyBase, statusCode: 99 });

        const statusCodeError = errors.find(
          (e) => e.property === "statusCode",
        )!;
        expect(statusCodeError).toBeDefined();
        expect(Object.keys(statusCodeError.constraints as object)).toContain(
          "min",
        );
      });

      it("should fail when statusCode is above 511", () => {
        const errors = validateBody({ ...validBodyBase, statusCode: 512 });

        const statusCodeError = errors.find(
          (e) => e.property === "statusCode",
        )!;
        expect(statusCodeError).toBeDefined();
        expect(Object.keys(statusCodeError.constraints as object)).toContain(
          "max",
        );
      });

      it("should fail when statusCode is not an integer", () => {
        const errors = validateBody({ ...validBodyBase, statusCode: 200.5 });

        const statusCodeError = errors.find(
          (e) => e.property === "statusCode",
        )!;
        expect(statusCodeError).toBeDefined();
        expect(Object.keys(statusCodeError.constraints as object)).toContain(
          "isInt",
        );
      });

      it("should pass when statusCode is absent", () => {
        const errors = validateBody(validBodyBase);
        const statusCodeError = errors.find((e) => e.property === "statusCode");
        expect(statusCodeError).toBeUndefined();
      });

      it("should pass at the boundary values 100 and 511", () => {
        const errors100 = validateBody({ ...validBodyBase, statusCode: 100 });
        expect(
          errors100.find((e) => e.property === "statusCode"),
        ).toBeUndefined();

        const errors511 = validateBody({ ...validBodyBase, statusCode: 511 });
        expect(
          errors511.find((e) => e.property === "statusCode"),
        ).toBeUndefined();
      });
    });

    describe("responseBodyType", () => {
      it("should fail when responseBodyType is not a valid ResponseBodyType", () => {
        const errors = validateBody({
          ...validBodyBase,
          responseBodyType: "INVALID",
        });

        const responseBodyTypeError = errors.find(
          (e) => e.property === "responseBodyType",
        )!;
        expect(responseBodyTypeError).toBeDefined();
        expect(
          Object.keys(responseBodyTypeError.constraints as object),
        ).toContain("isEnum");
      });

      it("should pass when responseBodyType is absent", () => {
        const errors = validateBody(validBodyBase);
        const responseBodyTypeError = errors.find(
          (e) => e.property === "responseBodyType",
        );
        expect(responseBodyTypeError).toBeUndefined();
      });

      it("should pass for each valid ResponseBodyType value", () => {
        for (const responseBodyType of Object.values(ResponseBodyType)) {
          const errors = validateBody({ ...validBodyBase, responseBodyType });
          const responseBodyTypeError = errors.find(
            (e) => e.property === "responseBodyType",
          );
          expect(responseBodyTypeError).toBeUndefined();
        }
      });
    });

    describe("responseJson", () => {
      it("should fail when responseJson is not valid JSON", () => {
        const errors = validateBody({
          ...validBodyBase,
          responseJson: "not-json",
        });

        const responseJsonError = errors.find(
          (e) => e.property === "responseJson",
        )!;
        expect(responseJsonError).toBeDefined();
        expect(Object.keys(responseJsonError.constraints as object)).toContain(
          "isJson",
        );
      });

      it("should pass when responseJson is absent", () => {
        const errors = validateBody(validBodyBase);
        const responseJsonError = errors.find(
          (e) => e.property === "responseJson",
        );
        expect(responseJsonError).toBeUndefined();
      });

      it("should pass with a valid JSON string", () => {
        const errors = validateBody({
          ...validBodyBase,
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
        const errors = validateBody({ ...validBodyBase, responseText: 123 });

        const responseTextError = errors.find(
          (e) => e.property === "responseText",
        )!;
        expect(responseTextError).toBeDefined();
        expect(Object.keys(responseTextError.constraints as object)).toContain(
          "isString",
        );
      });

      it("should pass when responseText is absent", () => {
        const errors = validateBody(validBodyBase);
        const responseTextError = errors.find(
          (e) => e.property === "responseText",
        );
        expect(responseTextError).toBeUndefined();
      });

      it("should pass with a valid responseText", () => {
        const errors = validateBody({
          ...validBodyBase,
          responseText: "some text",
        });
        const responseTextError = errors.find(
          (e) => e.property === "responseText",
        );
        expect(responseTextError).toBeUndefined();
      });
    });
  });
});
