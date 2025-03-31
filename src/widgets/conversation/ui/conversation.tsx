import { Loader } from 'lucide-react'
import { Id } from '@convex/_generated/dataModel'
import { MessageList, usePanel } from '@/widgets/message-list'
import { useGetMember } from '@/entities/member'
import { useGetMessages } from '@/entities/message'
import { useMemberId } from '@/shared/hooks'
import { ChatInput } from './chat-input'
import { Header } from './header'

interface Props {
  id: Id<'conversations'>
}

export const Conversation = ({ id }: Props) => {
  const memberId = useMemberId()

  const { onOpenProfile } = usePanel()

  const { data: member, isLoading: memberLoading } = useGetMember({
    id: memberId,
  })
  const { results, status, loadMore } = useGetMessages({
    conversationId: id,
  })

  if (memberLoading || status === 'LoadingFirstPage') {
    return (
      <div className='flex h-full items-center justify-center'>
        <Loader className='text-muted-foreground size-6 animate-spin' />
      </div>
    )
  }

  return (
    <div className='flex h-full flex-col'>
      <Header
        memberName={member?.user.name}
        memberImage={member?.user.image}
        onClick={() => onOpenProfile(memberId)}
      />
      <MessageList
        data={results}
        variant='conversation'
        memberImage={member?.user.image}
        memberName={member?.user.name}
        loadMore={loadMore}
        isLoadingMore={status === 'LoadingMore'}
        canLoadMore={status === 'CanLoadMore'}
      />
      <ChatInput
        placeholder={`Message ${member?.user.name}`}
        conversationId={id}
      />
    </div>
  )
}
