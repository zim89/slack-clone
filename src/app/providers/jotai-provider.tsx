'use client'

import type { ReactNode } from 'react'
import { Provider } from 'jotai'

interface Props {
  children: ReactNode
}

export const JotaiProvider = ({ children }: Props) => {
  return <Provider>{children}</Provider>
}
