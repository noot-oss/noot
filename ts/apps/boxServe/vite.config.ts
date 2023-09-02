import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import viteTsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact(), viteTsconfigPaths()],
})
