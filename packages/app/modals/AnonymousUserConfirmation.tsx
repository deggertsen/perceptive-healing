import { Button, Modal, ModalClose, Paragraph, XStack, YStack } from '@my/ui'
import { useEffect, useState } from 'react'
import { useRouter } from 'solito/navigation'
import { getItem, setItem } from '../helpers/AsyncStorage'

export const AnonymousUserConfirmation = ({ isAnonymousUser }: { isAnonymousUser: boolean }) => {
  const router = useRouter()

  const navigateToSignIn = () => {
    router.push('/sign-in')
  }

  const [isOpen, setIsOpen] = useState(false)

  /* Check from local storage if they have already seen this if they are an anonymous user */
  useEffect(() => {
    if (isAnonymousUser) {
      const checkIfHasSeen = async () => {
        const hasSeen = await getItem('hasSeenAnonymousUserConfirmation')
        /* If they have seen it in the last 24 hours, don't show it */
        if (
          hasSeen &&
          new Date().getTime() - new Date(hasSeen as string).getTime() > 1000 * 60 * 60 * 24
        ) {
          setIsOpen(true)
          setItem('hasSeenAnonymousUserConfirmation', new Date().toISOString())
        }
      }
      checkIfHasSeen()
    }
  }, [isAnonymousUser])

  if (!isAnonymousUser) return null

  return (
    <Modal open={isOpen} onOpenChange={setIsOpen} title="Confirm">
      <YStack gap="$4">
        <Paragraph>
          You are not logged in so your data will not be saved. Please sign so that your data will
          be saved.
        </Paragraph>
        <XStack gap="$4">
          <ModalClose>
            <Button.Text theme="alt1">I Understand</Button.Text>
          </ModalClose>
          <Button theme="danger" onPress={navigateToSignIn}>
            Sign In
          </Button>
        </XStack>
      </YStack>
    </Modal>
  )
}
