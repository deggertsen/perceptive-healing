import type React from 'react'
import { XStack, YStack, useMedia } from 'tamagui'
import { BottomTabs } from '../navigation/BottomTabs'
import { TopNavBar } from '../navigation/TopNavBar'

export function PageWrapper({ children }: { children: React.ReactNode }) {
  const media = useMedia()

  return (
    <YStack f={1}>
      {media.gtMd && <TopNavBar />}
      <XStack f={1} ai="stretch">
        {children}
      </XStack>
      {!media.gtMd && <BottomTabs />}
    </YStack>
  )
}
