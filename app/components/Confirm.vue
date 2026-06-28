<template>
  <!-- nuxt supabase module is busy doing some magic -->
  <div v-if="status === 'pending'">
    <UIcon name="i-lucide-loader-circle" class="animate-spin size-10" />
  </div>

  <!-- if user is set after code exchange succeeded then they can recover their account -->
  <UAuthForm
    v-else-if="status === 'recovery'"
    title="Set a new password"
    description="Enter a new password for your account"
    :fields="fields"
    :schema="schema"
    :submit="{ label: 'Update password' }"
    loading-auto
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
  </UAuthForm>

  <!-- code expired already used or user navigated here directly -->
  <UCard
    v-else
    title="Link expired or invalid"
    description="This link has expired or has already been used."
  >
    <template #footer>
      <div class="flex justify-end">
        <ULink to="/auth/forgot-password">Request a new link</ULink>
      </div>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import * as z from "zod";
import type { AuthFormField, FormSubmitEvent } from "@nuxt/ui";

const client = useSupabaseClient();
const user = useSupabaseUser();
const route = useRoute();
const serverError = ref<string | null>(null);
const status = ref<"pending" | "recovery" | "invalid">("pending");
// capture 2 values below before any stripping or modification can happen to the url
const hadCode = !!route.query.code;
const hadType = route.query.type;

onMounted(() => {
  if (hadCode) {
    if (hadType === "signup") {
      user.value ? navigateTo("/app/dashboard") : (status.value = "invalid");
    } else {
      // user is set if the code exchange succeeded
      status.value = user.value ? "recovery" : "invalid";
    }
  } else {
    // direct navigation so send back home
    user.value ? navigateTo("/app/dashboard") : (status.value = "invalid");
  }
});

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

const schema = z
  .object({
    password: z
      .string({ message: "Password is required" })
      .min(1, "Password is required"),
    confirmPassword: z
      .string({ message: "Please confirm your password" })
      .min(1, "Please confirm your password"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type Schema = z.infer<typeof schema>;

const fields: AuthFormField[] = [
  {
    name: "password",
    type: "password",
    label: "New password",
    onInput: (e: Event) => {
      passwordValue.value = (e.target as HTMLInputElement).value;
    },
  } as AuthFormField,
  { name: "confirmPassword", type: "password", label: "Confirm new password" },
];

async function onSubmit({ data }: FormSubmitEvent<Schema>) {
  serverError.value = null;
  const { error } = await client.auth.updateUser({ password: data.password });
  if (error) {
    serverError.value =
      error.code === "same_password"
        ? "Your new password must be different from your old one."
        : error.code === "weak_password"
          ? "Password doesn't meet the requirements. Check the criteria above."
          : error.message;
    return;
  }
  navigateTo("/app/dashboard");
}
</script>
