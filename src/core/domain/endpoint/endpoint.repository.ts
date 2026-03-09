import { IRepository } from "../shared/repositories/repository-interface";
import { Uuid } from "../shared/value-objects/uuid.vo";
import { Endpoint } from "./endpoint.entity";
import { HttpMethod } from "./endpoint.types";

export interface IEndpointRepository extends IRepository<Endpoint, Uuid> {
  findAllSummary(): Promise<
    Array<{
      entity_id: Uuid;
      title: string;
      method: HttpMethod;
    }>
  >;
}
