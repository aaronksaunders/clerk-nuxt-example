// server/api/organizations.ts
import { clerkClient } from '@clerk/nuxt/server';

export default defineEventHandler(async (event) => {
  const auth = event.context.auth();
  
  if (!auth.userId) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }
  
  // Get user's organization memberships
  const user = await clerkClient.users.getUser(auth.userId);
  return user.organizationMemberships;
});
