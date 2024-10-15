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
  Select,
} from '@my/ui'
import React, { useEffect, useRef, useState } from 'react'
import { Animated, PanResponder } from 'react-native'
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

  const [dragging, setDragging] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  const pan = useRef(new Animated.ValueXY()).current

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (_, gestureState) => {
        setDragging(true)
        setDraggedIndex(Math.floor(gestureState.y0 / 50)) // Assuming each item is 50 pixels high
      },
      onPanResponderMove: Animated.event([null, { dy: pan.y }], { useNativeDriver: false }),
      onPanResponderRelease: (_, gestureState) => {
        setDragging(false)
        const newIndex = Math.floor((gestureState.moveY - 100) / 50) // Adjust based on your layout
        if (
          draggedIndex !== null &&
          newIndex !== draggedIndex &&
          newIndex >= 0 &&
          template &&
          newIndex < template.fields.length
        ) {
          const newFields = [...template.fields]
          const [reorderedItem] = newFields.splice(draggedIndex, 1)
          newFields.splice(newIndex, 0, reorderedItem)
          setTemplate({ ...template, fields: newFields })
        }
        setDraggedIndex(null)
        pan.setValue({ x: 0, y: 0 })
      },
    }),
  ).current

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
      placeholder: '',
      default_value: '',
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
            <Animated.View
              key={field.id}
              style={[
                draggedIndex === index ? { transform: [{ translateY: pan.y }] } : undefined,
                { opacity: dragging && draggedIndex === index ? 0.5 : 1 },
              ]}
              {...panResponder.panHandlers}
            >
              <YStack gap="$2">
                <Input
                  value={field.name}
                  onChangeText={(text) => handleUpdateField(index, { name: text })}
                  placeholder="Field Name"
                />
                <Select
                  value={field.type}
                  onValueChange={(value) =>
                    handleUpdateField(index, { type: value as TemplateField['type'] })
                  }
                >
                  <Select.Trigger>
                    <Select.Value placeholder="Select field type" />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Item index={0} key="text" value="text">
                      <Select.ItemText>Text</Select.ItemText>
                    </Select.Item>
                    <Select.Item index={1} key="multiline" value="multiline">
                      <Select.ItemText>Multiline</Select.ItemText>
                    </Select.Item>
                    <Select.Item index={2} key="number" value="number">
                      <Select.ItemText>Number</Select.ItemText>
                    </Select.Item>
                    <Select.Item index={3} key="checkbox" value="checkbox">
                      <Select.ItemText>Checkbox</Select.ItemText>
                    </Select.Item>
                    <Select.Item index={4} key="date" value="date">
                      <Select.ItemText>Date</Select.ItemText>
                    </Select.Item>
                  </Select.Content>
                </Select>
                <Input
                  value={field.placeholder}
                  onChangeText={(text) => handleUpdateField(index, { placeholder: text })}
                  placeholder="Placeholder (optional)"
                />
                <Input
                  value={field.default_value}
                  onChangeText={(text) => handleUpdateField(index, { default_value: text })}
                  placeholder="Default Value (optional)"
                />
                <XStack gap="$2">
                  <Button onPress={() => handleDeleteField(index)}>Delete</Button>
                </XStack>
              </YStack>
            </Animated.View>
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
