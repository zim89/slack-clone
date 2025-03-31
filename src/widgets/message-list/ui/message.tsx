import dynamic from 'next/dynamic'
import { format, isToday, isYesterday } from 'date-fns'
import { toast } from 'sonner'
import { Doc, Id } from '@convex/_generated/dataModel'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shared/components/ui/avatar'
import { Reactions } from '@/features/reaction'
import { useRemoveMessage, useUpdateMessage } from '@/entities/message'
import { useToggleReaction } from '@/entities/reaction'
import { Hint, Toolbar } from '@/shared/components'
import { useConfirm } from '@/shared/hooks/use-confirm'
import { cn } from '@/shared/utils'
import { usePanel } from '../model'
import { ThreadBar } from './thread-bar'
import { Thumbnail } from './thumbnail'

const Editor = dynamic(() => import('@/shared/components/editor'), {
  ssr: false,
})
const Renderer = dynamic(() => import('@/shared/components/renderer'), {
  ssr: false,
})

interface Props {
  id: Id<'messages'>
  memberId: Id<'members'>
  authorImage?: string
  authorName?: string
  isAuthor: boolean
  reactions: Array<
    Omit<Doc<'reactions'>, 'memberId'> & {
      count: number
      memberIds: Id<'members'>[]
    }
  >
  body: Doc<'messages'>['body']
  image: string | null | undefined
  createdAt: Doc<'messages'>['_creationTime']
  updatedAt: Doc<'messages'>['updatedAt']
  isEditing: boolean
  isCompact?: boolean
  setEditingId: (id: Id<'messages'> | null) => void
  hideThreadButton?: boolean
  threadCount?: number
  threadImage?: string
  threadName?: string
  threadTimestamp?: number
}

const formatFullTime = (date: Date) => {
  return `${isToday(date) ? 'Today' : isYesterday(date) ? 'Yesterday' : format(date, 'MMM d, yyyy')} at ${format(date, 'h:mm:ss a')}`
}

export const Message = ({
  id,
  isAuthor,
  memberId,
  authorImage,
  authorName = 'Member',
  reactions,
  body,
  image,
  createdAt,
  updatedAt,
  isEditing,
  isCompact,
  setEditingId,
  hideThreadButton,
  threadCount,
  threadImage,
  threadName,
  threadTimestamp,
}: Props) => {
  const { parentMessageId, onOpenMessage, onOpenProfile, onClose } = usePanel()

  const [ConfirmDialog, confirm] = useConfirm(
    'Delete message',
    'Are you sure you want to delete this message? This cannot be undone.',
  )

  const { mutate: updateMessage, isPending: isUpdatingMessage } =
    useUpdateMessage()
  const { mutate: removeMessage, isPending: isRemovingMessage } =
    useRemoveMessage()
  const { mutate: toggleReaction, isPending: isTogglingReaction } =
    useToggleReaction()

  const isPending = isUpdatingMessage || isTogglingReaction

  const handleReaction = (value: string) => {
    toggleReaction(
      { messageId: id, value },
      {
        onError: () => {
          toast.error('Failed to toggle reaction')
        },
      },
    )
  }

  const handleRemove = async () => {
    const ok = await confirm()

    if (!ok) return

    removeMessage(
      { id },
      {
        onSuccess: () => {
          toast.success('Message deleted')

          if (parentMessageId === id) {
            onClose()
          }
        },
        onError: () => {
          toast.error('Failed to delete message')
        },
      },
    )
  }

  const handleUpdate = ({ body }: { body: string }) => {
    updateMessage(
      { id, body },
      {
        onSuccess: () => {
          toast.success('Message updated')
          setEditingId(null)
        },
        onError: () => {
          toast.error('Failed to update message')
        },
      },
    )
  }

  if (isCompact) {
    return (
      <>
        <ConfirmDialog />
        <div
          className={cn(
            'group relative flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60',
            isEditing && 'bg-[#f2c74433] hover:bg-[#f2c74433]',
            isRemovingMessage &&
              'origin-bottom scale-y-0 transform bg-rose-500/50 transition-all duration-200',
          )}
        >
          <div className='flex items-start gap-2'>
            <Hint label={formatFullTime(new Date(createdAt))}>
              <button className='text-muted-foreground w-[40px] text-center text-xs leading-[22px] opacity-0 group-hover:opacity-100 hover:underline'>
                {format(new Date(createdAt), 'hh:mm')}
              </button>
            </Hint>
            {isEditing ? (
              <div className='h-full w-full'>
                <Editor
                  onSubmit={handleUpdate}
                  disabled={isPending}
                  defaultValue={JSON.parse(body)}
                  onCancel={() => setEditingId(null)}
                  variant='update'
                />
              </div>
            ) : (
              <div className='flex w-full flex-col'>
                <Renderer value={body} />
                <Thumbnail url={image} />
                {updatedAt ? (
                  <span className='text-muted-foreground text-xs'>
                    (edited)
                  </span>
                ) : null}
                <Reactions data={reactions} onChange={handleReaction} />
                <ThreadBar
                  count={threadCount}
                  image={threadImage}
                  name={threadName}
                  timestamp={threadTimestamp}
                  onClick={() => onOpenMessage(id)}
                />
              </div>
            )}
          </div>
          {!isEditing && (
            <Toolbar
              isAuthor={isAuthor}
              isPending={isPending}
              handleEdit={() => setEditingId(id)}
              handleThread={() => onOpenMessage(id)}
              handleDelete={handleRemove}
              handleReaction={handleReaction}
              hideThreadButton={hideThreadButton}
            />
          )}
        </div>
      </>
    )
  }

  const avatarFallback = authorName.charAt(0).toUpperCase()

  return (
    <>
      <ConfirmDialog />
      <div
        className={cn(
          'group relative flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60',
          isEditing && 'bg-[#f2c74433] hover:bg-[#f2c74433]',
          isRemovingMessage &&
            'origin-bottom scale-y-0 transform bg-rose-500/50 transition-all duration-200',
        )}
      >
        <div className='flex items-start gap-2'>
          <button onClick={() => onOpenProfile(memberId)}>
            <Avatar>
              <AvatarImage src={authorImage} />
              <AvatarFallback>{avatarFallback}</AvatarFallback>
            </Avatar>
          </button>
          {isEditing ? (
            <div className='h-full w-full'>
              <Editor
                onSubmit={handleUpdate}
                disabled={isPending}
                defaultValue={JSON.parse(body)}
                onCancel={() => setEditingId(null)}
                variant='update'
              />
            </div>
          ) : (
            <div className='flex w-full flex-col overflow-hidden'>
              <div className='text-sm'>
                <button
                  onClick={() => onOpenProfile(memberId)}
                  className='text-primary font-bold hover:underline'
                >
                  {authorName}
                </button>
                <span>&nbsp;&nbsp;</span>
                <Hint label={formatFullTime(new Date(createdAt))}>
                  <button className='text-muted-foreground text-xs hover:underline'>
                    {format(new Date(createdAt), 'h:mm a')}
                  </button>
                </Hint>
              </div>
              <Renderer value={body} />
              <Thumbnail url={image} />
              {updatedAt ? (
                <span className='text-muted-foreground text-xs'>(edited)</span>
              ) : null}
              <Reactions data={reactions} onChange={handleReaction} />
              <ThreadBar
                count={threadCount}
                image={threadImage}
                name={threadName}
                timestamp={threadTimestamp}
                onClick={() => onOpenMessage(id)}
              />
            </div>
          )}
        </div>
        {!isEditing && (
          <Toolbar
            isAuthor={isAuthor}
            isPending={isPending}
            handleEdit={() => setEditingId(id)}
            handleThread={() => onOpenMessage(id)}
            handleDelete={handleRemove}
            handleReaction={handleReaction}
            hideThreadButton={hideThreadButton}
          />
        )}
      </div>
    </>
  )
}
