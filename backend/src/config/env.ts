import "dotenv/config";
import { z } from "zod";

const EnvSchema = z.object({
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  APP_NAME: z.string().default("MathQuest"),
  LOG_LEVEL: z.string().default("info"),
  DATABASE_URL: z.string().url({ message: "DATABASE_URL must be a valid URL" }),
});

export type Env = z.infer<typeof EnvSchema>;
export const env: Env = EnvSchema.parse(process.env);
