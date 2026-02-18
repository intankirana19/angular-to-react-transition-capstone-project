import axios from 'axios';

const DEFAULT_ERROR_MESSAGE = 'Something went wrong. Please try again.';

interface ApiErrorPayload {
  message?: string;
  error?: string;
}

function isApiErrorPayload(value: unknown): value is ApiErrorPayload {
  return typeof value === 'object' && value !== null;
}

export function getErrorMessage(error: unknown, fallback = DEFAULT_ERROR_MESSAGE): string {
  if (axios.isAxiosError<ApiErrorPayload | string>(error)) { // pakai axios type-guard generic biar `response.data` tetap aman (bukan `any`).
    const responseData = error.response?.data;
    if (typeof responseData === 'string' && responseData.trim()) {
      return responseData;
    }
    if (isApiErrorPayload(responseData)) {
      if (typeof responseData.message === 'string' && responseData.message.trim()) {
        return responseData.message;
      }
      if (typeof responseData.error === 'string' && responseData.error.trim()) {
        return responseData.error;
      }
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallback;
}
