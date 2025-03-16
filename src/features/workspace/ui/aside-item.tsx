import Link from 'next/link'
import { cva, type VariantProps } from 'class-variance-authority'
import { LucideIcon } from 'lucide-react'
import { IconType } from 'react-icons/lib'
import { Button } from '@/shared/components/ui/button'
import { useWorkspaceId } from '@/shared/hooks'
import { cn } from '@/shared/utils'

const asideItemVariants = cva(
  'flex items-center gap-1.5 justify-start font-normal h-7 px-[18px] text-sm overflow-hidden',
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
  label: string
  id: string
  icon: LucideIcon | IconType
  variant?: VariantProps<typeof asideItemVariants>['variant']
}

export const AsideItem = ({ label, id, icon: Icon, variant }: Props) => {
  const workspaceId = useWorkspaceId()

  return (
    <Button
      variant='transparent'
      size='sm'
      className={cn(asideItemVariants({ variant }))}
      asChild
    >
      <Link href={`/workspace/${workspaceId}/channel/${id}`}>
        <Icon className='mr-1 size-3.5 shrink-0' />
        <span className='truncate text-sm'>{label}</span>
      </Link>
    </Button>
  )
}
