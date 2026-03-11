import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateEndpointsTable1773067320714 implements MigrationInterface {
  name = "CreateEndpointsTable1773067320714";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."endpoints_method_enum" AS ENUM('GET', 'POST', 'PUT', 'DELETE', 'PATCH')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."endpoints_responsebodytype_enum" AS ENUM('json', 'text', 'null', 'empty')`,
    );
    await queryRunner.query(
      `CREATE TABLE "endpoints" ("endpointId" uuid NOT NULL, "title" character varying(50) NOT NULL, "method" "public"."endpoints_method_enum" NOT NULL, "description" character varying(200) NOT NULL DEFAULT '', "delay" integer NOT NULL DEFAULT '0', "statusCode" integer NOT NULL, "responseBodyType" "public"."endpoints_responsebodytype_enum", "responseJson" text, "responseText" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_2e48b720c7298270fc3360cc773" PRIMARY KEY ("endpointId"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "endpoints"`);
    await queryRunner.query(
      `DROP TYPE "public"."endpoints_responsebodytype_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."endpoints_method_enum"`);
  }
}
