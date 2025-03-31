import { MdOutlineAddReaction } from 'react-icons/md'
import { Doc, Id } from '@convex/_generated/dataModel'
import { Hint } from '@/shared/components/hint'
import { useCurrentMember } from '@/entities/member'
import { EmojiPopover } from '@/shared/components'
import { useWorkspaceId } from '@/shared/hooks'
import { cn } from '@/shared/utils'

interface Props {
  data: Array<
    Omit<Doc<'reactions'>, 'memberId'> & {
      count: number
      memberIds: Id<'members'>[]
    }
  >
  onChange: (value: string) => void
}

export const Reactions = ({ data, onChange }: Props) => {
  const workspaceId = useWorkspaceId()
  const { data: currentMember } = useCurrentMember({ workspaceId })

  const currentMemberId = currentMember?._id

  if (data.length === 0 || !currentMemberId) {
    return null
  }

  return (
    <div className='mt-1 mb-1 flex items-center gap-1'>
      {data.map(reaction => (
        <Hint
          key={reaction._id}
          label={`${reaction.count} ${reaction.count === 1 ? 'person' : 'people'} reacted with ${reaction.value}`}
        >
          <button
            onClick={() => onChange(reaction.value)}
            className={cn(
              'flex h-6 items-center gap-x-1 rounded-full border border-transparent bg-slate-200/70 px-2 text-slate-800',
              reaction.memberIds.includes(currentMemberId) &&
                'border-blue-500 bg-blue-100/70 text-white',
            )}
          >
            {reaction.value}
            <span
              className={cn(
                'text-muted-foreground text-xs font-semibold',
                reaction.memberIds.includes(currentMemberId) && 'text-blue-500',
              )}
            >
              {reaction.count}
            </span>
          </button>
        </Hint>
      ))}
      <EmojiPopover
        hint='Add reaction'
        onEmojiSelect={emoji => onChange(emoji)}
      >
        <button className='flex h-7 items-center gap-x-1 rounded-full border border-transparent bg-slate-200/70 px-3 text-slate-800 hover:border-slate-500'>
          <MdOutlineAddReaction className='size-4' />
        </button>
      </EmojiPopover>
    </div>
  )
}
