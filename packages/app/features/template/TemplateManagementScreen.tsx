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
import { useAuthContext } from '../../provider/AuthProvider'
import { PageWrapper } from '../../provider/PageWrapper'

interface Template {
  id: string
  user_id: string
  name: string
  fields: any[] // We'll define a more specific type for fields later
  is_default: boolean
  created_at: string
  updated_at: string
}

export function TemplateManagementScreen() {
  const { user } = useAuthContext()
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddTemplateOpen, setIsAddTemplateOpen] = useState(false)
  const [newTemplateName, setNewTemplateName] = useState('')
  const toast = useToastController()

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.from('templates').select('*').eq('user_id', user?.id)

      if (error) throw error
      setTemplates(data || [])
    } catch (err) {
      toast.show('Error', {
        message: err.message,
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddTemplate = async () => {
    if (!newTemplateName.trim() || !user) {
      toast.show('Template name is required', {
        message: 'Please enter a valid template name.',
        type: 'error',
      })
      return
    }

    try {
      setLoading(true)
      const defaultFields = [
        { name: 'Subjective', type: 'text' },
        { name: 'Objective', type: 'text' },
        { name: 'Assessment', type: 'text' },
        { name: 'Plan', type: 'text' },
      ]

      const { data, error } = await supabase
        .from('note_templates')
        .insert({
          name: newTemplateName.trim(),
          fields: defaultFields,
          user_id: user.id,
          is_default: false,
        })
        .select()

      if (error) throw error

      if (data) {
        setTemplates([...templates, data[0]])
        setIsAddTemplateOpen(false)
        setNewTemplateName('')
        toast.show('Template added', {
          message: 'New template has been successfully added.',
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

  const handleUpdateTemplate = async (template: Template) => {
    // Implementation for updating a template
  }

  const handleDeleteTemplate = async (templateId: string) => {
    // Implementation for deleting a template
  }

  return (
    <PageWrapper>
      <YStack f={1} jc="flex-start" ai="stretch" p="$4" gap="$4">
        <H1>Template Management</H1>
        <Button onPress={() => setIsAddTemplateOpen(true)}>Add Template</Button>
        {loading ? (
          <Paragraph>Loading templates...</Paragraph>
        ) : (
          <ScrollView>
            {templates.map((template) => (
              <XStack key={template.id} jc="space-between" ai="center" p="$2">
                <Paragraph>{template.name}</Paragraph>
                <Button onPress={() => handleUpdateTemplate(template)}>Edit</Button>
                <Button onPress={() => handleDeleteTemplate(template.id)}>Delete</Button>
              </XStack>
            ))}
          </ScrollView>
        )}
      </YStack>
      {/* Add Modal for creating/editing templates */}
    </PageWrapper>
  )
}
