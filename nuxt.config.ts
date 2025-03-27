import process from 'node:process'
import pkg from './package.json'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',

  future: {
    compatibilityVersion: 4,
  },

  devtools: { enabled: true },

  modules: ['@nuxt/fonts', '@vueuse/nuxt', '@unocss/nuxt'],

  runtimeConfig: {
    public: {
      __BUILD_TIME__: new Date().toLocaleString(),
      __PACKAGE_NAME__: pkg.name,
      __PACKAGE_VERSION__: pkg.version,
      NUXT_LOG_ENABLE: process.env.NUXT_LOG_ENABLE || 'true',
    },
  },

  css: [
    './app/styles/global.css',
  ],
})
