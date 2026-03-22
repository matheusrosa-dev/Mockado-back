import { IUseCase } from "../../../shared/use-case.interface";
import { IEndpointRepository } from "../../../../domain/endpoint/endpoint.repository";
import { Uuid } from "../../../../domain/shared/value-objects/uuid.vo";
import {
  EndpointOutput,
  EndpointOutputMapper,
} from "../common/endpoint.output";
import { NotFoundError } from "../../../../domain/shared/errors/not-found.error";
import { Endpoint } from "../../../../domain/endpoint/endpoint.entity";

export class FindEndpointByIdUseCase
  implements IUseCase<FindEndpointByIdInput, EndpointOutput>
{
  constructor(private endpointRepository: IEndpointRepository) {}

  async execute(input: FindEndpointByIdInput): Promise<EndpointOutput> {
    const endpointId = new Uuid(input.endpointId);

    const endpoint = await this.endpointRepository.findByIdWithUserId({
      endpointId,
      userId: new Uuid(input.userId),
    });

    if (!endpoint) {
      throw new NotFoundError(endpointId.toString(), Endpoint);
    }

    return EndpointOutputMapper.toOutput(endpoint);
  }
}

type FindEndpointByIdInput = {
  endpointId: string;
  userId: string;
};
