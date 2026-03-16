import { EntityValidationError } from "@domain/shared/validators/validation.error";
import { EndpointFactory } from "@domain/endpoint/endpoint.entity";
import { IUseCase } from "../../../shared/use-case.interface";
import {
  EndpointOutput,
  EndpointOutputMapper,
} from "../common/endpoint.output";
import { IEndpointRepository } from "@domain/endpoint/endpoint.repository";
import { StatusCode } from "@domain/endpoint/value-objects/status-code.vo";
import { IUserRepository } from "@domain/user/user.repository";
import { Uuid } from "@domain/shared/value-objects/uuid.vo";
import { HttpMethod, ResponseBodyType } from "@domain/endpoint/endpoint.types";
import { NotFoundError } from "@domain/shared/errors/not-found.error";
import { User } from "@domain/user/user.entity";

export class CreateEndpointUseCase
  implements IUseCase<CreateEndpointInput, EndpointOutput>
{
  constructor(
    private endpointRepository: IEndpointRepository,
    private userRepository: IUserRepository,
  ) {}

  async execute(input: CreateEndpointInput): Promise<EndpointOutput> {
    const existingUser = await this.userRepository.findById(
      new Uuid(input.userId),
    );

    if (!existingUser) {
      throw new NotFoundError("User not found with the provided userId", User);
    }

    const statusCode = new StatusCode(input.statusCode);

    const endpoint = EndpointFactory.create({
      ...input,
      userId: new Uuid(input.userId),
      statusCode,
    });

    if (endpoint.notification.hasErrors()) {
      throw new EntityValidationError(endpoint.notification.toJSON());
    }

    await this.endpointRepository.insert(endpoint);

    return EndpointOutputMapper.toOutput(endpoint);
  }
}

type CreateEndpointInput = {
  title: string;
  userId: string;
  method: HttpMethod;
  description?: string;
  delay?: number;
  statusCode: number;
  responseBodyType?: ResponseBodyType;
  responseJson?: string;
  responseText?: string;
};
