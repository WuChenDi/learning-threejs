import process from 'node:process'
import pkg from './package.json'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
      },
      title: 'Learning Three.js - Interactive 3D Web Development',
      viewport: 'width=device-width,initial-scale=1,viewport-fit=cover',
      link: [
        { rel: 'icon', href: 'https://notes-wudi.pages.dev/images/logo.png', sizes: 'any' },
        { rel: 'apple-touch-icon', href: 'https://notes-wudi.pages.dev/images/logo.png' },
        { rel: 'canonical', href: 'https://learning-threejs.pages.dev' },
      ],
      meta: [
        { 'http-equiv': 'X-UA-Compatible', 'content': 'IE=edge' },
        { 'http-equiv': 'Content-Security-Policy' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'description', content: 'Master Three.js with hands-on tutorials, interactive demos, and practical examples. Learn 3D web development, WebGL, and create stunning interactive experiences.' },
        { name: 'keywords', content: 'Three.js tutorials, 3D web development, WebGL programming, JavaScript 3D graphics, interactive 3D animations, web-based 3D rendering, Three.js examples, modern web development' },
        { name: 'author', content: 'wudi' },
        { name: 'publisher', content: 'wudi' },
        { name: 'contact', content: 'wuchendi96@gmail.com' },
        { name: 'robots', content: 'index, follow' },

        // Open Graph / Facebook
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Learning Three.js' },
        { property: 'og:title', content: 'Learning Three.js - Master 3D Web Development' },
        { property: 'og:description', content: 'Comprehensive Three.js learning platform with interactive tutorials, practical examples, and step-by-step guides for modern 3D web development.' },
        { property: 'og:url', content: 'https://learning-three.js.pages.dev' },
        { property: 'og:image', content: '/og-image.png' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:alt', content: 'Learning Three.js - Interactive 3D Web Development Platform' },
        { property: 'og:locale', content: 'en_US' },

        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: '@wuchendi96' },
        { name: 'twitter:creator', content: '@wuchendi96' },
        { name: 'twitter:title', content: 'Learning Three.js - Master 3D Web Development' },
        { name: 'twitter:description', content: 'Learn Three.js through interactive tutorials and practical examples. Create stunning 3D web experiences with modern WebGL techniques.' },
        { name: 'twitter:image', content: '/twitter-card.png' },
        { name: 'twitter:image:alt', content: 'Learning Three.js tutorials and examples' },

        { property: 'og:see_also', content: 'https://https://www.facebook.com/wudi996' },
        { property: 'og:see_also', content: 'https://www.youtube.com/@wuchendi' },
        { property: 'og:see_also', content: 'https://github.com/WuChenDi' },
        { name: 'facebook', content: 'https://https://www.facebook.com/wudi996' },
        { name: 'youtube', content: 'https://www.youtube.com/@wuchendi' },
        { name: 'github', content: 'https://github.com/WuChenDi' },

        // Security & Performance
        { name: 'referrer', content: 'strict-origin-when-cross-origin' },
        { name: 'format-detection', content: 'telephone=no' },
      ],

      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            'name': 'Learning Three.js',
            'alternateName': 'learning-threejs',
            'url': 'https://learning-threejs.pages.dev',
            'logo': 'https://notes-wudi.pages.dev/images/logo.png',
            'description': 'Comprehensive Three.js learning platform offering interactive tutorials, practical examples, and expert guidance for mastering 3D web development with WebGL.',
            'email': 'wuchendi96@gmail.com',
            'foundingDate': '2024',
            'sameAs': [
              'https://https://www.facebook.com/wudi996',
              'https://www.youtube.com/@wuchendi',
              'https://github.com/WuChenDi',
            ],
            'contactPoint': {
              '@type': 'ContactPoint',
              'email': 'wuchendi96@gmail.com',
              'contactType': 'customer service',
              'availableLanguage': ['English'],
            },
          }),
        },
      ],
    },
  },

  compatibilityDate: '2024-11-01',

  devtools: {
    enabled: true,
  },

  devServer: {
    host: '0.0.0.0',
  },

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
