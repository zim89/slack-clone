'use client'

import { useEffect, useState } from 'react'
import { WorkspaceModal } from '@/features/workspace'

export const Modals = () => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <>
      <WorkspaceModal />
    </>
  )
}
