import { FastifyReply, FastifyRequest } from "fastify";
import { LessonsUsecase } from "../../../usecase/lessons";
import { SubmitAnswerRequest } from "../../../domain/entities";

export class LessonsController {
  constructor(private lessonUc: LessonsUsecase) {}

  list = async (req: FastifyRequest, rep: FastifyReply) => {
    try {
      const userID = 1; // using user demo
      const lessons = await this.lessonUc.list(userID);
      rep.send(lessons);
    } catch (error) {
      return rep.status(500).send({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  getLesson = async (req: FastifyRequest, rep: FastifyReply) => {
    try {
      const { id } = req.params as { id: string };
      const lessonId = parseInt(id);
      if (isNaN(lessonId)) {
        return rep.status(422).send({
          error: "InvalidProblem",
          message: `Problem ID must be a number`,
        });
      }

      const lesson = await this.lessonUc.detail(lessonId);
      if (!lesson) {
        return rep.status(422).send({
          error: "InvalidProblem",
          message: `Problem ${lessonId} not found`,
        });
      }
      rep.send(lesson);
    } catch (error) {
      return rep.status(500).send({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  submitAnswers = async (
    req: FastifyRequest<{
      Params: { id: string };
      Body: SubmitAnswerRequest;
    }>,
    rep: FastifyReply,
  ) => {
    try {
      const userID = 1; // using user demo
      const lessonId = parseInt(req.params.id);
      const { attempt_id, answers } = req.body;

      if (isNaN(lessonId)) {
        return rep.status(422).send({
          error: "InvalidProblem",
          message: `Problem ID must be a number`,
        });
      }

      if (req.body.answers.length == 0) {
        return rep
          .status(409)
          .send({ error: "Validation", message: "answers must be non-empty" });
      }

      const res = await this.lessonUc.submitAnswers(userID, lessonId, {
        attempt_id,
        answers,
      });
      rep.send(res);
    } catch (error) {
      return rep.status(500).send({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };
}
