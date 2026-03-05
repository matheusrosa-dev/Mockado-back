import { Entity } from "../shared/entity";
import { Uuid } from "../shared/value-objects/uuid.vo";
import { HttpMethod, ResponseBodyType } from "./endpoint.types";
import {
  EndpointValidationGroup,
  EndpointValidator,
} from "./endpoint.validator";

type ConstructorProps = {
  endpoint_id?: Uuid;
  method: HttpMethod;
  title: string;
  description?: string;
  statusCode: number;
  delay?: number;
  responseBodyType?: ResponseBodyType;
  responseJson?: string;
  responseText?: string;
  created_at?: Date;
};

export class Endpoint extends Entity {
  endpoint_id: Uuid;
  method: HttpMethod;
  title: string;
  description?: string;
  delay?: number;
  statusCode: number;
  responseBodyType?: ResponseBodyType;
  responseJson?: string;
  responseText?: string;
  created_at: Date;

  constructor(props: ConstructorProps) {
    super();
    this.endpoint_id = props.endpoint_id ?? new Uuid();
    this.method = props.method;
    this.title = props.title;
    this.description = props.description ?? "";
    this.delay = props.delay ?? 0;
    this.statusCode = props.statusCode;
    this.created_at = props.created_at ?? new Date();

    const hasBody = Endpoint.statusCodeHasBody(props.statusCode);

    if (hasBody) {
      this.responseBodyType = props.responseBodyType;

      if (props.responseBodyType === ResponseBodyType.JSON) {
        this.responseJson = props.responseJson ?? "{}";
      }

      if (props.responseBodyType === ResponseBodyType.TEXT) {
        this.responseText = props.responseText ?? "";
      }
    }
  }

  changeMethod(method: HttpMethod) {
    this.method = method;
    this.validate(["method"]);
  }

  changeTitle(title: string) {
    this.title = title;
    this.validate(["title"]);
  }

  changeDescription(description?: string) {
    this.description = description;
    this.validate(["description"]);
  }

  changeStatusCode(statusCode: number) {
    this.statusCode = statusCode;
    this.validate(["statusCode"]);
  }

  changeDelay(delay?: number) {
    this.delay = delay;
    this.validate(["delay"]);
  }

  changeResponseBodyType(responseBodyType: ResponseBodyType) {
    this.responseBodyType = responseBodyType;
    this.validate(["responseBodyType"]);
  }

  changeResponseJson(responseJson?: string) {
    this.responseJson = responseJson;
    this.validate(["responseJson"]);
  }

  changeResponseText(responseText?: string) {
    this.responseText = responseText;
    this.validate(["responseText"]);
  }

  validate(fields?: EndpointValidationGroup[]) {
    const validator = new EndpointValidator();

    return validator.validate(this.notification, this, fields);
  }

  static statusCodeHasBody(statusCode: number) {
    const statusCodesWithoutBody = [
      ...Array.from({ length: 100 }, (_, i) => i + 100),
      204,
      205,
      304,
    ];

    return !statusCodesWithoutBody.includes(statusCode);
  }

  get entity_id() {
    return this.endpoint_id;
  }

  toJSON() {
    return {
      endpoint_id: this.endpoint_id.toString(),
      title: this.title,
      method: this.method,
      description: this.description,
      statusCode: this.statusCode,
      delay: this.delay,

      ...(this.responseBodyType && { responseBodyType: this.responseBodyType }),
      ...(this.responseJson && { responseJson: this.responseJson }),
      ...(this.responseText && { responseText: this.responseText }),

      created_at: this.created_at,
    };
  }
}

type CreateCommandProps = {
  method: HttpMethod;
  title: string;
  description?: string;
  delay?: number;
  statusCode: number;
  responseBodyType: ResponseBodyType;
  responseJson?: string;
  responseText?: string;
};

export class EndpointFactory {
  static create(props: CreateCommandProps) {
    const endpoint = new Endpoint(props);

    endpoint.validate();

    return endpoint;
  }

  static fake() {}
}
