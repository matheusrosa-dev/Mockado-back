console.log({
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
  DATABASE_URL: process.env.DATABASE_URL,
});
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import {
  apiConfig,
  databaseConfig,
  authConfig,
  validationSchema,
} from "./env-config";
import { join } from "node:path";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [apiConfig, databaseConfig, authConfig],
      isGlobal: true,
      envFilePath: [join(process.cwd(), `.env`)],
      validationSchema,
    }),
  ],
})
export class ConfigsModule {}
