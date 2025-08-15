import { buildApp } from "./app";
import { env } from "./config/env";

const app = buildApp();
app
  .listen({ port: env.PORT, host: "0.0.0.0" })
  .then(() =>
    console.log(`${env.APP_NAME} running on http://localhost:${env.PORT}`),
  )
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
