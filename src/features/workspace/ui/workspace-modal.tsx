'use client'

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
import {
  useCreateWorkspace,
  useWorkspaceModalStore,
} from '@/entities/workspace'
import { appRoutes } from '@/shared/config'

export const WorkspaceModal = () => {
  const [name, setName] = useState('')
  const [open, setOpen] = useWorkspaceModalStore()
  const router = useRouter()

  const { mutate, isPending } = useCreateWorkspace()

  const handleClose = () => {
    setOpen(false)
    setName('')
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    mutate(
      { name },
      {
        onSuccess(id) {
          toast.success('Workspace created')
          router.push(`${appRoutes.workspace}/${id}`)
          handleClose()
        },
        onError(error) {
          // TODO:  Handle or show toast error
          console.log(error)
        },
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a workspace</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <Input
            value={name}
            onChange={e => setName(e.target.value)}
            disabled={isPending}
            required
            autoFocus
            minLength={3}
            placeholder="Workspace name e.g. 'Work', 'Personal', 'Home'"
          />
          <div className='flex justify-end'>
            <Button disabled={isPending}>Create</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
