import { supabase } from '@my/config'
import { Button, H1, Paragraph, ScrollView, XStack, YStack, useToastController } from '@my/ui'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'solito/navigation'
import { useAuthContext } from '../../provider/AuthProvider'
import { PageWrapper } from '../../provider/PageWrapper'
import type { Note } from '../template/types'

export function NoteListScreen() {
  const { user } = useAuthContext()
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const toast = useToastController()
  const router = useRouter()

  useEffect(() => {
    fetchNotes()
  }, [])

  const fetchNotes = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setNotes(data || [])
    } catch (err) {
      toast.show('Error', {
        message: err.message,
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteNote = async (noteId: string) => {
    try {
      setLoading(true)
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', noteId)
        .eq('user_id', user?.id)

      if (error) throw error

      setNotes(notes.filter((n) => n.id !== noteId))
      toast.show('Note deleted', {
        message: 'Note has been successfully deleted.',
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
        <H1>Notes</H1>
        <Button onPress={() => router.push('/notes/edit')}>Add Note</Button>
        {loading ? (
          <Paragraph>Loading notes...</Paragraph>
        ) : (
          <ScrollView>
            {notes.map((note) => (
              <XStack
                key={note.id}
                jc="space-between"
                ai="center"
                p="$2"
                borderBottomWidth={1}
                borderColor="$gray5"
              >
                <Paragraph>{note.created_at}</Paragraph>
                <XStack gap="$2">
                  <Button onPress={() => router.push(`/notes/edit/${note.id}`)}>Edit</Button>
                  <Button theme="danger" onPress={() => handleDeleteNote(note.id)}>
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
