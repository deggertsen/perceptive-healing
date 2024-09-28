import { useEffect, useState } from 'react'
import { FirebaseOptions, initializeApp } from 'firebase/app'
import { firebaseConfig } from '../config/env'
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  User,
  createUserWithEmailAndPassword as firebaseCreateUserWithEmailAndPassword,
} from 'firebase/auth'

const firebaseApp = initializeApp(firebaseConfig as FirebaseOptions)
const firebaseAuth = getAuth(firebaseApp)

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged(setUser)
    return unsubscribe
  }, [])

  async function signIn(email: string, password: string) {
    try {
      await signInWithEmailAndPassword(firebaseAuth, email, password)
      console.info('Successfully signed in!')
    } catch (error) {
      console.error('Error signing in:', error)
      throw error
    }
  }

  async function signOut() {
    try {
      await firebaseSignOut(firebaseAuth)
      console.info('Successfully signed out!')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  async function createUserWithEmailAndPassword(email: string, password: string) {
    try {
      await firebaseCreateUserWithEmailAndPassword(firebaseAuth, email, password)
      console.info('Successfully signed up!')
    } catch (error) {
      console.error('Error signing up:', error)
      throw error
    }
  }

  return { user, signIn, signOut, createUserWithEmailAndPassword }
}
