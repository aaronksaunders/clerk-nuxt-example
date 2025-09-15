import { defineEventHandler, createError } from 'h3';
import { createClerkClient } from '@clerk/backend';

// Initialize Clerk with your Secret Key
const clerkClient = createClerkClient({
  secretKey: process.env.NUXT_CLERK_SECRET_KEY,
});

export default defineEventHandler(async (event) => {
  console.log("API: /api/users - Request received."); // New log
  const { userId } = event.context.auth();

  console.log("API: /api/users - User ID from context:", userId); // New log

  if (!userId) {
    console.log("API: /api/users - Unauthorized: No user ID in context."); // New log
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  try {
    console.log("API: /api/users - Attempting to fetch user list from Clerk."); // New log
    const usersResponse = await clerkClient.users.getUserList({
      limit: 100,
    });
    console.log("API: /api/users - User list fetched from Clerk. Total:", usersResponse.totalCount); // New log

    return {
      data: usersResponse.data,
      totalCount: usersResponse.totalCount,
    };
  } catch (error) {
    console.error("API: /api/users - Error fetching users from Clerk:", error); // Enhanced log
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch users",
    });
  }
});