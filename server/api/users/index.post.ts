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

    // Get request body
    const body = await readBody(event);
    const { firstName, lastName, email, role } = body;

    if (!firstName || !lastName || !email || !role) {
      throw createError({
        statusCode: 400,
        statusMessage: "Missing required fields",
      });
    }

    // Create new user
    const newUser = await clerkClient.users.createUser({
      firstName,
      lastName,
      emailAddress: [email],
      publicMetadata: {
        role: role,
      },
    });

    return {
      success: true,
      user: newUser,
    };
  } catch (error) {
    console.error("Error creating user:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to create user",
    });
  }
});
