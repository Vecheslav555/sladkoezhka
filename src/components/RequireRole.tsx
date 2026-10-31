import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import type { RootState } from '../app/store'
import type { Role } from '../entities/authSlice'

export default function RequireRole({ roles, children }: { roles: Role[]; children: ReactNode }) {
  const auth = useSelector((s: RootState) => s.auth)
  const loc = useLocation()
  if (!roles.includes(auth.role)) {
    return <Navigate to="/login" state={{ from: loc.pathname }} replace />
  }
  return <>{children}</>
}