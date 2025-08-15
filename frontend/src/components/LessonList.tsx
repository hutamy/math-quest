import React from "react";
import { LoadingState } from "./common/LoadingState";
import { ErrorState } from "./common/ErrorState";
import type { LessonWithProgress } from "../types";
import { CheckBadgeIcon, PlayCircleIcon } from "@heroicons/react/20/solid";
import { StarIcon } from "@heroicons/react/24/outline";

interface LessonListProps {
  lessons: LessonWithProgress[];
  isLoading: boolean;
  error: string | null;
  onLessonSelect: (lesson: LessonWithProgress) => void;
  onRetry?: () => void;
}

export const LessonListScreen: React.FC<LessonListProps> = ({
  isLoading,
  error,
  onRetry,
  lessons,
  onLessonSelect,
}) => {
  if (isLoading) {
    return <LoadingState message="Loading lessons..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={onRetry} />;
  }

  if (lessons.length === 0) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          No lessons available
        </h3>
        <p className="text-gray-600">Check back later for new content!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {lessons.map((lesson, index) => {
        const isLocked = index > 0 && !lessons[index - 1].is_completed;
        return (
          <LessonCard
            key={lesson.id}
            lesson={lesson}
            isLocked={isLocked}
            onClick={() => !isLocked && onLessonSelect(lesson)}
          />
        );
      })}
    </div>
  );
};

interface LessonCardProps {
  lesson: LessonWithProgress;
  isLocked: boolean;
  onClick: () => void;
}

const LessonCard: React.FC<LessonCardProps> = ({
  lesson,
  isLocked,
  onClick,
}) => {
  const getStatusIcon = () => {
    if (isLocked) {
      return (
        <div className="w-6 h-6 rounded-full border-2 border-gray-300 bg-gray-100" />
      );
    }

    if (lesson.is_completed) {
      return <CheckBadgeIcon className="w-6 h-6 text-green-500" />;
    }

    if (lesson.progress_percent > 0) {
      return <PlayCircleIcon className="w-6 h-6 text-blue-500" />;
    }

    return <StarIcon className="w-6 h-6 text-blue-500" />;
  };

  const getStatusText = () => {
    if (isLocked) return "Locked";
    if (lesson.is_completed) return "Completed";
    if (lesson.progress_percent > 0) return "In Progress";
    return "Start Now";
  };

  const getStatusColor = () => {
    if (isLocked) return "text-gray-500";
    if (lesson.is_completed) return "text-green-600";
    if (lesson.progress_percent > 0) return "text-blue-600";
    return "text-blue-600";
  };

  return (
    <div
      className={`card p-4 transition-all duration-200 ${
        isLocked
          ? "opacity-60 cursor-not-allowed shadow-lg"
          : "cursor-pointer shadow-lg hover:border-blue-300 transform hover:-translate-y-1"
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          {getStatusIcon()}
          <div>
            <h3 className="font-semibold text-gray-800 text-lg">
              {lesson.title}
            </h3>
            <p className="text-sm text-gray-600">{lesson.description}</p>
          </div>
        </div>
      </div>

      {!isLocked && lesson.progress_percent > 0 && (
        <div className="mb-3">
          <div className="progress-bar h-3">
            <div
              className="progress-fill"
              style={{
                width: `${Math.max(
                  0,
                  Math.min(100, lesson.progress_percent)
                )}%`,
              }}
            />
            <div className="text-xs text-gray-600 mt-1">
              {Math.round(lesson.progress_percent)}%
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className={`text-sm font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        </div>
      </div>
    </div>
  );
};
