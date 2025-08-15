import axios from "axios";
import type {
  LessonWithProgress,
  LessonDetail,
  UserProfile,
  SubmitAnswerRequest,
  SubmitAnswerResponse,
} from "../types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

export const apiService = {
  async getLessons(): Promise<LessonWithProgress[]> {
    const response = await api.get("/lessons");
    return response.data;
  },
  async getLessonDetail(id: number): Promise<LessonDetail | null> {
    const response = await api.get(`/lessons/${id}`);
    return response.data;
  },
  async getProfile(): Promise<UserProfile | null> {
    const response = await api.get("/profile");
    return response.data;
  },
  async submitAnswer(
    lessonID: number,
    answers: SubmitAnswerRequest
  ): Promise<SubmitAnswerResponse> {
    const response = await api.post(`/lessons/${lessonID}/submit`, answers);
    return response.data;
  },
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    const response = await api.get("/");
    return response.data;
  },
};

interface AxiosErrorResponse {
  response?: {
    data?: {
      message?: string;
      error?: string;
    };
  };
}

export const handleApiError = (error: unknown): string => {
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as AxiosErrorResponse;
    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message;
    }
    if (axiosError.response?.data?.error) {
      return axiosError.response.data.error;
    }
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return "An unexpected error occurred";
};
