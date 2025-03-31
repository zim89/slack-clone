'use client'

import { Loader, TriangleAlert } from 'lucide-react'
import { MessageList } from '@/widgets/message-list'
import { useGetChannel } from '@/entities/channel'
import { useGetMessages } from '@/entities/message'
import { useChannelId } from '@/shared/hooks/use-channel-id'
import { ChatInput } from './chat-input'
import { Header } from './header'

const Page = () => {
  const channelId = useChannelId()

  const { results, status, loadMore } = useGetMessages({ channelId })
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
      <MessageList
        channelName={channel.name}
        channelCreationTime={channel._creationTime}
        data={results}
        loadMore={loadMore}
        isLoadingMore={status === 'LoadingMore'}
        canLoadMore={status === 'CanLoadMore'}
      />
      <ChatInput placeholder={`Message #${channel.name}`} />
    </div>
  )
}

export default Page
