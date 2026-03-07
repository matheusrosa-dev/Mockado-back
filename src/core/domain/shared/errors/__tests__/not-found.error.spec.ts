import { Entity } from "../../entity";
import { Uuid } from "../../value-objects/uuid.vo";
import { NotFoundError } from "../not-found.error";

class StubEntity extends Entity {
  entity_id = new Uuid();

  toJSON(): object {
    return { id: this.entity_id.id };
  }
}

describe("Not Found Error - Unit Tests", () => {
  it("should create an instance of NotFoundError with a single ID", () => {
    const entity = new StubEntity();

    const error = new NotFoundError(entity.entity_id, StubEntity);
    expect(error).toBeInstanceOf(NotFoundError);
    expect(error.message).toBe(
      `StubEntity Not Found using IDs: ${entity.entity_id.id}`,
    );
    expect(error.name).toBe("NotFoundError");
  });

  it("should create an instance of NotFoundError with multiple IDs", () => {
    const entity1 = new StubEntity();
    const entity2 = new StubEntity();

    const error = new NotFoundError(
      [entity1.entity_id, entity2.entity_id],
      StubEntity,
    );
    expect(error).toBeInstanceOf(NotFoundError);
    expect(error.message).toBe(
      `StubEntity Not Found using IDs: ${entity1.entity_id.id}, ${entity2.entity_id.id}`,
    );
    expect(error.name).toBe("NotFoundError");
  });
});
