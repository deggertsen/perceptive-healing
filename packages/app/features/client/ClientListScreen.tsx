import { supabase } from '@my/config'
import {
  Button,
  H1,
  Input,
  Label,
  Modal,
  ModalClose,
  Paragraph,
  ScrollView,
  XStack,
  YStack,
  useToastController,
} from '@my/ui'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'solito/navigation'
import { AnonymousUserConfirmation } from '../../modals/AnonymousUserConfirmation'
import { useAuthContext } from '../../provider/AuthProvider'
import { PageWrapper } from '../../provider/PageWrapper'
import type { Client } from './types'

export function ClientListScreen() {
  const { user } = useAuthContext()
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddClientOpen, setIsAddClientOpen] = useState(false)
  const [newClientName, setNewClientName] = useState('')
  const [newClientEmail, setNewClientEmail] = useState('')
  const [newClientPhone, setNewClientPhone] = useState('')
  const router = useRouter()
  const toast = useToastController()

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', user?.id)
        .is('deleted_at', null)

      if (error) throw error
      setClients(data || [])
    } catch (err) {
      toast.show('Error', {
        message: err.message,
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddClient = async () => {
    if (!newClientName.trim() || !user) {
      toast.show('Client name is required', {
        message: 'Please enter a valid client name.',
        type: 'error',
      })
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
          user_id: user.id,
        })
        .select()

      if (error) throw error

      if (data) {
        setClients([...clients, data[0]])
        setIsAddClientOpen(false)
        setNewClientName('')
        setNewClientEmail('')
        setNewClientPhone('')
        toast.show('Client added', {
          message: 'New client has been successfully added.',
          type: 'success',
        })
      }
    } catch (err) {
      toast.show('Error', {
        message: err.message,
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageWrapper>
      <YStack f={1} jc="flex-start" ai="stretch" p="$4" gap="$4">
        <H1>Clients</H1>
        <Button onPress={() => setIsAddClientOpen(true)}>Add Client</Button>
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
            <ModalClose>
              <Button.Text>Cancel</Button.Text>
            </ModalClose>
            <Button theme="active" onPress={handleAddClient}>
              Add Client
            </Button>
          </XStack>
        </YStack>
      </Modal>
      <AnonymousUserConfirmation isAnonymousUser={user?.is_anonymous ?? false} />
    </PageWrapper>
  )
}
