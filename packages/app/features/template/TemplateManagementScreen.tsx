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
    try {
      setLoading(true)
      const { error } = await supabase
        .from('note_templates')
        .update({ name: template.name, fields: template.fields })
        .eq('id', template.id)
        .eq('user_id', user?.id)

      if (error) throw error

      toast.show('Template updated', {
        message: 'Template has been successfully updated.',
        type: 'success',
      })
      fetchTemplates()
    } catch (err) {
      toast.show('Error', {
        message: err.message,
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteTemplate = async (templateId: string) => {
    try {
      setLoading(true)
      const { error } = await supabase
        .from('note_templates')
        .delete()
        .eq('id', templateId)
        .eq('user_id', user?.id)

      if (error) throw error

      setTemplates(templates.filter((t) => t.id !== templateId))
      toast.show('Template deleted', {
        message: 'Template has been successfully deleted.',
        type: 'success',
      })
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
      <Modal open={isAddTemplateOpen} onOpenChange={setIsAddTemplateOpen} title="Add New Template">
        <YStack gap="$4" maw={600} p="$4">
          <Label htmlFor="templateName">Template Name</Label>
          <Input
            id="templateName"
            placeholder="Template Name"
            value={newTemplateName}
            onChangeText={setNewTemplateName}
          />
          <XStack gap="$2">
            <ModalClose>
              <Button.Text>Cancel</Button.Text>
            </ModalClose>
            <Button theme="active" onPress={handleAddTemplate}>
              Add Template
            </Button>
          </XStack>
        </YStack>
      </Modal>
    </PageWrapper>
  )
}
