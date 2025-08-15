import { useState, useEffect } from "react";
import type { LessonDetail, LessonWithProgress } from "../types";
import { apiService, handleApiError } from "../services/api";

export const useLessons = () => {
  const [lessons, setLessons] = useState<LessonWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLessons = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getLessons();
      setLessons(data);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  return { lessons, loading, error, refetch: fetchLessons };
};

export const useLessonDetail = (lessonID: number | null) => {
  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLessonDetail = async (id: number) => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getLessonDetail(id);
      setLesson(data);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (lessonID) {
      fetchLessonDetail(lessonID);
    }
  }, [lessonID]);

  return {
    lesson,
    loading,
    error,
    refetch: lessonID ? () => fetchLessonDetail(lessonID) : undefined,
  };
};
