import { IsNotEmpty, IsUUID } from "class-validator";

export class FindEndpointByIdDto {
  @IsNotEmpty()
  @IsUUID()
  endpointId: string;

  constructor(props: FindEndpointByIdDto) {
    if (!props) return;

    Object.assign(this, props);
  }
}
