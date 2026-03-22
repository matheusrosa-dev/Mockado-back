import { CreateEndpointUseCase } from "../../core/app/endpoint/use-cases/create-endpoint/create-endpoint.use-case";
import { UpdateEndpointUseCase } from "../../core/app/endpoint/use-cases/update-endpoint/update-endpoint.use-case";
import { FindEndpointByIdUseCase } from "../../core/app/endpoint/use-cases/find-endpoint-by-id/find-endpoint-by-id.use-case";
import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { CreateEndpointDto } from "./dtos/create-endpoint.dto";
import { FindEndpointByIdDto } from "./dtos/find-endpoint-by-id.dto";
import { ListEndpointsSummaryUseCase } from "../../core/app/endpoint/use-cases/list-endpoints-summary/list-endpoints-summary.use-case";
import {
  UpdateEndpointBodyDto,
  UpdateEndpointParamsDto,
} from "./dtos/update-endpoint.dto";
import {
  CurrentSession,
  type ICurrentSession,
} from "../shared/decorators/current-session.decorator";

@Controller("endpoints")
export class EndpointsController {
  constructor(
    private listEndpointsSummaryUseCase: ListEndpointsSummaryUseCase,
    private createEndpointUseCase: CreateEndpointUseCase,
    private updateEndpointUseCase: UpdateEndpointUseCase,
    private findEndpointByIdUseCase: FindEndpointByIdUseCase,
  ) {}

  @Post()
  async createEndpoint(
    @Body() createEndpointDto: CreateEndpointDto,
    @CurrentSession() session: ICurrentSession,
  ) {
    return this.createEndpointUseCase.execute({
      ...createEndpointDto,
      userId: session.userId,
    });
  }

  @Get("summary")
  async listEndpointsSummary(@CurrentSession() session: ICurrentSession) {
    return this.listEndpointsSummaryUseCase.execute({
      userId: session.userId,
    });
  }

  @Get(":endpointId")
  async findEndpointById(
    @Param() params: FindEndpointByIdDto,
    @CurrentSession() session: ICurrentSession,
  ) {
    return this.findEndpointByIdUseCase.execute({
      userId: session.userId,
      endpointId: params.endpointId,
    });
  }

  @Patch(":endpointId")
  async updateEndpoint(
    @Param() params: UpdateEndpointParamsDto,
    @Body() updateEndpointDto: UpdateEndpointBodyDto,
    @CurrentSession() session: ICurrentSession,
  ) {
    return this.updateEndpointUseCase.execute({
      ...updateEndpointDto,
      id: params.endpointId,
      userId: session.userId,
    });
  }
}
