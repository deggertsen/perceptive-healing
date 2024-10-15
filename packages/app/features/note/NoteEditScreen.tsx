import { supabase } from '@my/config'
import {
  Button,
  H1,
  Input,
  Label,
  Paragraph,
  ScrollView,
  Select,
  XStack,
  YStack,
  useToastController,
} from '@my/ui'
import React, { useEffect, useState } from 'react'
import { createParam } from 'solito'
import { useRouter } from 'solito/router'
import { useAuthContext } from '../../provider/AuthProvider'
import { PageWrapper } from '../../provider/PageWrapper'
import type { Client, Note, Template } from '../template/types'

const { useParams } = createParam<{ id: string }>()

export function NoteEditScreen() {
  const { user } = useAuthContext()
  const [note, setNote] = useState<Note | null>(null)
  const [templates, setTemplates] = useState<Template[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const toast = useToastController()
  const router = useRouter()
  const { params } = useParams()
  const id = params.id

  useEffect(() => {
    fetchTemplates()
    fetchClients()
    if (id !== 'new') {
      fetchNote()
    } else {
      setLoading(false)
    }
  }, [id])

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('note_templates')
        .select('*')
        .eq('user_id', user?.id)

      if (error) throw error
      setTemplates(data || [])
    } catch (err) {
      toast.show('Error', {
        message: err.message,
        type: 'error',
      })
    }
  }

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase.from('clients').select('*').eq('user_id', user?.id)

      if (error) throw error
      setClients(data || [])
    } catch (err) {
      toast.show('Error', {
        message: err.message,
        type: 'error',
      })
    }
  }

  const fetchNote = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('id', id)
        .eq('user_id', user?.id)
        .single()

      if (error) throw error
      setNote(data)
      setSelectedTemplate(templates.find((t) => t.id === data.template_id) || null)
      setSelectedClientId(data.client_id)
    } catch (err) {
      toast.show('Error', {
        message: err.message,
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!note || !selectedTemplate || !selectedClientId) return

    try {
      setLoading(true)
      const noteData = {
        ...note,
        user_id: user?.id,
        template_id: selectedTemplate.id,
        client_id: selectedClientId,
      }

      const { error: noteError } =
        id === 'new'
          ? await supabase.from('notes').insert(noteData)
          : await supabase.from('notes').update(noteData).eq('id', note.id)

      if (noteError) throw noteError

      toast.show('Success', {
        message: `Note ${id === 'new' ? 'created' : 'updated'} successfully`,
        type: 'success',
      })
      router.push('/notes')
    } catch (err) {
      toast.show('Error', {
        message: err.message,
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleTemplateChange = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId)
    setSelectedTemplate(template || null)
    if (template) {
      setNote((prevNote) => ({
        id: prevNote?.id || '',
        user_id: prevNote?.user_id || '',
        client_id: prevNote?.client_id || '',
        created_at: prevNote?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
        template_id: template.id,
        content: template.fields.reduce(
          (acc, field) => {
            acc[field.name] = ''
            return acc
          },
          {} as Record<string, string>,
        ),
      }))
    }
  }

  const handleInputChange = (fieldName: string, value: string) => {
    setNote((prevNote) => ({
      id: prevNote?.id || '',
      user_id: prevNote?.user_id || '',
      client_id: prevNote?.client_id || '',
      template_id: prevNote?.template_id || '',
      created_at: prevNote?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
      content: {
        ...(prevNote?.content || {}),
        [fieldName]: value,
      },
    }))
  }

  if (loading) return <Paragraph>Loading...</Paragraph>

  return (
    <PageWrapper>
      <ScrollView>
        <YStack f={1} jc="flex-start" ai="stretch" p="$4" gap="$4">
          <H1>{id === 'new' ? 'Create Note' : 'Edit Note'}</H1>

          {id === 'new' && (
            <Select value={selectedTemplate?.id} onValueChange={handleTemplateChange}>
              <Select.Trigger>
                <Select.Value placeholder="Select a template" />
              </Select.Trigger>
              <Select.Content>
                {templates.map((t, index) => (
                  <Select.Item index={index} key={t.id} value={t.id}>
                    <Select.ItemText>{t.name}</Select.ItemText>
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
          )}

          {selectedTemplate?.fields.map((field) => (
            <YStack key={field.id} gap="$2">
              <Label htmlFor={field.name}>{field.name}</Label>
              <Input
                id={field.name}
                value={note?.content[field.name] || ''}
                onChangeText={(text) => handleInputChange(field.name, text)}
                multiline={field.type === 'multiline'}
              />
            </YStack>
          ))}

          <XStack gap="$2">
            <Button theme="alt1" onPress={() => router.push('/notes')}>
              Cancel
            </Button>
            <Button theme="active" onPress={handleSave}>
              Save Note
            </Button>
          </XStack>
        </YStack>
      </ScrollView>
    </PageWrapper>
  )
}
