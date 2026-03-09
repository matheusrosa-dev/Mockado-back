import {
  IsEnum,
  IsInt,
  IsJSON,
  IsNotEmpty,
  IsOptional,
  Max,
  MaxLength,
  Min,
} from "class-validator";
import { Endpoint } from "./endpoint.entity";
import { HttpMethod, ResponseBodyType } from "./endpoint.types";
import { ClassValidatorFields } from "../shared/validators/class-validator-fields";
import { Notification } from "../shared/notification";

const endpointValidationGroups = [
  "title",
  "method",
  "description",
  "delay",
  "statusCode",
  "responseBodyType",
  "responseJson",
  "responseText",
] as const;

export type EndpointValidationGroup = (typeof endpointValidationGroups)[number];

class EndpointRules {
  @IsNotEmpty({ groups: ["title"] as EndpointValidationGroup[] })
  @MaxLength(50, { groups: ["title"] as EndpointValidationGroup[] })
  _title: string;

  @IsEnum(HttpMethod, { groups: ["method"] as EndpointValidationGroup[] })
  _method: HttpMethod;

  @MaxLength(200, { groups: ["description"] as EndpointValidationGroup[] })
  _description?: string;

  @IsInt({ groups: ["delay"] as EndpointValidationGroup[] })
  @Min(0, { groups: ["delay"] as EndpointValidationGroup[] })
  @Max(10, { groups: ["delay"] as EndpointValidationGroup[] })
  _delay?: number;

  @IsOptional({ groups: ["responseBodyType"] as EndpointValidationGroup[] })
  @IsEnum(ResponseBodyType, {
    groups: ["responseBodyType"] as EndpointValidationGroup[],
  })
  _responseBodyType?: ResponseBodyType;

  @IsOptional({ groups: ["responseJson"] as EndpointValidationGroup[] })
  @IsJSON({ groups: ["responseJson"] as EndpointValidationGroup[] })
  _responseJson?: string;

  @IsOptional({ groups: ["responseText"] as EndpointValidationGroup[] })
  @MaxLength(1000, { groups: ["responseText"] as EndpointValidationGroup[] })
  _responseText?: string;

  constructor(entity: Endpoint) {
    Object.assign(this, entity);
  }
}

export class EndpointValidator extends ClassValidatorFields {
  validate(
    notification: Notification,
    data: Endpoint,
    fields?: EndpointValidationGroup[],
  ): boolean {
    const fieldsToValidate = fields?.length ? fields : endpointValidationGroups;

    return super.validate(
      notification,
      new EndpointRules(data),
      fieldsToValidate as string[],
    );
  }
}
