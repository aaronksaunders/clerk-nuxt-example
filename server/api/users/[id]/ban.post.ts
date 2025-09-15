import { clerkClient } from "@clerk/nuxt/server";

export default defineEventHandler(async (event) => {
  try {
    // Get the authorization header
    const authHeader = getHeader(event, "authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized",
      });
    }

    // Verify the token and get user info
    const token = authHeader.substring(7);
    const { userId } = await clerkClient.verifyToken(token);

    if (!userId) {
      throw createError({
        statusCode: 401,
        statusMessage: "Invalid token",
      });
    }

    // Get user ID from route params
    const userIdToBan = getRouterParam(event, "id");
    if (!userIdToBan) {
      throw createError({
        statusCode: 400,
        statusMessage: "User ID is required",
      });
    }

    // Get the user to check if they're banned
    const user = await clerkClient.users.getUser(userIdToBan);

    if (user.bannedAt) {
      // User is banned, unban them
      await clerkClient.users.unbanUser(userIdToBan);
      return { success: true, action: "unbanned" };
    } else {
      // User is not banned, ban them
      await clerkClient.users.banUser(userIdToBan);
      return { success: true, action: "banned" };
    }
  } catch (error) {
    console.error("Error toggling ban:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to toggle ban",
    });
  }
});
