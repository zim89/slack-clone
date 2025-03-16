import {
  AlertTriangle,
  HashIcon,
  Loader,
  MessageSquareText,
  SendHorizontal,
} from 'lucide-react'
import { useChannelModalState, useGetChannels } from '@/entities/channel'
import { useCurrentMember, useGetMembers } from '@/entities/member'
import { useGetWorkspace } from '@/entities/workspace'
import { useChannelId, useMemberId, useWorkspaceId } from '@/shared/hooks'
import { AsideHeader } from './aside-header'
import { AsideItem } from './aside-item'
import { AsideSection } from './aside-section'
import { AsideUser } from './aside-user'

export const WorkspaceAside = () => {
  const memberId = useMemberId()
  const channelId = useChannelId()
  const workspaceId = useWorkspaceId()

  const [, setOpen] = useChannelModalState()

  const { data: member, isLoading: memberLoading } = useCurrentMember({
    workspaceId,
  })
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({
    id: workspaceId,
  })
  const { data: channels } = useGetChannels({ workspaceId })
  const { data: members } = useGetMembers({ workspaceId })

  if (workspaceLoading || memberLoading) {
    return (
      <div className='flex h-full flex-col items-center justify-center bg-[#5E2C5F]'>
        <Loader className='size-5 animate-spin text-white' />
      </div>
    )
  }

  if (!workspace || !member) {
    return (
      <div className='flex h-full flex-col items-center justify-center gap-y-2 bg-[#5E2C5F]'>
        <AlertTriangle className='size-5 text-white' />
        <p className='text-sm text-white'>Workspace not found</p>
      </div>
    )
  }

  return (
    <aside className='flex h-full flex-col bg-[#5E2C5F]'>
      <AsideHeader workspace={workspace} isAdmin={member.role === 'admin'} />

      <div className='mt-3 flex flex-col px-2'>
        <AsideItem label='Threads' icon={MessageSquareText} id='threads' />
        <AsideItem label='Drafts & Sent' icon={SendHorizontal} id='drafts' />
      </div>

      <AsideSection
        label='Channels'
        hint='New channel'
        onNew={member.role === 'admin' ? () => setOpen(true) : undefined}
      >
        {channels?.map(item => (
          <AsideItem
            key={item._id}
            icon={HashIcon}
            label={item.name}
            id={item._id}
            variant={channelId === item._id ? 'active' : 'default'}
          />
        ))}
      </AsideSection>

      <AsideSection label='Direct Messages' hint='New direct message'>
        {members?.map(item => (
          <AsideUser
            key={item._id}
            id={item._id}
            label={item.user.name}
            image={item.user.image}
            variant={item._id === memberId ? 'active' : 'default'}
          />
        ))}
      </AsideSection>
    </aside>
  )
}
