import React, { createContext, useContext } from 'react'
import { useAuth } from '../hooks/useAuth'
import { FirebaseAuthTypes } from '@react-native-firebase/auth'

type AuthContextType = {
  user: FirebaseAuthTypes.User | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth()

  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
}

export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}
