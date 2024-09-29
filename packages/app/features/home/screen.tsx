import {
  Button,
  H1,
  Paragraph,
  Separator,
  SwitchThemeButton,
  SwitchRouterButton,
  XStack,
  YStack,
} from '@my/ui'
import { useAuthContext } from '../../provider/AuthProvider'
import { Platform } from 'react-native'
import { useLink } from 'solito/navigation'

export function HomeScreen({ pagesMode = false }: { pagesMode?: boolean }) {
  const { user } = useAuthContext()
  const linkProps = useLink({
    href: `/user`,
  })

  const signInLink = useLink({
    href: '/user/sign-in',
  })

  const signUpLink = useLink({
    href: '/user/sign-up',
  })

  const clientListLink = useLink({
    href: '/client',
  })

  return (
    <YStack f={1} jc="center" ai="center" gap="$8" p="$4" bg="$background">
      <XStack
        pos="absolute"
        w="100%"
        t="$6"
        gap="$6"
        jc="center"
        fw="wrap"
        $sm={{ pos: 'relative', t: 0 }}
      >
        <SwitchThemeButton />
      </XStack>

      <YStack gap="$4" ai="center">
        <H1 ta="center" col="$color12">
          Body Work SOAP Notes
        </H1>
        <Paragraph col="$color10" ta="center">
          An app to help body work practitioners with client intake, SOAP notes, and keeping track
          of client progress over time.
        </Paragraph>
        <Separator />
      </YStack>

      <Button {...linkProps}>Link to user</Button>

      <Button {...clientListLink}>Client List</Button>

      {user?.isAnonymous && (
        <XStack gap="$4">
          <Button {...signInLink}>Sign In</Button>
          <Button {...signUpLink}>Sign Up</Button>
        </XStack>
      )}
    </YStack>
  )
}
