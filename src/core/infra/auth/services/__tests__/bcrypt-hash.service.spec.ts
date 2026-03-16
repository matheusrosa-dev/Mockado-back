import bcrypt from "bcrypt";
import { BcryptHashService } from "../bcrypt-hash.service";

describe("Bcrypt Hash Service - Unit Tests", () => {
  let service: BcryptHashService;

  beforeEach(() => {
    service = new BcryptHashService();
  });

  describe("hash()", () => {
    it("should return a hashed string", async () => {
      const hash = await service.hash("my-password");

      expect(typeof hash).toBe("string");
      expect(hash).not.toBe("my-password");
    });

    it("should return a valid bcrypt hash", async () => {
      const hash = await service.hash("my-password");

      expect(bcrypt.getRounds(hash)).toBe(10);
    });

    it("should return different hashes for the same value", async () => {
      const hash1 = await service.hash("my-password");
      const hash2 = await service.hash("my-password");

      expect(hash1).not.toBe(hash2);
    });
  });

  describe("compare()", () => {
    it("should return true when value matches the hash", async () => {
      const hash = await service.hash("my-password");

      const result = await service.compare("my-password", hash);

      expect(result).toBe(true);
    });

    it("should return false when value does not match the hash", async () => {
      const hash = await service.hash("my-password");

      const result = await service.compare("wrong-password", hash);

      expect(result).toBe(false);
    });

    it("should return false when comparing against an empty string hash", async () => {
      const hash = await service.hash("my-password");

      const result = await service.compare("", hash);

      expect(result).toBe(false);
    });
  });
});
