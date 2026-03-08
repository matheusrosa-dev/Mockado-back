import { Uuid } from "@domain/shared/value-objects/uuid.vo";
import { Endpoint } from "@domain/endpoint/endpoint.entity";
import { IEndpointRepository } from "@domain/endpoint/endpoint.repository";
import { InMemoryRepository } from "../../../shared/db/in-memory/in-memory.repository";

export class EndpointInMemoryRepository
  extends InMemoryRepository<Endpoint, Uuid>
  implements IEndpointRepository
{
  getEntity() {
    return Endpoint;
  }
}
