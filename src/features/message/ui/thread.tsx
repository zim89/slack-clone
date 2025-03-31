import { useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { differenceInMinutes, format, isToday, isYesterday } from 'date-fns'
import { AlertTriangle, Loader, XIcon } from 'lucide-react'
import Quill from 'quill'
import { toast } from 'sonner'
import { Id } from '@convex/_generated/dataModel'
import { Button } from '@/shared/components/ui/button'
import { Message } from '@/widgets/message-list/ui/message'
import { useCurrentMember } from '@/entities/member'
import {
  useCreateMessage,
  useGetMessage,
  useGetMessages,
} from '@/entities/message'
import { useGenerateUploadUrl } from '@/entities/upload'
import { useChannelId, useWorkspaceId } from '@/shared/hooks'

const Editor = dynamic(() => import('@/shared/components/editor'), {
  ssr: false,
})

const TIME_THRESHOLD = 5

interface ThreadProps {
  messageId: Id<'messages'>
  onClose: () => void
}

type CreateMessageValues = {
  channelId: Id<'channels'>
  workspaceId: Id<'workspaces'>
  parentMessageId: Id<'messages'>
  body: string
  image: Id<'_storage'> | undefined
}

const formatDateLabel = (dateStr: string) => {
  const date = new Date(dateStr)
  if (isToday(date)) return 'Today'
  if (isYesterday(date)) return 'Yesterday'
  return format(date, 'EEEE, MMMM d')
}

export const Thread = ({ messageId, onClose }: ThreadProps) => {
  const channelId = useChannelId()
  const workspaceId = useWorkspaceId()

  const [editingId, setEditingId] = useState<Id<'messages'> | null>(null)
  const [editorKey, setEditorKey] = useState(0)
  const [isPending, setIsPending] = useState(false)

  const editorRef = useRef<Quill | null>(null)

  const { mutate: createMessage } = useCreateMessage()
  const { mutate: generateUploadUrl } = useGenerateUploadUrl()

  const { data: currentMember } = useCurrentMember({ workspaceId })
  const { data: message, isLoading: loadingMessage } = useGetMessage({
    id: messageId,
  })
  const { results, status, loadMore } = useGetMessages({
    channelId,
    parentMessageId: messageId,
  })

  const canLoadMore = status === 'CanLoadMore'
  const isLoadingMore = status === 'LoadingMore'

  const handleSubmit = async ({
    body,
    image,
  }: {
    body: string
    image: File | null
  }) => {
    try {
      setIsPending(true)
      editorRef?.current?.enable(false)

      const values: CreateMessageValues = {
        channelId,
        workspaceId,
        parentMessageId: messageId,
        body,
        image: undefined,
      }

      if (image) {
        const url = await generateUploadUrl({ throwError: true })

        if (!url) {
          throw new Error('Url not found')
        }

        const result = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': image.type },
          body: image,
        })

        if (!result.ok) {
          throw new Error('Failed to upload image')
        }

        const { storageId } = await result.json()

        values.image = storageId
      }

      await createMessage(values, { throwError: true })

      setEditorKey(prevKey => prevKey + 1)
    } catch (error) {
      console.log('[Error sending message]', error)
      toast.error('Failed to send message')
    } finally {
      setIsPending(false)
      editorRef?.current?.enable(true)
    }
  }

  const groupedMessages = results?.reduce(
    (groups, message) => {
      const date = new Date(message._creationTime)
      const dateKey = format(date, 'yyyy-MM-dd')
      if (!groups[dateKey]) {
        groups[dateKey] = []
      }
      groups[dateKey].unshift(message)
      return groups
    },
    {} as Record<string, typeof results>,
  )

  if (loadingMessage || status === 'LoadingFirstPage') {
    return (
      <div className='flex h-full flex-col'>
        <div className='flex h-[49px] items-center justify-between border-b px-4'>
          <p className='text-lg font-bold'>Thread</p>
          <Button onClick={onClose} size='iconSm' variant='ghost'>
            <XIcon className='size-5 stroke-[1.5]' />
          </Button>
        </div>
        <div className='flex h-full flex-col items-center justify-center gap-y-2'>
          <Loader className='text-muted-foreground size-5 animate-spin' />
        </div>
      </div>
    )
  }

  if (!message) {
    return (
      <div className='flex h-full flex-col'>
        <div className='flex h-[49px] items-center justify-between border-b px-4'>
          <p className='text-lg font-bold'>Thread</p>
          <Button onClick={onClose} size='iconSm' variant='ghost'>
            <XIcon className='size-5 stroke-[1.5]' />
          </Button>
        </div>
        <div className='flex h-full flex-col items-center justify-center gap-y-2'>
          <AlertTriangle className='text-muted-foreground size-5' />
          <p className='text-muted-foreground text-sm'>Message not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className='h-full'>
      <div className='flex h-[49px] items-center justify-between border-b px-4'>
        <p className='text-lg font-bold'>Thread</p>
        <Button onClick={onClose} size='iconSm' variant='ghost'>
          <XIcon className='size-5 stroke-[1.5]' />
        </Button>
      </div>
      <div className='messages-scrollbar flex flex-1 flex-col-reverse overflow-y-auto pb-4'>
        {Object.entries(groupedMessages || {}).map(([dateKey, messages]) => (
          <div key={dateKey}>
            <div className='relative my-2 text-center'>
              <hr className='absolute top-1/2 right-0 left-0 border-t border-gray-300' />
              <span className='relative inline-block rounded-full border border-gray-300 bg-white px-4 py-1 text-xs shadow-sm'>
                {formatDateLabel(dateKey)}
              </span>
            </div>
            {messages.map((message, index) => {
              const prevMessage = messages[index - 1]
              const isCompact =
                prevMessage &&
                prevMessage.user?._id === message.user?._id &&
                differenceInMinutes(
                  new Date(message._creationTime),
                  new Date(prevMessage._creationTime),
                ) < TIME_THRESHOLD

              return (
                <Message
                  key={message._id}
                  id={message._id}
                  memberId={message.memberId}
                  authorImage={message.user.image}
                  authorName={message.user.name}
                  isAuthor={message.memberId === currentMember?._id}
                  reactions={message.reactions}
                  body={message.body}
                  image={message.image}
                  updatedAt={message.updatedAt}
                  createdAt={message._creationTime}
                  isEditing={editingId === message._id}
                  setEditingId={setEditingId}
                  isCompact={isCompact}
                  hideThreadButton
                  threadCount={message.threadCount}
                  threadImage={message.threadImage}
                  threadName={message.threadName}
                  threadTimestamp={message.threadTimestamp}
                />
              )
            })}
          </div>
        ))}
        <div
          className='h-1'
          ref={el => {
            if (el) {
              const observer = new IntersectionObserver(
                ([entry]) => {
                  if (entry.isIntersecting && canLoadMore) {
                    loadMore()
                  }
                },
                { threshold: 1.0 },
              )

              observer.observe(el)
              return () => observer.disconnect()
            }
          }}
        />
        {isLoadingMore && (
          <div className='relative my-2 text-center'>
            <hr className='absolute top-1/2 right-0 left-0 border-t border-gray-300' />
            <span className='relative inline-block rounded-full border border-gray-300 bg-white px-4 py-1 text-xs shadow-sm'>
              <Loader className='size-4 animate-spin' />
            </span>
          </div>
        )}
        <Message
          hideThreadButton
          memberId={message.memberId}
          authorImage={message.user.image}
          authorName={message.user.name}
          isAuthor={message.memberId === currentMember?._id}
          body={message.body}
          image={message.image}
          createdAt={message._creationTime}
          updatedAt={message.updatedAt}
          id={message._id}
          reactions={message.reactions}
          isEditing={editingId === message._id}
          setEditingId={setEditingId}
        />
      </div>
      <div className='px-4'>
        <Editor
          key={editorKey}
          onSubmit={handleSubmit}
          innerRef={editorRef}
          disabled={isPending}
          placeholder='Reply..'
        />
      </div>
    </div>
  )
}
