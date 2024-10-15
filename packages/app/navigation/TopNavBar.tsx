import { useLink } from 'solito/navigation'
import { Button, XStack } from 'tamagui'
import { useAuthContext } from '../provider/AuthProvider'

export function TopNavBar() {
  const { isAnonymous } = useAuthContext()

  const clientsLink = useLink({
    href: '/client',
  })

  const notesLink = useLink({
    href: '/notes',
  })

  const accountLink = useLink({
    href: isAnonymous ? '/sign-in' : '/user',
  })

  return (
    <XStack
      gap="$4"
      justifyContent="flex-end"
      alignItems="center"
      paddingHorizontal="$4"
      paddingVertical="$2"
      backgroundColor="$background"
    >
      <Button {...clientsLink}>Clients</Button>
      <Button {...notesLink}>Notes</Button>
      <Button {...accountLink}>Account</Button>
    </XStack>
  )
}
