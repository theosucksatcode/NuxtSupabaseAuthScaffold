<template>
  <SignUp class="max-w-xs" />
</template>

<script setup lang="ts">
definePageMeta({
  layout: "centered",
  middleware: "guest",
});
</script>
