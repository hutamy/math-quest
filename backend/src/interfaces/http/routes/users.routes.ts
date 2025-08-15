import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { UserRepositoryPrisma } from "../../../infrastructure/UserRepository";
import { UserUsecase } from "../../../usecase/users";
import { UsersController } from "../controllers/users.controller";
import { Type } from "@sinclair/typebox";

const usersRoutes: FastifyPluginAsyncTypebox = async (app) => {
  const userRepo = new UserRepositoryPrisma();
  const usersUc = new UserUsecase(userRepo);
  const usersController = new UsersController(usersUc);

  app.get(
    "/profile",
    {
      schema: {
        tags: ["Users"],
        summary: "Get user profile with stats",
        response: {
          200: Type.Object({
            id: Type.Number(),
            username: Type.String(),
            total_xp: Type.Number(),
            current_streak: Type.Number(),
            best_streak: Type.Number(),
            progress_percent: Type.Number(),
          }),
        },
      },
    },
    usersController.getProfile,
  );
};

export default usersRoutes;
