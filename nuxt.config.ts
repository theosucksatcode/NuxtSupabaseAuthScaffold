// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2026-06-24", // project scaffold date
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@nuxtjs/supabase"],
  css: ["~/assets/css/main.css"],
  supabase: {
    redirectOptions: {
      login: "/auth/sign-in", // where unauthenticated users land
      callback: "/auth/confirm", // where supabase redirects after pkce code exchange
      include: ["/app/**"], // only /app/** routes require auth and everything else is public
    },
  },
});
