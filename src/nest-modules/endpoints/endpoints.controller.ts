import { CreateEndpointUseCase } from "@app/endpoint/create-endpoint/create-endpoint.use-case";
import { UpdateEndpointUseCase } from "@app/endpoint/update-endpoint/update-endpoint.use-case";
import { FindEndpointUseCase } from "@app/endpoint/find-endpoint/find-endpoint.use-case";
import { DeleteEndpointUseCase } from "@app/endpoint/delete-endpoint/delete-endpoint.use-case";
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { CreateEndpointDto } from "./dtos/create-endpoint.dto";
import { DeleteEndpointDto } from "./dtos/delete-endpoint.dto";
import { FindEndpointDto } from "./dtos/find-endpoint.dto";
import { ListEndpointsSummaryUseCase } from "@app/endpoint/list-endpoints-summary/list-endpoints-summary.use-case";
import {
  UpdateEndpointBodyDto,
  UpdateEndpointParamsDto,
} from "./dtos/update-endpoint.dto";

@Controller("endpoints")
export class EndpointsController {
  constructor(
    private listEndpointsSummaryUseCase: ListEndpointsSummaryUseCase,
    private createEndpointUseCase: CreateEndpointUseCase,
    private updateEndpointUseCase: UpdateEndpointUseCase,
    private findEndpointUseCase: FindEndpointUseCase,
    private deleteEndpointUseCase: DeleteEndpointUseCase,
  ) {}

  @Post()
  async createEndpoint(@Body() createEndpointDto: CreateEndpointDto) {
    return this.createEndpointUseCase.execute(createEndpointDto);
  }

  @Get("summary")
  async listEndpointsSummary() {
    return this.listEndpointsSummaryUseCase.execute();
  }

  @Get(":endpointId")
  async findEndpointById(@Param() params: FindEndpointDto) {
    return this.findEndpointUseCase.execute({ endpointId: params.endpointId });
  }

  @Patch(":endpointId")
  async updateEndpoint(
    @Param() params: UpdateEndpointParamsDto,
    @Body() updateEndpointDto: UpdateEndpointBodyDto,
  ) {
    return this.updateEndpointUseCase.execute({
      ...updateEndpointDto,
      id: params.endpointId,
    });
  }

  @Delete(":endpointId")
  async deleteEndpoint(@Param() params: DeleteEndpointDto) {
    return this.deleteEndpointUseCase.execute({
      endpointId: params.endpointId,
    });
  }
}
