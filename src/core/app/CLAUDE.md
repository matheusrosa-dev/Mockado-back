# core/app

Camada de aplicação. Contém os casos de uso que orquestram operações de domínio. Não possui lógica HTTP, de banco de dados, nem dependências de frameworks.

## Estrutura

```
app/
  shared/          → interface base de casos de uso
  <módulo>/        → casos de uso de cada módulo
    common/        → tipos de output e mappers compartilhados dentro do módulo
    <operação>/    → cada caso de uso em seu próprio diretório
      <operação>.input.ts      → DTO de entrada com validações
      <operação>.use-case.ts   → implementação do caso de uso
      __tests__/               → testes unitários
```

## Interface base (`shared/use-case.interface.ts`)

Todos os casos de uso implementam `IUseCase<Input, Output>`, que define apenas:

```
execute(input: Input): Promise<Output>
```

Quando não há entrada, o tipo `void` é usado como `Input`.

## Padrão de caso de uso

- Classe que implementa `IUseCase<Input, Output>`
- Recebe interfaces de repositório via construtor (`I<Entity>Repository`)
- O único método público é `execute(input)`
- Após mutações na entidade, verifica `entity.notification.hasErrors()` e lança `EntityValidationError` caso haja erros
- Lança `NotFoundError` quando a entidade não é encontrada no repositório

## Padrão de Input

- Classe com campos decorados com `class-validator`
- Construtor recebe um objeto tipado `ConstructorProps` e usa `Object.assign(this, props)`
- A classe Input do `core/app` é usada diretamente como base class para os DTOs do `nest-modules/`

## Padrão de Output

Cada módulo define:
- Um tipo `<Entity>Output` com os campos serializados (IDs como `string`, value objects como primitivos)
- Uma classe `<Entity>OutputMapper` com método estático `.toOutput(entity)` que converte a entidade de domínio para o tipo de saída

## Dependências permitidas

- Apenas `@domain/*` pode ser importado dentro de `core/app/`
- Sem importações de `@infra/*` ou do NestJS
