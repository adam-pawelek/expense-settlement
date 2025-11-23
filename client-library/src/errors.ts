/**
 * Custom error classes for the client library
 */

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public detail?: string
  ) {
    super(message);
    this.name = "ApiError";
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export class AuthenticationError extends ApiError {
  constructor(message: string = "Authentication failed", detail?: string) {
    super(message, 401, detail);
    this.name = "AuthenticationError";
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string = "Resource not found", detail?: string) {
    super(message, 404, detail);
    this.name = "NotFoundError";
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class ValidationError extends ApiError {
  constructor(message: string = "Validation error", detail?: string) {
    super(message, 400, detail);
    this.name = "ValidationError";
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export class ForbiddenError extends ApiError {
  constructor(message: string = "Access forbidden", detail?: string) {
    super(message, 403, detail);
    this.name = "ForbiddenError";
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}

