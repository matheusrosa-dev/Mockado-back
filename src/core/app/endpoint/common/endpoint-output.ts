import { Endpoint } from "../../../domain/endpoint/endpoint.entity";

export type EndpointOutput = {
  id: string;
  method: string;
  title: string;
  description: string;
  delay?: number;
  statusCode: number;
  responseBodyType?: string;
  responseJson?: string;
  responseText?: string;
  created_at: Date;
};

export class EndpointOutputMapper {
  static toOutput(entity: Endpoint): EndpointOutput {
    const jsonEntity = entity.toJSON();

    return {
      id: jsonEntity.endpoint_id,
      ...jsonEntity,
    };
  }
}
