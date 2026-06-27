<template>
  <div>
    <p>Welcome, {{ user?.user_metadata?.name }}!</p>
    <UButton block @click="signOut">Sign out</UButton>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "centered",
});

const user = useSupabaseUser();
const client = useSupabaseClient();
const toast = useToast();

async function signOut() {
  const { error } = await client.auth.signOut();
  if (error)
    return toast.add({
      title: "Sign out failed. Please try again.",
      color: "error",
    });
  navigateTo("/auth/sign-in");
}
</script>
