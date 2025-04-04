'use client'

import { RefObject, useEffect, useLayoutEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { ImageIcon, Smile, XIcon } from 'lucide-react'
import Quill, { type QuillOptions } from 'quill'
import { Delta, Op } from 'quill/core'
import { MdSend } from 'react-icons/md'
import { PiTextAa } from 'react-icons/pi'
import { Button } from '@/shared/components/ui/button'
import { EmojiPopover, Hint } from '@/shared/components'
import { cn } from '@/shared/utils'
import 'quill/dist/quill.snow.css'

type EditorValue = {
  image: File | null
  body: string
}

interface Props {
  onSubmit: ({ image, body }: EditorValue) => void
  onCancel?: () => void
  placeholder?: string
  defaultValue?: Delta | Op[]
  disabled?: boolean
  innerRef?: RefObject<Quill | null>
  variant?: 'create' | 'update'
}

const Editor = ({
  onCancel,
  onSubmit,
  placeholder = 'Write something...',
  defaultValue = [],
  disabled = false,
  innerRef,
  variant = 'create',
}: Props) => {
  const [text, setText] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [isToolbarVisible, setIsToolbarVisible] = useState(true)

  const submitRef = useRef(onSubmit)
  const placeholderRef = useRef(placeholder)
  const quillRef = useRef<Quill | null>(null)
  const defaultValueRef = useRef(defaultValue)
  const containerRef = useRef<HTMLDivElement>(null)
  const disabledRef = useRef(disabled)
  const imageElementRef = useRef<HTMLInputElement>(null)

  useLayoutEffect(() => {
    submitRef.current = onSubmit
    placeholderRef.current = placeholder
    defaultValueRef.current = defaultValue
    disabledRef.current = disabled
  })

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const editorContainer = container.appendChild(
      container.ownerDocument.createElement('div'),
    )

    const options: QuillOptions = {
      theme: 'snow',
      placeholder: placeholderRef.current,
      modules: {
        toolbar: [
          ['bold', 'italic', 'strike'],
          ['link'],
          [{ list: 'ordered' }, { list: 'bullet' }],
        ],
        keyboard: {
          bindings: {
            enter: {
              key: 'Enter',
              handler: () => {
                const text = quill.getText()
                const addedImage = imageElementRef.current?.files?.[0] || null

                const isEmpty =
                  !addedImage &&
                  text.replace(/<(.|\n)*?>/g, '').trim().length === 0

                if (isEmpty) return

                const body = JSON.stringify(quill.getContents())
                submitRef.current?.({ body, image: addedImage })
              },
            },
            shift_enter: {
              key: 'Enter',
              shiftKey: true,
              handler: () => {
                quill.insertText(quill.getSelection()?.index || 0, '\n')
              },
            },
          },
        },
      },
    }

    const quill = new Quill(editorContainer, options)
    quillRef.current = quill
    quillRef.current.focus()

    if (innerRef) {
      innerRef.current = quill
    }

    quill.setContents(defaultValueRef.current)
    setText(quill.getText())

    quill.on(Quill.events.TEXT_CHANGE, () => {
      setText(quill.getText())
    })

    return () => {
      quill.off(Quill.events.TEXT_CHANGE)
      if (container) {
        container.innerHTML = ''
      }
      if (quillRef.current) {
        quillRef.current = null
      }
      if (innerRef) {
        innerRef.current = null
      }
    }
  }, [innerRef])

  const toggleToolbar = () => {
    setIsToolbarVisible(current => !current)
    const toolbarElement = containerRef.current?.querySelector('.ql-toolbar')

    if (toolbarElement) {
      toolbarElement.classList.toggle('hidden')
    }
  }

  const onEmojiSelect = (emojiValue: string) => {
    const quill = quillRef.current

    quill?.insertText(quill?.getSelection()?.index || 0, emojiValue)
  }

  const isEmpty = !image && text.replace(/<(.|\n)*?>/g, '').trim().length === 0

  return (
    <div className='flex flex-col'>
      <input
        type='file'
        accept='image/*'
        ref={imageElementRef}
        onChange={event => setImage(event.target.files![0])}
        className='hidden'
      />
      <div
        className={cn(
          'flex flex-col overflow-hidden rounded-md border border-slate-200 bg-white transition focus-within:border-slate-300 focus-within:shadow-sm',
          disabled && 'opacity-50',
        )}
      >
        <div ref={containerRef} className='ql-custom h-full' />
        {!!image && (
          <div className='p-2'>
            <div className='group/image relative flex size-[62px] items-center justify-center'>
              <Hint label='Remove image'>
                <button
                  onClick={() => {
                    setImage(null)
                    imageElementRef.current!.value = ''
                  }}
                  className='absolute -top-2.5 -right-2.5 z-[4] hidden size-6 items-center justify-center rounded-full border-2 border-white bg-black/70 text-white group-hover/image:flex hover:bg-black'
                >
                  <XIcon className='size-3.5' />
                </button>
              </Hint>
              <Image
                src={URL.createObjectURL(image)}
                alt='Uploaded'
                fill
                className='overflow-hidden rounded-xl border object-cover'
              />
            </div>
          </div>
        )}
        <div className='z-[5] flex px-2 pb-2'>
          <Hint
            label={isToolbarVisible ? 'Hide formatting' : 'Show formatting'}
          >
            <Button
              disabled={disabled}
              size='iconSm'
              variant='ghost'
              onClick={toggleToolbar}
            >
              <PiTextAa className='size-4' />
            </Button>
          </Hint>
          <EmojiPopover onEmojiSelect={onEmojiSelect}>
            <Button disabled={disabled} size='iconSm' variant='ghost'>
              <Smile className='size-4' />
            </Button>
          </EmojiPopover>
          {variant === 'create' && (
            <Hint label='Image'>
              <Button
                disabled={disabled}
                size='iconSm'
                variant='ghost'
                onClick={() => imageElementRef.current?.click()}
              >
                <ImageIcon className='size-4' />
              </Button>
            </Hint>
          )}
          {variant === 'update' && (
            <div className='ml-auto flex items-center gap-x-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={onCancel}
                disabled={disabled}
              >
                Cancel
              </Button>
              <Button
                disabled={disabled || isEmpty}
                onClick={() => {
                  onSubmit({
                    body: JSON.stringify(quillRef.current?.getContents()),
                    image,
                  })
                }}
                size='sm'
                className='bg-[#007a5a] text-white hover:bg-[#007a5a]/80'
              >
                Save
              </Button>
            </div>
          )}
          {variant === 'create' && (
            <Button
              disabled={disabled || isEmpty}
              onClick={() => {
                onSubmit({
                  body: JSON.stringify(quillRef.current?.getContents()),
                  image,
                })
              }}
              size='iconSm'
              className={cn(
                'ml-auto',
                isEmpty
                  ? 'text-muted-foreground bg-white hover:bg-white'
                  : 'bg-[#007a5a] text-white hover:bg-[#007a5a]/80',
              )}
            >
              <MdSend className='size-4' />
            </Button>
          )}
        </div>
      </div>
      {variant === 'create' && (
        <div
          className={cn(
            'text-muted-foreground flex justify-end p-2 text-[10px] opacity-0 transition',
            !isEmpty && 'opacity-100',
          )}
        >
          <p>
            <strong>Shift + Return</strong> to add a new line
          </p>
        </div>
      )}
    </div>
  )
}

export default Editor
