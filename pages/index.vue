<template>
  <div class="min-h-screen flex flex-col">
    <Header />
    <main class="flex-1 flex flex-col items-center justify-center text-center">
      <h1 class="text-4xl font-bold">Welcome to the Nuxt App</h1>
      <p class="mt-4 text-lg">Your solution for... well, everything.</p>

      <div
        v-if="isLoaded && user"
        class="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg"
      >
        <h2 class="text-lg font-semibold text-yellow-800 mb-2">
          Authentication Successful!
        </h2>
        <p class="text-yellow-700 mb-4">
          You are signed in as
          <strong>{{ user.emailAddresses[0]?.emailAddress }}</strong>
        </p>

        <div v-if="roleLoading" class="text-sm text-yellow-600">
          Loading role information...
        </div>
        <div v-else-if="role" class="text-sm text-green-600">
          <p>
            Your role: <strong>{{ role }}</strong>
          </p>
          <p class="mt-2">
            You should be redirected to your dashboard automatically.
          </p>
        </div>
        <div v-else class="text-sm text-yellow-600">
          However, no role has been assigned to your account. Please contact an
          administrator to assign a role.
        </div>

        <div class="mt-4">
          <NuxtLink to="/admin">
            <Button variant="outline">Try Admin Access</Button>
          </NuxtLink>
        </div>
      </div>
      <div v-else class="mt-8">
        <NuxtLink to="/sign-in">
          <Button>Sign In</Button>
        </NuxtLink>
      </div>
    </main>
  </div>
</template>

<script setup>
import Button from '~/components/ui/Button.vue';

import { useUserRole } from "~/composables/useAuth";

const { user, isLoaded } = useAuth();
const { role, loading: roleLoading } = useUserRole("next-roles");
</script>
