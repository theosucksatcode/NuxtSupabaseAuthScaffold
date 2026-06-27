<template>
  <div class="flex gap-2">
    <UButton to="/auth/sign-up" label="Get started" />
    <UButton to="/auth/sign-in" label="Sign in" variant="soft" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "centered",
});
</script>
