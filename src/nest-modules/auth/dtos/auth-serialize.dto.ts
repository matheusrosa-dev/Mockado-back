import { Expose, Type } from "class-transformer";

class User {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  name: string;
}

export class AuthSerializeDto {
  @Expose()
  @Type(() => User)
  user: User;
}
