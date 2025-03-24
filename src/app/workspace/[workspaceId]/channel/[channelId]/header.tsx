import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { TrashIcon } from 'lucide-react'
import { FaChevronDown } from 'react-icons/fa'
import { toast } from 'sonner'
import { Button } from '@/shared/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog'
import { Input } from '@/shared/components/ui/input'
import { useRemoveChannel, useUpdateChannel } from '@/entities/channel'
import { useCurrentMember } from '@/entities/member'
import { useChannelId } from '@/shared/hooks/use-channel-id'
import { useConfirm } from '@/shared/hooks/use-confirm'
import { useWorkspaceId } from '@/shared/hooks/use-workspace-id'

interface Props {
  title: string
}

export const Header = ({ title }: Props) => {
  const router = useRouter()
  const channelId = useChannelId()
  const workspaceId = useWorkspaceId()
  const [ConfirmDialog, confirm] = useConfirm(
    'Delete this channel?',
    'You are about to delete this channel. This action is irreversible',
  )

  const [value, setValue] = useState(title)
  const [editOpen, setEditOpen] = useState(false)

  const { data: member } = useCurrentMember({ workspaceId })
  const { mutate: updateChannel, isPending: isUpdatingChannel } =
    useUpdateChannel()
  const { mutate: removeChannel, isPending: isRemovingChannel } =
    useRemoveChannel()

  const handleEditOpen = (value: boolean) => {
    if (member?.role !== 'admin') return

    setEditOpen(value)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, '-').toLowerCase()
    setValue(value)
  }

  const handleDelete = async () => {
    const ok = await confirm()

    if (!ok) return

    removeChannel(
      { id: channelId },
      {
        onSuccess: () => {
          toast.success('Channel deleted')
          router.push(`/workspace/${workspaceId}`)
        },
        onError: () => {
          toast.error('Failed to delete channel')
        },
      },
    )
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    updateChannel(
      { id: channelId, name: value },
      {
        onSuccess: () => {
          toast.success('Channel updated')
          setEditOpen(false)
        },
        onError: () => {
          toast.error('Failed to update channel')
        },
      },
    )
  }

  return (
    <div className='flex h-[49px] items-center overflow-hidden border-b bg-white px-4'>
      <ConfirmDialog />

      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant='ghost'
            className='w-auto overflow-hidden px-2 text-lg font-semibold'
            size='sm'
          >
            <span className='truncate'># {title}</span>
            <FaChevronDown className='ml-2 size-2.5' />
          </Button>
        </DialogTrigger>

        <DialogContent className='overflow-hidden bg-gray-50 p-0'>
          <DialogHeader className='border-b bg-white p-4'>
            <DialogTitle># {title}</DialogTitle>
          </DialogHeader>

          <div className='flex flex-col gap-y-2 px-4 pb-4'>
            <Dialog open={editOpen} onOpenChange={handleEditOpen}>
              <DialogTrigger asChild>
                <div className='cursor-pointer rounded-lg border bg-white px-5 py-4 hover:bg-gray-50'>
                  <div className='flex items-center justify-between'>
                    <p className='text-sm font-semibold'>Channel name</p>
                    {member?.role === 'admin' && (
                      <p className='text-sm font-semibold text-[#1264a3] hover:underline'>
                        Edit
                      </p>
                    )}
                  </div>
                  <p className='text-sm'># {title}</p>
                </div>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Rename this channel</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className='space-y-4'>
                  <Input
                    value={value}
                    disabled={isUpdatingChannel}
                    onChange={handleChange}
                    required
                    autoFocus
                    minLength={3}
                    maxLength={80}
                    placeholder='e.g. plan-budget'
                  />
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant='outline' disabled={isUpdatingChannel}>
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button disabled={isUpdatingChannel}>Save</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            {member?.role === 'admin' && (
              <button
                onClick={handleDelete}
                disabled={isRemovingChannel}
                className='flex cursor-pointer items-center gap-x-2 rounded-lg border bg-white px-5 py-4 text-rose-600 hover:bg-gray-50'
              >
                <TrashIcon className='size-4' />
                <p className='text-sm font-semibold'>Delete channel</p>
              </button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
