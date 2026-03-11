# core/domain/shared

Contém as primitivas de domínio reutilizadas por todos os módulos. Nada aqui é específico de nenhum módulo de negócio.

## Responsabilidades

### Entidade base (`entity.ts`)

Abstract class `Entity` que serve de base para todas as entidades de domínio. Fornece:
- `notification` — instância de `Notification` para acumulação de erros de validação
- `localMediator` — instância de `EventEmitter2` para despacho interno de eventos
- `events` / `dispatchedEvents` — conjuntos para rastreamento de eventos de domínio
- `applyEvent()` — adiciona e emite um evento no mediador local
- `registerHandler()` — registra um handler para um tipo de evento
- `getUncommittedEvents()` — retorna eventos ainda não despachados
- `clearEvents()` — limpa todos os eventos registrados
- Contrato abstrato: `entityId` (getter) e `toJSON()` que toda entidade deve implementar

### Notificação (`notification.ts`)

Classe `Notification` para coletar e expor erros de validação sem lançar exceções diretamente:
- `addError(message, field?)` — acumula um erro por campo ou global
- `setError(error, field?)` — sobrescreve erros de um campo
- `hasErrors()` — verifica se há algum erro acumulado
- `toJSON()` — serializa os erros em formato de array

### Value Object base (`value-objects/value-object.ts`)

Abstract class `ValueObject` com igualdade por valor via `fast-deep-equal`. Toda comparação entre value objects usa `.equals()`.

### UUID (`value-objects/uuid.vo.ts`)

Value object `Uuid` que encapsula um UUID v4. Gera automaticamente um novo UUID quando nenhum é fornecido. Valida o formato na construção e lança `InvalidUuidError` em caso inválido.

### Interface de Validação (`validators/class-validator-fields.interface.ts`)

Interface `IValidatorFields` com método `validate(notification, data, fields?)`. Define o contrato de validação utilizado por todos os validadores de entidade.

### Validação com class-validator (`validators/class-validator-fields.ts`)

Abstract class `ClassValidatorFields` que implementa `IValidatorFields` utilizando `validateSync` do `class-validator` com suporte a grupos. Itera os erros e os registra na `Notification` com nome de campo normalizado (remove underscore inicial do nome da propriedade).

### Erros de validação (`validators/validation.error.ts`)

Hierarquia de erros de validação:
- `BaseValidationError` — base com campo `error: FieldsErrors[]`
- `EntityValidationError` — lançado quando uma entidade tem notificação com erros
- `LoadEntityError` — lançado ao reconstruir uma entidade a partir do banco de dados com dados inválidos
- `ValidationError` — erro genérico de validação

### Interface de Repositório (`repositories/repository-interface.ts`)

Interface genérica `IRepository<E, EntityId>` com contrato CRUD:
- `insert(entity)`, `update(entity)`, `delete(entityId)`
- `findById(entityId)`, `findAll()`
- `getEntity()` — retorna o construtor da entidade manipulada

### Erro de não encontrado (`errors/not-found.error.ts`)

`NotFoundError` recebe a entidade (classe) e o ID (value object ou array). A mensagem é construída automaticamente com o nome da classe e o(s) ID(s).

### Interface de Evento de Domínio (`events/domain-event.interface.ts`)

`IDomainEvent` com `occurredOn: Date` e `eventVersion: number`. Todos os eventos de domínio implementam esta interface.
