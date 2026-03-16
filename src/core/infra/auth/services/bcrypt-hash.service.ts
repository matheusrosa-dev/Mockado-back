import { IHashService } from "@app/auth/services/hash.service";
import bcrypt from "bcrypt";

export class BcryptHashService implements IHashService {
  async hash(value: string) {
    return bcrypt.hash(value, 10);
  }

  async compare(value: string, hash: string) {
    return bcrypt.compare(value, hash);
  }
}
