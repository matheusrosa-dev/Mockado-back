# core/app

Camada de aplicação. Contém os casos de uso que orquestram operações de domínio. Não possui lógica HTTP, de banco de dados, nem dependências de frameworks.

## Estrutura

```
app/
  shared/          → interface base de casos de uso
  <módulo>/
    common/        → tipos de output e mappers compartilhados (quando o módulo tem múltiplos casos de uso que retornam a mesma entidade)
    services/      → interfaces de serviços externos usados pelos casos de uso (ex: auth/)
    validations/   → validadores reutilizáveis entre casos de uso (ex: auth/)
    <operação>/    → cada caso de uso em seu próprio diretório
      <operação>.use-case.ts        → implementação do caso de uso
      <operação>.unit-of-work.ts    → interface de UoW (apenas quando a operação requer transação)
      __tests__/                    → testes de integração
```

## Interface base (`shared/use-case.interface.ts`)

Todos os casos de uso implementam `IUseCase<Input, Output>`, que define apenas:

```ts
execute(input: Input): Promise<Output>
```

Quando não há entrada, o tipo `void` é usado como `Input`.

## Padrão de caso de uso

- Classe que implementa `IUseCase<Input, Output>`
- Recebe interfaces de repositório ou serviços via construtor
- O único método público é `execute(input)`
- Após mutações na entidade, verifica `entity.notification.hasErrors()` e lança `EntityValidationError` caso haja erros
- Lança `NotFoundError` quando a entidade não é encontrada no repositório
- Lança `AuthenticationError` em falhas de autenticação

## Padrão de Input e Output

- Input e Output são **plain type aliases** (`type`) definidos no final do mesmo arquivo do caso de uso
- IDs chegam como `string` no input; o caso de uso converte para `Uuid` internamente
- Não há classes com decoradores no `core/app/`; validação de formato acontece no domínio

```ts
type GoogleLoginInput = { token: string };
type GoogleLoginOutput = { accessToken: string; refreshToken: string; user: {...} };
```

## Padrão de Output Mapper (módulos com múltiplos casos)

Módulos que expõem a mesma entidade em múltiplos casos de uso definem em `common/`:
- Um tipo `<Entity>Output` com os campos serializados
- Uma classe `<Entity>OutputMapper` com método estático `.toOutput(entity)`

```ts
// common/endpoint.output.ts
export class EndpointOutputMapper {
  static toOutput(entity: Endpoint): EndpointOutput { ... }
}
```

Módulos com outputs únicos por operação (ex: `auth/`) definem o tipo de output inline no próprio arquivo.

## Padrão de Unit of Work

Quando um caso de uso precisa executar múltiplas escritas atomicamente, é criada uma interface `I<OperaçãoUseCase>UnitOfWork` no mesmo diretório:

```ts
// google-login.unit-of-work.ts
export const GOOGLE_LOGIN_UNIT_OF_WORK = "GOOGLE_LOGIN_UNIT_OF_WORK";

export type GoogleLoginRepositories = {
  userRepository: IUserRepository;
  refreshTokenRepository: IRefreshTokenRepository;
};

export interface IGoogleLoginUnitOfWork {
  runInTransaction<T>(work: (repositories: GoogleLoginRepositories) => Promise<T>): Promise<T>;
}
```

A implementação concreta vive em `core/infra/`.

## Interfaces de Serviços (`auth/services/`)

Interfaces de serviços externos usados pelos casos de uso de autenticação:

| Interface | Método principal | Propósito |
|---|---|---|
| `IAuthTokenService` | `generate(payload)` | Gera access token e refresh token |
| `IGoogleAuthService` | `verifyToken(token)` | Valida um Google ID token e retorna `GoogleUser` |
| `IHashService` | `hash(value)`, `compare(value, hash)` | Hash e comparação bcrypt |

Implementações concretas vivem em `core/infra/auth/services/`.

## Padrão de Validador de Aplicação (`auth/validations/`)

Validadores reutilizáveis entre uso de uso, quando a validação envolve repositório ou serviço externo. São classes simples instanciadas via `new` dentro dos casos de uso. Retornam `Either<OkType, ErrorType>`:

```ts
class RefreshTokenExistsValidator {
  constructor(private repo: IRefreshTokenRepository, private hashService: IHashService) {}
  async validate(props): Promise<Either<Result, NotFoundError>> { ... }
}
// Uso:
const [result, error] = (await validator.validate(...)).asArray();
if (error) throw new AuthenticationError(...);
```

## Dependências permitidas

- Apenas `domain` pode ser importado dentro de `core/app/`
- Sem importações de `infra` ou do NestJS
