'use client'

import type { ReactNode } from 'react'
import { WorkspaceSidebar, WorkspaceToolbar } from '@/features/workspace'

interface Props {
  children: ReactNode
}

const WorkspaceLayout = ({ children }: Props) => {
  return (
    <div className='h-full'>
      <WorkspaceToolbar />

      <div className='flex h-[calc(100vh-40px)]'>
        <WorkspaceSidebar />
        {children}
      </div>
    </div>
  )
}

export default WorkspaceLayout
