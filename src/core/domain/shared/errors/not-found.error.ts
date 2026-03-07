import { Entity } from "../entity";
import { ValueObject } from "../value-object";

export class NotFoundError extends Error {
  constructor(
    entity_id: ValueObject | ValueObject[],
    entityClass: new (...args: any[]) => Entity,
  ) {
    const idsMessage = Array.isArray(entity_id)
      ? entity_id.join(", ")
      : entity_id;

    super(`${entityClass.name} Not Found using IDs: ${idsMessage}`);

    this.name = "NotFoundError";
  }
}
