// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  ssr: true,

  modules: [
    '@nuxt/icon',
    '@nuxt/ui',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@pinia/nuxt',
    '@nuxt/image',
  ],

  fonts: {
    provider: 'google',
    defaults: {
      weights: [400, 700],
      styles: ['normal'],
    },
  },

  css: ['~/assets/css/main.css'],
  colorMode: {
    preference: 'light',
  },

  app: {
    head: {
      link: [
        { rel: "icon", type: "image/svg+xml", href: "/logo.svg" },
        { rel: "manifest", href: "/manifest.json" },
      ],
    },
  },

  runtimeConfig: {
    public: {
      host: '',
    },
  },

  devServer: {
    port: 4000,
  },

  $development: {
    runtimeConfig: {
      public: {
        host: 'http://localhost:3000',
      },
    },
  },
});