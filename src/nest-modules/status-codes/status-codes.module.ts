import { Module } from "@nestjs/common";
import { ListStatusCodesUseCase } from "@app/status-code/list-status-codes/list-status-code.use-case";
import { StatusCodesController } from "./status-codes.controller";

@Module({
  controllers: [StatusCodesController],
  providers: [
    {
      provide: ListStatusCodesUseCase,
      useFactory: () => new ListStatusCodesUseCase(),
    },
  ],
})
export class StatusCodesModule {}
