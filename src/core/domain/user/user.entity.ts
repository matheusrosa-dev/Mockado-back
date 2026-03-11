import { Entity } from "@domain/shared/entity";
import { Uuid } from "@domain/shared/value-objects/uuid.vo";

type ConstructorProps = {
  userId?: Uuid;
  googleId: string;
  email: string;
  name: string;
  picture: string;
  createdAt?: Date;
};

export class User extends Entity {
  private _userId: Uuid;
  private _googleId: string;
  private _email: string;
  private _name: string;
  private _picture: string;
  private _createdAt: Date;

  constructor(props: ConstructorProps) {
    super();

    this._userId = props.userId ?? new Uuid();
    this._googleId = props.googleId;
    this._email = props.email;
    this._name = props.name;
    this._picture = props.picture;
    this._createdAt = props.createdAt ?? new Date();
  }

  changeName(name: string) {
    this._name = name;

    // this.validate(["name"]);
  }

  changeEmail(email: string) {
    this._email = email;

    // this.validate(["email"]);
  }

  changePicture(picture: string) {
    this._picture = picture;

    // this.validate(["picture"]);
  }

  // TODO: IMPLEMENTAR
  validate(fields?: []) {
    console.log(fields);
  }

  get entityId() {
    return this._userId;
  }

  get userId() {
    return this._userId;
  }

  get googleId() {
    return this._googleId;
  }

  get email() {
    return this._email;
  }

  get name() {
    return this._name;
  }

  get picture() {
    return this._picture;
  }

  get createdAt() {
    return this._createdAt;
  }

  toJSON() {
    return {
      user_id: this._userId.toString(),
    };
  }
}
