import { watch } from "vue"; // Import watch
import { useAuth } from "@clerk/nuxt/composables"; // Explicitly import useAuth
import { defineNuxtRouteMiddleware, navigateTo } from "nuxt/app"; // Explicitly import these as well

/**
 * Global Nuxt route middleware for authentication and authorization using Clerk.
 * This middleware checks the user's authentication status and role,
 * then redirects them accordingly to protected or public routes.
 */
export default defineNuxtRouteMiddleware(async (to, from) => {
  /**
   * Retrieves the current user's ID and session claims from Clerk.
   * @type { import('@clerk/nuxt').UseAuthReturn }
   */
  const { userId, sessionClaims, isLoaded } = useAuth(); // Destructure isLoaded

  // Wait for Clerk to be fully loaded before proceeding
  await new Promise((resolve) => {
    let unwatch: (() => void) | null = null;
    unwatch = watch(
      isLoaded,
      (newIsLoaded) => {
        console.log("Middleware: Clerk isLoaded changed to:", newIsLoaded);
        if (newIsLoaded) {
          if (unwatch) {
            unwatch();
          }
          resolve(true);
        }
      },
      { immediate: true }
    );
  });

  /**
   * An array of public routes that do not require authentication.
   * @type {string[]}
   */
  const publicRoutes = ["/", "/sign-in", "/sign-up", "/verify-email"];

  console.log("🚀 Navigating from:", from.path, "to:", to.path);
  console.log("🚀 Middleware executing for:", to.path);
  console.log("🚀 User ID:", userId.value);
  console.log("🚀 Session Claims:", sessionClaims.value);

  /**
   * The path to redirect to, if a redirection is necessary.
   * @type {string | null}
   */
  let targetPath: string | null = null;

  // 1. Handle unauthenticated users
  if (!userId.value) {
    // If the user is not authenticated and tries to access a protected route
    if (!publicRoutes.includes(to.path)) {
      console.log("🚀 No authenticated user. Route is protected. Redirecting to sign-in.");
      targetPath = "/sign-in";
    } else {
      // If the user is not authenticated and tries to access a public route
      console.log("🚀 No authenticated user. Route is public. Continuing.");
    }
  } else { // Authenticated user
    /**
     * The user's role, extracted from session claims.
     * @type {string}
     */
    const userRole = sessionClaims.value?.role as string;
    console.log("🚀 User Role:", userRole);

    // 2. If authenticated and on a public route, redirect based on role
    if (publicRoutes.includes(to.path)) {
      // If no specific role is found, redirect to home page
      if (!userRole) {
        console.log("🚫 No role found in session claims. Redirecting to home page.");
        targetPath = "/";
      } else if (userRole === "admin") {
        console.log("🔄 Redirecting admin role to /admin.");
        targetPath = "/admin";
      } else if (userRole === "host") {
        console.log("🔄 Redirecting host role to /host.");
        targetPath = "/host";
      } else if (userRole === "attendee") {
        console.log("🔄 Redirecting attendee role to /attendee.");
        targetPath = "/attendee";
      } else if (userRole === "both") {
        console.log("🔄 Redirecting 'both' role to /combined-dashboard.");
        targetPath = "/combined-dashboard";
      }
    } else { // 3. Authenticated and on a protected route
      // Check access for admin routes
      if (to.path.startsWith("/admin")) {
        if (userRole !== "admin" && userRole !== "both") {
          console.log("🚫 User does not have admin access. Redirecting to sign-in.");
          targetPath = "/sign-in";
        }
      } else if (to.path.startsWith("/host")) {
        // Check access for host routes
        if (userRole !== "host" && userRole !== "both") {
          console.log("🚫 User does not have host access. Redirecting to sign-in.");
          targetPath = "/sign-in";
        }
      } else if (to.path.startsWith("/dashboard")) {
        // Check access for attendee/dashboard routes
        if (userRole !== "attendee" && userRole !== "both") {
          console.log("🚫 User does not have attendee access. Redirecting to sign-in.");
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
    // If a targetPath was determined but it's the same as the current path, continue navigation
    console.log(`✅ Already on target path: ${targetPath}. Continuing.`);
    return;
  }

  // If no redirection was needed, allow the navigation to proceed to the intended route
  console.log("🚀 User authorized. Continuing to:", to.path);
});