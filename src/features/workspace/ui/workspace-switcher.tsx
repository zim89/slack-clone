import { useRouter } from 'next/navigation'
import { Loader, Plus } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import { appRoutes } from '@/shared/config'
import { useWorkspaceId } from '@/shared/hooks'
import { useGetWorkspace, useGetWorkspaces } from '../api'
import { useWorkspaceModalStore } from '../model'

export const WorkspaceSwitcher = () => {
  const router = useRouter()
  const workspaceId = useWorkspaceId()
  const [, setOpen] = useWorkspaceModalStore()

  const { data: workspaces } = useGetWorkspaces()
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({
    id: workspaceId,
  })

  const filteredWorkspaces = workspaces?.filter(
    workspace => workspace?._id !== workspaceId,
  )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className='relative size-9 overflow-hidden bg-[#ABABAD] text-xl font-semibold text-slate-800 hover:bg-[#ABABAD]/80'>
          {workspaceLoading ? (
            <Loader className='size-5 shrink-0 animate-spin' />
          ) : (
            workspace?.name.charAt(0).toUpperCase()
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent side='bottom' align='start' className='w-64'>
        <DropdownMenuItem
          onClick={() => router.push(`${appRoutes.workspace}/${workspaceId}`)}
          className='cursor-pointer flex-col items-start justify-start capitalize'
        >
          {workspace?.name}
          <span className='text-muted-foreground text-xs'>
            Active workspace
          </span>
        </DropdownMenuItem>

        {filteredWorkspaces?.map(workspace => (
          <DropdownMenuItem
            key={workspace._id}
            className='cursor-pointer overflow-hidden capitalize'
            onClick={() =>
              router.push(`${appRoutes.workspace}/${workspace._id}`)
            }
          >
            <div className='relative mr-2 flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md bg-[#616061] text-lg font-semibold text-white'>
              {workspace.name.charAt(0).toUpperCase()}
            </div>
            <p className='truncate'>{workspace.name}</p>
          </DropdownMenuItem>
        ))}

        <DropdownMenuItem
          className='cursor-pointer'
          onClick={() => setOpen(true)}
        >
          <div className='relative mr-2 flex size-9 items-center justify-center overflow-hidden rounded-md bg-[#F2F2F2] text-lg font-semibold text-slate-800'>
            <Plus />
          </div>
          Create a new workspace
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
