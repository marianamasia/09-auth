import { isAxiosError } from "axios";

interface ApiErrorBody {
  message?: string | string[];
  error?: string;
  response?: { message?: string | string[] };
}
export function getApiError(error: unknown, fallback: string): string {
  if (!isAxiosError<ApiErrorBody>(error)) return fallback;
  const message =
    error.response?.data?.response?.message ?? error.response?.data?.message;
  if (Array.isArray(message)) return message.join(" ");
  if (typeof message === "string") return message;
  if (error.response?.status === 401)
    return "Please check your email and password, or sign in again.";
  return fallback;
}
