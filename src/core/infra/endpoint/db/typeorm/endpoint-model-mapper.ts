import { LoadEntityError } from "../../../../domain/shared/validators/validation.error";
import { Endpoint } from "../../../../domain/endpoint/endpoint.entity";
import { EndpointModel } from "./endpoint-typeorm.model";
import { Uuid } from "../../../../domain/shared/value-objects/uuid.vo";
import { StatusCode } from "../../../../domain/endpoint/value-objects/status-code.vo";

export class EndpointModelMapper {
  static toModel(entity: Endpoint): EndpointModel {
    const model = new EndpointModel();

    model.userId = entity.userId.toString();
    model.endpointId = entity.endpointId.toString();
    model.title = entity.title;
    model.method = entity.method;
    model.description = entity.description;
    model.delay = entity.delay;
    model.statusCode = entity.statusCode.statusCode;
    model.responseBodyType = entity.responseBodyType ?? null;
    model.responseJson = entity.responseJson ?? null;
    model.responseText = entity.responseText ?? null;
    model.createdAt = entity.createdAt;

    return model;
  }

  static toEntity(model: EndpointModel): Endpoint {
    const endpoint = new Endpoint({
      userId: new Uuid(model.userId),
      endpointId: new Uuid(model.endpointId),
      title: model.title,
      method: model.method,
      description: model.description,
      delay: model.delay,
      statusCode: new StatusCode(model.statusCode),
      createdAt: model.createdAt,

      ...(model?.responseBodyType && {
        responseBodyType: model.responseBodyType,
      }),
      ...(model?.responseJson && { responseJson: model.responseJson }),
      ...(model?.responseText && { responseText: model.responseText }),
    });

    endpoint.validate();

    if (endpoint.notification.hasErrors()) {
      throw new LoadEntityError(endpoint.notification.toJSON());
    }

    return endpoint;
  }
}
