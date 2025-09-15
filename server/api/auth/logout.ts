import { clerkMiddleware } from '@clerk/nuxt/server';
import { sendRedirect } from 'h3';
import { createClerkClient } from '@clerk/backend'; // Import createClerkClient

export default clerkMiddleware(async (event) => {
  const auth = event.context.auth;

  if (auth.userId && auth.sessionId) {
    console.log("Server API: User is authenticated, revoking session.");
    try {
      // Initialize Clerk Backend SDK
      const clerkClient = createClerkClient({
        secretKey: process.env.NUXT_CLERK_SECRET_KEY, // Use the secret key from runtime config
      });
      await clerkClient.sessions.revokeSession(auth.sessionId);
      console.log("Server API: Session revoked successfully.");
    } catch (error) {
      console.error("Server API: Error revoking session:", error);
    }
  } else {
    console.log("Server API: No authenticated user or session to revoke.");
  }

  // Always redirect to the sign-in page after attempting to sign out
  return sendRedirect(event, '/sign-in');
});