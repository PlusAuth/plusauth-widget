import type { Config } from 'tailwindcss';

export default {
  corePlugins: {
    preflight: false,
  },
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,vue,tsx}',
  ],
  theme: {
    borderRadius: {
      'none': '0',
      'sm': '1px',
      DEFAULT: '0.25rem',
      'md': '0.375rem',
      'lg': '0.5rem',
      'full': '9999px',
      'large': '12px',
    },
    extend: {
      colors: {
        accent: {
          50: 'rgb(var(--color-accent-50) / <alpha-value>)',
          100: 'rgb(var(--color-accent-100) / <alpha-value>)',
          200: 'rgb(var(--color-accent-200) / <alpha-value>)',
          300: 'rgb(var(--color-accent-300) / <alpha-value>)',
          400: 'rgb(var(--color-accent-400) / <alpha-value>)',
          500: 'rgb(var(--color-accent-500) / <alpha-value>)',
          600: 'rgb(var(--color-accent-600) / <alpha-value>)',
          700: 'rgb(var(--color-accent-700) / <alpha-value>)',
          800: 'rgb(var(--color-accent-800) / <alpha-value>)',
          900: 'rgb(var(--color-accent-900) / <alpha-value>)',
          950: 'rgb(var(--color-accent-950) / <alpha-value>)',
          DEFAULT: 'rgb(var(--color-accent-DEFAULT) / <alpha-value>)'
        },
        error: {
          50: 'rgb(var(--color-error-50) / <alpha-value>)',
          100: 'rgb(var(--color-error-100) / <alpha-value>)',
          200: 'rgb(var(--color-error-200) / <alpha-value>)',
          300: 'rgb(var(--color-error-300) / <alpha-value>)',
          400: 'rgb(var(--color-error-400) / <alpha-value>)',
          500: 'rgb(var(--color-error-500) / <alpha-value>)',
          600: 'rgb(var(--color-error-600) / <alpha-value>)',
          700: 'rgb(var(--color-error-700) / <alpha-value>)',
          800: 'rgb(var(--color-error-800) / <alpha-value>)',
          900: 'rgb(var(--color-error-900) / <alpha-value>)',
          950: 'rgb(var(--color-error-950) / <alpha-value>)',
          DEFAULT: 'rgb(var(--color-error-DEFAULT) / <alpha-value>)'
        },
        info: {
          50: 'rgb(var(--color-info-50) / <alpha-value>)',
          100: 'rgb(var(--color-info-100) / <alpha-value>)',
          200: 'rgb(var(--color-info-200) / <alpha-value>)',
          300: 'rgb(var(--color-info-300) / <alpha-value>)',
          400: 'rgb(var(--color-info-400) / <alpha-value>)',
          500: 'rgb(var(--color-info-500) / <alpha-value>)',
          600: 'rgb(var(--color-info-600) / <alpha-value>)',
          700: 'rgb(var(--color-info-700) / <alpha-value>)',
          800: 'rgb(var(--color-info-800) / <alpha-value>)',
          900: 'rgb(var(--color-info-900) / <alpha-value>)',
          950: 'rgb(var(--color-info-950) / <alpha-value>)',
          DEFAULT: 'rgb(var(--color-info-DEFAULT) / <alpha-value>)'
        },
        primary: {
          50: 'rgb(var(--pa-color-primary-50) / <alpha-value>)',
          100: 'rgb(var(--pa-color-primary-100) / <alpha-value>)',
          200: 'rgb(var(--pa-color-primary-200) / <alpha-value>)',
          300: 'rgb(var(--pa-color-primary-300) / <alpha-value>)',
          400: 'rgb(var(--pa-color-primary-400) / <alpha-value>)',
          500: 'rgb(var(--pa-color-primary-500) / <alpha-value>)',
          600: 'rgb(var(--pa-color-primary-600) / <alpha-value>)',
          700: 'rgb(var(--pa-color-primary-700) / <alpha-value>)',
          800: 'rgb(var(--pa-color-primary-800) / <alpha-value>)',
          900: 'rgb(var(--pa-color-primary-900) / <alpha-value>)',
          950: 'rgb(var(--pa-color-primary-950) / <alpha-value>)',
          DEFAULT: 'rgb(var(--pa-color-primary-DEFAULT) / <alpha-value>)'
        },
        secondary: {
          50: 'rgb(var(--color-secondary-50) / <alpha-value>)',
          100: 'rgb(var(--color-secondary-100) / <alpha-value>)',
          200: 'rgb(var(--color-secondary-200) / <alpha-value>)',
          300: 'rgb(var(--color-secondary-300) / <alpha-value>)',
          400: 'rgb(var(--color-secondary-400) / <alpha-value>)',
          500: 'rgb(var(--color-secondary-500) / <alpha-value>)',
          600: 'rgb(var(--color-secondary-600) / <alpha-value>)',
          700: 'rgb(var(--color-secondary-700) / <alpha-value>)',
          800: 'rgb(var(--color-secondary-800) / <alpha-value>)',
          900: 'rgb(var(--color-secondary-900) / <alpha-value>)',
          950: 'rgb(var(--color-secondary-950) / <alpha-value>)',
          DEFAULT: 'rgb(var(--color-secondary-DEFAULT) / <alpha-value>)'
        },
        success: {
          50: 'rgb(var(--color-success-50) / <alpha-value>)',
          100: 'rgb(var(--color-success-100) / <alpha-value>)',
          200: 'rgb(var(--color-success-200) / <alpha-value>)',
          300: 'rgb(var(--color-success-300) / <alpha-value>)',
          400: 'rgb(var(--color-success-400) / <alpha-value>)',
          500: 'rgb(var(--color-success-500) / <alpha-value>)',
          600: 'rgb(var(--color-success-600) / <alpha-value>)',
          700: 'rgb(var(--color-success-700) / <alpha-value>)',
          800: 'rgb(var(--color-success-800) / <alpha-value>)',
          900: 'rgb(var(--color-success-900) / <alpha-value>)',
          950: 'rgb(var(--color-success-950) / <alpha-value>)',
          DEFAULT: 'rgb(var(--color-success-DEFAULT) / <alpha-value>)'
        },
        warning: {
          50: 'rgb(var(--color-warning-50) / <alpha-value>)',
          100: 'rgb(var(--color-warning-100) / <alpha-value>)',
          200: 'rgb(var(--color-warning-200) / <alpha-value>)',
          300: 'rgb(var(--color-warning-300) / <alpha-value>)',
          400: 'rgb(var(--color-warning-400) / <alpha-value>)',
          500: 'rgb(var(--color-warning-500) / <alpha-value>)',
          600: 'rgb(var(--color-warning-600) / <alpha-value>)',
          700: 'rgb(var(--color-warning-700) / <alpha-value>)',
          800: 'rgb(var(--color-warning-800) / <alpha-value>)',
          900: 'rgb(var(--color-warning-900) / <alpha-value>)',
          950: 'rgb(var(--color-warning-950) / <alpha-value>)',
          DEFAULT: 'rgb(var(--color-warning-DEFAULT) / <alpha-value>)'
        }
      }
    },
  },
  plugins: [],
} as Config

