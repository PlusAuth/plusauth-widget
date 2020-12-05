import {UserConfig} from "vite";

const config: UserConfig = {
  plugins: [
  ],
  optimizeDeps: {
    include: [
      "@popperjs/core/lib/modifiers/offset",
      "@popperjs/core/lib/modifiers/flip",
      "@popperjs/core/lib/modifiers/preventOverflow",
      "@popperjs/core/lib/popper-lite"
    ]
  }
}
export default config
