<template>
  <UAuthForm
    title="Get started"
    description="Create a new account"
    :fields="fields"
    :schema="schema"
    loading-auto
  >
    <template #password-help>
      <ul class="space-y-1.5">
        <li
          v-for="(req, i) in strength"
          :key="i"
          class="flex items-center gap-1.5"
          :class="req.met ? 'text-success' : ''"
        >
          <UIcon :name="req.met ? 'i-lucide-check' : 'i-lucide-x'" />
          <span class="text-xs">{{ req.text }}</span>
        </li>
      </ul>
    </template>

    <template #footer>
      Already have an account?
      <ULink to="/auth/sign-in">Sign in</ULink>
    </template>
  </UAuthForm>
</template>

<script setup lang="ts">
import * as z from "zod";
import type { AuthFormField } from "@nuxt/ui";

const schema = z
  .object({
    email: z
      .string({ message: "Email is required" }) // catches undefined case
      .min(1, "Email is required")
      .email("Invalid email address"),
    password: z
      .string({ message: "Password is required" }) // catches undefined case
      .min(1, "Password is required"),
    confirmPassword: z
      .string({ message: "Please confirm your password" }) // catches undefined case
      .min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const passwordValue = ref("");

const strength = computed(() =>
  [
    { regex: /.{8,}/, text: "At least 8 characters" },
    { regex: /\d/, text: "At least 1 number" },
    { regex: /[a-z]/, text: "At least 1 lowercase letter" },
    { regex: /[A-Z]/, text: "At least 1 uppercase letter" },
  ].map((req) => ({
    met: req.regex.test(passwordValue.value),
    text: req.text,
  })),
);

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
  {
    name: "password",
    type: "password",
    label: "Password",
    onInput: (e: Event) => {
      passwordValue.value = (e.target as HTMLInputElement).value;
    },
  } as AuthFormField,
  { name: "confirmPassword", type: "password", label: "Confirm your password" },
]);
</script>
