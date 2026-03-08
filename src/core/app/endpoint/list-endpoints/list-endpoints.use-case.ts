import { IUseCase } from "../../shared/use-case.interface";
import { IEndpointRepository } from "@domain/endpoint/endpoint.repository";
import {
  EndpointOutput,
  EndpointOutputMapper,
} from "../common/endpoint-output";

export class ListEndpointsUseCase implements IUseCase<void, EndpointOutput[]> {
  constructor(private readonly repository: IEndpointRepository) {}

  async execute(): Promise<EndpointOutput[]> {
    const endpoints = await this.repository.findAll();

    const endpointOutputs = endpoints.map((endpoint) =>
      EndpointOutputMapper.toOutput(endpoint),
    );

    return endpointOutputs;
  }
}
