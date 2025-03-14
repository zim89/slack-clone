'use client'

import { useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { UserButton } from '@/features/user'
import { useGetWorkspaces, useWorkspaceModalStore } from '@/features/workspace'
import { appRoutes } from '@/shared/config'

export default function Home() {
  const [open, setOpen] = useWorkspaceModalStore()
  const { data, isLoading } = useGetWorkspaces()
  const router = useRouter()

  const workspacesId = useMemo(() => data?.[0]?._id, [data])

  useEffect(() => {
    if (isLoading) return

    if (workspacesId) {
      router.replace(`${appRoutes.workspace}/${workspacesId}`)
    } else if (!open) {
      setOpen(true)
    }
  }, [isLoading, open, router, setOpen, workspacesId])

  return (
    <div>
      <h1>Home page</h1>
      <UserButton />
    </div>
  )
}
