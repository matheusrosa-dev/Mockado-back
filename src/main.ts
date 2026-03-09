import { NestFactory } from "@nestjs/core";
import { AppModule } from "./nest-modules/app.module";
import { applyGlobalConfig } from "./nest-modules/configs/global-config";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  const config = app.get<ConfigService>(ConfigService);
  const port = config.get<number>("api.port")!;

  applyGlobalConfig(app);

  await app.listen(port);
}
bootstrap();
