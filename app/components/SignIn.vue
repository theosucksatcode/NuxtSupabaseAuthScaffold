<template>
  <UAuthForm
    title="Welcome back"
    description="Sign in to your account"
    :fields="fields"
    :schema="schema"
    loading-auto
  >
    <template #password-hint>
      <ULink
        to="/auth/forgot-password"
        class="text-muted no-underline font-normal"
        >Forgot password?</ULink
      >
    </template>
    <template #footer>
      Don't have an account?
      <ULink to="/auth/sign-up">Sign up</ULink>
    </template>
  </UAuthForm>
</template>

<script setup lang="ts">
import * as z from "zod";
import type { AuthFormField } from "@nuxt/ui";

const schema = z.object({
  email: z
    .string({ message: "Email is required" }) // catches undefined case
    .min(1, "Email is required")
    .email("Invalid email address"),
  password: z
    .string({ message: "Password is required" }) // catches undefined case
    .min(1, "Password is required"),
});

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
