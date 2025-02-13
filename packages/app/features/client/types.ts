import type { ClientInfo, Database } from '@my/config'

export type Client = Database['public']['Tables']['clients']['Row'] & {
  client_info: ClientInfo
}
