import antfu from '@antfu/eslint-config'

export default antfu(
  {
    formatters: true,
    ignores: [
      '**/.nuxt/**',
      '**/cache',
      '**/dist',
      '**/.temp',
      '**/*.svg',
      '**/*.md',
      '**/*.toml',
    ],
  },
  {
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  },
)
