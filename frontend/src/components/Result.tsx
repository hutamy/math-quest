import { StarIcon } from "@heroicons/react/20/solid";
import type { SubmitAnswerResponse } from "../types";
import { Button } from "./common/Button";

interface ResultScreenProps {
  data: SubmitAnswerResponse;
  lessonTitle: string;
  onContinue: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  data,
  lessonTitle,
  onContinue,
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Lesson Complete!
        </h1>
        <p className="text-gray-600">{lessonTitle}</p>
      </div>

      <div className="card p-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <StarIcon
                className={`w-6 h-6 ${
                  data.earned_xp > 0 ? "text-red-500" : "text-gray-400"
                }`}
              />
            </div>
            <div className="text-2xl font-bold text-gray-800">
              +{data.earned_xp}
            </div>
            <div className="text-sm text-gray-600">XP Gained</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600">
              {data.streak.current && `Day Streak: ${data.streak.current} 🔥`}
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-3">
          <div>
            <p className="text-sm text-gray-600">
              Keep it up! You're building great learning habits.
            </p>
          </div>
        </div>
      </div>

      <div className="pt-4">
        <Button onClick={onContinue} className="w-full text-lg py-4">
          Continue Learning 🚀
        </Button>
      </div>
    </div>
  );
};
