/**
 * GET /api/auth/session
 *
 * Returns the current user session
 * Used by frontend to check authentication state and get user info
 *
 * @returns {user: {id, name, email, role}} or 401 if not authenticated
 */

import { auth } from "@/lib/auth";
import { apiResponse, apiError } from "@/lib/api-utils";
import { UnauthorizedError } from "@/lib/errors";

export async function GET() {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return apiError(
        new UnauthorizedError("No active session"),
        401
      );
    }

    return apiResponse({
      user: session.user,
    });
  } catch (error) {
    console.error("[Session API Error]", error);
    return apiError(
      new UnauthorizedError("Failed to retrieve session"),
      401
    );
  }
}
