import { Button, H1, Input, Paragraph, XStack, YStack } from '@my/ui'
import React, { useRef, useState } from 'react'
import { useRouter } from 'solito/navigation'
import { useAuthContext } from '../../provider/AuthProvider'

export function SignUpScreen() {
  const { signUp, signIn } = useAuthContext()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const passwordInputRef = useRef<Input>(null)
  const confirmPasswordInputRef = useRef<Input>(null)

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    setError(null)
    try {
      await signUp(email, password)
      await signIn(email, password)
      router.push('/')
    } catch (err) {
      setError(err.message || 'An error occurred during sign-up.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <YStack f={1} jc="center" ai="center" gap="$6" p="$4" bg="$background">
      <H1 ta="center" col="$purple10">
        Sign Up
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
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
        width={300}
        textContentType="password"
        returnKeyType="next"
        onSubmitEditing={() => confirmPasswordInputRef.current?.focus()}
      />
      <Input
        ref={confirmPasswordInputRef}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
        width={300}
        textContentType="password"
        returnKeyType="done"
        onSubmitEditing={handleSignUp}
      />
      <Button onPress={handleSignUp} disabled={loading}>
        {loading ? 'Signing Up...' : 'Sign Up'}
      </Button>
      <XStack>
        <Paragraph ta="center">Already have an account? </Paragraph>
        <Button onPress={() => router.push('/sign-in')}>Sign In</Button>
      </XStack>
    </YStack>
  )
}
