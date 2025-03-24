import { useCallback, useMemo, useState } from 'react'
import { useMutation } from 'convex/react'
import { api } from '@convex/_generated/api'
import { StatusEnum, type StatusType } from '@/shared/constants'

type ResponseType = string | null

type Options = {
  onSuccess?: (data: ResponseType) => void
  onError?: (error: Error) => void
  onSettled?: () => void
  throwError?: boolean
}

export const useGenerateUploadUrl = () => {
  const [data, setData] = useState<ResponseType>(null)
  const [error, setError] = useState<Error | null>(null)
  const [status, setStatus] = useState<StatusType | null>(null)

  const isPending = useMemo(() => status === StatusEnum.Pending, [status])
  const isSuccess = useMemo(() => status === StatusEnum.Success, [status])
  const isError = useMemo(() => status === StatusEnum.Error, [status])
  const isSettled = useMemo(() => status === StatusEnum.Settled, [status])

  const mutation = useMutation(api.upload.generateUploadUrl)

  const mutate = useCallback(
    async (options?: Options) => {
      try {
        setData(null)
        setError(null)
        setStatus(StatusEnum.Pending)

        const response = await mutation()
        options?.onSuccess?.(response)
        return response
      } catch (error) {
        setStatus(StatusEnum.Error)
        options?.onError?.(error as Error)
        if (options?.throwError) {
          throw error
        }
      } finally {
        setStatus(StatusEnum.Settled)
        options?.onSettled?.()
      }
    },
    [mutation],
  )

  return {
    mutate,
    data,
    error,
    isPending,
    isSuccess,
    isError,
    isSettled,
  }
}
