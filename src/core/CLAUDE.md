# core

Este diretório contém toda a lógica central da aplicação, completamente independente de frameworks como NestJS. É dividido em três camadas internas com responsabilidades distintas.

## Estrutura de camadas

```
core/
  domain/   → lógica de domínio pura
  app/      → casos de uso da aplicação
  infra/    → implementações de persistência e repositórios
```

## Responsabilidade de cada camada

- **`domain/`**: Contém entidades, value objects, interfaces de repositório, eventos de domínio e validadores. Não depende de nenhuma outra camada interna nem de frameworks externos.
- **`app/`**: Contém os casos de uso que orquestram operações de domínio. Depende apenas de `domain/`. Não contém lógica HTTP, nem de banco de dados.
- **`infra/`**: Contém as implementações concretas dos repositórios (TypeORM), modelos ORM, mappers, unit-of-works e serviços externos (JWT, Google Auth, bcrypt). Depende de `domain/` e de `app/` (para interfaces de serviço e de unit-of-work), além de bibliotecas externas.

## Path aliases

O `tsconfig.json` define os seguintes aliases apontando para este diretório:

| Alias       | Destino                  |
|-------------|--------------------------|
| `@domain/*` | `src/core/domain/*`      |
| `@app/*`    | `src/core/app/*`         |
| `@infra/*`  | `src/core/infra/*`       |

## Isolamento de framework

Nenhum arquivo dentro de `core/` importa ou utiliza decoradores, módulos ou qualquer primitiva do NestJS. Todo o acoplamento com o framework é feito na camada `nest-modules/`.

## Fluxo de dependências

```
nest-modules → infra → app → domain
nest-modules → app        → domain
```

A camada `app/` depende apenas de `domain/`. A camada `infra/` depende de `domain/` e de `app/` (para implementar as interfaces de serviço e de unit-of-work). A camada `nest-modules/` é a única que conhece e conecta todas as camadas.
