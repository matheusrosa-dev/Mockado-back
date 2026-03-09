import { registerAs } from "@nestjs/config";
import * as Joi from "joi";

import "dotenv/config";

export const apiConfig = registerAs("api", () => ({
  port: Number(process.env.API_PORT),
}));

export const validationSchema = Joi.object({
  API_PORT: Joi.number().required(),
});
