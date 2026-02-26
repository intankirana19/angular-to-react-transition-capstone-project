export interface AppErrorOptions {
  status: number;
  title: string;
  message: string;
}

// Error shape internal biar mock service rasanya sama kayak API real (punya status + pesan UI).
export class AppError extends Error {
  readonly status: number;
  readonly title: string;

  constructor(options: AppErrorOptions) {
    super(options.message);
    this.name = 'AppError';
    this.status = options.status;
    this.title = options.title;
  }
}

// Helper type-guard supaya extractor error (title/message) bisa baca metadata AppError dengan aman.
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}
