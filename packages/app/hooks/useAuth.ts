import { supabase } from '@my/config'
import type { Session, User } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isAnonymous, setIsAnonymous] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setIsAnonymous(session?.user?.aud === 'authenticated' && !!session?.user?.is_anonymous)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setIsAnonymous(session?.user?.aud === 'authenticated' && !!session?.user?.is_anonymous)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function signInAnonymously() {
    const { data, error } = await supabase.auth.signInAnonymously()
    if (error) throw error
    setIsAnonymous(true)
    return data
  }

  async function convertAnonymousUser(email: string, password: string) {
    if (!isAnonymous) throw new Error('User is not anonymous')

    const { data, error } = await supabase.auth.updateUser({ email, password })
    if (error) throw error
    setIsAnonymous(false)
    return data
  }

  async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    setIsAnonymous(false)
    return data
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    setIsAnonymous(false)
  }

  async function signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
    setIsAnonymous(false)
    return data
  }

  return {
    user,
    signIn,
    signOut,
    signUp,
    signInAnonymously,
    convertAnonymousUser,
    isAnonymous,
    session,
  }
}
