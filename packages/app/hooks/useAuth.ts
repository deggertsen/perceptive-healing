import { useEffect, useState } from 'react'
import { firebaseAuth } from '../config/firebaseConfig'
import { FirebaseAuthTypes } from '@react-native-firebase/auth'

export function useAuth() {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null)

  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged(setUser)
    return unsubscribe
  }, [])

  async function signOut() {
    try {
      await firebaseAuth.signOut()
      console.log('Successfully signed out!')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return { user, signOut }
}
