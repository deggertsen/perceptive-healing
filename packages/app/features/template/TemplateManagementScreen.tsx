import { supabase } from '@my/config'
import { Button, H1, Paragraph, ScrollView, XStack, YStack, useToastController } from '@my/ui'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'solito/navigation'
import { useAuthContext } from '../../provider/AuthProvider'
import { PageWrapper } from '../../provider/PageWrapper'
import type { Template } from './types'

export function TemplateManagementScreen() {
  const { user } = useAuthContext()
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const toast = useToastController()
  const router = useRouter()

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    try {
      setLoading(true)
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
        <Button onPress={() => router.push('/notes/templates/edit')}>Add Template</Button>
        {loading ? (
          <Paragraph>Loading templates...</Paragraph>
        ) : (
          <ScrollView>
            {templates.map((template) => (
              <XStack
                key={template.id}
                jc="space-between"
                ai="center"
                p="$2"
                borderBottomWidth={1}
                borderColor="$gray5"
              >
                <Paragraph>{template.name}</Paragraph>
                <XStack gap="$2">
                  <Button
                    onPress={() =>
                      router.push('/notes/templates/edit', { query: { id: template.id } })
                    }
                  >
                    Edit
                  </Button>
                  <Button theme="danger" onPress={() => handleDeleteTemplate(template.id)}>
                    Delete
                  </Button>
                </XStack>
              </XStack>
            ))}
          </ScrollView>
        )}
      </YStack>
    </PageWrapper>
  )
}
