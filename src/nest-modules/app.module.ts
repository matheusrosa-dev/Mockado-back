import { Module } from "@nestjs/common";
import { EndpointsModule } from "./endpoints/endpoints.module";
import { DatabasesModule } from "./databases/databases.module";

@Module({
  imports: [DatabasesModule, EndpointsModule],
})
export class AppModule {}
