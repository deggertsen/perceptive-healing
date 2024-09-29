import React from 'react'
import { Dialog, Sheet, useMedia, YStack, styled, Text } from 'tamagui'

type ModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
  title?: string
}

export const Modal = ({ open, onOpenChange, children, title }: ModalProps) => {
  const media = useMedia()

  if (media.gtMd) {
    return (
      <Dialog modal open={open} onOpenChange={onOpenChange}>
        <Dialog.Portal>
          <Dialog.Overlay key="overlay" animation="quick" opacity={0.5} />
          <Dialog.Content
            bordered
            elevate
            key="content"
            animation={[
              'quick',
              {
                opacity: {
                  overshootClamping: true,
                },
              },
            ]}
            enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
            exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
            x={0}
            y={0}
            opacity={1}
            scale={1}
            w={400}
          >
            {title && <Dialog.Title>{title}</Dialog.Title>}
            <YStack space>{children}</YStack>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
    )
  }

  return (
    <Sheet modal open={open} onOpenChange={onOpenChange} snapPoints={[80]} position={0}>
      <Sheet.Overlay />
      <Sheet.Frame ai="center" jc="center">
        <Sheet.Handle />
        <YStack gap="$4" maw={600}>
          {title && <Text>{title}</Text>}
          {children}
        </YStack>
      </Sheet.Frame>
    </Sheet>
  )
}

export const ModalTrigger = styled(Dialog.Trigger, {
  name: 'ModalTrigger',
})

export const ModalClose = styled(Dialog.Close, {
  name: 'ModalClose',
})
