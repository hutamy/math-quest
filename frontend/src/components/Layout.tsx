import React from "react";
import { BookOpenIcon, UserIcon } from "@heroicons/react/24/outline";

interface LayoutProps {
  children: React.ReactNode;
  currentPage?: "lessons" | "profile";
  onNavigate?: (page: "lessons" | "profile") => void;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  currentPage = "lessons",
  onNavigate,
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-gray-800">MathQuest</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-6 pb-20">{children}</main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-pb">
        <div className="max-w-md mx-auto px-4">
          <div className="flex justify-around py-2">
            <button
              onClick={() => onNavigate?.("lessons")}
              className={`flex flex-col items-center cursor-pointer gap-1 py-2 px-4 rounded-lg transition-colors ${
                currentPage == "lessons"
                  ? "text-blue-500"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <BookOpenIcon className="w-5 h-5" />
              <span className="text-xs font-medium">Lessons</span>
            </button>
            <button
              onClick={() => onNavigate?.("profile")}
              className={`flex flex-col items-center cursor-pointer gap-1 py-2 px-4 rounded-lg transition-colors ${
                currentPage == "profile"
                  ? "text-blue-500"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <UserIcon className="w-5 h-5" />
              <span className="text-xs font-medium">Profile</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};
