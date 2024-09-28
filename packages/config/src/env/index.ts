import getConfig from 'next/config'

type ConfigType = {
  serverRuntimeConfig: {}
  publicRuntimeConfig: {
    supabaseConfig: {
      url: string
      anonKey: string
    }
    firebaseConfig: {
      apiKey: string
      authDomain: string
      projectId: string
      storageBucket: string
      messagingSenderId: string
      appId: string
    }
    NODE_ENV: string
  }
}

const getLocalConfig = (): ConfigType => {
  return {
    serverRuntimeConfig: {},
    publicRuntimeConfig: {
      supabaseConfig: {
        url: process.env.SUPABASE_URL ?? '',
        anonKey: process.env.SUPABASE_ANON_KEY ?? '',
      },
      firebaseConfig: {
        apiKey: process.env.FIREBASE_API_KEY ?? '',
        authDomain: process.env.FIREBASE_AUTH_DOMAIN ?? '',
        projectId: process.env.FIREBASE_PROJECT_ID ?? '',
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET ?? '',
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID ?? '',
        appId: process.env.FIREBASE_APP_ID ?? '',
      },
      NODE_ENV: process.env.REACT_APP_NODE_ENV ?? '',
    },
  } as ConfigType
}

const getConfigWithTypes = (): ConfigType => {
  const nextConfig = getConfig() as unknown as ConfigType | undefined
  if (nextConfig) return nextConfig

  const localConfig = getLocalConfig()
  if (localConfig) return localConfig

  throw new Error('Config not found')
}

export default getConfigWithTypes

export const firebaseConfig = getConfigWithTypes().publicRuntimeConfig.firebaseConfig
