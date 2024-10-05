import React from 'react'
import { useRouter } from 'solito/navigation'
import { useAuthContext } from '../provider/AuthProvider'

type ProtectedRouteProps = {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user } = useAuthContext()
  const router = useRouter()

  React.useEffect(() => {
    if (user === null) {
      router.replace('/sign-in')
    }
  }, [user, router])

  if (user === undefined) {
    // Optionally, show a loading indicator
    return null
  }

  return <>{user ? children : null}</>
}
