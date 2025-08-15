import type {
  LessonDetail,
  SubmitAnswerResponse,
  LessonProgress,
  SubmitAnswerRequest,
  ProblemForClient,
  ProblemOptionForClient,
} from "../types";
import { LoadingState } from "./common/LoadingState";
import { ErrorState } from "./common/ErrorState";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { apiService, handleApiError } from "../services/api";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Button } from "./common/Button";

interface LessonInterfaceProps {
  lesson: LessonDetail;
  isLoading: boolean;
  error: string | null;
  onBack: () => void;
  onComplete: (result: SubmitAnswerResponse) => void;
  onRetry?: () => void;
}

export const LessonDetailScreen: React.FC<LessonInterfaceProps> = ({
  lesson,
  isLoading,
  error,
  onBack,
  onRetry,
  onComplete,
}) => {
  const [progress, setProgress] = useState<LessonProgress>({
    current_problem: 0,
    total_problems: lesson.problems.length,
    answers: [],
    time_started: Date.now(),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorSubmit, setErrorSubmit] = useState<string | null>(null);

  useEffect(() => {
    if (lesson?.problems) {
      setProgress((prev) => ({
        ...prev,
        total_problems: lesson.problems.length,
        time_started: Date.now(),
      }));
    }
  }, [lesson]);

  if (isLoading) {
    return <LoadingState message="Loading lesson detail..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={onRetry} />;
  }

  if (!lesson || !lesson.problems?.length) {
    return (
      <ErrorState
        message="No problems found in this lesson"
        onRetry={onRetry}
      />
    );
  }

  const currentProblem = lesson.problems[progress.current_problem];
  const hasNext = progress.current_problem < progress.total_problems - 1;
  const hasPrev = progress.current_problem > 0;
  const isLast = progress.current_problem === progress.total_problems - 1;

  // Find current problem's answer from the array
  const currentAnswer = progress.answers.find(
    (a) => a.problem_id === currentProblem.id
  );
  const hasAnswered = currentAnswer !== undefined;

  const handleAnswerChange = (answer: number) => {
    const newAnswers = [...progress.answers];
    const existingIndex = newAnswers.findIndex(
      (a) => a.problem_id === currentProblem.id
    );

    const answerObj = {
      problem_id: currentProblem.id,
      value: currentProblem.type === "INPUT" ? answer : undefined,
      option_id: currentProblem.type === "MULTIPLE_CHOICE" ? answer : undefined,
    };

    if (existingIndex >= 0) {
      newAnswers[existingIndex] = answerObj;
    } else {
      newAnswers.push(answerObj);
    }

    setProgress((prev) => ({
      ...prev,
      answers: newAnswers,
    }));
  };

  const handleNext = () => {
    if (hasNext) {
      setProgress((prev) => ({
        ...prev,
        current_problem: prev.current_problem + 1,
      }));
    }
  };

  const handlePrev = () => {
    if (hasPrev) {
      setProgress((prev) => ({
        ...prev,
        current_problem: prev.current_problem - 1,
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setErrorSubmit(null);

      const submission: SubmitAnswerRequest = {
        attempt_id: uuidv4(),
        answers: progress.answers.map((answer) => ({
          problem_id: answer.problem_id,
          value: answer.value,
          option_id: answer.option_id,
        })),
      };

      const result = await apiService.submitAnswer(lesson.id, submission);
      onComplete(result);
    } catch (err) {
      setErrorSubmit(handleApiError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const allProblemsAnswered = lesson.problems.every((problem) =>
    progress.answers.some((a) => a.problem_id === problem.id)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 cursor-pointer"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span>Back</span>
        </button>
      </div>

      {/* Problem */}
      <ProblemCard
        problem={currentProblem}
        answer={
          (currentProblem.type === "MULTIPLE_CHOICE"
            ? currentAnswer?.option_id
            : currentAnswer?.value) || 0
        }
        onAnswerChange={handleAnswerChange}
      />

      {/* Submit Error */}
      {errorSubmit && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-700 text-sm">{errorSubmit}</p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center pt-4">
        <Button
          variant="secondary"
          onClick={handlePrev}
          disabled={!hasPrev}
          className="w-24"
        >
          Prev
        </Button>

        {isLast ? (
          <Button
            onClick={handleSubmit}
            disabled={!allProblemsAnswered || isSubmitting}
            loading={isSubmitting}
            className="px-8"
          >
            Submit Lesson
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            disabled={!hasAnswered || !hasNext}
            className="w-24"
          >
            Next
          </Button>
        )}
      </div>
    </div>
  );
};

interface ProblemCardProps {
  problem: ProblemForClient;
  answer: number;
  onAnswerChange: (answer: number) => void;
}

const ProblemCard: React.FC<ProblemCardProps> = ({
  problem,
  answer,
  onAnswerChange,
}) => {
  return (
    <div className="card space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {problem.question}
        </h3>
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <span className="inline-flex items-center gap-1">
            + {problem.xp} XP
          </span>
        </div>
      </div>

      {problem.type === "MULTIPLE_CHOICE" ? (
        <div className="space-y-3">
          {problem.options?.map((option: ProblemOptionForClient) => (
            <label
              key={option.id}
              className={`block p-3 rounded-lg border-2 cursor-pointer transition-all ${
                answer === option.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300 bg-gray-50 hover:bg-gray-100"
              }`}
            >
              <input
                type="radio"
                name={`problem-${problem.id}`}
                value={option.id}
                checked={answer === option.id}
                onChange={(e) =>
                  onAnswerChange(Number(e.target.value))
                }
                className="sr-only"
              />
              <span className="text-gray-800">{option.value}</span>
            </label>
          ))}
        </div>
      ) : (
        <div>
          <input
            type="number"
            value={answer || ""}
            onChange={(e) =>
              onAnswerChange(Number(e.target.value) || 0)
            }
            placeholder="Enter your answer..."
            className="input-field text-lg text-center"
            autoFocus
          />
        </div>
      )}
    </div>
  );
};
