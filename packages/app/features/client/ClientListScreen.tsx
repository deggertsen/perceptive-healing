import React, { useEffect, useState } from 'react'
import { Button, Paragraph, YStack, XStack, H1, ScrollView } from '@my/ui'
import { supabase } from '@my/config'
import { useRouter } from 'solito/navigation'
import { Client } from './types'

export function ClientListScreen() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.from('clients').select('*')
      if (error) throw error
      setClients(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAddClient = () => {
    // We'll implement this later
    console.log('Add client')
  }

  return (
    <YStack f={1} jc="flex-start" ai="stretch" p="$4" space>
      <H1>Clients</H1>
      <Button onPress={handleAddClient}>Add Client</Button>
      {error && <Paragraph color="$red10">{error}</Paragraph>}
      {loading ? (
        <Paragraph>Loading clients...</Paragraph>
      ) : (
        <ScrollView>
          {clients.map((client) => (
            <XStack
              key={client.id}
              jc="space-between"
              ai="center"
              p="$2"
              borderBottomWidth={1}
              borderColor="$gray5"
            >
              <Paragraph>{client.name}</Paragraph>
              <Button onPress={() => router.push(`/client/${client.id}`)}>View</Button>
            </XStack>
          ))}
        </ScrollView>
      )}
    </YStack>
  )
}
