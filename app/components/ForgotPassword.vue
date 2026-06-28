<template>
  <UAuthForm
    v-if="!requestSent"
    title="Forgot your password?"
    description="Enter your email and we'll send you a link to recover your account"
    :fields="fields"
    :schema="schema"
    loading-auto
    @submit="onSubmit"
    :submit="{ label: 'Send recovery link' }"
  >
    <template #validation>
      <UAlert v-if="serverError" color="error" :description="serverError" />
    </template>

    <template #footer>
      Already have an account?
      <ULink to="/auth/sign-in">Sign in</ULink>
    </template>
  </UAuthForm>

  <UCard
    v-else
    title="Check your inbox"
    description="We've sent a password reset link to your email. It expires in 15 minutes."
  >
    <template #footer>
      <div class="flex justify-end">
        <ULink to="/auth/sign-in">Back to sign in</ULink>
      </div>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import * as z from "zod";
import type { AuthFormField, FormSubmitEvent } from "@nuxt/ui";

const client = useSupabaseClient();
const serverError = ref<string | null>(null);
const requestSent = ref(false);

const schema = z.object({
  email: z
    .string({ message: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email address"),
});

type Schema = z.infer<typeof schema>;

async function onSubmit({ data }: FormSubmitEvent<Schema>) {
  serverError.value = null;
  const { error } = await client.auth.resetPasswordForEmail(data.email, {
    redirectTo: `${window.location.origin}/auth/confirm`, // env agnostic redirect so it works on localhost and prod
  });
  if (error) {
    serverError.value = error.message;
    return;
  }
  requestSent.value = true;
}

const fields: AuthFormField[] = [
  {
    name: "email",
    type: "text",
    label: "Email",
    onInput: emailOnInput,
  } as AuthFormField,
];
</script>
