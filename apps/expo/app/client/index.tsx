import { ClientListScreen } from 'app/features/client/ClientListScreen'
import { Stack } from 'expo-router'

export default function Screen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Client List',
        }}
      />
      <ClientListScreen />
    </>
  )
}
