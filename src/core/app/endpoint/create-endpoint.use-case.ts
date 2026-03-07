import { EntityValidationError } from "../../domain/shared/validators/validation.error";
import { EndpointFactory } from "../../domain/endpoint/endpoint.entity";
import { IUseCase } from "../shared/use-case.interface";
import { EndpointOutput, EndpointOutputMapper } from "./common/endpoint-output";
import { CreateEndpointInput } from "./create-endpoint.input";

export class CreateEndpointUseCase
  implements IUseCase<CreateEndpointInput, EndpointOutput>
{
  // constructor(private readonly endpointRepo: IEndpointRepository) {}

  async execute(input: CreateEndpointInput): Promise<EndpointOutput> {
    const entity = EndpointFactory.create(input);

    if (entity.notification.hasErrors()) {
      throw new EntityValidationError(entity.notification.toJSON());
    }

    // await this.endpointRepo.insert(entity);

    return EndpointOutputMapper.toOutput(entity);
  }
}
