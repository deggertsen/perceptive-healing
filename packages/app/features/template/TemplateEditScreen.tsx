import { supabase } from '@my/config'
import {
  Button,
  H1,
  Input,
  Label,
  Paragraph,
  ScrollView,
  XStack,
  YStack,
  useToastController,
} from '@my/ui'
import React, { useEffect, useState } from 'react'
import { createParam } from 'solito'
import { useRouter } from 'solito/router'
import { useAuthContext } from '../../provider/AuthProvider'
import { PageWrapper } from '../../provider/PageWrapper'
import type { Template, TemplateField } from './types'

// Include the Template and TemplateField interfaces here

const { useParams } = createParam<{ id: string }>()

export function TemplateEditScreen() {
  const { user } = useAuthContext()
  const [template, setTemplate] = useState<Template | null>(null)
  const [loading, setLoading] = useState(true)
  const toast = useToastController()
  const router = useRouter()
  const { params } = useParams()
  const id = params.id

  useEffect(() => {
    if (id !== 'new') {
      fetchTemplate()
    } else {
      setTemplate({
        id: '',
        user_id: user?.id || '',
        name: '',
        fields: [],
        is_default: false,
        created_at: '',
        updated_at: '',
      })
      setLoading(false)
    }
  }, [id, user?.id])

  const fetchTemplate = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('note_templates')
        .select('*')
        .eq('id', id)
        .eq('user_id', user?.id)
        .single()

      if (error) throw error
      setTemplate(data)
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
    if (!template) return

    try {
      setLoading(true)
      const { error } =
        id === 'new'
          ? await supabase.from('note_templates').insert(template)
          : await supabase.from('note_templates').update(template).eq('id', template.id)

      if (error) throw error

      toast.show('Success', {
        message: `Template ${id === 'new' ? 'created' : 'updated'} successfully`,
        type: 'success',
      })
      router.push('/notes/templates')
    } catch (err) {
      toast.show('Error', {
        message: err.message,
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddField = () => {
    if (!template) return
    const newField: TemplateField = {
      id: Date.now().toString(),
      name: '',
      type: 'text',
      order: template.fields.length,
    }
    setTemplate({ ...template, fields: [...template.fields, newField] })
  }

  const handleUpdateField = (index: number, field: Partial<TemplateField>) => {
    if (!template) return
    const updatedFields = [...template.fields]
    updatedFields[index] = { ...updatedFields[index], ...field }
    setTemplate({ ...template, fields: updatedFields })
  }

  const handleDeleteField = (index: number) => {
    if (!template) return
    const updatedFields = template.fields.filter((_, i) => i !== index)
    setTemplate({ ...template, fields: updatedFields })
  }

  if (loading) return <Paragraph>Loading...</Paragraph>
  if (!template) return <Paragraph>Template not found</Paragraph>

  return (
    <PageWrapper>
      <ScrollView>
        <YStack f={1} jc="flex-start" ai="stretch" p="$4" gap="$4">
          <H1>{id === 'new' ? 'Create Template' : 'Edit Template'}</H1>
          <Label htmlFor="templateName">Template Name</Label>
          <Input
            id="templateName"
            value={template.name}
            onChangeText={(text) => setTemplate({ ...template, name: text })}
          />
          <H1>Fields</H1>
          {template.fields.map((field, index) => (
            <YStack key={field.id} gap="$2">
              <Input
                value={field.name}
                onChangeText={(text) => handleUpdateField(index, { name: text })}
                placeholder="Field Name"
              />
              <XStack gap="$2">
                <Button onPress={() => handleDeleteField(index)}>Delete</Button>
                {/* Add more field type options here */}
              </XStack>
            </YStack>
          ))}
          <Button onPress={handleAddField}>Add Field</Button>
          <XStack gap="$2">
            <Button theme="alt1" onPress={() => router.push('/notes/templates')}>
              Cancel
            </Button>
            <Button theme="active" onPress={handleSave}>
              Save Template
            </Button>
          </XStack>
        </YStack>
      </ScrollView>
    </PageWrapper>
  )
}
