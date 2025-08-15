import { FastifyReply, FastifyRequest } from "fastify";
import { UserUsecase } from "../../../usecase/users";

export class UsersController {
  constructor(private userUc: UserUsecase) {}

  getProfile = async (req: FastifyRequest, rep: FastifyReply) => {
    try {
      const userID = 1; // using user demo
      const profile = await this.userUc.getProfile(userID);
      rep.send(profile);
    } catch (error) {
      return rep.status(500).send({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };
}
