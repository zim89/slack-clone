import { useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import Quill from 'quill'
import { toast } from 'sonner'
import { Id } from '@convex/_generated/dataModel'
import { useCreateMessage } from '@/entities/message'
import { useGenerateUploadUrl } from '@/entities/upload'
import { useWorkspaceId } from '@/shared/hooks'

const Editor = dynamic(() => import('@/shared/components/editor'), {
  ssr: false,
})

interface Props {
  placeholder: string
  conversationId: Id<'conversations'>
}

type CreateMessageValues = {
  conversationId: Id<'conversations'>
  workspaceId: Id<'workspaces'>
  body: string
  image: Id<'_storage'> | undefined
}

export const ChatInput = ({ placeholder, conversationId }: Props) => {
  const [editorKey, setEditorKey] = useState(0)
  const [isPending, setIsPending] = useState(false)

  const editorRef = useRef<Quill | null>(null)

  const workspaceId = useWorkspaceId()

  const { mutate: createMessage } = useCreateMessage()
  const { mutate: generateUploadUrl } = useGenerateUploadUrl()

  const handleSubmit = async ({
    body,
    image,
  }: {
    body: string
    image: File | null
  }) => {
    try {
      setIsPending(true)
      editorRef?.current?.enable(false)

      const values: CreateMessageValues = {
        conversationId,
        workspaceId,
        body,
        image: undefined,
      }

      if (image) {
        const url = await generateUploadUrl({ throwError: true })

        if (!url) {
          throw new Error('Url not found')
        }

        const result = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': image.type },
          body: image,
        })

        if (!result.ok) {
          throw new Error('Failed to upload image')
        }

        const { storageId } = await result.json()

        values.image = storageId
      }

      await createMessage(values, { throwError: true })

      setEditorKey(prevKey => prevKey + 1)
    } catch {
      toast.error('Failed to send message')
    } finally {
      setIsPending(false)
      editorRef?.current?.enable(true)
    }
  }

  return (
    <div className='w-full px-5'>
      <Editor
        key={editorKey}
        placeholder={placeholder}
        onSubmit={handleSubmit}
        disabled={isPending}
        innerRef={editorRef}
      />
    </div>
  )
}
