import { IRepository } from "../shared/repositories/repository-interface";
import { Uuid } from "../shared/value-objects/uuid.vo";
import { Endpoint } from "./endpoint.entity";

export interface IEndpointRepository extends IRepository<Endpoint, Uuid> {}
