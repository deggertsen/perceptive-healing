import { NoteListScreen } from 'app/features/note/NoteListScreen'
import { Stack } from 'expo-router'

export default function Screen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Notes',
        }}
      />
      <NoteListScreen />
    </>
  )
}
