import type { LoginFormData, ForgotPasswordFormData, ValidationErrors } from '../types';

export function validateEmail(email: string): string | null {
  if (!email) {
    return 'Email is required';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }

  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) {
    return 'Password is required';
  }

  if (password.length < 8) {
    return 'Password must be at least 8 characters';
  }

  return null;
}

export function validateLoginForm(data: LoginFormData): ValidationErrors {
  const errors: ValidationErrors = {};

  const emailError = validateEmail(data.email);
  if (emailError) {
    errors.email = emailError;
  }

  const passwordError = validatePassword(data.password);
  if (passwordError) {
    errors.password = passwordError;
  }

  return errors;
}

export function validateForgotPasswordForm(data: ForgotPasswordFormData): ValidationErrors {
  const errors: ValidationErrors = {};

  const emailError = validateEmail(data.email);
  if (emailError) {
    errors.email = emailError;
  }

  return errors;
}
