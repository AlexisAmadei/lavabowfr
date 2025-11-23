import { supabase } from '@/utils/supabase/supabase'
import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router'

export default function AdminLayout() {
  const navigate = useNavigate()

  const getUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    console.log('Current user:', user)
    return user
  }

  useEffect(() => {
    async function fetchUser() {
      const user = await getUser()
      if (!user) {
        navigate('/admin/login')
      } else {
        navigate()
      }
    }
    fetchUser()
  }, [navigate])

  return (
    <>
      <Outlet />
    </>
  )
}
