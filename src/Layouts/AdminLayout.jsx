import { supabase } from '@/utils/supabase'
import React, { use, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router'

export default function AdminLayout() {
  const navigate = useNavigate()

  const getUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  }

  useEffect( () => {
    async function fetchUser() {
      const user = await getUser()
      console.log('user', user)
      if (!user) {
        navigate('/admin/login')
      }
    }
    fetchUser()
  }, [])

  return (
    <>
      <Outlet />
    </>
  )
}
