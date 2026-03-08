import { join } from "node:path";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: ":memory:",
      entities: [join(__dirname, "../../core/**/*.model{.ts,.js}")],
      synchronize: true,
    }),
  ],
})
export class DatabasesModule {}
