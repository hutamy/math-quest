import { UserRepository } from "../domain/ports";
import { ID, UserProfile } from "../domain/entities";

export class UserUsecase {
  constructor(private userRepo: UserRepository) {}

  async getProfile(userID: ID): Promise<UserProfile> {
    return await this.userRepo.getUserProfile(userID);
  }
}
