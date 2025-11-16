import { defineConfig } from 'vite';
import react from '@vitejsplugin-react-swc';
import path from 'path';

export default defineConfig({
   //Update this base path to match your repository name
   //Format 'repository-name'
  base: '/EPE/',   //Use '.' for custom domain or update to 'your-repo-name'
  plugins [react()],
  resolve {
    extensions ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias {
      'vaul@1.1.2' 'vaul',
      'sonner@2.0.3' 'sonner',
      'recharts@2.15.2' 'recharts',
      'react-resizable-panels@2.1.7' 'react-resizable-panels',
      'react-hook-form@7.55.0' 'react-hook-form',
      'react-day-picker@8.10.1' 'react-day-picker',
      'next-themes@0.4.6' 'next-themes',
      'lucide-react@0.487.0' 'lucide-react',
      'input-otp@1.4.2' 'input-otp',
      'embla-carousel-react@8.6.0' 'embla-carousel-react',
      'cmdk@1.1.1' 'cmdk',
      'class-variance-authority@0.7.1' 'class-variance-authority',
      '@radix-uireact-tooltip@1.1.8' '@radix-uireact-tooltip',
      '@radix-uireact-toggle@1.1.2' '@radix-uireact-toggle',
      '@radix-uireact-toggle-group@1.1.2' '@radix-uireact-toggle-group',
      '@radix-uireact-tabs@1.1.3' '@radix-uireact-tabs',
      '@radix-uireact-switch@1.1.3' '@radix-uireact-switch',
      '@radix-uireact-slot@1.1.2' '@radix-uireact-slot',
      '@radix-uireact-slider@1.2.3' '@radix-uireact-slider',
      '@radix-uireact-separator@1.1.2' '@radix-uireact-separator',
      '@radix-uireact-select@2.1.6' '@radix-uireact-select',
      '@radix-uireact-scroll-area@1.2.3' '@radix-uireact-scroll-area',
      '@radix-uireact-radio-group@1.2.3' '@radix-uireact-radio-group',
      '@radix-uireact-progress@1.1.2' '@radix-uireact-progress',
      '@radix-uireact-popover@1.1.6' '@radix-uireact-popover',
      '@radix-uireact-navigation-menu@1.2.5' '@radix-uireact-navigation-menu',
      '@radix-uireact-menubar@1.1.6' '@radix-uireact-menubar',
      '@radix-uireact-label@2.1.2' '@radix-uireact-label',
      '@radix-uireact-hover-card@1.1.6' '@radix-uireact-hover-card',
      '@radix-uireact-dropdown-menu@2.1.6' '@radix-uireact-dropdown-menu',
      '@radix-uireact-dialog@1.1.6' '@radix-uireact-dialog',
      '@radix-uireact-context-menu@2.2.6' '@radix-uireact-context-menu',
      '@radix-uireact-collapsible@1.1.3' '@radix-uireact-collapsible',
      '@radix-uireact-checkbox@1.1.4' '@radix-uireact-checkbox',
      '@radix-uireact-avatar@1.1.3' '@radix-uireact-avatar',
      '@radix-uireact-aspect-ratio@1.1.2' '@radix-uireact-aspect-ratio',
      '@radix-uireact-alert-dialog@1.1.6' '@radix-uireact-alert-dialog',
      '@radix-uireact-accordion@1.2.3' '@radix-uireact-accordion',
      '@' path.resolve(__dirname, '.src'),
    },
  },
  build {
    target 'esnext',
    outDir 'build',
  },
  server {
    port 3000,
    open true,
  },
});