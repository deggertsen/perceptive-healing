import { supabase } from '@my/config'
import {
  Button,
  H1,
  Input,
  Label,
  Modal,
  ModalClose,
  Paragraph,
  Spinner,
  XStack,
  YStack,
} from '@my/ui'
import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'solito/navigation'
import { useAuthContext } from '../../provider/AuthProvider'
import type { Client } from './types'

export function ClientDetailScreen() {
  const { user } = useAuthContext()
  const [client, setClient] = useState<Client | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const router = useRouter()
  const { id } = useParams()

  useEffect(() => {
    if (id) fetchClient()
  }, [id])

  const fetchClient = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.from('clients').select('*').eq('id', id).single()

      if (error) throw error
      setClient(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async () => {
    if (!client) return

    try {
      setLoading(true)
      const { error } = await supabase
        .from('clients')
        .update({
          name: client.name,
          client_info: client.client_info,
        })
        .eq('id', client.id)

      if (error) throw error
      setIsEditing(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    if (!client) return

    if (field === 'name') {
      setClient({ ...client, name: value })
    } else {
      setClient({
        ...client,
        client_info: { ...client.client_info, [field]: value },
      })
    }
  }

  const handleDelete = async () => {
    if (!client) return

    try {
      setLoading(true)
      const { error } = await supabase
        .from('clients')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', client.id)
        .eq('user_id', user?.uid)

      if (error) throw error
      router.push('/client')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Spinner />
  if (error) return <Paragraph>{error}</Paragraph>
  if (!client) return <Paragraph>Client not found</Paragraph>

  return (
    <>
      <YStack f={1} jc="flex-start" ai="stretch" p="$4" gap="$4">
        <XStack jc="space-between" ai="center">
          <H1>{isEditing ? 'Edit Client' : 'Client Details'}</H1>
          <Button onPress={() => setIsEditing(!isEditing)}>{isEditing ? 'Cancel' : 'Edit'}</Button>
        </XStack>

        <YStack gap="$4">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={client.name}
            onChangeText={(value) => handleInputChange('name', value)}
            editable={isEditing}
          />

          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            value={client.client_info.email}
            onChangeText={(value) => handleInputChange('email', value)}
            editable={isEditing}
          />

          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={client.client_info.phone}
            onChangeText={(value) => handleInputChange('phone', value)}
            editable={isEditing}
          />
        </YStack>

        {isEditing && (
          <Button theme="active" onPress={handleUpdate}>
            Save Changes
          </Button>
        )}

        <Button theme="alt1" onPress={() => router.push('/client')}>
          Back to Client List
        </Button>

        <Button theme="danger" onPress={() => setIsDeleteModalOpen(true)}>
          Delete Client
        </Button>
      </YStack>
      <Modal open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen} title="Confirm Deletion">
        <YStack gap="$4">
          <Paragraph>Are you sure you want to delete this client?</Paragraph>
          <XStack gap="$4">
            <ModalClose asChild>
              <Button theme="alt1">Cancel</Button>
            </ModalClose>
            <Button theme="danger" onPress={handleDelete}>
              Confirm Delete
            </Button>
          </XStack>
        </YStack>
      </Modal>
    </>
  )
}
