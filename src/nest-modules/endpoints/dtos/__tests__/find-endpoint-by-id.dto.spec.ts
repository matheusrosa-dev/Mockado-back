/** biome-ignore-all lint/suspicious/noExplicitAny: <It has to allow any in tests> */
import { validateSync } from "class-validator";
import { Uuid } from "../../../../core/domain/shared/value-objects/uuid.vo";
import { FindEndpointByIdDto } from "../find-endpoint-by-id.dto";

function validate(props: any) {
  const input = new FindEndpointByIdDto(props);
  return validateSync(input);
}

describe("Find Endpoint By Id DTO - Unit Tests", () => {
  it("should pass with valid props", () => {
    const errors = validate({
      endpointId: new Uuid().id,
    });

    expect(errors).toHaveLength(0);
  });

  describe("endpointId", () => {
    it("should fail when endpointId is empty", () => {
      const errors = validate({ endpointId: "" });

      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe("endpointId");
      expect(Object.keys(errors[0].constraints as object)).toContain("isUuid");
      expect(Object.keys(errors[0].constraints as object)).toContain(
        "isNotEmpty",
      );
    });

    it("should fail when endpointId is not a UUID", () => {
      const errors = validate({
        endpointId: "invalid-uuid",
      });

      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe("endpointId");
      expect(Object.keys(errors[0].constraints as object)).toContain("isUuid");
    });
  });
});
