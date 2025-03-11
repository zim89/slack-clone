'use client'

import { api } from '@convex/_generated/api'
import { useQuery } from 'convex/react'

export const useUser = () => {
  const data = useQuery(api.user.current)
  const isLoading = data === undefined

  return { data, isLoading }
}
