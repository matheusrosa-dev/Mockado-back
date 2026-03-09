import { Entity } from "../entity";
import { ValueObject } from "../value-objects/value-object";

export class NotFoundError extends Error {
  constructor(
    entity_id: ValueObject | ValueObject[],
    // biome-ignore lint/suspicious/noExplicitAny: <It has to be any because we need to receive the constructor of the entity>
    entityClass: new (...args: any[]) => Entity,
  ) {
    if (Array.isArray(entity_id)) {
      super(`${entityClass.name} Not Found using IDs: ${entity_id.join(", ")}`);
    } else {
      super(`${entityClass.name} Not Found using ID: ${entity_id}`);
    }

    this.name = "NotFoundError";
  }
}
