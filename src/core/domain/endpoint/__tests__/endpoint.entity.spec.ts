import { Endpoint } from "../endpoint.entity";
import { HttpMethod, ResponseBodyType } from "../endpoint.types";
import { Uuid } from "../../shared/value-objects/uuid.vo";

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

describe("Endpoint Entity - Unit Tests", () => {
  describe("constructor", () => {
    it("should instance a GET endpoint", () => {
      const requiredProps = {
        method: HttpMethod.GET,
        title: "My Endpoint",
        statusCode: 100,
      };

      const endpoint = new Endpoint(requiredProps);

      expect(endpoint.method).toBe(requiredProps.method);
      expect(endpoint.title).toBe(requiredProps.title);
      expect(endpoint.statusCode).toBe(requiredProps.statusCode);
    });

    it("should instance a POST endpoint", () => {
      const requiredProps = {
        method: HttpMethod.POST,
        title: "My Endpoint",
        statusCode: 100,
      };

      const endpoint = new Endpoint(requiredProps);

      expect(endpoint.method).toBe(requiredProps.method);
      expect(endpoint.title).toBe(requiredProps.title);
      expect(endpoint.statusCode).toBe(requiredProps.statusCode);
    });

    it("should instance a PUT endpoint", () => {
      const requiredProps = {
        method: HttpMethod.PUT,
        title: "My Endpoint",
        statusCode: 100,
      };

      const endpoint = new Endpoint(requiredProps);

      expect(endpoint.method).toBe(requiredProps.method);
      expect(endpoint.title).toBe(requiredProps.title);
      expect(endpoint.statusCode).toBe(requiredProps.statusCode);
    });

    it("should instance a DELETE endpoint", () => {
      const requiredProps = {
        method: HttpMethod.DELETE,
        title: "My Endpoint",
        statusCode: 100,
      };

      const endpoint = new Endpoint(requiredProps);

      expect(endpoint.method).toBe(requiredProps.method);
      expect(endpoint.title).toBe(requiredProps.title);
      expect(endpoint.statusCode).toBe(requiredProps.statusCode);
    });

    it("should instance a PATCH endpoint", () => {
      const requiredProps = {
        method: HttpMethod.PATCH,
        title: "My Endpoint",
        statusCode: 100,
      };

      const endpoint = new Endpoint(requiredProps);

      expect(endpoint.method).toBe(requiredProps.method);
      expect(endpoint.title).toBe(requiredProps.title);
      expect(endpoint.statusCode).toBe(requiredProps.statusCode);
    });

    it("should ignore body on provide it to an endpoint which does not allow body", () => {
      const endpointProps = {
        method: HttpMethod.GET,
        title: "My Endpoint",
        statusCode: 204,
      };

      const endpoint = new Endpoint({
        ...endpointProps,
        responseBodyType: ResponseBodyType.JSON,
        responseJson: '{"key":"value"}',
        responseText: "some text",
      });

      expect(endpoint.method).toBe(endpointProps.method);
      expect(endpoint.title).toBe(endpointProps.title);
      expect(endpoint.statusCode).toBe(endpointProps.statusCode);
      expect(endpoint.responseBodyType).toBeUndefined();
      expect(endpoint.responseJson).toBeUndefined();
      expect(endpoint.responseText).toBeUndefined();
    });

    it("should set default values when not provided", () => {
      const endpoint1 = new Endpoint({
        method: HttpMethod.GET,
        title: "My Endpoint",
        statusCode: 200,
        responseBodyType: ResponseBodyType.JSON,
      });

      expect(endpoint1.endpoint_id).toBeInstanceOf(Uuid);
      expect(endpoint1.description).toBe("");
      expect(endpoint1.delay).toBe(0);
      expect(endpoint1.responseJson).toEqual("{}");
      expect(endpoint1.created_at).toBeInstanceOf(Date);

      const endpoint2 = new Endpoint({
        method: HttpMethod.GET,
        title: "My Endpoint",
        statusCode: 200,
        responseBodyType: ResponseBodyType.TEXT,
      });

      expect(endpoint2.responseText).toBe("");
    });

    it("should set endpoint_id and created_at when provided", () => {
      const id = new Uuid();
      const date = new Date("2024-01-01");

      const endpoint = new Endpoint({
        endpoint_id: id,
        method: HttpMethod.GET,
        title: "My Endpoint",
        statusCode: 200,
        created_at: date,
      });

      expect(endpoint.endpoint_id).toBe(id);
      expect(endpoint.created_at).toBe(date);
    });

    it("should set optional props when provided", () => {
      const endpoint1 = new Endpoint({
        method: HttpMethod.GET,
        responseBodyType: ResponseBodyType.JSON,
        title: "My Endpoint",
        statusCode: 200,
        description: "A description",
        delay: 5,
        responseJson: '{"key":"value"}',
      });

      expect(endpoint1.description).toBe("A description");
      expect(endpoint1.delay).toBe(5);
      expect(endpoint1.responseJson).toBe('{"key":"value"}');

      const endpoint2 = new Endpoint({
        method: HttpMethod.GET,
        title: "My Endpoint",
        statusCode: 200,
        responseBodyType: ResponseBodyType.TEXT,
        responseText: "some text",
      });

      expect(endpoint2.responseText).toBe("some text");
    });

    describe("should instance all endpoints which allows body with a body", () => {
      it.each(
        STATUS_CODES_WITH_BODY,
      )("should instance an endpoint with status code %i with body", (statusCode) => {
        const endpointProps = {
          method: HttpMethod.GET,
          title: "My Endpoint",
          statusCode,
          responseBodyType: ResponseBodyType.JSON,
          responseJson: '{"key":"value"}',
        };

        const endpoint = new Endpoint(endpointProps);

        expect(endpoint.method).toBe(endpointProps.method);
        expect(endpoint.title).toBe(endpointProps.title);
        expect(endpoint.statusCode).toBe(endpointProps.statusCode);
        expect(endpoint.responseBodyType).toBe(endpointProps.responseBodyType);
        expect(endpoint.responseJson).toBe(endpointProps.responseJson);
        expect(endpoint.responseText).toBeUndefined();
      });
    });
  });

  describe("entity_id", () => {
    it("should return endpoint_id", () => {
      const id = new Uuid();
      const endpoint = new Endpoint({
        endpoint_id: id,
        method: HttpMethod.GET,
        title: "My Endpoint",
        statusCode: 100,
      });

      expect(endpoint.entity_id).toBe(id);
    });
  });

  describe("toJSON", () => {
    it("should return a plain object with all fields", () => {
      const endpoint1 = new Endpoint({
        method: HttpMethod.GET,
        title: "My Endpoint",
        statusCode: 200,
        responseBodyType: ResponseBodyType.JSON,
        description: "desc",
        delay: 2,
        responseJson: '{"a":1}',
      });

      expect(endpoint1.toJSON()).toEqual({
        endpoint_id: endpoint1.endpoint_id.toString(),
        title: endpoint1.title,
        method: endpoint1.method,
        description: endpoint1.description,
        delay: endpoint1.delay,
        statusCode: endpoint1.statusCode,
        responseBodyType: endpoint1.responseBodyType,
        responseJson: endpoint1.responseJson,
        created_at: endpoint1.created_at,
      });

      const endpoint2 = new Endpoint({
        endpoint_id: new Uuid(),
        method: HttpMethod.GET,
        title: "My Endpoint",
        statusCode: 200,
        responseBodyType: ResponseBodyType.TEXT,
        description: "desc",
        delay: 2,
        responseText: "text",
        created_at: new Date("2024-01-01"),
      });

      expect(endpoint2.toJSON()).toEqual({
        endpoint_id: endpoint2.endpoint_id.toString(),
        title: endpoint2.title,
        method: endpoint2.method,
        description: endpoint2.description,
        delay: endpoint2.delay,
        statusCode: endpoint2.statusCode,
        responseBodyType: endpoint2.responseBodyType,
        responseText: endpoint2.responseText,
        created_at: endpoint2.created_at,
      });
    });
  });

  describe("validate", () => {
    it("should have no errors for valid props", () => {
      const endpoint = new Endpoint({
        title: "Valid Endpoint",
        method: HttpMethod.GET,
        statusCode: 100,
      });

      endpoint.validate();

      expect(endpoint.notification.hasErrors()).toBe(false);
    });

    it("should add error when title is empty", () => {
      const endpoint = new Endpoint({
        title: "",
        method: HttpMethod.GET,
        statusCode: 100,
      });

      endpoint.validate(["title"]);

      expect(endpoint.notification.hasErrors()).toBe(true);
    });

    it("should add error when title exceeds 50 characters", () => {
      const endpoint = new Endpoint({
        title: "a".repeat(51),
        method: HttpMethod.GET,
        statusCode: 100,
      });

      endpoint.validate(["title"]);

      expect(endpoint.notification.hasErrors()).toBe(true);
    });

    it("should add error when method is invalid", () => {
      const endpoint = new Endpoint({
        title: "Endpoint",
        method: "INVALID" as HttpMethod,
        statusCode: 100,
      });
      endpoint.validate(["method"]);

      expect(endpoint.notification.hasErrors()).toBe(true);
    });

    it("should add error when description exceeds 200 characters", () => {
      const endpoint = new Endpoint({
        title: "Endpoint",
        method: HttpMethod.GET,
        statusCode: 100,
        description: "a".repeat(201),
      });
      endpoint.validate(["description"]);

      expect(endpoint.notification.hasErrors()).toBe(true);
    });

    it("should not add error when description is undefined", () => {
      const endpoint = new Endpoint({
        title: "Endpoint",
        method: HttpMethod.GET,
        statusCode: 100,
        description: undefined,
      });

      endpoint.validate(["description"]);

      expect(endpoint.notification.hasErrors()).toBe(false);
    });

    it("should add error when delay is below 0", () => {
      const endpoint = new Endpoint({
        title: "Endpoint",
        method: HttpMethod.GET,
        statusCode: 100,
        delay: -1,
      });
      endpoint.validate(["delay"]);

      expect(endpoint.notification.hasErrors()).toBe(true);
    });

    it("should add error when delay exceeds 10", () => {
      const endpoint = new Endpoint({
        title: "Endpoint",
        method: HttpMethod.GET,
        statusCode: 100,
        delay: 11,
      });
      endpoint.validate(["delay"]);

      expect(endpoint.notification.hasErrors()).toBe(true);
    });

    it("should add error when delay is not number", () => {
      const endpoint = new Endpoint({
        title: "Endpoint",
        method: HttpMethod.GET,
        statusCode: 100,
        delay: "" as any,
      });

      endpoint.validate(["delay"]);

      expect(endpoint.notification.hasErrors()).toBe(true);
    });

    it("should add error when delay is not integer", () => {
      const endpoint = new Endpoint({
        title: "Endpoint",
        method: HttpMethod.GET,
        statusCode: 100,
        delay: 1.1,
      });

      endpoint.validate(["delay"]);

      expect(endpoint.notification.hasErrors()).toBe(true);
    });

    it("should not add error when delay is undefined", () => {
      const endpoint = new Endpoint({
        title: "Endpoint",
        method: HttpMethod.GET,
        statusCode: 100,
        delay: undefined,
      });
      endpoint.validate(["delay"]);

      expect(endpoint.notification.hasErrors()).toBe(false);
    });

    it("should add error when statusCode is below 100", () => {
      const endpoint = new Endpoint({
        title: "Endpoint",
        method: HttpMethod.GET,
        statusCode: 99,
      });

      endpoint.validate(["statusCode"]);

      expect(endpoint.notification.hasErrors()).toBe(true);
    });

    it("should add error when statusCode exceeds 511", () => {
      const endpoint = new Endpoint({
        title: "Endpoint",
        method: HttpMethod.GET,
        statusCode: 512,
      });
      endpoint.validate(["statusCode"]);

      expect(endpoint.notification.hasErrors()).toBe(true);
    });

    it("should add error when responseBodyType is invalid", () => {
      const endpoint = new Endpoint({
        title: "Endpoint",
        method: HttpMethod.GET,
        statusCode: 200,
        responseBodyType: "invalid" as ResponseBodyType,
      });

      endpoint.validate(["responseBodyType"]);

      expect(endpoint.notification.hasErrors()).toBe(true);
    });

    it("should add error when responseJson is not valid JSON", () => {
      const endpoint = new Endpoint({
        title: "Endpoint",
        method: HttpMethod.GET,
        statusCode: 200,
        responseBodyType: ResponseBodyType.JSON,
        responseJson: "not-json",
      });

      endpoint.validate(["responseJson"]);

      expect(endpoint.notification.hasErrors()).toBe(true);
    });

    it("should add error when responseText exceeds 1000 characters", () => {
      const endpoint = new Endpoint({
        title: "Endpoint",
        method: HttpMethod.GET,
        statusCode: 200,
        responseBodyType: ResponseBodyType.TEXT,
        responseText: "a".repeat(1001),
      });

      endpoint.validate(["responseText"]);

      expect(endpoint.notification.hasErrors()).toBe(true);
    });

    it("should not add error when responseText is undefined", () => {
      const endpoint = new Endpoint({
        title: "Endpoint",
        method: HttpMethod.GET,
        statusCode: 200,
        responseBodyType: ResponseBodyType.TEXT,
        responseText: undefined,
      });

      endpoint.validate(["responseText"]);

      expect(endpoint.notification.hasErrors()).toBe(false);
    });
  });
});
