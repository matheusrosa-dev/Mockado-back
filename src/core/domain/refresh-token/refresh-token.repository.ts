import { Uuid } from "@domain/shared/value-objects/uuid.vo";
import { IRepository } from "../shared/repositories/repository-interface";
import { RefreshToken } from "./refresh-token.entity";

export interface IRefreshTokenRepository extends IRepository<RefreshToken> {
  findManyByUserId(userId: Uuid): Promise<RefreshToken[]>;
}
