import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  AlertTriangle,
  ChevronDownIcon,
  Loader,
  MailIcon,
  XIcon,
} from 'lucide-react'
import { toast } from 'sonner'
import { Id } from '@convex/_generated/dataModel'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shared/components/ui/avatar'
import { Button } from '@/shared/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import { Separator } from '@/shared/components/ui/separator'
import {
  useCurrentMember,
  useGetMember,
  useRemoveMember,
  useUpdateMember,
} from '@/entities/member'
import { useConfirm, useWorkspaceId } from '@/shared/hooks'

interface ProfileProps {
  memberId: Id<'members'>
  onClose: () => void
}

export const Profile = ({ memberId, onClose }: ProfileProps) => {
  const router = useRouter()
  const workspaceId = useWorkspaceId()

  const [UpdateDialog, confirmUpdate] = useConfirm(
    'Change role',
    "Are you sure you want to change this member's role?",
  )
  const [LeaveDialog, confirmLeave] = useConfirm(
    'Leave workspace',
    'Are you sure you want to leave this workspace?',
  )
  const [RemoveDialog, confirmRemove] = useConfirm(
    'Remove member',
    'Are you sure you want to remove this member?',
  )

  const { data: member, isLoading: isLoadingMember } = useGetMember({
    id: memberId,
  })
  const { data: currentMember, isLoading: isLoadingCurrentMember } =
    useCurrentMember({
      workspaceId,
    })

  const { mutate: updateMember } = useUpdateMember()
  const { mutate: removeMember } = useRemoveMember()

  const onRemove = async () => {
    const ok = await confirmRemove()

    if (!ok) return

    removeMember(
      { id: memberId },
      {
        onSuccess: () => {
          toast.success('Member removed')
          onClose()
        },
        onError: () => {
          toast.error('Failed to remove member')
        },
      },
    )
  }

  const onLeave = async () => {
    const ok = await confirmLeave()

    if (!ok) return

    removeMember(
      { id: memberId },
      {
        onSuccess: () => {
          router.replace('/')
          toast.success('You left the workspace')
          onClose()
        },
        onError: () => {
          toast.error('Failed to leave the workspace')
        },
      },
    )
  }

  const onUpdate = async (role: 'admin' | 'member') => {
    const ok = await confirmUpdate()

    if (!ok) return

    updateMember(
      { id: memberId, role },
      {
        onSuccess: () => {
          toast.success('Role changed')
          onClose()
        },
        onError: () => {
          toast.error('Failed to change role')
        },
      },
    )
  }

  if (isLoadingMember || isLoadingCurrentMember) {
    return (
      <div className='flex h-full flex-col'>
        <div className='flex h-[49px] items-center justify-between border-b px-4'>
          <p className='text-lg font-bold'>Profile</p>
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

  if (!member) {
    return (
      <div className='flex h-full flex-col'>
        <div className='flex h-[49px] items-center justify-between border-b px-4'>
          <p className='text-lg font-bold'>Profile</p>
          <Button onClick={onClose} size='iconSm' variant='ghost'>
            <XIcon className='size-5 stroke-[1.5]' />
          </Button>
        </div>
        <div className='flex h-full flex-col items-center justify-center gap-y-2'>
          <AlertTriangle className='text-muted-foreground size-5' />
          <p className='text-muted-foreground text-sm'>Profile not found</p>
        </div>
      </div>
    )
  }

  const avatarFallback = member.user.name?.[0] ?? 'M'

  return (
    <>
      <RemoveDialog />
      <LeaveDialog />
      <UpdateDialog />
      <div className='flex h-full flex-col'>
        <div className='flex h-[49px] items-center justify-between border-b px-4'>
          <p className='text-lg font-bold'>Profile</p>
          <Button onClick={onClose} size='iconSm' variant='ghost'>
            <XIcon className='size-5 stroke-[1.5]' />
          </Button>
        </div>
        <div className='flex flex-col items-center justify-center p-4'>
          <Avatar className='size-full max-h-[256px] max-w-[256px]'>
            <AvatarImage src={member.user.image} />
            <AvatarFallback className='aspect-square text-6xl'>
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className='flex flex-col p-4'>
          <p className='tex-xl font-bold'>{member.user.name}</p>
          {currentMember?.role === 'admin' &&
          currentMember?._id !== memberId ? (
            <div className='mt-4 flex items-center gap-2'>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='outline' className='w-full capitalize'>
                    {member.role} <ChevronDownIcon className='ml-2 size-4' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-full'>
                  <DropdownMenuRadioGroup
                    value={member.role}
                    onValueChange={role => onUpdate(role as 'admin' | 'member')}
                  >
                    <DropdownMenuRadioItem value='admin'>
                      Admin
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value='member'>
                      Member
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button onClick={onRemove} variant='outline' className='w-full'>
                Remove
              </Button>
            </div>
          ) : currentMember?._id === memberId &&
            currentMember?.role !== 'admin' ? (
            <div className='mt-4'>
              <Button onClick={onLeave} variant='outline' className='w-full'>
                Leave
              </Button>
            </div>
          ) : null}
        </div>
        <Separator />
        <div className='flex flex-col p-4'>
          <p className='mb-4 text-sm font-bold'>Contact information</p>
          <div className='flex items-center gap-2'>
            <div className='bg-muted flex size-9 items-center justify-center rounded-md'>
              <MailIcon className='size-4' />
            </div>
            <div className='flex flex-col'>
              <p className='text-muted-foreground text-[13px] font-semibold'>
                Email Address
              </p>
              <Link
                href={`mailto:${member.user.email}`}
                className='text-sm text-[#1264a3] hover:underline'
              >
                {member.user.email}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
