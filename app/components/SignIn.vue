<template>
  <UAuthForm
    title="Welcome back"
    description="Sign in to your account"
    :fields="fields"
    :schema="schema"
    loading-auto
    :submit="{ label: 'Sign in' }"
    @submit="onSubmit"
  >
    <template #password-hint>
      <ULink
        to="/auth/forgot-password"
        class="text-muted no-underline font-normal"
        >Forgot password?</ULink
      >
    </template>

    <template #validation>
      <UAlert v-if="serverError" color="error" :description="serverError" />
    </template>

    <template #footer>
      Don't have an account?
      <ULink to="/auth/sign-up">Sign up</ULink>
    </template>
  </UAuthForm>
</template>

<script setup lang="ts">
import * as z from "zod";
import type { AuthFormField, FormSubmitEvent } from "@nuxt/ui";

const client = useSupabaseClient();
const serverError = ref<string | null>(null);

const schema = z.object({
  email: z
    .string({ message: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email address"),
  password: z
    .string({ message: "Password is required" })
    .min(1, "Password is required"),
});

type Schema = z.infer<typeof schema>;

async function onSubmit({ data }: FormSubmitEvent<Schema>) {
  serverError.value = null;
  const { error } = await client.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });
  if (error) {
    serverError.value =
      error.code === "invalid_credentials"
        ? "Email or password is incorrect."
        : error.code === "email_not_confirmed"
          ? "Please confirm your email before signing in. Check your inbox."
          : error.code === "user_banned"
            ? "Your account has been disabled. Please contact support."
            : error.message;
    return;
  }
  navigateTo("/app/dashboard");
}

const fields = ref<AuthFormField[]>([
  {
    name: "email",
    type: "text",
    label: "Email",
    onInput: (e: Event) => {
      (e.target as HTMLInputElement).value = (
        e.target as HTMLInputElement
      ).value.toLowerCase();
    },
  } as AuthFormField,
  { name: "password", type: "password", label: "Password" },
]);
</script>
