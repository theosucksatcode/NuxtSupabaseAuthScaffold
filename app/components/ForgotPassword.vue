<template>
  <UAuthForm
    title="Forgot your password?"
    description="Enter your email and we'll send you a link to reset the password"
    :fields="fields"
    :schema="schema"
    loading-auto
  >
    <template #footer>
      Already have an account?
      <ULink to="/auth/sign-in">Sign in</ULink>
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
]);
</script>
