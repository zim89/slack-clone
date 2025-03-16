'use client'

import { useGetWorkspace } from '@/entities/workspace'
import { useWorkspaceId } from '@/shared/hooks'

export default function Page() {
  const workspaceId = useWorkspaceId()

  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({
    id: workspaceId,
  })

  return (
    <div>
      <h1>Workspace Page with ID: {workspaceId}</h1>
      {!workspaceLoading && <div>{workspace?.name}</div>}
    </div>
  )
}
