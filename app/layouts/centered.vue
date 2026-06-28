<template>
  <div class="relative flex items-center justify-center min-h-svh p-6">
    <UBadge
      icon="i-lucide-presentation"
      label="Live demo"
      variant="subtle"
      color="info"
      class="absolute top-6 right-6"
    />
    <slot />
  </div>
</template>
