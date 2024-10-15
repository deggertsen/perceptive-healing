import { NoteEditScreen } from 'app/features/note/NoteEditScreen'
import { Stack } from 'expo-router'

export default function Screen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Edit Note',
        }}
      />
      <NoteEditScreen />
    </>
  )
}
