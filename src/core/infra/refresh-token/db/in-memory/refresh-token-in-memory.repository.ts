import { InMemoryRepository } from "../../../shared/db/in-memory/in-memory.repository";
import { IRefreshTokenRepository } from "@domain/refresh-token/refresh-token.repository";
import { RefreshToken } from "@domain/refresh-token/refresh-token.entity";
import { Uuid } from "@domain/shared/value-objects/uuid.vo";

export class RefreshTokenInMemoryRepository
  extends InMemoryRepository<RefreshToken>
  implements IRefreshTokenRepository
{
  findManyByAnyId(props: {
    googleId?: string;
    userId?: Uuid;
  }): Promise<RefreshToken[]> {
    const { googleId, userId } = props;

    const refreshTokens = this.items.filter((refreshToken) => {
      if (googleId && userId) {
        return (
          refreshToken.googleId === googleId &&
          refreshToken.userId.equals(userId)
        );
      }

      if (googleId) {
        return refreshToken.googleId === googleId;
      }

      if (userId) {
        return refreshToken.userId.equals(userId);
      }

      return false;
    });

    return Promise.resolve(refreshTokens);
  }

  getEntity() {
    return RefreshToken;
  }
}
