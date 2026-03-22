import {
  HttpMethod,
  ResponseBodyType,
} from "../../../core/domain/endpoint/endpoint.types";
import {
  IsEnum,
  IsInt,
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from "class-validator";

export class CreateEndpointDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsEnum(HttpMethod)
  method: HttpMethod;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  delay?: number;

  @IsInt()
  @Min(100)
  @Max(511)
  statusCode: number;

  @IsOptional()
  @IsEnum(ResponseBodyType)
  responseBodyType?: ResponseBodyType;

  @IsOptional()
  @IsJSON()
  responseJson?: string;

  @IsOptional()
  @IsString()
  responseText?: string;

  constructor(props: CreateEndpointDto) {
    if (!props) return;

    Object.assign(this, props);
  }
}
