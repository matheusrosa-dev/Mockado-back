import { Entity } from "../entity";
import { ValueObject } from "../value-objects/value-object";

export class NotFoundError extends Error {
  constructor(
    entityId: ValueObject | ValueObject[],
    // biome-ignore lint/suspicious/noExplicitAny: <It has to be any because we need to receive the constructor of the entity>
    entityClass: new (...args: any[]) => Entity,
  ) {
    if (Array.isArray(entityId)) {
      super(
        `${entityClass.name} Not Found using IDs: ${entityId.map((id) => id.toString()).join(", ")}`,
      );
    } else {
      super(`${entityClass.name} Not Found using ID: ${entityId.toString()}`);
    }

    this.name = "NotFoundError";
  }
}
