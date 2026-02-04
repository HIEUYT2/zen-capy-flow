import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.capyflow.app',
  appName: 'CapyFlow',
  webDir: 'dist',
  
  // Android-specific settings
  android: {
    // Allow mixed content for YouTube embeds
    allowMixedContent: true,
    // Background color while loading
    backgroundColor: '#fff8e7',
    // Use hardware back button
    handleBackButton: true,
  },
  
  // Server configuration
  server: {
    // Enable hardware acceleration
    androidScheme: 'https',
  },
  
  // Plugin configurations
  plugins: {
    // Status bar configuration
    StatusBar: {
      style: 'LIGHT',
      backgroundColor: '#fff8e7',
    },
    // Keyboard behavior
    Keyboard: {
      resize: 'body',
      resizeOnFullScreen: true,
    },
  },
};

export default config;

