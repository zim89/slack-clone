'use client'

import { Loader, TriangleAlert } from 'lucide-react'
import { useGetChannel } from '@/entities/channel'
import { useChannelId } from '@/shared/hooks/use-channel-id'
import { ChatInput } from './chat-input'
import { Header } from './header'

const Page = () => {
  const channelId = useChannelId()

  // TODO: get messages hook
  const { data: channel, isLoading: channelLoading } = useGetChannel({
    id: channelId,
  })

  if (channelLoading || status === 'LoadingFirstPage') {
    return (
      <div className='flex h-full flex-1 items-center justify-center'>
        <Loader className='text-muted-foreground size-5 animate-spin' />
      </div>
    )
  }

  if (!channel) {
    return (
      <div className='flex h-full flex-1 flex-col items-center justify-center gap-y-2'>
        <TriangleAlert className='text-muted-foreground size-5' />
        <span className='text-muted-foreground text-sm'>Channel not found</span>
      </div>
    )
  }

  return (
    <div className='flex h-full flex-col'>
      <Header title={channel.name} />
      {/* //TODO: chat list component */}
      <ChatInput placeholder={`Message #${channel.name}`} />
    </div>
  )
}

export default Page
