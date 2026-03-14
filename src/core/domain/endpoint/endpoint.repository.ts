import { IRepository } from "../shared/repositories/repository-interface";
import { Uuid } from "../shared/value-objects/uuid.vo";
import { Endpoint } from "./endpoint.entity";
import { HttpMethod } from "./endpoint.types";

export interface IEndpointRepository extends IRepository<Endpoint> {
  findByIdWithUserId(props: {
    endpointId: Uuid;
    googleId?: string;
    userId?: Uuid;
  }): Promise<Endpoint | null>;

  findSummaryByUserId(props: { userId?: Uuid; googleId?: string }): Promise<
    Array<{
      endpointId: Uuid;
      title: string;
      method: HttpMethod;
    }>
  >;
}
