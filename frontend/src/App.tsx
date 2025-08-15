import { Layout } from "./components/Layout";
import React, { useState } from "react";
import { LessonListScreen } from "./components/LessonList";
import { useLessons, useLessonDetail } from "./hooks/lessons";
import type { LessonWithProgress, SubmitAnswerResponse } from "./types";
import { LessonDetailScreen } from "./components/LessonDetail";
import { useUserProfile } from "./hooks/user";
import { ResultScreen } from "./components/Result";
import { ProfileScreen } from "./components/Profile";

type Page = "lessons" | "profile" | "lesson" | "results";
function App() {
  const [currentPage, setCurrentPage] = React.useState<Page>("lessons");
  const [selectedLesson, setSelectedLesson] =
    React.useState<LessonWithProgress | null>(null);
  const [result, setResult] = useState<SubmitAnswerResponse | null>(null);
  const [selectedLessonID, setSelectedLessonID] = React.useState<number | null>(
    null
  );
  const getLayoutProps = () => {
    return {
      currentPage:
        currentPage == "profile" ? ("profile" as const) : ("lessons" as const),
      onNavigate: handleNavigate,
    };
  };
  const {
    lessons,
    loading: lessonsLoading,
    error: lessonsError,
    refetch: refetchLessons,
  } = useLessons();
  const {
    lesson,
    loading: lessonLoading,
    error: lessonError,
    refetch: refetchLesson,
  } = useLessonDetail(selectedLessonID);
  const {
    profile,
    loading: loadingProfile,
    error: profileError,
    refetch: refetchProfile,
  } = useUserProfile();

  const handleNavigate = (page: "lessons" | "profile") => {
    if (page === "lessons") {
      setCurrentPage("lessons");
    } else {
      setCurrentPage("profile");
    }
  };

  const handleSelectLesson = (lesson: LessonWithProgress) => {
    setSelectedLesson(lesson);
    setSelectedLessonID(lesson.id);
    setCurrentPage("lesson");
  };

  const handleLessonComplete = (result: SubmitAnswerResponse) => {
    setResult(result);
    setCurrentPage("results");
    refetchLessons();
    refetchProfile()
  };

  const handleBackToLessons = () => {
    setCurrentPage("lessons");
    setSelectedLessonID(null);
    setSelectedLesson(null);
  };

  const handleContinueFromResults = () => {
    setCurrentPage('lessons');
    setSelectedLessonID(null);
    setSelectedLesson(null);
    setResult(null);
  };


  const renderPageContent = () => {
    switch (currentPage) {
      case "lessons":
        return (
          <LessonListScreen
            lessons={lessons}
            isLoading={lessonsLoading}
            error={lessonsError}
            onRetry={refetchLessons}
            onLessonSelect={handleSelectLesson}
          />
        );
      case "lesson":
        if (!lesson) return null;
        return (
          <LessonDetailScreen
            lesson={lesson}
            isLoading={lessonLoading}
            error={lessonError}
            onBack={handleBackToLessons}
            onRetry={refetchLesson}
            onComplete={handleLessonComplete}
          />
        );
      case "profile":
        return <ProfileScreen 
          user={profile}
          isLoading={loadingProfile}
          error={profileError}
          onRetry={refetchProfile}
        />;
      case "results":
        if (!result || !selectedLesson) return null;
        return (
          <ResultScreen
            data={result}
            lessonTitle={selectedLesson.title}
            onContinue={handleContinueFromResults}
          />
        );
      default:
        return <div />;
    }
  };

  return (
    <>
      <Layout {...getLayoutProps()}>{renderPageContent()}</Layout>
    </>
  );
}

export default App;
