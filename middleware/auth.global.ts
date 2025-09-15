/**
 * Global Nuxt route middleware for authentication and authorization using Clerk.
 * This middleware checks the user's authentication status and organization roles,
 * then redirects them accordingly to protected or public routes.
 */
export default defineNuxtRouteMiddleware(async (to, from) => {
  /**
   * Retrieves the current user's ID from Clerk.
   * @type { import('@clerk/nuxt').UseAuthReturn }
   */
  const { userId } = await useAuth();

  /**
   * Custom composable to get user organization memberships and roles.
   */
  const { isHostAdmin, isAttendeeAdmin, isHost, isAttendee, isBothHostAndAttendee, loading } = useUserOrganizationsAndRoles();

  // Wait for organization roles to be loaded
  await new Promise(resolve => {
    const unwatch = watch(loading, (newVal) => {
      if (!newVal) {
        unwatch();
        resolve(true);
      }
    }, { immediate: true });
  });

  /**
   * An array of public routes that do not require authentication.
   * @type {string[]}
   */
  const publicRoutes = ["/", "/sign-in", "/sign-up", "/verify-email"];

  console.log("🚀 Navigating from:", from.path, "to:", to.path);
  console.log("🚀 Middleware executing for:", to.path);
  console.log("🚀 User ID:", userId.value);

  let targetPath: string | null = null;

  // 1. Handle unauthenticated users
  if (!userId.value) {
    if (!publicRoutes.includes(to.path)) {
      console.log("🚀 No authenticated user. Route is protected. Redirecting to sign-in.");
      targetPath = "/sign-in";
    } else {
      console.log("🚀 No authenticated user. Route is public. Continuing.");
    }
  } else { // Authenticated user
    console.log("🚀 User is authenticated.");
    console.log("🚀 isHostAdmin:", isHostAdmin.value);
    console.log("🚀 isAttendeeAdmin:", isAttendeeAdmin.value);
    console.log("🚀 isHost:", isHost.value);
    console.log("🚀 isAttendee:", isAttendee.value);
    console.log("🚀 isBothHostAndAttendee:", isBothHostAndAttendee.value);

    // 2. If authenticated and on a public route, redirect based on organization roles
    if (publicRoutes.includes(to.path)) {
      if (isBothHostAndAttendee.value) {
        console.log("🔄 Redirecting user (Host & Attendee) to /combined-dashboard.");
        targetPath = "/combined-dashboard";
      } else if (isHost.value) {
        console.log("🔄 Redirecting host user to /host.");
        targetPath = "/host";
      } else if (isAttendee.value) {
        console.log("🔄 Redirecting attendee user to /attendee.");
        targetPath = "/attendee";
      } else if (isHostAdmin.value || isAttendeeAdmin.value) {
        // If they are an admin of any type but not specifically host/attendee, redirect to admin dashboard
        console.log("🔄 Redirecting admin user to /admin.");
        targetPath = "/admin";
      } else {
        console.log("🚫 No specific organization role found. Redirecting to home page.");
        targetPath = "/";
      }
    } else { // 3. Authenticated and on a protected route
      // Check access for admin routes
      if (to.path.startsWith("/admin")) {
        if (!isHostAdmin.value && !isAttendeeAdmin.value) {
          console.log("🚫 User does not have admin access. Redirecting to sign-in.");
          targetPath = "/sign-in";
        }
      } else if (to.path.startsWith("/host")) {
        // Check access for host routes
        if (!isHost.value) {
          console.log("🚫 User does not have host access. Redirecting to sign-in.");
          targetPath = "/sign-in";
        }
      } else if (to.path.startsWith("/attendee") || to.path.startsWith("/dashboard")) {
        // Check access for attendee/dashboard routes
        if (!isAttendee.value) {
          console.log("🚫 User does not have attendee access. Redirecting to sign-in.");
          targetPath = "/sign-in";
        }
      } else if (to.path.startsWith("/combined-dashboard")) {
        // Check access for combined dashboard
        if (!isBothHostAndAttendee.value) {
          console.log("🚫 User does not have combined host/attendee access. Redirecting to sign-in.");
          targetPath = "/sign-in";
        }
      }
    }
  }

  // Perform redirection if a targetPath was determined and is different from the current path
  if (targetPath && targetPath !== to.path) {
    console.log(`➡️ Redirecting to: ${targetPath}`);
    return navigateTo(targetPath);
  } else if (targetPath && targetPath === to.path) {
    console.log(`✅ Already on target path: ${targetPath}. Continuing.`);
    return;
  }

  console.log("🚀 User authorized. Continuing to:", to.path);
});
