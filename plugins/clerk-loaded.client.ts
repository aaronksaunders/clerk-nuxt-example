import { defineNuxtPlugin } from '#app';

import { watch } from 'vue';

export default defineNuxtPlugin(async (nuxtApp) => {
  const auth = useAuth();

  await new Promise<void>((resolve) => {
    if (auth.isLoaded.value) {
      resolve();
      return;
    }
    const unwatch = watch(auth.isLoaded, (newVal) => {
      if (newVal) {
        unwatch();
        resolve();
      }
    });
  });
});