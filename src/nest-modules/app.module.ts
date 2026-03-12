import { Module } from "@nestjs/common";
import { EndpointsModule } from "./endpoints/endpoints.module";
import { DatabasesModule } from "./databases/databases.module";
import { ConfigsModule } from "./configs/configs.module";
import { StatusCodesModule } from "./status-codes/status-codes.module";
import { AuthModule } from "./auth/auth.module";

@Module({
  imports: [
    ConfigsModule,
    DatabasesModule,
    AuthModule,
    EndpointsModule,
    StatusCodesModule,
  ],
})
export class AppModule {}
