import { MessageSquareTextIcon, Pencil, Smile, Trash } from 'lucide-react'
import { EmojiPopover } from './emoji-popover'
import { Hint } from './hint'
import { Button } from './ui/button'

interface Props {
  isAuthor: boolean
  isPending: boolean
  handleEdit: () => void
  handleThread: () => void
  handleDelete: () => void
  handleReaction: (value: string) => void
  hideThreadButton?: boolean
}

export const Toolbar = ({
  isAuthor,
  isPending,
  handleEdit,
  handleThread,
  handleDelete,
  handleReaction,
  hideThreadButton,
}: Props) => {
  return (
    <div className='absolute top-2 right-5'>
      <div className='rounded-md border bg-white opacity-0 shadow-sm transition-opacity group-hover:opacity-100'>
        <EmojiPopover
          hint='Add reaction'
          onEmojiSelect={emoji => handleReaction(emoji)}
        >
          <Button variant='ghost' size='iconSm' disabled={isPending}>
            <Smile className='size-4' />
          </Button>
        </EmojiPopover>
        {!hideThreadButton && (
          <Hint label='Reply in thread'>
            <Button
              variant='ghost'
              size='iconSm'
              disabled={isPending}
              onClick={handleThread}
            >
              <MessageSquareTextIcon className='size-4' />
            </Button>
          </Hint>
        )}
        {isAuthor && (
          <Hint label='Edit message'>
            <Button
              variant='ghost'
              size='iconSm'
              disabled={isPending}
              onClick={handleEdit}
            >
              <Pencil className='size-4' />
            </Button>
          </Hint>
        )}
        {isAuthor && (
          <Hint label='Delete message'>
            <Button
              variant='ghost'
              size='iconSm'
              disabled={isPending}
              onClick={handleDelete}
            >
              <Trash className='size-4' />
            </Button>
          </Hint>
        )}
      </div>
    </div>
  )
}
