import { supabase } from '@/utils/supabase/supabase'
import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router'
import { ADMIN_MENU_ITEMS } from '@/constants/menuItems'

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
        // Navigate to the first menu item
        navigate(ADMIN_MENU_ITEMS[0].path)
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
