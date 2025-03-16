import Link from 'next/link'
import { cva, type VariantProps } from 'class-variance-authority'
import { Id } from '@convex/_generated/dataModel'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shared/components/ui/avatar'
import { Button } from '@/shared/components/ui/button'
import { useWorkspaceId } from '@/shared/hooks'
import { cn } from '@/shared/utils'

const asideUserVariants = cva(
  'flex items-center gap-1.5 justify-start font-normal h-7 px-4 text-sm overflow-hidden',
  {
    variants: {
      variant: {
        default: 'text-[#f9edffcc]',
        active: 'text-[#481349] bg-white/90 hover:bg-white/90',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

interface Props {
  id: Id<'members'>
  label?: string
  image?: string
  variant?: VariantProps<typeof asideUserVariants>['variant']
}

export const AsideUser = ({ id, label = 'Member', image, variant }: Props) => {
  const workspaceId = useWorkspaceId()
  const avatarFallback = label.charAt(0).toUpperCase()

  return (
    <Button
      variant='transparent'
      className={cn(asideUserVariants({ variant: variant }))}
      size='sm'
      asChild
    >
      <Link href={`/workspace/${workspaceId}/member/${id}`}>
        <Avatar className='mr-1 size-5 rounded-md'>
          <AvatarImage className='rounded-md' src={image} />
          <AvatarFallback className='rounded-md bg-sky-500 text-xs text-white'>
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
        <span className='truncate text-sm'>{label}</span>
      </Link>
    </Button>
  )
}
