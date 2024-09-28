import React, { createContext, useContext } from 'react'
import { useAuth } from '../hooks/useAuth'
import { FirebaseAuthTypes } from '@react-native-firebase/auth'

type AuthContextType = {
  user: FirebaseAuthTypes.User | null
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, signIn, signOut } = useAuth()

  return <AuthContext.Provider value={{ user, signIn, signOut }}>{children}</AuthContext.Provider>
}

export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}
