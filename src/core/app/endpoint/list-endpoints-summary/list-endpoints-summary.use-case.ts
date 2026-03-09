import { IUseCase } from "../../shared/use-case.interface";
import { IEndpointRepository } from "@domain/endpoint/endpoint.repository";
import { HttpMethod } from "@domain/endpoint/endpoint.types";

type Output = {
  id: string;
  title: string;
  method: HttpMethod;
};

export class ListEndpointsSummaryUseCase implements IUseCase<void, Output[]> {
  constructor(private readonly repository: IEndpointRepository) {}

  async execute(): Promise<Output[]> {
    const endpoints = await this.repository.findAllSummary();

    return endpoints.map((endpoint) => ({
      id: endpoint.entity_id.id,
      title: endpoint.title,
      method: endpoint.method,
    }));
  }
}
