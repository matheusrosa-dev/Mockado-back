import { HttpMethod, ResponseBodyType } from "@domain/endpoint/endpoint.types";
import {
  IsEnum,
  IsInt,
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from "class-validator";

export class UpdateEndpointParamsDto {
  @IsNotEmpty()
  @IsUUID()
  endpointId: string;

  constructor(props: UpdateEndpointBodyDto) {
    if (!props) return;

    Object.assign(this, props);
  }
}

export class UpdateEndpointBodyDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsEnum(HttpMethod)
  method?: HttpMethod;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  delay?: number;

  @IsOptional()
  @IsInt()
  @Min(100)
  @Max(511)
  statusCode?: number;

  @IsOptional()
  @IsEnum(ResponseBodyType)
  responseBodyType?: ResponseBodyType;

  @IsOptional()
  @IsJSON()
  responseJson?: string;

  @IsOptional()
  @IsString()
  responseText?: string;

  constructor(props: UpdateEndpointBodyDto) {
    if (!props) return;

    Object.assign(this, props);
  }
}
