<template>
  <div class="space-y-4">
    <div>
      <label for="email" class="block text-sm font-medium text-gray-700">
        Email Address
      </label>
      <input
        id="email"
        v-model="email"
        type="email"
        required
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
        placeholder="Enter your email"
      />
    </div>

    <Button @click="handleEmailLink" :disabled="isLoading" class="w-full">
      <template #default>{{ isLoading ? "Sending..." : "Send Magic Link" }}</template>
    </Button>

    <div
      v-if="message"
      class="text-sm"
      :class="message.includes('Error') ? 'text-red-600' : 'text-green-600'"
    >
      {{ message }}
    </div>
  </div>
</template>

<script setup>
import Button from '~/components/ui/Button.vue';

/**
 * Component for handling email-based magic link sign-in using Clerk.
 * Allows users to enter their email and receive a magic link for authentication.
 */

const { signIn, isLoaded } = useSignIn();

/**
 * Reactive state for the user's email address.
 * @type {import('vue').Ref<string>}
 */
const email = ref("");

/**
 * Reactive state to indicate if an asynchronous operation is in progress.
 * @type {import('vue').Ref<boolean>}
 */
const isLoading = ref(false);

/**
 * Reactive state to display messages to the user (e.g., success, error).
 * @type {import('vue').Ref<string>}
 */
const message = ref("");

/**
 * Handles the submission of the email for magic link authentication.
 * Initiates a sign-in attempt with Clerk using the 'email_link' strategy.
 */
const handleEmailLink = async () => {
  if (!isLoaded.value || !signIn.value) return;

  isLoading.value = true;
  message.value = "";

  try {
    // Create a sign-in attempt with the email
    const signInAttempt = await signIn.value.create({
      identifier: email.value,
      strategy: "email_link", // Ensure strategy is set
      redirectUrl: `${window.location.origin}/verify-email`,
    });

    console.log("Sign-in attempt created:", signInAttempt);
    console.log(
      "Supported first factors:",
      signInAttempt.supportedFirstFactors
    );

    // Find the email link factor
    const emailLinkFactor = signInAttempt.supportedFirstFactors.find(
      (factor) => factor.strategy === "email_link"
    );

    console.log("Email link factor found:", emailLinkFactor);

    if (!emailLinkFactor || !emailLinkFactor.emailAddressId) {
      throw new Error("Email link authentication not available or missing emailAddressId.");
    }

    // Prepare the email link verification
    const prepareResult = await signIn.value.prepareFirstFactor({
      strategy: "email_link",
      emailAddressId: emailLinkFactor.emailAddressId,
      redirectUrl: `${window.location.origin}/verify-email`,
    });

    console.log("Prepare first factor result:", prepareResult);

    message.value = "Check your email for a magic link to sign in!";
  } catch (error) {
    console.error("Error sending magic link:", error);
    message.value = "Error sending magic link. Please try again.";
  } finally {
    isLoading.value = false;
  }
};
</script>
