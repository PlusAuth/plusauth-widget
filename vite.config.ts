import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default  defineConfig({
  plugins: [
    vue()
  ],
  resolve: {
    dedupe: ["vue"],
  },
  optimizeDeps: {
    include: [
      "@popperjs/core/lib/modifiers/offset",
      "@popperjs/core/lib/modifiers/flip",
      "@popperjs/core/lib/modifiers/preventOverflow",
      "@popperjs/core/lib/popper-lite"
    ]
  }
})
