import { ValueObject } from "@domain/shared/value-objects/value-object";

export class InvalidStatusCodeError extends Error {
  constructor(message?: string) {
    super(message || "Status code must be between 100 and 511");
    this.name = "InvalidStatusCodeError";
  }
}

export class StatusCode extends ValueObject {
  readonly statusCode: number;

  constructor(statusCode: number) {
    super();

    this.statusCode = statusCode;
    this.validate();
  }

  allowsBody(): boolean {
    const statusCodesWithoutBody = [
      ...Array.from({ length: 100 }, (_, i) => i + 100),
      204,
      205,
      304,
    ];

    return !statusCodesWithoutBody.includes(this.statusCode);
  }

  private validate() {
    const isValid = this.statusCode >= 100 && this.statusCode <= 511;

    if (!isValid) {
      throw new InvalidStatusCodeError();
    }
  }
}
