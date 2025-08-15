import type { UserProfile } from "../types";
import React from "react";
import { LoadingState } from "./common/LoadingState";
import { ErrorState } from "./common/ErrorState";
import {
  TrophyIcon,
  StarIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/20/solid";

interface ProfileProps {
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  onRetry?: () => void;
}

export const ProfileScreen: React.FC<ProfileProps> = ({
  user,
  isLoading,
  error,
  onRetry,
}) => {
  if (isLoading) {
    return <LoadingState message="Loading your profile..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={onRetry} />;
  }

  if (!user) {
    return <ErrorState message="Use data not found" onRetry={onRetry} />;
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          Hi, {user.username}!
        </h1>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          icon={<TrophyIcon className="w-6 h-6 text-yellow-500" />}
          title="Total XP"
          value={user.total_xp.toLocaleString()}
          subtitle={
            user.progress_percent < 34
              ? "Level 1"
              : user.progress_percent < 67
              ? "Level 2"
              : "Level 3"
          }
          color="bg-gradient-to-r from-yellow-100 to-yellow-200"
        />
        <StatCard
          icon={<StarIcon className="w-6 h-6 text-blue-500" />}
          title="Current Streak"
          value={user.current_streak.toString()}
          subtitle={user.current_streak === 1 ? "day" : "days"}
          color="bg-gradient-to-r from-blue-100 to-blue-200"
        />
        <StatCard
          icon={<StarIcon className="w-6 h-6 text-red-500" />}
          title="Best Streak"
          value={user.best_streak.toString()}
          subtitle={user.best_streak === 1 ? "day" : "days"}
          color="bg-gradient-to-r from-red-100 to-red-200"
        />
        <StatCard
          icon={<ArrowTrendingUpIcon className="w-6 h-6 text-purple-500" />}
          title="Progress"
          value={`${Math.round(user.progress_percent)}%`}
          subtitle="completed"
          color="bg-gradient-to-r from-purple-100 to-purple-200"
        />
      </div>
    </div>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  title,
  value,
  subtitle,
  color,
}) => {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 rounded-lg ${color} text-white`}>{icon}</div>
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
        <div className="text-2xl font-bold text-gray-800">{value}</div>
        <p className="text-xs text-gray-600">{subtitle}</p>
      </div>
    </div>
  );
};
