/**
 * POST /api/auth/logout
 *
 * Signs out the current user by destroying the session
 * This is a convenience endpoint; signOut() can also be called client-side
 *
 * @returns {message: "Logged out successfully"}
 */

import { signOut } from "@/lib/auth";
import { apiResponse } from "@/lib/api-utils";

export async function POST() {
  try {
    await signOut({ redirect: false });

    return apiResponse({
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("[Logout API Error]", error);
    return apiResponse({
      message: "Logged out successfully",
    });
  }
}
