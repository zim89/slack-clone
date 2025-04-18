'use client'

import type { ReactNode } from 'react'
import { Loader } from 'lucide-react'
import type { Id } from '@convex/_generated/dataModel'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/shared/components/ui/resizable'
import { usePanel } from '@/widgets/message-list'
import { Thread } from '@/features/message'
import { Profile } from '@/features/user'
import {
  WorkspaceAside,
  WorkspaceNavbar,
  WorkspaceToolbar,
} from '@/features/workspace'

interface Props {
  children: ReactNode
}

const WorkspaceLayout = ({ children }: Props) => {
  const { parentMessageId, profileMemberId, onClose } = usePanel()
  const showPanel = !!parentMessageId || !!profileMemberId

  return (
    <div className='h-full'>
      <WorkspaceToolbar />

      <div className='flex h-[calc(100vh-40px)]'>
        <WorkspaceNavbar />

        <ResizablePanelGroup
          direction='horizontal'
          autoSaveId='sc-workspace-layout'
        >
          <ResizablePanel
            defaultSize={20}
            minSize={11}
            className='bg-[#5E2C5F]'
          >
            <WorkspaceAside />
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel minSize={20} defaultSize={80}>
            {children}
          </ResizablePanel>

          {showPanel && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel minSize={20} defaultSize={29}>
                {parentMessageId ? (
                  <Thread
                    messageId={parentMessageId as Id<'messages'>}
                    onClose={onClose}
                  />
                ) : profileMemberId ? (
                  <Profile
                    memberId={profileMemberId as Id<'members'>}
                    onClose={onClose}
                  />
                ) : (
                  <div className='flex h-full items-center justify-center'>
                    <Loader className='text-muted-foreground size-5 animate-spin' />
                  </div>
                )}
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  )
}

export default WorkspaceLayout
