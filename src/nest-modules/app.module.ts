import { Module } from "@nestjs/common";
import { EndpointsModule } from "./endpoints/endpoints.module";
import { DatabasesModule } from "./databases/databases.module";
import { ConfigsModule } from "./configs/configs.module";
import { StatusCodesModule } from "./status-codes/status-codes.module";
import { GoogleAuthModule } from "./google-auth/google-auth.module";

@Module({
  imports: [
    ConfigsModule,
    DatabasesModule,
    GoogleAuthModule,
    EndpointsModule,
    StatusCodesModule,
  ],
})
export class AppModule {}
