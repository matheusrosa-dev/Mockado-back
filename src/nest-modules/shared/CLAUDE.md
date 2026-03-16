# nest-modules/shared

Contém infraestrutura NestJS reutilizável aplicada globalmente a toda a aplicação. Não contém lógica de negócio.

## Estrutura

```
shared/
  filters/               → exception filters para erros de domínio
  guards/                → guards de autenticação
  interceptors/
    wrapper-data/        → interceptor de envelopamento de respostas
  decorators/            → decorators de rota e de parâmetro
```

## Filtros de exceção (`filters/`)

Convertem erros de domínio (lançados na camada `core/`) em respostas HTTP adequadas. Todos registrados globalmente em `applyGlobalConfig`:

| Filtro | Captura | HTTP |
|---|---|---|
| `EntityValidationErrorFilter` | `EntityValidationError` | 422 — serializa `notification.toJSON()` em array de strings sem duplicatas |
| `NotFoundErrorFilter` | `NotFoundError` | 404 — retorna a mensagem do erro |
| `AuthenticationErrorFilter` | `AuthenticationError` | 401 — retorna a mensagem do erro |

## Guards (`guards/`)

| Guard | Extends | Registro | Uso |
|---|---|---|---|
| `AccessTokenGuard` | `AuthGuard("jwt")` | `APP_GUARD` no `AppModule` | Global padrão; bypassado por rotas com `@Public()` |
| `RefreshTokenGuard` | `AuthGuard("jwt-refresh")` | Nenhum (não é `@Injectable()` com Reflector) | Aplicado por rota via `@UseGuards(RefreshTokenGuard)` |

`AccessTokenGuard` usa `Reflector.getAllAndOverride("isPublic", ...)` para detectar e liberar rotas públicas.

## Decorators (`decorators/`)

| Decorator | Tipo | Função |
|---|---|---|
| `@Public()` | `SetMetadata("isPublic", true)` | Marca uma rota como pública — desativa o `AccessTokenGuard` |
| `@CurrentSession()` | `createParamDecorator` | Extrai `request.user` como `ICurrentSession` do contexto de execução |

`ICurrentSession` (exportado de `current-session.decorator.ts`):
```ts
interface ICurrentSession {
  userId: string;
  name: string;
  email: string;
  refreshToken: string;
}
```

## Interceptor de envelopamento (`interceptors/wrapper-data/`)

`WrapperDataInterceptor` envolve toda resposta não-nula que ainda não possua uma propriedade `data` no formato:

```json
{ "data": <corpo_original> }
```

Respostas que já contenham `data` ou sejam nulas/vazias passam sem modificação.

## Aplicação global

Todos os itens deste diretório são registrados globalmente via `applyGlobalConfig()` no bootstrap da aplicação (ou via `APP_GUARD` no `AppModule`). Nenhum módulo individual precisa importá-los.
