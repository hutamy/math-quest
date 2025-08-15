import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { LessonRepositoryPrisma } from "../../../infrastructure/LessonRepository";
import { LessonsUsecase } from "../../../usecase/lessons";
import { LessonsController } from "../controllers/lessons.controller";
import { Type } from "@sinclair/typebox";
import ProblemRepositoryPrisma from "../../../infrastructure/ProblemRepository";
import { SubmissionRepositoryPrisma } from "../../../infrastructure/SubmissionRepository";
import { LessonProgressRepositoryPrisma } from "../../../infrastructure/LessonProgressRepository";
import { UserRepositoryPrisma } from "../../../infrastructure/UserRepository";
import { PrismaTransactionManager } from "../../../infrastructure/TransactionManager";

const lessonsRoutes: FastifyPluginAsyncTypebox = async (app) => {
  const lessonRepo = new LessonRepositoryPrisma();
  const submissionRepo = new SubmissionRepositoryPrisma();
  const problemRepo = new ProblemRepositoryPrisma();
  const userRepo = new UserRepositoryPrisma();
  const progressRepo = new LessonProgressRepositoryPrisma();
  const transactionManager = new PrismaTransactionManager();

  const lessonsUc = new LessonsUsecase(
    lessonRepo,
    submissionRepo,
    problemRepo,
    userRepo,
    progressRepo,
    transactionManager,
  );
  const controller = new LessonsController(lessonsUc);

  app.get(
    "/lessons",
    {
      schema: {
        tags: ["Lessons"],
        summary: "Get all lessons with progress",
        response: {
          200: Type.Array(
            Type.Object({
              id: Type.Number(),
              title: Type.String(),
              description: Type.Optional(Type.String()),
              order: Type.Number(),
              is_completed: Type.Boolean(),
              progress_percent: Type.Number(),
              total_problems: Type.Number(),
              correct_answers: Type.Number(),
            }),
          ),
        },
      },
    },
    controller.list,
  );

  app.get(
    "/lessons/:id",
    {
      schema: {
        summary: "Get lesson details with problems",
        params: Type.Object({
          id: Type.String(),
        }),
        response: {
          200: Type.Object({
            id: Type.Number(),
            title: Type.String(),
            description: Type.Optional(Type.String()),
            order: Type.Number(),
            problems: Type.Array(
              Type.Object({
                id: Type.Number(),
                type: Type.Union([
                  Type.Literal("MULTIPLE_CHOICE"),
                  Type.Literal("INPUT"),
                ]),
                question: Type.String(),
                xp: Type.Number(),
                options: Type.Optional(
                  Type.Array(
                    Type.Object({
                      id: Type.Number(),
                      value: Type.Number(),
                    }),
                  ),
                ),
              }),
            ),
          }),
          422: Type.Object({
            error: Type.String(),
            message: Type.String(),
          }),
        },
      },
    },
    controller.getLesson,
  );

  app.post(
    "/lessons/:id/submit",
    {
      schema: {
        tags: ["Lessons"],
        summary: "Submit answers for a lessons",
        params: Type.Object({
          id: Type.String(),
        }),
        body: Type.Object({
          attempt_id: Type.String(),
          answers: Type.Array(
            Type.Object({
              problem_id: Type.Number(),
              option_id: Type.Optional(Type.Number()),
              value: Type.Optional(Type.Number()),
            }),
          ),
        }),
        response: {
          200: Type.Object({
            correct_count: Type.Number(),
            earned_xp: Type.Number(),
            new_total_xp: Type.Number(),
            lesson_progress: Type.Number(),
            streak: Type.Object({
              current: Type.Number(),
              best: Type.Number(),
            }),
          }),
          409: Type.Object({
            error: Type.String(),
            message: Type.String(),
          }),
          422: Type.Object({
            error: Type.String(),
            message: Type.String(),
          }),
        },
      },
    },
    controller.submitAnswers,
  );
};

export default lessonsRoutes;
