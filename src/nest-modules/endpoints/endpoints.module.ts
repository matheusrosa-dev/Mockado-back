import { Module } from "@nestjs/common";
import { EndpointsController } from "./endpoints.controller";
import { EndpointTypeOrmRepository } from "@infra/endpoint/db/typeorm/endpoint-typeorm.repository";
import { ENDPOINT_PROVIDERS } from "./endpoints.provider";

@Module({
  controllers: [EndpointsController],
  providers: [
    ENDPOINT_PROVIDERS.REPOSITORY,
    ...Object.values(ENDPOINT_PROVIDERS.USE_CASES),
  ],
  exports: [EndpointTypeOrmRepository],
})
export class EndpointsModule {}
