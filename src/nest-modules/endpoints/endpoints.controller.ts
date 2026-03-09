import { CreateEndpointUseCase } from "@app/endpoint/create-endpoint/create-endpoint.use-case";
import { UpdateEndpointUseCase } from "@app/endpoint/update-endpoint/update-endpoint.use-case";
import { FindEndpointUseCase } from "@app/endpoint/find-endpoint/find-endpoint.use-case";
import { DeleteEndpointUseCase } from "@app/endpoint/delete-endpoint/delete-endpoint.use-case";
import { ListEndpointsUseCase } from "@app/endpoint/list-endpoints/list-endpoints.use-case";
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from "@nestjs/common";
import { CreateEndpointDto } from "./dtos/create-endpoint.dto";

@Controller("endpoints")
export class EndpointsController {
  constructor(
    private listEndpointsUseCase: ListEndpointsUseCase,
    private createEndpointUseCase: CreateEndpointUseCase,
    private updateEndpointUseCase: UpdateEndpointUseCase,
    private findEndpointUseCase: FindEndpointUseCase,
    private deleteEndpointUseCase: DeleteEndpointUseCase,
  ) {}

  @Post()
  async createEndpoint(@Body() createEndpointDto: CreateEndpointDto) {
    return this.createEndpointUseCase.execute(createEndpointDto);
  }

  @Get()
  async listEndpoints() {
    return this.listEndpointsUseCase.execute();
  }

  @Get(":endpointId")
  async findEndpointById(
    @Param("endpointId", new ParseUUIDPipe({ errorHttpStatusCode: 422 }))
    endpointId: string,
  ) {
    return this.findEndpointUseCase.execute({ endpointId });
  }

  @Delete(":endpointId")
  async deleteEndpoint(
    @Param("endpointId", new ParseUUIDPipe({ errorHttpStatusCode: 422 }))
    endpointId: string,
  ) {
    return this.deleteEndpointUseCase.execute({ endpointId });
  }
}
