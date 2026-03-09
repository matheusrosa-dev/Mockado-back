import { NestFactory } from "@nestjs/core";
import { AppModule } from "./nest-modules/app.module";
import { applyGlobalConfig } from "./nest-modules/config/global-config";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get<ConfigService>(ConfigService);
  const port = config.get<number>("api.port")!;

  applyGlobalConfig(app);

  console.log(`API is running on port ${port}`);

  await app.listen(port);
}
bootstrap();
