import React, { useRef, useState } from 'react'
import { Button, Paragraph, YStack, Input, H1, XStack } from '@my/ui'
import { useAuthContext } from '../../provider/AuthProvider'
import { useRouter } from 'solito/navigation'

export function SignInScreen() {
  const { signIn } = useAuthContext()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const passwordInputRef = useRef<Input>(null)

  const handleSignIn = async () => {
    setLoading(true)
    setError(null)
    try {
      await signIn(email, password)
      router.push('/user') // Redirect to user dashboard or home
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign-in.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <YStack f={1} jc="center" ai="center" gap="$6" p="$4" bg="$background">
      <H1 ta="center" col="$blue10">
        Sign In
      </H1>
      {error && (
        <Paragraph ta="center" color="$red10">
          {error}
        </Paragraph>
      )}
      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        inputMode="email"
        autoCapitalize="none"
        autoCorrect={false}
        width={300}
        textContentType="emailAddress"
        returnKeyType="next"
        onSubmitEditing={() => passwordInputRef.current?.focus()}
        autoFocus
      />
      <Input
        ref={passwordInputRef}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
        width={300}
        textContentType="password"
        returnKeyType="done"
        onSubmitEditing={handleSignIn}
      />
      <Button onPress={handleSignIn} disabled={loading}>
        {loading ? 'Signing In...' : 'Sign In'}
      </Button>
      <XStack>
        <Paragraph ta="center">Don't have an account? </Paragraph>
        <Button onPress={() => router.push('/user/sign-up')}>Sign Up</Button>
      </XStack>
    </YStack>
  )
}
