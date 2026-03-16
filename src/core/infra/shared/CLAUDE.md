# core/infra/shared

Contém infraestrutura reutilizável por todos os módulos de `infra/`.

## Estrutura

```
shared/
  db/
    typeorm/
      migrations/ → migrations TypeORM para banco de dados de produção (PostgreSQL)
  testing/       → utilitários de setup para testes de integração
```

## Migrations TypeORM (`db/typeorm/migrations/`)

Contém as migration files usadas no banco de dados de produção (PostgreSQL). Cada migration implementa `MigrationInterface` com `up()` e `down()`. São executadas automaticamente quando `DB_MIGRATIONS_AUTO_RUN=true` ou manualmente via CLI (`npm run migration:run`). Não são usadas quando `DB_TYPE=sqlite` (que usa `synchronize: true`).

## Utilitários de teste (`testing/`)

Função `setupTypeOrm(options)` para uso em arquivos de teste de integração:
- Cria um `DataSource` **real** com SQLite in-memory (`database: ":memory:"`), `synchronize: true`, `dropSchema: true`
- Aceita opções adicionais (como `entities`) para customizar as entidades carregadas
- Registra `beforeEach` para inicializar e `afterEach` para destruir o `DataSource` automaticamente
- Retorna `{ dataSource }` para uso nos testes

```ts
const { dataSource } = setupTypeOrm({
  entities: [UserModel, RefreshTokenModel, EndpointModel],
});
```

Todos os testes de integração usam este helper — **não existem repositórios in-memory** na base de código. Os testes rodam contra SQLite real.
