import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { TrashIcon } from 'lucide-react'
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
import { useRemoveWorkspace, useUpdateWorkspace } from '@/entities/workspace'
import { useConfirm, useWorkspaceId } from '@/shared/hooks'

interface Props {
  open: boolean
  setOpen: (open: boolean) => void
  initialValue: string
}

export const PreferencesModal = ({ open, setOpen, initialValue }: Props) => {
  const router = useRouter()
  const workspaceId = useWorkspaceId()
  const [ConfirmDialog, confirm] = useConfirm(
    'Are you sure?',
    'This action is irreversible.',
  )

  const [value, setValue] = useState(initialValue)
  const [editOpen, setEditOpen] = useState(false)

  const { mutate: updateWorkspace, isPending: isUpdatingWorkspace } =
    useUpdateWorkspace()
  const { mutate: removeWorkspace, isPending: isRemovingWorkspace } =
    useRemoveWorkspace()

  const handleRemove = async () => {
    const ok = await confirm()

    if (!ok) return

    removeWorkspace(
      {
        id: workspaceId,
      },
      {
        onSuccess: () => {
          toast.success('Workspace removed')
          router.replace('/')
        },
        onError: () => {
          toast.error('Failed to remove workspace')
        },
      },
    )
  }

  const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    updateWorkspace(
      {
        id: workspaceId,
        name: value,
      },
      {
        onSuccess: () => {
          toast.success('Workspace updated')
          setEditOpen(false)
        },
        onError: () => {
          toast.error('Failed to update workspace')
        },
      },
    )
  }

  return (
    <>
      <ConfirmDialog />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className='overflow-hidden bg-gray-50 p-0'>
          <DialogHeader className='border-b bg-white p-4'>
            <DialogTitle>{value}</DialogTitle>
          </DialogHeader>
          <div className='flex flex-col gap-y-2 px-4 pb-4'>
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <DialogTrigger asChild>
                <div className='cursor-pointer rounded-lg border bg-white px-5 py-4 hover:bg-gray-50'>
                  <div className='flex items-center justify-between'>
                    <p className='text-sm font-semibold'>Workspace name</p>
                    <p className='text-sm font-semibold text-[#1264a3] hover:underline'>
                      Edit
                    </p>
                  </div>
                  <p className='text-sm'>{value}</p>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Rename this workspace</DialogTitle>
                </DialogHeader>
                <form className='space-y-4' onSubmit={handleEdit}>
                  <Input
                    value={value}
                    disabled={isUpdatingWorkspace}
                    onChange={e => setValue(e.target.value)}
                    required
                    autoFocus
                    minLength={3}
                    maxLength={80}
                    placeholder="Workspace name e.g. 'Work', 'Personal', 'Home'"
                  />
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant='outline' disabled={isUpdatingWorkspace}>
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button disabled={isUpdatingWorkspace}>Save</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            <button
              disabled={isRemovingWorkspace}
              onClick={handleRemove}
              className='flex cursor-pointer items-center gap-x-2 rounded-lg border bg-white px-5 py-4 text-rose-600 hover:bg-gray-50'
            >
              <TrashIcon className='size-4' />
              <p className='text-sm font-semibold'>Delete workspace</p>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
