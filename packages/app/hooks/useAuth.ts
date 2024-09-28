import { useEffect, useState } from 'react'
import { firebaseAuth } from '../config/firebaseConfig'
import { FirebaseAuthTypes } from '@react-native-firebase/auth'

export function useAuth() {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null)

  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged(setUser)
    return unsubscribe
  }, [])

  async function signIn(email: string, password: string) {
    try {
      await firebaseAuth.signInWithEmailAndPassword(email, password)
      console.info('Successfully signed in!')
    } catch (error) {
      console.error('Error signing in:', error)
      throw error
    }
  }

  async function signOut() {
    try {
      await firebaseAuth.signOut()
      console.info('Successfully signed out!')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return { user, signIn, signOut }
}
