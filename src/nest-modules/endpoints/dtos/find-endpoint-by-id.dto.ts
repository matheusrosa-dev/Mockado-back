import { FindEndpointByIdInput } from "@app/endpoint/use-cases/find-endpoint-by-id/find-endpoint-by-id.input";
import { IsOptional } from "class-validator";

export class FindEndpointByIdDto extends FindEndpointByIdInput {
  @IsOptional()
  declare googleId?: string;

  @IsOptional()
  declare userId?: string;
}
