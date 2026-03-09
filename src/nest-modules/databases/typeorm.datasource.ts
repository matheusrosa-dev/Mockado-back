import { join } from "node:path";
import { DataSource } from "typeorm";

const type = process.env.DB_TYPE as "sqlite" | "postgres";

const commonOptions = {
  entities: [join(process.cwd(), "src/core/**/*.model{.ts,.js}")],
  migrations: [
    join(
      process.cwd(),
      "src/core/infra/shared/db/typeorm/migrations/*{.ts,.js}",
    ),
  ],
  synchronize: false,
  logging: true,
};

let dataSource: DataSource | null = null;

if (type === "postgres") {
  dataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    ...commonOptions,
  });
}

export default dataSource;
