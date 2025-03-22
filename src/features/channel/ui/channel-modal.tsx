import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/shared/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import { Input } from '@/shared/components/ui/input'
import { useChannelModalState, useCreateChannel } from '@/entities/channel'
import { useWorkspaceId } from '@/shared/hooks/use-workspace-id'

export const ChannelModal = () => {
  const router = useRouter()
  const workspaceId = useWorkspaceId()

  const { mutate, isPending } = useCreateChannel()
  const [open, setOpen] = useChannelModalState()
  const [name, setName] = useState('')

  const handleClose = () => {
    setName('')
    setOpen(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, '-').toLowerCase()
    setName(value)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    mutate(
      { name, workspaceId },
      {
        onSuccess: id => {
          toast.success('Channel created')
          router.push(`/workspace/${workspaceId}/channel/${id}`)
          handleClose()
        },
        onError: () => {
          toast.error('Failed to create channel')
        },
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a channel</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <Input
            value={name}
            disabled={isPending}
            onChange={handleChange}
            required
            autoFocus
            minLength={3}
            maxLength={80}
            placeholder='e.g. plan-budget'
          />
          <div className='flex justify-end'>
            <Button disabled={isPending}>Create</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
