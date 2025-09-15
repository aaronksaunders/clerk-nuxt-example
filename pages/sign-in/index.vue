<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="w-full max-w-md space-y-8">
      <div class="text-center">
        <h2 class="text-3xl font-bold">Sign in to your account</h2>
        <p class="mt-2 text-sm text-gray-600">
          Choose your preferred sign-in method
        </p>
      </div>

      <div class="space-y-4">
        <div class="flex justify-center mb-6 border rounded-lg overflow-hidden">
          <Button @click="signInMethod = 'magicLink'" class="flex-1 rounded-none border-r last:border-r-0"
            :variant="signInMethod === 'magicLink' ? 'default' : 'ghost'"
            :class="{'text-white': signInMethod === 'magicLink', 'bg-gray-50 text-gray-700': signInMethod !== 'magicLink'}">
            <template #default>Magic Link</template>
          </Button>
          <Button @click="signInMethod = 'emailPassword'" class="flex-1 rounded-none"
            :variant="signInMethod === 'emailPassword' ? 'default' : 'ghost'"
            :class="{'text-white': signInMethod === 'emailPassword', 'bg-gray-50 text-gray-700': signInMethod !== 'emailPassword'}">
            <template #default>Email & Password</template>
          </Button>
        </div>

        <div v-if="signInMethod === 'magicLink'" class="border rounded-lg p-6">
          <h3 class="text-lg font-semibold mb-4">Email Magic Link</h3>
          <EmailSignIn />
        </div>

        <div v-else-if="signInMethod === 'emailPassword'" class="border rounded-lg p-6">
          <h3 class="text-lg font-semibold mb-4">Sign in with Email and Password</h3>
          <EmailPasswordSignIn />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Button from '~/components/ui/Button.vue';
import EmailPasswordSignIn from '~/components/EmailPasswordSignIn.vue';

/**
 * Reactive state to control the currently active sign-in method.
 * Can be 'magicLink' or 'emailPassword'.
 * @type {import('vue').Ref<"magicLink" | "emailPassword">}
 */
const signInMethod = ref('magicLink');
</script>
