'use client'

import { useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Loader } from 'lucide-react'
import { useGetWorkspaces, useWorkspaceModalStore } from '@/entities/workspace'

export default function Home() {
  const router = useRouter()
  const [open, setOpen] = useWorkspaceModalStore()

  const { data, isLoading } = useGetWorkspaces()

  const workspaceId = useMemo(() => data?.[0]?._id, [data])

  useEffect(() => {
    if (isLoading) return

    if (workspaceId) {
      router.replace(`/workspace/${workspaceId}`)
    } else if (!open) {
      setOpen(true)
    }
  }, [workspaceId, isLoading, open, setOpen, router])

  return (
    <div className='flex h-full items-center justify-center'>
      <Loader className='text-muted-foreground size-6 animate-spin' />
    </div>
  )
}
