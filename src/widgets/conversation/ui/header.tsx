import { FaChevronDown } from 'react-icons/fa'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shared/components/ui/avatar'
import { Button } from '@/shared/components/ui/button'

interface Props {
  memberName?: string
  memberImage?: string
  onClick?: () => void
}

export const Header = ({
  memberName = 'Member',
  memberImage,
  onClick,
}: Props) => {
  const avatarFallback = memberName.charAt(0).toUpperCase()

  return (
    <div className='flex h-[49px] items-center overflow-hidden border-b bg-white px-4'>
      <Button
        variant='ghost'
        className='w-auto overflow-hidden px-2 text-lg font-semibold'
        size='sm'
        onClick={onClick}
      >
        <Avatar className='mr-2 size-6'>
          <AvatarImage src={memberImage} />
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>
        <span className='truncate'>{memberName}</span>
        <FaChevronDown className='ml-2 size-2.5' />
      </Button>
    </div>
  )
}
