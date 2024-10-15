import type React from 'react'
import { createContext, useContext } from 'react'
import { Button, Dialog, Sheet, Text, YStack, useMedia } from 'tamagui'

type ModalContextType = {
  isDialog: boolean
  onOpenChange: (open: boolean) => void
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

export const useModalContext = () => {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error('useModalContext must be used within a ModalProvider')
  }
  return context
}

const ModalProvider = ({
  isDialog,
  onOpenChange,
  children,
}: {
  isDialog: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}) => <ModalContext.Provider value={{ isDialog, onOpenChange }}>{children}</ModalContext.Provider>

type ModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
  title?: string
}

export const Modal = ({ open, onOpenChange, children, title }: ModalProps) => {
  const { gtMd } = useMedia()
  const isDialog = gtMd

  return (
    <ModalProvider isDialog={isDialog} onOpenChange={onOpenChange}>
      {isDialog ? (
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
              <YStack gap="$4">{children}</YStack>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog>
      ) : (
        <Sheet modal open={open} onOpenChange={onOpenChange} snapPoints={[80]} position={0}>
          <Sheet.Overlay />
          <Sheet.Frame ai="center" jc="center">
            <Sheet.Handle />
            <YStack gap="$4" w="100%" p="$4">
              {title && <Text>{title}</Text>}
              {children}
            </YStack>
          </Sheet.Frame>
        </Sheet>
      )}
    </ModalProvider>
  )
}
export const ModalClose = ({ children, ...props }) => {
  const { onOpenChange } = useModalContext()

  const handleClose = () => {
    onOpenChange(false)
  }

  return (
    <Button onPress={handleClose} {...props}>
      {children}
    </Button>
  )
}

export const ModalTrigger = ({ children, ...props }) => {
  const { onOpenChange } = useModalContext()

  const handleOpen = () => {
    onOpenChange(true)
  }

  return (
    <Button onPress={handleOpen} {...props}>
      {children}
    </Button>
  )
}
