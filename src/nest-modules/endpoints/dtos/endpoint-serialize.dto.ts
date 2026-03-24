import { Expose } from "class-transformer";

export class EndpointSerializeDto {
  @Expose()
  id: string;

  @Expose()
  userId: string;

  @Expose()
  title: string;

  @Expose()
  method: string;

  @Expose()
  description: string;

  @Expose()
  statusCode: number;

  @Expose()
  delay: number;

  @Expose()
  responseBodyType: string;

  @Expose()
  responseJson: string;

  @Expose()
  createdAt: Date;
}
