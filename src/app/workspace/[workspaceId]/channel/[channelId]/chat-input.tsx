import { useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import Quill from 'quill'

const Editor = dynamic(() => import('@/shared/components/editor'), {
  ssr: false,
})

interface Props {
  placeholder: string
}

export const ChatInput = ({ placeholder }: Props) => {
  const [editorKey, setEditorKey] = useState(0)
  const [isPending, setIsPending] = useState(false)

  const editorRef = useRef<Quill | null>(null)

  // TODO: use create message hook and generate upload url hook

  const handleSubmit = async ({
    body,
    image,
  }: {
    body: string
    image: File | null
  }) => {
    console.log({ body, image })
    //TODO: implement create message mutation
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
