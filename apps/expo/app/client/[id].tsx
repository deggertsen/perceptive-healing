import { ClientDetailScreen } from 'app/features/client/ClientDetailScreen'
import { Stack } from 'expo-router'

export default function Screen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Client Details',
        }}
      />
      <ClientDetailScreen />
    </>
  )
}
