import { ReactNode } from 'react'
import { Button } from 'react-aria-components'

import { useAuth } from '@app/hooks/useAuth'
import { useNavigate } from '@tanstack/react-router'

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
        <Button className="react-aria-Button" onPress={logout}>
          Logout
        </Button>
      </div>
      {children}
    </>
  )
}
