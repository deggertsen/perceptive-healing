import type { Session, User, WeakPassword } from '@supabase/supabase-js'
import type React from 'react'
import { createContext, useContext, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'

type AuthContextType = {
  user: User | null
  signIn: (
    email: string,
    password: string,
  ) => Promise<{
    user: User
    session: Session
    weakPassword?: WeakPassword
  }>
  signOut: () => Promise<void>
  signUp: (
    email: string,
    password: string,
  ) => Promise<{
    user: User | null
    session: Session | null
  }>
  signInAnonymously: () => Promise<{ user: User | null; session: Session | null }>
  convertAnonymousUser: (email: string, password: string) => Promise<{ user: User | null }>
  isAnonymous: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, signIn, signOut, signUp, signInAnonymously, convertAnonymousUser, isAnonymous } =
    useAuth()

  useEffect(() => {
    if (!user) {
      signInAnonymously()
    }
  }, [user, signInAnonymously])

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signOut,
        signUp,
        signInAnonymously,
        convertAnonymousUser,
        isAnonymous,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}
