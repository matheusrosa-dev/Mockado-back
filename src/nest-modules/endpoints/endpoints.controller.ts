import { CreateEndpointUseCase } from "@app/endpoint/create-endpoint/create-endpoint.use-case";
import { UpdateEndpointUseCase } from "@app/endpoint/update-endpoint/update-endpoint.use-case";
import { FindEndpointUseCase } from "@app/endpoint/find-endpoint/find-endpoint.use-case";
import { DeleteEndpointUseCase } from "@app/endpoint/delete-endpoint/delete-endpoint.use-case";
import { ListEndpointsUseCase } from "@app/endpoint/list-endpoints/list-endpoints.use-case";
import { Controller, Get } from "@nestjs/common";

@Controller("endpoints")
export class EndpointsController {
  constructor(
    private listEndpointsUseCase: ListEndpointsUseCase,
    private createEndpointUseCase: CreateEndpointUseCase,
    private updateEndpointUseCase: UpdateEndpointUseCase,
    private findEndpointUseCase: FindEndpointUseCase,
    private deleteEndpointUseCase: DeleteEndpointUseCase,
  ) {}

  @Get()
  async getHello(): Promise<string> {
    return "Hello World!";
  }
}
