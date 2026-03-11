import { IUserRepository } from "@domain/user/user.repository";
import { InMemoryRepository } from "../../../shared/db/in-memory/in-memory.repository";
import { User } from "@domain/user/user.entity";

export class UserInMemoryRepository
  extends InMemoryRepository<User>
  implements IUserRepository
{
  getEntity() {
    return User;
  }
}
