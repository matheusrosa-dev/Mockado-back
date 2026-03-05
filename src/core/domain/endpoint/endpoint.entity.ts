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
  responseBodyType: ResponseBodyType;
  responseJson?: string;
  responseText?: string;
  created_at?: Date;
};

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

export class Endpoint extends Entity {
  endpoint_id: Uuid;
  method: HttpMethod;
  title: string;
  description?: string;
  delay?: number;
  statusCode: number;
  responseBodyType: ResponseBodyType;
  responseJson?: string;
  responseText?: string;
  created_at: Date;

  constructor(props: ConstructorProps) {
    super();
    this.endpoint_id = props.endpoint_id ?? new Uuid();
    this.method = props.method;
    this.title = props.title;
    this.description = props.description;
    this.delay = props.delay;
    this.statusCode = props.statusCode;
    this.responseBodyType = props.responseBodyType;
    this.responseJson = props.responseJson;
    this.responseText = props.responseText;
    this.created_at = props.created_at ?? new Date();
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

  get entity_id() {
    return this.endpoint_id;
  }

  toJSON() {
    return {
      endpoint_id: this.endpoint_id.toString(),
      title: this.title,
      method: this.method,
      description: this.description,
      delay: this.delay,
      responseBodyType: this.responseBodyType,
      responseJson: this.responseJson,
      responseText: this.responseText,
      created_at: this.created_at,
    };
  }
}

export class EndpointFactory {
  static create(props: CreateCommandProps) {
    const endpoint = new Endpoint(props);

    endpoint.validate();

    return endpoint;
  }

  static fake() {}
}
