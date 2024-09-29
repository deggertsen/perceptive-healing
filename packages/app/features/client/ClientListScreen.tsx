import React, { useEffect, useState } from 'react'
import { Button, Paragraph, YStack, XStack, H1, ScrollView, Input, Sheet, Label } from '@my/ui'
import { supabase } from '@my/config'
import { useRouter } from 'solito/navigation'
import { Client } from './types'

export function ClientListScreen() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAddClientOpen, setIsAddClientOpen] = useState(false)
  const [newClientName, setNewClientName] = useState('')
  const [newClientEmail, setNewClientEmail] = useState('')
  const [newClientPhone, setNewClientPhone] = useState('')
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

  const handleAddClient = async () => {
    if (!newClientName.trim()) {
      setError('Client name is required')
      return
    }

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('clients')
        .insert({
          name: newClientName.trim(),
          client_info: {
            email: newClientEmail.trim(),
            phone: newClientPhone.trim(),
          },
        })
        .select()

      if (error) throw error

      if (data) {
        setClients([...clients, data[0]])
        setIsAddClientOpen(false)
        setNewClientName('')
        setNewClientEmail('')
        setNewClientPhone('')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <YStack f={1} jc="flex-start" ai="stretch" p="$4" space>
      <H1>Clients</H1>
      <Button onPress={() => setIsAddClientOpen(true)}>Add Client</Button>
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

      <Sheet
        modal
        open={isAddClientOpen}
        onOpenChange={setIsAddClientOpen}
        snapPoints={[50]}
        dismissOnSnapToBottom
        position={0}
        zIndex={100_000}
      >
        <Sheet.Overlay />
        <Sheet.Frame ai="center" jc="center">
          <Sheet.Handle />
          <YStack space="$4" maw={600} p="$4" ai="stretch">
            <H1>Add New Client</H1>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Client Name"
              value={newClientName}
              onChangeText={setNewClientName}
            />
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="Email"
              value={newClientEmail}
              onChangeText={setNewClientEmail}
              keyboardType="email-address"
            />
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              placeholder="Phone"
              value={newClientPhone}
              onChangeText={setNewClientPhone}
              keyboardType="phone-pad"
            />
            <XStack space>
              <Button theme="alt1" onPress={() => setIsAddClientOpen(false)}>
                Cancel
              </Button>
              <Button theme="active" onPress={handleAddClient}>
                Add Client
              </Button>
            </XStack>
          </YStack>
        </Sheet.Frame>
      </Sheet>
    </YStack>
  )
}
