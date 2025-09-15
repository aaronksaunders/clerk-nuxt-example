<template>
  <div>
    <div v-if="!isLoaded" class="flex items-center justify-center min-h-screen">
      <p>Loading authentication...</p>
      <!-- You can replace this with a more sophisticated spinner or loading component -->
    </div>
    <div v-else>
      <NuxtPage />
    </div>
  </div>
</template>

<script setup>
import { useAuth } from '@clerk/nuxt/composables';

const { isLoaded } = useAuth();
</script>