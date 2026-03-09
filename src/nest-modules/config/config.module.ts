import { Module } from "@nestjs/common";
import { ConfigModule as NestjsConfigModule } from "@nestjs/config";
import { apiConfig, validationSchema } from "./config";
import { join } from "node:path";

@Module({
  imports: [
    NestjsConfigModule.forRoot({
      load: [apiConfig],
      isGlobal: true,
      envFilePath: [join(process.cwd(), "envs", `.env`)],
      validationSchema,
    }),
  ],
})
export class ConfigModule {}
