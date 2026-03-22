import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  type Relation,
} from "typeorm";
import {
  HttpMethod,
  ResponseBodyType,
} from "../../../../domain/endpoint/endpoint.types";
import { UserModel } from "../../../../infra/user/db/typeorm/user-typeorm.model";

@Entity({ name: "endpoints" })
export class EndpointModel {
  @PrimaryColumn({
    name: "id",
    type: "uuid",
    nullable: false,
  })
  endpointId: string;

  @Column({
    name: "user_id",
    type: "uuid",
    nullable: false,
  })
  userId: string;

  @Column({ type: "varchar", length: 50, nullable: false })
  title: string;

  @Column({ type: "simple-enum", enum: HttpMethod, nullable: false })
  method: HttpMethod;

  @Column({ type: "varchar", length: 200, default: "", nullable: false })
  description: string;

  @Column({ type: "int", default: 0, nullable: false })
  delay: number;

  @Column({
    name: "status_code",
    type: "int",
    nullable: false,
  })
  statusCode: number;

  @Column({
    name: "response_body_type",
    type: "simple-enum",
    enum: ResponseBodyType,
    nullable: true,
    default: null,
  })
  responseBodyType: ResponseBodyType | null;

  @Column({
    name: "response_json",
    type: "text",
    nullable: true,
    default: null,
  })
  responseJson: string | null;

  @Column({
    name: "response_text",
    type: "text",
    nullable: true,
    default: null,
  })
  responseText: string | null;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @ManyToOne(
    () => UserModel,
    (user) => user.endpoints,
    {
      nullable: false,
      onDelete: "CASCADE",
    },
  )
  @JoinColumn({ name: "user_id" })
  user: Relation<UserModel>;
}
