<template>
  <header class="border-b">
    <div class="container mx-auto px-4 py-4 flex justify-between items-center">
      <div class="flex items-center space-x-4">
        <NuxtLink to="/" class="text-xl font-bold"> Clerk Nuxt App </NuxtLink>
      </div>

      <div class="flex items-center space-x-4">
        <SignedOut>
          <NuxtLink to="/sign-in">
            <Button variant="outline">Sign In</Button>
          </NuxtLink>
        </SignedOut>

        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </div>
  </header>
</template>

<script setup>
import Button from '~/components/ui/Button.vue';
// Clerk components are auto-imported by the @clerk/nuxt module
</script>
