import { NestFactory } from "@nestjs/core";
import { AppModule } from "./nest-modules/app.module";
import { ValidationPipe } from "@nestjs/common";
import { NotFoundErrorFilter } from "./nest-modules/shared/filters/not-found-error.filter";
import { WrapperDataInterceptor } from "./nest-modules/shared/interceptors/wrapper-data/wrapper-data.interceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: 422,
      transform: true,
    }),
  );

  app.useGlobalInterceptors(new WrapperDataInterceptor());

  app.useGlobalFilters(new NotFoundErrorFilter());

  await app.listen(process.env.PORT ?? 3333);
}
bootstrap();
