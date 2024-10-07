import { TemplateEditScreen } from 'app/features/template/TemplateEditScreen'
import { Stack } from 'expo-router'

export default function Screen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Edit Template',
        }}
      />
      <TemplateEditScreen />
    </>
  )
}
