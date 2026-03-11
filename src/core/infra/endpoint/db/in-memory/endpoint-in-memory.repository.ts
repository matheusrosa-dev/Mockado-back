import { Uuid } from "@domain/shared/value-objects/uuid.vo";
import { Endpoint } from "@domain/endpoint/endpoint.entity";
import { IEndpointRepository } from "@domain/endpoint/endpoint.repository";
import { InMemoryRepository } from "../../../shared/db/in-memory/in-memory.repository";

export class EndpointInMemoryRepository
  extends InMemoryRepository<Endpoint, Uuid>
  implements IEndpointRepository
{
  async findAllSummary() {
    const endpoints = this.items.map((endpoint) => ({
      endpointId: endpoint.endpointId,
      title: endpoint.title,
      method: endpoint.method,
    }));

    return endpoints;
  }

  getEntity() {
    return Endpoint;
  }
}
