// used by 3 of the auth routes whilst confirm handles its own implementation internally
export default defineNuxtRouteMiddleware(() => {
  if (useSupabaseUser().value) return navigateTo("/app/dashboard");
});
