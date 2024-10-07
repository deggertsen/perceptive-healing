import getConfig from 'next/config'

type ConfigType = {
  serverRuntimeConfig: Record<string, unknown>
  publicRuntimeConfig: {
    supabaseConfig: {
      url: string
      anonKey: string
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
