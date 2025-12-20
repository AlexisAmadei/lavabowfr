import { Toaster } from '@/components/ui/toaster'
import { supabase } from '@/utils/supabase/supabase'
import { useEffect } from 'react'
import { Outlet, useNavigate, useResolvedPath } from 'react-router'

export default function AdminLayout() {
  const navigate = useNavigate()
  // @ts-ignore
  const path = useResolvedPath()

  const getUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  }

  useEffect(() => {
    async function fetchUser() {
      const user = await getUser()
      if (!user) {
        navigate('/admin/login')
      } else if (user && path.pathname === '/admin')
        navigate('/admin/dashboard')
    }
    fetchUser()
  }, [navigate, path.pathname])
  return (
    <>
      <Outlet />
      <Toaster />
    </>
  )
}
