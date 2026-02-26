import axios from 'axios';
import { isAppError } from './appError';

const DEFAULT_ERROR_MESSAGE = 'Something went wrong. Please try again.';
const DEFAULT_ERROR_TITLE = 'Something went wrong';

interface ApiErrorPayload {
  message?: string;
  error?: string;
}

function isApiErrorPayload(value: unknown): value is ApiErrorPayload {
  return typeof value === 'object' && value !== null;
}

export function getErrorMessage(error: unknown, fallback = DEFAULT_ERROR_MESSAGE): string {
  // Prioritas AppError dulu supaya message dari service (simulasi API) langsung kepakai di UI
  if (isAppError(error) && error.message.trim()) {
    return error.message;
  }

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

export function getErrorTitle(error: unknown, fallback = DEFAULT_ERROR_TITLE): string {
  // Kalau service lempar AppError, title custom dari sana dipakai langsung.
  if (isAppError(error) && error.title.trim()) {
    return error.title;
  }

  // Fallback mapping status umum buat error dari Axios/API.
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;

    if (status === 401) {
      return 'Unauthorized';
    }

    if (status === 403) {
      return 'Forbidden';
    }

    if (status === 404) {
      return 'Not found';
    }

    if (typeof status === 'number' && status >= 500) {
      return 'Server error';
    }
  }

  if (error instanceof Error && 'status' in error) {
    const status = (error as { status?: number }).status;

    if (status === 401) {
      return 'Unauthorized';
    }
    if (status === 403) {
      return 'Forbidden';
    }
    if (status === 404) {
      return 'Not found';
    }
    if (typeof status === 'number' && status >= 500) {
      return 'Server error';
    }
  }

  return fallback;
}
