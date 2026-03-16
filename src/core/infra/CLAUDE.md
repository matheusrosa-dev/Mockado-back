# core/infra

Camada de infraestrutura. Contém as implementações concretas dos repositórios, modelos ORM, mappers, unit-of-works e serviços externos. Depende de `domain/` e de bibliotecas externas (TypeORM, bcrypt, JWT, etc.).

## Estrutura

```
infra/
  shared/        → utilitários reutilizáveis entre todos os módulos
  auth/          → implementações de serviços e unit-of-works de autenticação
    google-login/           → TypeORM UoW para o caso de uso google-login
    replace-refresh-token/  → TypeORM UoW para o caso de uso replace-refresh-token
    services/               → implementações concretas de IAuthTokenService, IGoogleAuthService, IHashService
  <módulo>/      → implementações específicas de cada entidade
    db/
      typeorm/   → modelo ORM, mapper e repositório TypeORM
```

## Organização por módulo de entidade

```
<módulo>/
  db/
    typeorm/
      <entidade>-typeorm.model.ts       → modelo ORM (classe decorada com TypeORM)
      <entidade>-model-mapper.ts        → conversão bidirecional: entidade ↔ model
      <entidade>-typeorm.repository.ts  → implementação do repositório com TypeORM
```

## Padrão de Model ORM

- Classe decorada com decoradores TypeORM (`@Entity`, `@Column`, `@PrimaryColumn`, etc.)
- Campos com tipos primitivos (sem value objects de domínio)
- Campos opcionais do domínio são representados com `| null` e `default: null`

## Padrão de Model Mapper

- Classe `<Entity>ModelMapper` com dois métodos estáticos puros:
  - `toModel(entity)` — converte entidade de domínio para model ORM
  - `toEntity(model)` — reconstrói entidade de domínio a partir do model; chama `.validate()` na entidade e lança `LoadEntityError` se houver erros de notificação

## Padrão de Repositório TypeORM

- Classe que implementa a interface `I<Entity>Repository` do domínio
- Construtor recebe `DataSource` (ou `EntityManager` quando dentro de uma transação) e extrai o `Repository<Model>` interno
- `update()` e `delete()` verificam o campo `affected` do resultado; se for `0`, lançam `NotFoundError`
- `getEntity()` retorna a classe construtora da entidade de domínio

## Padrão de Unit of Work TypeORM

Implementação concreta das interfaces `I<Operação>UnitOfWork` definidas em `core/app/`:

```ts
// typeorm-google-login.unit-of-work.ts
export class TypeOrmGoogleLoginUnitOfWork implements IGoogleLoginUnitOfWork {
  constructor(private dataSource: DataSource) {}

  async runInTransaction<T>(work: (repos: GoogleLoginRepositories) => Promise<T>): Promise<T> {
    return this.dataSource.transaction((manager) =>
      work({
        userRepository: new UserTypeOrmRepository(manager),
        refreshTokenRepository: new RefreshTokenTypeOrmRepository(manager),
      }),
    );
  }
}
```

Os repositórios dentro da transação recebem o `EntityManager` ao invés do `DataSource`.

## Implementações de Serviços (`auth/services/`)

Implementações concretas das interfaces definidas em `core/app/auth/services/`:

| Classe | Implementa | Dependências |
|---|---|---|
| `JwtTokenService` | `IAuthTokenService` | `ConfigService` (lê JWT_SECRET, JWT_EXPIRATION_TIME, etc.) |
| `GoogleAuthService` | `IGoogleAuthService` | `ConfigService` (lê GOOGLE_CLIENT_ID) |
| `BcryptHashService` | `IHashService` | nenhuma |

## Interação com outras camadas

- Importa `@domain/*` para tipos, entidades, interfaces de repositório e erros
- Importa `@app/*` apenas para interfaces de serviço e de unit-of-work
- Não importa `nest-modules/`
- A camada `nest-modules/` é responsável por instanciar os repositórios e injetá-los nos casos de uso
