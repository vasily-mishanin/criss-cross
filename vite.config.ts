import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.m4a'],
  css: {
    modules: {
      // Use camelCase for CSS class names
      // localsConvention: 'camelCaseOnly',
      // Generate class names with the filename prefix
      generateScopedName: '[name]_[local]__[hash:base64:5]',
    },
  },
});
