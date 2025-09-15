import { defineNuxtRouteMiddleware, navigateTo } from "#app";
import { useAuth } from "@clerk/nuxt/composables";

export default defineNuxtRouteMiddleware((to, from) => {
  const { isSignedIn } = useAuth();

  if (isSignedIn.value) {
    console.log("Middleware: User is already signed in. Redirecting from sign-in page.");
    return navigateTo("/");
  }
});