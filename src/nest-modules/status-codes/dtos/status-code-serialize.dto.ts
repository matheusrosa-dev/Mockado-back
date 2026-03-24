import { Expose } from "class-transformer";

export class StatusCodeSerializeDto {
  @Expose()
  code: number;

  @Expose()
  description: string;
}
