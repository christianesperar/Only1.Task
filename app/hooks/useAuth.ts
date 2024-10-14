import { useNavigate } from '@tanstack/react-router'
import Cookies from 'js-cookie'

export function useAuth() {
  const navigate = useNavigate()

  const login = (token: string) => {
    Cookies.set('authToken', token)
  }

  const logout = () => {
    Cookies.remove('authToken')
    navigate({ to: '/' })
  }

  const getUserToken = () => {
    return Cookies.get('authToken')
  }

  const isAuthenticated = () => {
    return !!getUserToken()
  }

  return { login, logout, getUserToken, isAuthenticated }
}
