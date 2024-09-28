import { useEffect, useState } from 'react'
import { FirebaseAuthTypes } from '@react-native-firebase/auth'
import auth from '@react-native-firebase/auth'

const firebaseAuth = auth()

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

  async function createUserWithEmailAndPassword(email: string, password: string) {
    try {
      await firebaseAuth.createUserWithEmailAndPassword(email, password)
      console.info('Successfully signed up!')
    } catch (error) {
      console.error('Error signing up:', error)
      throw error
    }
  }

  return { user, signIn, signOut, createUserWithEmailAndPassword }
}
