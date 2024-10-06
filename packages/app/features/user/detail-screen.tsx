import { Button, Paragraph, YStack } from '@my/ui'
import { useAuthContext } from '../../provider/AuthProvider'
import { ProtectedRoute } from '../../provider/ProtectedRoute'
import { PageWrapper } from '../../provider/PageWrapper'

export function UserDetailScreen() {
  const { user, signOut } = useAuthContext()

  return (
    <PageWrapper>
      <ProtectedRoute>
        <YStack f={1} jc="center" ai="center" gap="$4" bg="$background" p="$4">
        <Paragraph ta="center" fow="700" col="$blue10">
          Welcome, {user?.email}
        </Paragraph>
        <Button onPress={signOut}>Sign Out</Button>
        </YStack>
      </ProtectedRoute>
    </PageWrapper>
  )
}
