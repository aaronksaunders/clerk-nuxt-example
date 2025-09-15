<template>
  <div class="flex justify-center items-center min-h-screen">
    <div class="text-center">
      <h1 class="text-2xl font-bold mb-4">Verifying your email...</h1>
      <p v-if="status === 'verifying'">Please wait, we are verifying your email address.</p>
      <p v-else-if="status === 'success'" class="text-green-600">Email verified successfully! Redirecting...</p>
      <p v-else-if="status === 'error'" class="text-red-600">Error verifying email: {{ errorMessage }}</p>
      <p v-else-if="status === 'idle'">If you were expecting a verification, please check your email.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const { signIn, isLoaded } = useSignIn();

/**
 * Reactive state to track the email verification process.
 * Can be 'idle', 'verifying', 'success', or 'error'.
 * @type {import('vue').Ref<"idle" | "verifying" | "success" | "error">}
 */
const status = ref('idle');

/**
 * Reactive state to store any error messages during verification.
 * @type {import('vue').Ref<string>}
 */
const errorMessage = ref('');

/**
 * Lifecycle hook that runs after the component is mounted.
 * Handles the email link verification process based on query parameters.
 */
onMounted(async () => {
  const { __clerk_ticket, __clerk_status } = route.query;
  console.log("VerifyEmail Page: onMounted. Query params:", route.query);

  // Check if a Clerk email link verification is in progress
  if (__clerk_ticket && __clerk_status === 'email_link_verification') {
    status.value = 'verifying';
    console.log("VerifyEmail Page: __clerk_ticket and email_link_verification found.");

    // Ensure Clerk is loaded before attempting verification
    if (!isLoaded.value) {
      console.log("VerifyEmail Page: Clerk not loaded yet. Returning.");
      return;
    }
    console.log("VerifyEmail Page: Clerk loaded.");

    // Ensure the signIn object is available
    if (!signIn.value) {
      errorMessage.value = 'Sign-in object not available.';
      status.value = 'error';
      console.error("VerifyEmail Page: Sign-in object not available.");
      return;
    }

    try {
      console.log("VerifyEmail Page: Attempting email link verification...");
      // Attempt to verify the email link using the provided ticket
      const result = await signIn.value.attemptEmailLinkVerification({
        ticket: __clerk_ticket,
      });

      console.log("VerifyEmail Page: Verification result:", result);

      // If verification is complete, set status to success and redirect
      if (result.status === 'complete') {
        status.value = 'success';
        console.log("VerifyEmail Page: Verification complete. Redirecting to /.");
        router.push('/'); // Let middleware handle role-based redirection
      } else {
        // Handle other statuses if necessary
        errorMessage.value = `Verification failed with status: ${result.status}`;
        status.value = 'error';
        console.error("VerifyEmail Page: Verification failed with status:", result.status);
      }
    } catch (err) {
      // Catch and display any errors during verification
      errorMessage.value = err.errors?.[0]?.longMessage || err.message || 'An unknown error occurred.';
      status.value = 'error';
      console.error('VerifyEmail Page: Email verification error:', err);
    }
  } else if (__clerk_status === 'client_mismatch') {
    // Handle client mismatch error (e.g., link opened on a different device)
    errorMessage.value = 'Verification link is invalid for this device. Please open the link on the device and browser from which you initiated the sign-in.';
    status.value = 'error';
    console.log("VerifyEmail Page: Client mismatch error detected.");
  } else if (__clerk_status === 'verified') {
    // Handle case where email is already verified, redirect to home
    status.value = 'success';
    console.log("VerifyEmail Page: Email already verified. Redirecting to /.");
    router.push('/');
  } else if (__clerk_status) {
    // Handle any other unhandled Clerk statuses
    errorMessage.value = `Unhandled Clerk status: ${__clerk_status}`;
    status.value = 'error';
    console.error("VerifyEmail Page: Unhandled Clerk status:", __clerk_status);
  }
});
</script>