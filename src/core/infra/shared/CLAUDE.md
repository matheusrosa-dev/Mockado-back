# core/infra/shared

Contém infraestrutura reutilizável por todos os módulos de `infra/`.

## Estrutura

```
shared/
  db/
    in-memory/   → repositório base em memória
    typeorm/
      migrations/ → migrations TypeORM de produção
  testing/       → utilitários de setup para testes de integração
```

## Repositório base em memória (`db/in-memory/`)

Abstract class `InMemoryRepository<E, EntityId>` que implementa `IRepository<E, EntityId>` completo:
- Mantém um array `items` em memória
- Implementa `insert`, `update`, `delete`, `findById`, `findAll`
- `update()` e `delete()` lançam `NotFoundError` se o item não existir (busca por `entityId.equals()`)
- Força as subclasses a implementar `getEntity()` (abstract)

Todos os repositórios in-memory de módulos específicos estendem esta classe.

## Migrations TypeORM (`db/typeorm/migrations/`)

Contém as migration files usadas no banco de dados de produção. Cada migration implementa `MigrationInterface` com `up()` e `down()`. Executadas automaticamente quando `DB_MIGRATIONS_AUTO_RUN=true` ou manualmente via CLI.

## Utilitários de teste (`testing/`)

Função `setupTypeOrm(options)` para uso em arquivos de teste de integração:
- Cria um `DataSource` com SQLite in-memory, `synchronize: true`, `dropSchema: true`
- Aceita opções adicionais (como `entities`) para customização
- Registra `beforeEach` para inicializar e `afterEach` para destruir o `DataSource` automaticamente
- Retorna `{ dataSource }` para uso nos testes
