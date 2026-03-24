import { ListStatusCodesUseCase } from "@app/status-code/use-cases/list-status-codes/list-status-code.use-case";
import { Controller, Get } from "@nestjs/common";
import { Serialize } from "../shared/interceptors/serialize.interceptor";
import { StatusCodeSerializeDto } from "./dtos/status-code-serialize.dto";

@Controller("status-codes")
@Serialize(StatusCodeSerializeDto)
export class StatusCodesController {
  constructor(private listStatusCodesUseCase: ListStatusCodesUseCase) {}

  @Get()
  async listStatusCodes() {
    return this.listStatusCodesUseCase.execute();
  }
}
