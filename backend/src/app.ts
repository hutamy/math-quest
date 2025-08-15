import Fastify from "fastify";
import { env } from "./config/env";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import lessonsRoutes from "./interfaces/http/routes/lessons.routes";
import usersRoutes from "./interfaces/http/routes/users.routes";

export function buildApp() {
  const app = Fastify({
    logger: { level: env.LOG_LEVEL },
    ajv: {
      customOptions: {
        strict: false,
      },
    },
  }).withTypeProvider<TypeBoxTypeProvider>();

  // CORS
  app.addHook("preHandler", async (request, reply) => {
    reply.header("Access-Control-Allow-Origin", "*");
    reply.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS",
    );
    reply.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (request.method === "OPTIONS") {
      reply.status(204).send();
      return;
    }
  });

  // Swagger
  app.register(swagger, {
    openapi: {
      info: {
        title: "Math Quest API",
        description: "API documentation for the Math Quest application",
        version: "1.0.0",
      },
      tags: [
        {
          name: "Lessons",
          description: "Lesson management and problem submission",
        },
        { name: "User", description: "User profile and statistics" },
      ],
    },
  });

  // Health check
  app.get("/", async (request, reply) => {
    return { status: "ok", timestamp: new Date().toISOString() };
  });
  app.get("/health", async (request, reply) => {
    return { status: "ok", timestamp: new Date().toISOString() };
  });

  app.register(swaggerUi, {
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: "full",
      deepLinking: false,
    },
    staticCSP: true,
  });

  app.register(lessonsRoutes, { prefix: "/api" });
  app.register(usersRoutes, { prefix: "/api" });

  return app;
}
