import {
  IReplaceRefreshTokenUnitOfWork,
  ReplaceRefreshTokenRepositories,
} from "@app/auth/use-cases/replace-refresh-token/replace-refresh-token.unit-of-work";
import { RefreshTokenTypeOrmRepository } from "@infra/refresh-token/db/typeorm/refresh-token-typeorm.repository";
import { DataSource } from "typeorm";

export class TypeOrmReplaceRefreshTokenUnitOfWork
  implements IReplaceRefreshTokenUnitOfWork
{
  constructor(private dataSource: DataSource) {}

  async runInTransaction<T>(
    work: (repositories: ReplaceRefreshTokenRepositories) => Promise<T>,
  ): Promise<T> {
    return this.dataSource.transaction((manager) => {
      return work({
        refreshTokenRepository: new RefreshTokenTypeOrmRepository(manager),
      });
    });
  }
}
