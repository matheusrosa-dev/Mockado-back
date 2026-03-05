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
  title: string;

  @IsEnum(HttpMethod, { groups: ["method"] as EndpointValidationGroup[] })
  method: HttpMethod;

  @IsOptional({ groups: ["description"] as EndpointValidationGroup[] })
  @MaxLength(200, { groups: ["description"] as EndpointValidationGroup[] })
  description?: string;

  @IsOptional({ groups: ["delay"] as EndpointValidationGroup[] })
  @IsInt({ groups: ["delay"] as EndpointValidationGroup[] })
  @Min(0, { groups: ["delay"] as EndpointValidationGroup[] })
  @Max(10, { groups: ["delay"] as EndpointValidationGroup[] })
  delay?: number;

  @IsInt({ groups: ["statusCode"] as EndpointValidationGroup[] })
  @Min(100, { groups: ["statusCode"] as EndpointValidationGroup[] })
  @Max(599, { groups: ["statusCode"] as EndpointValidationGroup[] })
  statusCode: number;

  @IsEnum(ResponseBodyType, {
    groups: ["responseBodyType"] as EndpointValidationGroup[],
  })
  responseBodyType: ResponseBodyType;

  @IsOptional({ groups: ["responseJson"] as EndpointValidationGroup[] })
  @IsJSON({ groups: ["responseJson"] as EndpointValidationGroup[] })
  responseJson?: string;

  @IsOptional({ groups: ["responseText"] as EndpointValidationGroup[] })
  @MaxLength(1000, { groups: ["responseText"] as EndpointValidationGroup[] })
  responseText?: string;

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
    const newFields = fields?.length ? fields : endpointValidationGroups;

    return super.validate(
      notification,
      new EndpointRules(data),
      newFields as string[],
    );
  }
}
