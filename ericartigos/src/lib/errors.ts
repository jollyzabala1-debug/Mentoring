/**
 * Custom error classes for Ericartigos API
 */

export class ApiErrorBase extends Error {
  constructor(
    public message: string,
    public statusCode: number
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

/**
 * 400 Bad Request
 * Used for validation errors or malformed requests
 */
export class ValidationError extends ApiErrorBase {
  constructor(message: string = "Validation failed") {
    super(message, 400);
  }
}

/**
 * 401 Unauthorized
 * Used when user is not authenticated
 */
export class UnauthorizedError extends ApiErrorBase {
  constructor(message: string = "Authentication required") {
    super(message, 401);
  }
}

/**
 * 403 Forbidden
 * Used when user doesn't have permission to access resource
 */
export class ForbiddenError extends ApiErrorBase {
  constructor(message: string = "You do not have permission to access this resource") {
    super(message, 403);
  }
}

/**
 * 404 Not Found
 * Used when resource doesn't exist
 */
export class NotFoundError extends ApiErrorBase {
  constructor(message: string = "Resource not found") {
    super(message, 404);
  }
}

/**
 * 409 Conflict
 * Used when request conflicts with existing data (e.g., duplicate email)
 */
export class ConflictError extends ApiErrorBase {
  constructor(message: string = "Conflict with existing resource") {
    super(message, 409);
  }
}

/**
 * 500 Internal Server Error
 * Used for unexpected server errors
 */
export class InternalServerError extends ApiErrorBase {
  constructor(message: string = "Internal server error") {
    super(message, 500);
  }
}
