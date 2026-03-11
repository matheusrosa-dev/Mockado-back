# nest-modules

Camada de integração com o framework NestJS. É a única camada que conhece e conecta todas as camadas do `core/`. Não contém lógica de negócio.

## Estrutura

```
nest-modules/
  app.module.ts       → módulo raiz da aplicação
  configs/            → configuração de ambiente e inicialização global
  databases/          → módulo de configuração do TypeORM
  shared/             → filtros e interceptors globais
  <módulo>/           → módulos de funcionalidade específica (controller, providers, DTOs)
```

## Módulo raiz (`app.module.ts`)

Importa todos os módulos de funcionalidade e infraestrutura. Não declara provedores diretamente.

## Padrão de módulo de funcionalidade

Cada módulo de funcionalidade segue esta estrutura:

```
<módulo>/
  <módulo>.module.ts     → @Module com controller, providers e exports
  <módulo>.controller.ts → controller HTTP que injeta e delega aos casos de uso
  <módulo>.provider.ts   → declaração dos FactoryProviders (repositório + casos de uso)
  dtos/                  → DTOs que estendem os inputs da camada app/
```

## Padrão de Provider

Os casos de uso e repositórios **não** são classes `@Injectable()`. Eles são instanciados por `FactoryProvider`:

- O repositório é um `FactoryProvider` que recebe `DataSource` via `inject: [DataSource]` e instancia a implementação TypeORM
- Cada caso de uso é um `FactoryProvider` que recebe o repositório e instancia o caso de uso diretamente
- Os providers de casos de uso são gerados programaticamente (ex: via `.map()`) a partir de um array de classes de caso de uso

## Padrão de DTO

- DTOs de módulo estendem diretamente os `Input` da camada `app/`, herdando todos os decoradores `class-validator`
- Quando um endpoint requer separação de parâmetros de rota e corpo, dois DTOs distintos são criados: `...ParamsDto` e `...BodyDto`
- O `BodyDto` pode sobrescrever decoradores do pai usando `declare` para relaxar restrições de campos que chegam por outra via (ex: `id` vindo dos params)

## Padrão de Controller

- Recebe casos de uso via injeção de dependência no construtor
- Cada método do controller chama diretamente o `.execute()` do caso de uso correspondente
- Faz merge de params e body quando necessário antes de chamar o caso de uso
- Não contém lógica de negócio nem acessa repositórios diretamente

## Configuração global (`configs/global-config.ts`)

Aplicada via `applyGlobalConfig(app)` em `main.ts`:
- `ValidationPipe` com `transform: true` e `errorHttpStatusCode: 422`
- `WrapperDataInterceptor` envolvendo todas as respostas em `{ data: ... }`
- `EntityValidationErrorFilter` → HTTP 422
- `NotFoundErrorFilter` → HTTP 404

## Configuração de ambiente (`configs/`)

- Configurações tiparizadas por domínio (`api`, `database`, `googleAuth`) via `registerAs()`
- Validação de variáveis de ambiente com Joi no momento do bootstrap
- Carregamento automático a partir de `envs/.env`
- `ConfigsModule` configurado como global (`isGlobal: true`)

## Módulo de banco de dados (`databases/`)

- `DatabasesModule` configura o TypeORM dinamicamente via `forRootAsync` lendo `ConfigService`
- Suporta `sqlite` (com `synchronize: true`) e `postgres` (com migrations)
- `typeorm.datasource.ts` expõe um `DataSource` separado para uso direto via CLI do TypeORM
