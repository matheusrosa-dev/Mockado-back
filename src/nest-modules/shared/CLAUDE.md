# nest-modules/shared

Contém infraestrutura NestJS reutilizável aplicada globalmente a toda a aplicação. Não contém lógica de negócio.

## Estrutura

```
shared/
  filters/               → exception filters para erros de domínio
  interceptors/
    wrapper-data/        → interceptor de envelopamento de respostas
```

## Filtros de exceção (`filters/`)

Convertem erros de domínio (lançados na camada `core/`) em respostas HTTP adequadas:

- **`NotFoundErrorFilter`** — captura `NotFoundError` e responde com HTTP 404 e a mensagem do erro
- **`EntityValidationErrorFilter`** — captura `EntityValidationError` e responde com HTTP 422, serializando as mensagens de erro em um array sem duplicatas

Ambos registram o tipo de erro capturado via `@Catch()` e utilizam `ArgumentsHost` para acessar o `Response` do Express.

## Interceptor de envelopamento (`interceptors/wrapper-data/`)

`WrapperDataInterceptor` envolve toda resposta não-nula que ainda não possua uma propriedade `data` no formato:

```json
{ "data": <corpo_original> }
```

Respostas que já contenham `data` ou sejam nulas/vazias passam sem modificação.

## Aplicação global

Todos os itens deste diretório são registrados globalmente via `applyGlobalConfig()` no bootstrap da aplicação. Nenhum módulo individual precisa importá-los.
