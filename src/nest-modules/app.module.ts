import { Module } from "@nestjs/common";
import { EndpointsModule } from "./endpoints/endpoints.module";
import { DatabasesModule } from "./databases/databases.module";
import { ConfigModule } from "./config/config.module";

@Module({
  imports: [ConfigModule, DatabasesModule, EndpointsModule],
})
export class AppModule {}
