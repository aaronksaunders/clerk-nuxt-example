<template>
  <div class="space-y-4">
    <div v-if="step === 'signIn'">
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
      <div class="mt-4">
        <label for="password" class="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          id="password"
          v-model="password"
          type="password"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          placeholder="Enter your password"
        />
      </div>
      <Button @click="handleSignIn" :disabled="isLoading" class="w-full mt-6">
        <template #default>{{ isLoading ? "Signing In..." : "Sign In" }}</template>
      </Button>
    </div>

    <div v-else-if="step === 'verifyCode'">
      <div>
        <label for="code" class="block text-sm font-medium text-gray-700">
          Verification Code
        </label>
        <input
          id="code"
          v-model="code"
          type="text"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          placeholder="Enter verification code"
        />
      </div>
      <Button @click="handleVerifyCode" :disabled="isLoading" class="w-full mt-6">
        {{ isLoading ? "Verifying..." : "Verify Code" }}
      </Button>
    </div>

    <div
      v-if="message"
      class="text-sm mt-4"
      :class="message.includes('Error') ? 'text-red-600' : 'text-green-600'"
    >
      {{ message }}
    </div>
  </div>
</template>

<script setup>
import Button from '~/components/ui/Button.vue';

/**
 * Component for handling email/password sign-in with optional verification code using Clerk.
 * Manages a multi-step authentication flow: email/password submission and verification code entry.
 */

const { signIn, isLoaded } = useSignIn();
const { setActive } = useAuth();

/**
 * Reactive state for the user's email address.
 * @type {import('vue').Ref<string>}
 */
const email = ref("");

/**
 * Reactive state for the user's password.
 * @type {import('vue').Ref<string>}
 */
const password = ref("");

/**
 * Reactive state for the verification code (OTP).
 * @type {import('vue').Ref<string>}
 */
const code = ref("");

/**
 * Reactive state to control the current step of the sign-in process.
 * Can be 'signIn' (for email/password entry) or 'verifyCode' (for OTP entry).
 * @type {import('vue').Ref<"signIn" | "verifyCode">}
 */
const step = ref("signIn");

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
 * Handles the initial sign-in attempt with email and password.
 * If a second factor (e.g., email code) is required, transitions to the 'verifyCode' step.
 * On successful completion, sets the active session and redirects to the home page.
 */
const handleSignIn = async () => {
  if (!isLoaded.value) return;

  isLoading.value = true;
  message.value = "";

  try {
    const result = await signIn.value.create({
      identifier: email.value,
      password: password.value,
    });

    console.log("Sign-in result:", result);

    // If a second factor is needed (e.g., email verification code)
    if (result.status === "needs_second_factor") {
      const emailCodeFactor = result.supportedFirstFactors.find(
        (factor) => factor.strategy === "email_code"
      );

      if (emailCodeFactor) {
        // Prepare for email code verification
        await signIn.value.prepareFirstFactor({
          strategy: "email_code",
          emailAddressId: emailCodeFactor.emailAddressId,
        });
        step.value = "verifyCode";
        message.value = "A verification code has been sent to your email.";
      } else {
        throw new Error("Email code verification not available.");
      }
    } else if (result.status === "complete") {
      // If sign-in is complete, set the active session and redirect
      await setActive({
        session: result.createdSessionId,
      });
      navigateTo("/");
    }
  } catch (error) {
    console.error("Error during sign-in:", error);
    message.value = error.errors?.[0]?.longMessage || "An unknown error occurred.";
  } finally {
    isLoading.value = false;
  }
};

/**
 * Handles the submission of the verification code (OTP).
 * Attempts to complete the sign-in process using the provided code.
 * On successful completion, sets the active session and redirects to the home page.
 */
const handleVerifyCode = async () => {
  if (!isLoaded.value || !signIn.value) return;

  isLoading.value = true;
  message.value = "";

  try {
    // Attempt to verify the code
    const result = await signIn.value.attemptFirstFactor({
      strategy: "email_code",
      code: code.value,
    });

    console.log("Verification code attempt result:", result);

    // If verification is complete, set the active session and redirect
    if (result.status === "complete") {
      await setActive({
        session: result.createdSessionId,
      });
      navigateTo("/");
    } else {
      throw new Error("Verification failed.");
    }
  } catch (error) {
    console.error("Error verifying code:", error);
    message.value = error.errors?.[0]?.longMessage || "An unknown error occurred.";
  } finally {
    isLoading.value = false;
  }
};
</script>