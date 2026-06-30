<template>
  <div class="relative flex items-center justify-center min-h-svh p-6">
    <UBadge
      icon="i-lucide-presentation"
      label="Demo"
      variant="subtle"
      color="info"
      class="absolute top-1 right-1 rounded-none"
      size="xs"
    />
    <slot />
  </div>
</template>
