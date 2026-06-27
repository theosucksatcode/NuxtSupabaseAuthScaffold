export default defineNuxtRouteMiddleware(() => {
  if (useSupabaseUser().value) return navigateTo("/app/dashboard");
});
