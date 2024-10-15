import { useLink } from 'solito/navigation'
import { Tabs, Text } from 'tamagui'
import { useAuthContext } from '../provider/AuthProvider'

export function BottomTabs() {
  const { isAnonymous } = useAuthContext()

  const clientsLink = useLink({
    href: '/client',
  })

  const notesLink = useLink({
    href: '/',
  })

  const accountLink = useLink({
    href: isAnonymous ? '/sign-in' : '/user',
  })

  return (
    <Tabs
      defaultValue="clients"
      orientation="horizontal"
      flexDirection="column"
      width="100%"
      height={50}
      position="absolute"
      bottom={0}
      left={0}
      right={0}
    >
      <Tabs.List>
        <Tabs.Tab value="clients">
          <Text {...clientsLink}>Clients</Text>
        </Tabs.Tab>
        <Tabs.Tab value="notes">
          <Text {...notesLink}>Notes</Text>
        </Tabs.Tab>
        <Tabs.Tab value="account">
          <Text {...accountLink}>Account</Text>
        </Tabs.Tab>
      </Tabs.List>
    </Tabs>
  )
}
