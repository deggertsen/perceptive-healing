import React, { useEffect, useState } from 'react'
import {
  Button,
  Paragraph,
  YStack,
  XStack,
  H1,
  ScrollView,
  Input,
  Label,
  Modal,
  ModalClose,
} from '@my/ui'
import { supabase } from '@my/config'
import { useRouter } from 'solito/navigation'
import { Client } from './types'
import { useAuthContext } from '../../provider/AuthProvider'

export function ClientListScreen() {
  const { user } = useAuthContext()
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
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', user?.uid)
        .is('deleted_at', null)

      if (error) throw error
      setClients(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAddClient = async () => {
    if (!newClientName.trim() || !user) {
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
          user_id: user.uid,
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
    <>
      <YStack f={1} jc="flex-start" ai="stretch" p="$4" gap="$4">
        <H1>Clients</H1>
        <Button onPress={() => setIsAddClientOpen(true)}>Add Client</Button>
        {error && <Paragraph theme="danger">{error}</Paragraph>}
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
      <Modal open={isAddClientOpen} onOpenChange={setIsAddClientOpen} title="Add New Client">
        <YStack gap="$4" maw={600} p="$4">
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
            inputMode="email"
          />
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            placeholder="Phone"
            value={newClientPhone}
            onChangeText={setNewClientPhone}
            inputMode="tel"
          />
          <XStack gap="$2">
            <ModalClose asChild>
              <Button theme="alt1">Cancel</Button>
            </ModalClose>
            <Button theme="active" onPress={handleAddClient}>
              Add Client
            </Button>
          </XStack>
        </YStack>
      </Modal>
    </>
  )
}
