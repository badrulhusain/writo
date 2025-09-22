"use client";

import React from 'react'
import { useCurrentUser } from '@/hooks/use-current-user'
import { UserInfo } from '@/components/user-info'

function Dashboard() {
  const user = useCurrentUser();

  return (
    <UserInfo user={user} label="User Details" />
  )
}

export default Dashboard