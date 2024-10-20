import { ReactNode } from 'react'
import { useNavigate } from '@tanstack/react-router'

import { useAuth } from '@app/hooks/useAuth'
import OButton from '@app/components/OButton'

interface ProtectedRouteProps {
  children: ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const isServerSideRendering = typeof window === 'undefined'

  if (!isServerSideRendering && !isAuthenticated()) {
    navigate({ to: '/' })
    return null
  }

  return (
    <>
      <div className="mt-3 mr-2.5 flex justify-end">
        <OButton onPress={logout}>Logout</OButton>
      </div>
      {children}
    </>
  )
}
