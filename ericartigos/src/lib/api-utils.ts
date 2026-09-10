/**
 * API Utilities for Ericartigos
 * Provides response formatting, error handling, and authentication guards
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";
import type { ApiResponse, ApiError, Role } from "@/types";
import {
  ApiErrorBase,
  UnauthorizedError,
  ForbiddenError,
  InternalServerError,
} from "./errors";

// ─── Response Formatters ────────────────────────────────

/**
 * Format a successful API response
 *
 * @param data The response data
 * @param statusCode HTTP status code (default: 200)
 * @returns NextResponse with formatted data
 */
export function apiResponse<T>(
  data: T,
  statusCode: number = 200
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
    } as ApiResponse<T>,
    { status: statusCode }
  );
}

/**
 * Format an error API response
 *
 * @param error Error message or Error object
 * @param statusCode HTTP status code (default: 400)
 * @returns NextResponse with error message
 */
export function apiError(
  error: string | Error,
  statusCode: number = 400
): NextResponse<ApiError> {
  const message =
    error instanceof Error ? error.message : String(error);

  return NextResponse.json(
    {
      success: false,
      error: message,
    } as ApiError,
    { status: statusCode }
  );
}

// ─── Authentication & Authorization ─────────────────────

/**
 * Check if user has required roles
 *
 * @param userRole The user's role
 * @param requiredRoles Array of allowed roles
 * @returns true if user has one of the required roles
 */
export function hasRole(
  userRole: Role | undefined,
  requiredRoles: Role[]
): boolean {
  if (!userRole) return false;
  return requiredRoles.includes(userRole);
}

/**
 * Wrapper for protecting API routes with authentication and authorization
 *
 * @param handler The route handler function
 * @param requiredRoles Optional array of required roles
 * @returns Wrapped handler that checks authentication/authorization
 *
 * @example
 * // Protect route - auth required, any role
 * export const GET = withAuth(async (session) => {
 *   return apiResponse({ message: "OK" });
 * });
 *
 * @example
 * // Protect route - auth required, specific roles
 * export const POST = withAuth(
 *   async (session) => {
 *     return apiResponse({ message: "Created" }, 201);
 *   },
 *   ["OWNER", "ADMIN"]
 * );
 */
export function withAuth(
  handler: (session: any) => Promise<NextResponse>,
  requiredRoles?: Role[]
) {
  return async (req: NextRequest) => {
    try {
      // Get session
      const session = await auth();

      // Check if user is authenticated
      if (!session || !session.user) {
        return apiError(
          new UnauthorizedError("Authentication required"),
          401
        );
      }

      // Check if user has required role
      if (
        requiredRoles &&
        !hasRole((session.user as any).role, requiredRoles)
      ) {
        return apiError(
          new ForbiddenError(
            `This action requires one of these roles: ${requiredRoles.join(", ")}`
          ),
          403
        );
      }

      // Call the handler with the session
      return await handler(session);
    } catch (error) {
      console.error("[API Error]", error);

      if (error instanceof ApiErrorBase) {
        return apiError(error, error.statusCode);
      }

      return apiError(
        new InternalServerError("An unexpected error occurred"),
        500
      );
    }
  };
}

// ─── Request Validation ─────────────────────────────────

/**
 * Parse and validate request JSON body with a Zod schema
 *
 * @param req The NextRequest
 * @param schema The Zod schema for validation
 * @returns Parsed and validated data
 * @throws ValidationError if validation fails
 *
 * @example
 * const data = await parseBody(req, createUserSchema);
 */
export async function parseBody<T>(
  req: NextRequest,
  schema: any
): Promise<T> {
  try {
    const body = await req.json();
    return schema.parse(body) as T;
  } catch (error: any) {
    if (error.name === "ZodError") {
      const formattedErrors = error.errors
        .map((e: any) => `${e.path.join(".")}: ${e.message}`)
        .join("; ");
      throw new Error(`Validation error: ${formattedErrors}`);
    }
    throw error;
  }
}

// ─── Pagination Helper ──────────────────────────────────

/**
 * Extract and validate pagination parameters from URL search params
 *
 * @param searchParams URL search parameters
 * @returns Pagination object with page and limit
 *
 * @example
 * const { page, limit, skip } = getPagination(req.nextUrl.searchParams);
 */
export function getPagination(searchParams: URLSearchParams) {
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(
    100,
    Math.max(1, parseInt(searchParams.get("limit") || "10", 10))
  );
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

// ─── Async Error Wrapper ────────────────────────────────

/**
 * Wrap an async handler to automatically catch and format errors
 *
 * @param handler The async handler
 * @returns Wrapped handler with error handling
 *
 * @example
 * export const GET = asyncHandler(async (req) => {
 *   const data = await prisma.user.findMany();
 *   return apiResponse(data);
 * });
 */
export function asyncHandler(
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    try {
      return await handler(req);
    } catch (error) {
      console.error("[API Error]", error);

      if (error instanceof ApiErrorBase) {
        return apiError(error, error.statusCode);
      }

      return apiError(
        new InternalServerError("An unexpected error occurred"),
        500
      );
    }
  };
}
