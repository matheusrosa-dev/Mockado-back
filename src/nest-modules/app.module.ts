import { Module } from "@nestjs/common";
import { EndpointsModule } from "./endpoints/endpoints.module";
import { DatabasesModule } from "./databases/databases.module";
import { ConfigsModule } from "./configs/configs.module";
import { StatusCodesModule } from "./status-codes/status-codes.module";

@Module({
  imports: [ConfigsModule, DatabasesModule, EndpointsModule, StatusCodesModule],
})
export class AppModule {}
