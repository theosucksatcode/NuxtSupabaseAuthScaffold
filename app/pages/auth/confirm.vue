<template>
  <Confirm class="max-w-xs" />
</template>

<script setup lang="ts">
definePageMeta({
  layout: "centered",
  // confirm kind of has guest middleware functionality in the component self... does not follow how other auth components handle it
});
</script>
