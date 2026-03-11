# core/domain

Contém a lógica de negócio pura da aplicação. Esta camada não depende de frameworks, banco de dados ou qualquer tecnologia de infraestrutura.

## Estrutura

```
domain/
  shared/      → primitivas reutilizáveis entre todos os módulos de domínio
  <módulo>/    → cada entidade de domínio em seu próprio diretório
```

## Organização por módulo

Cada módulo de domínio (ex: `endpoint/`, `user/`) segue uma estrutura consistente:

```
<módulo>/
  <entidade>.entity.ts         → classe da entidade
  <entidade>.validator.ts      → validador da entidade
  <entidade>.repository.ts     → interface do repositório
  <entidade>.types.ts          → enums e tipos específicos do módulo (quando existem)
  <entidade>.fake-builder.ts   → builder fluente para testes
  events/                      → eventos de domínio do módulo
  value-objects/               → value objects específicos do módulo
  __tests__/                   → testes unitários
```

## Padrão de Entidade

- Campos privados com prefixo underscore (`_fieldName`)
- Expostos publicamente via getters sem underscore
- O construtor recebe um objeto tipado `ConstructorProps`
- Mutações realizadas via métodos `change*()`, que chamam `validate()` com o grupo de campo correspondente após a alteração
- Side effects entre campos (ex: mudança de status code afetando o corpo da resposta) são gerenciados por eventos de domínio registrados no construtor via `registerHandler()`
- `applyEvent()` emite o evento no mediador local, que dispara os handlers registrados
- `toJSON()` retorna uma representação serializada em objeto plano
- `notification` acumula erros de validação sem lançar exceções por conta própria

## Padrão de Factory

Cada módulo contém uma classe `<Entity>Factory` (declarada dentro do mesmo arquivo da entidade) com método estático `.create()` que instancia a entidade, chama `.validate()` e retorna a instância. Não é possível criar entidades sem passar pela factory em cenários que exigem validação completa.

## Padrão de Validador

- `<Entity>Validator` estende `ClassValidatorFields` (de `shared/`)
- Uma classe interna `<Entity>Rules` espelha os campos privados da entidade com decoradores `class-validator`
- A validação é organizada em grupos tipados como `as const` tuple
- `validate()` usa todos os grupos por padrão; aceita subconjunto de grupos para validação parcial

## Padrão de FakeBuilder

- Classe genérica `<Entity>FakeBuilder<TBuild>` para construção em testes
- Tipo auxiliar `PropOrFactory<T> = T | (() => T)` permite valores estáticos ou factories
- Métodos fluentes `with*()` para sobrescrever cada campo individualmente
- Construtores estáticos: `one<Entity>()` e `many<Entities>(n)`
- `.build()` instancia a(s) entidade(s) e chama `.validate()`
- Valores default são gerados com a biblioteca `Chance`

## Padrão de Repositório

- `I<Entity>Repository` estende `IRepository<Entity, EntityId>` (de `shared/`)
- A interface pode adicionar métodos de consulta específicos para além do CRUD base

## Eventos de Domínio

- Implementam `IDomainEvent` com `occurredOn: Date` e `eventVersion: number`
- São emitidos pela entidade via `applyEvent()` e processados por handlers registrados no constructor
- Permitem reações encadeadas e consistentes dentro dos limites da entidade sem dependências externas
