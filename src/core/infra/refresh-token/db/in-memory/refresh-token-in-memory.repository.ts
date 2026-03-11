import { InMemoryRepository } from "../../../shared/db/in-memory/in-memory.repository";
import { IRefreshTokenRepository } from "@domain/refresh-token/refresh-token.repository";
import { RefreshToken } from "@domain/refresh-token/refresh-token.entity";
import { Uuid } from "@domain/shared/value-objects/uuid.vo";

export class RefreshTokenInMemoryRepository
  extends InMemoryRepository<RefreshToken>
  implements IRefreshTokenRepository
{
  async findManyByUserId(userId: Uuid): Promise<RefreshToken[]> {
    return this.items.filter((item) => item.userId.equals(userId));
  }

  getEntity() {
    return RefreshToken;
  }
}
