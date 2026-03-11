# core/infra

Camada de infraestrutura. Contém os implementações concretas dos repositórios, modelos ORM e utilitários de teste. Depende de `domain/` e das bibliotecas externas de persistência (TypeORM).

## Estrutura

```
infra/
  shared/        → implementações reutilizáveis entre todos os módulos
  <módulo>/      → implementações específicas de cada entidade
    db/
      typeorm/   → modelo ORM, mapper e repositório TypeORM
      in-memory/ → repositório em memória para testes
```

## Organização por módulo

Cada módulo de infra segue a estrutura:

```
<módulo>/
  db/
    typeorm/
      <entidade>-typeorm.model.ts       → modelo ORM (classe decorada com TypeORM)
      <entidade>-model-mapper.ts        → conversão bidirecional: entidade ↔ model
      <entidade>-typeorm.repository.ts  → implementação do repositório com TypeORM
    in-memory/
      <entidade>-in-memory.repository.ts → implementação em memória para testes
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
- Construtor recebe `DataSource` e extrai o `Repository<Model>` interno
- `update()` e `delete()` verificam o campo `affected` do resultado; se for `0`, lançam `NotFoundError`
- `getEntity()` retorna a classe construtora da entidade de domínio

## Padrão de Repositório In-Memory

- Estende `InMemoryRepository<E, EntityId>` (de `shared/db/in-memory/`)
- Implementa apenas `getEntity()` e quaisquer métodos de consulta adicionais da interface do repositório
- Utilizado exclusivamente nos testes de casos de uso e de domínio

## Interação com outras camadas

- Importa `@domain/*` para tipos, entidades, interfaces de repositório e erros
- Não importa `@app/*` nem `nest-modules/`
- A camada `nest-modules/` é responsável por instanciar os repositórios e injetá-los nos casos de uso
