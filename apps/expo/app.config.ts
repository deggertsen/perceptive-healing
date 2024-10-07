import { ExpoConfig, ConfigContext } from 'expo/config'
import { version, buildNumber, versionCode } from './package.json'

const expoConfig = ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Body Work SOAP Notes',
  owner: 'Perceptive Healing',
  slug: 'bodywork',
  scheme: 'bodywork',
  version,
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    buildNumber,
    supportsTablet: true,
    bundleIdentifier: 'com.bodywork.app',
    googleServicesFile: './GoogleService-Info.plist',
  },
  android: {
    versionCode,
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#FFFFFF',
    },
    googleServicesFile: './google-services.json',
    package: 'com.bodywork.app',
  },
  web: {
    plugins: [
      'expo-router',
      'expo-font',
      '@react-native-firebase/app',
      '@react-native-firebase/crashlytics',
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    },
  },
})

export default expoConfig
