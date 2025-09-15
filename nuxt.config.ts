// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: "2025-09-14",
  modules: ["@clerk/nuxt", "@nuxtjs/tailwindcss", "@nuxtjs/color-mode"],
  clerk: {
    publishableKey: process.env.NUXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    secretKey: process.env.NUXT_CLERK_SECRET_KEY,
    // IMPORTANT: This JWT template needs to be configured in the Clerk Dashboard
    // to include organization memberships and roles.
    // For example, it should include claims like:
    // "organizations": [
    //   { "id": "org_xxxxxx", "name": "Host Org A", "role": "admin", "type": "host" },
    //   { "id": "org_yyyyyy", "name": "Attendee Org B", "role": "member", "type": "attendee" }
    // ]
    jwtTemplateName: 'organization_roles',
  },
  runtimeConfig: {
    public: {
      clerkPublishableKey: process.env.NUXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    },
    clerkSecretKey: process.env.NUXT_CLERK_SECRET_KEY,
  },
  css: ["~/assets/css/main.css"],
  colorMode: {
    classSuffix: "",
  },
});
