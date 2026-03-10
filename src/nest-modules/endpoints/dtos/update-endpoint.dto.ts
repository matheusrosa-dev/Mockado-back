import { IsNotEmpty, IsOptional, IsUUID } from "class-validator";
import { UpdateEndpointInput } from "@app/endpoint/update-endpoint/update-endpoint.input";

export class UpdateEndpointBodyDto extends UpdateEndpointInput {
  @IsOptional()
  declare id: string;
}

export class UpdateEndpointParamsDto {
  @IsNotEmpty()
  @IsUUID()
  endpointId: string;
}
