import { TemplateManagementScreen } from 'app/features/template/TemplateManagementScreen'
import { Stack } from 'expo-router'

export default function Screen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Note Templates',
        }}
      />
      <TemplateManagementScreen />
    </>
  )
}
