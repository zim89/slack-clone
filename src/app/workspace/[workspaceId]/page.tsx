'use client'

import { useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Loader, TriangleAlert } from 'lucide-react'
import { useChannelModalState, useGetChannels } from '@/entities/channel'
import { useCurrentMember } from '@/entities/member'
import { useGetWorkspace } from '@/entities/workspace'
import { useWorkspaceId } from '@/shared/hooks/use-workspace-id'

const WorkspaceIdPage = () => {
  const router = useRouter()
  const workspaceId = useWorkspaceId()
  const [open, setOpen] = useChannelModalState()

  const { data: member, isLoading: memberLoading } = useCurrentMember({
    workspaceId,
  })
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({
    id: workspaceId,
  })
  const { data: channels, isLoading: channelsLoading } = useGetChannels({
    workspaceId,
  })

  const channelId = useMemo(() => channels?.[0]?._id, [channels])
  const isAdmin = useMemo(() => member?.role === 'admin', [member?.role])

  useEffect(() => {
    if (
      workspaceLoading ||
      channelsLoading ||
      memberLoading ||
      !member ||
      !workspace
    )
      return

    if (channelId) {
      router.push(`/workspace/${workspaceId}/channel/${channelId}`)
    } else if (!open && isAdmin) {
      setOpen(true)
    }
  }, [
    member,
    memberLoading,
    isAdmin,
    channelId,
    workspaceLoading,
    channelsLoading,
    workspace,
    open,
    setOpen,
    router,
    workspaceId,
  ])

  if (workspaceLoading || channelsLoading || memberLoading) {
    return (
      <div className='flex h-full flex-1 flex-col items-center justify-center gap-2'>
        <Loader className='text-muted-foreground size-6 animate-spin' />
      </div>
    )
  }

  if (!workspace || !member) {
    return (
      <div className='flex h-full flex-1 flex-col items-center justify-center gap-2'>
        <TriangleAlert className='text-muted-foreground size-6' />
        <span className='text-muted-foreground text-sm'>
          Workspace not found
        </span>
      </div>
    )
  }

  return (
    <div className='flex h-full flex-1 flex-col items-center justify-center gap-2'>
      <TriangleAlert className='text-muted-foreground size-6' />
      <span className='text-muted-foreground text-sm'>No channel found</span>
    </div>
  )
}

export default WorkspaceIdPage
