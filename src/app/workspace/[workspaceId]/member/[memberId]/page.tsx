'use client'

import { useEffect, useState } from 'react'
import { AlertTriangle, Loader } from 'lucide-react'
import { toast } from 'sonner'
import { Id } from '@convex/_generated/dataModel'
import { Conversation } from '@/widgets/conversation'
import { useCreateOrGetConversation } from '@/entities/conversation'
import { useMemberId, useWorkspaceId } from '@/shared/hooks'

const MemberIdPage = () => {
  const memberId = useMemberId()
  const workspaceId = useWorkspaceId()

  const [conversationId, setConversationId] =
    useState<Id<'conversations'> | null>(null)

  const { mutate, isPending } = useCreateOrGetConversation()

  useEffect(() => {
    mutate(
      {
        workspaceId,
        memberId,
      },
      {
        onSuccess(data) {
          setConversationId(data)
        },
        onError() {
          toast.error('Failed to create or get conversation')
        },
      },
    )
  }, [memberId, workspaceId, mutate])

  if (isPending) {
    return (
      <div className='flex h-full items-center justify-center'>
        <Loader className='text-muted-foreground size-6 animate-spin' />
      </div>
    )
  }

  if (!conversationId) {
    return (
      <div className='flex h-full flex-col items-center justify-center gap-y-2'>
        <AlertTriangle className='text-muted-foreground size-6' />
        <span className='text-muted-foreground text-sm'>
          Conversation not found
        </span>
      </div>
    )
  }

  return <Conversation id={conversationId} />
}

export default MemberIdPage
