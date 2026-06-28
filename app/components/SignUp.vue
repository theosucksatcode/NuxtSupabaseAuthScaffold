<template>
  <UAuthForm
    v-if="!confirmationSent"
    title="Get started"
    description="Create a new account"
    :fields="fields"
    :schema="schema"
    loading-auto
    :submit="{ label: 'Sign up' }"
    @submit="onSubmit"
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
    description="We've sent a confirmation link to your email. Click it to activate your account."
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
const confirmationSent = ref(false);

const schema = z
  .object({
    name: z
      .string({ message: "Name is required" })
      .min(1, "First name is required")
      .max(50, "Name is too long"),
    surname: z
      .string({ message: "Surname is required" })
      .min(1, "Last name is required")
      .max(50, "Surname is too long"),
    email: z
      .string({ message: "Email is required" })
      .min(1, "Email is required")
      .email("Invalid email address"),
    password: z
      .string({ message: "Password is required" })
      .min(8, "At least 8 characters")
      .regex(/\d/, "At least 1 number")
      .regex(/[a-z]/, "At least 1 lowercase letter")
      .regex(/[A-Z]/, "At least 1 uppercase letter")
      .regex(/[^a-zA-Z0-9]/, "At least 1 symbol"),
    confirmPassword: z
      .string({ message: "Please confirm your password" })
      .min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type Schema = z.infer<typeof schema>;

async function onSubmit({ data }: FormSubmitEvent<Schema>) {
  serverError.value = null;
  const { data: authData, error } = await client.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: { name: data.name, surname: data.surname },
      emailRedirectTo: `${window.location.origin}/auth/confirm?type=signup`,
    },
  });
  if (error) {
    serverError.value =
      error.code === "email_exists" ||
      error.message.includes("already registered")
        ? "An account with this email already exists. Try signing in instead."
        : error.code === "weak_password" // in theory should never trigger again
          ? "Your password doesn't meet the requirements. Check the criteria above."
          : error.code === "signup_disabled"
            ? "New sign-ups are currently disabled. Please try again later."
            : error.message;
    return;
  }
  if (!authData.session) {
    confirmationSent.value = true;
    return;
  }
  navigateTo("/app/dashboard");
}

const passwordValue = ref("");

const strength = computed(() =>
  [
    { regex: /.{8,}/, text: "At least 8 characters" },
    { regex: /\d/, text: "At least 1 number" },
    { regex: /[a-z]/, text: "At least 1 lowercase letter" },
    { regex: /[A-Z]/, text: "At least 1 uppercase letter" },
    { regex: /[^a-zA-Z0-9]/, text: "At least 1 symbol" },
  ].map((req) => ({
    met: req.regex.test(passwordValue.value),
    text: req.text,
  })),
);

const fields = ref<AuthFormField[]>([
  { name: "name", type: "text", label: "Name" },
  { name: "surname", type: "text", label: "Surname" },
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
