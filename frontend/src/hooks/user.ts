import { useEffect, useState } from "react";
import type { UserProfile } from "../types";
import { apiService, handleApiError } from "../services/api";

export const useUserProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setloading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setloading(true);
      setError(null);
      const data = await apiService.getProfile();
      setProfile(data);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return { profile, loading, error, refetch: fetchProfile };
};
