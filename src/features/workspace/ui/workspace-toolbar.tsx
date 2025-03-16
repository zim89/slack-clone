import { Info, Search } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { useGetWorkspace } from '@/entities/workspace'
import { useWorkspaceId } from '@/shared/hooks'

export const WorkspaceToolbar = () => {
  const workspaceId = useWorkspaceId()

  const { data } = useGetWorkspace({ id: workspaceId })

  return (
    <nav className='flex h-10 items-center justify-between bg-[#481349] p-1.5'>
      <div className='flex-1' />
      <div className='max-[642px] min-w-[280px] shrink grow-[2]'>
        <Button
          size='sm'
          className='bg-accent/25 hover:bg-accent-25 h-7 w-full justify-start px-2'
        >
          <Search className='mr-2 size-4 text-white' />
          <span className='text-xs text-white'>Search {data?.name}</span>
        </Button>
      </div>
      <div className='ml-auto flex flex-1 items-center justify-end'>
        <Button variant='transparent' size='iconSm'>
          <Info className='size-5 text-white' />
        </Button>
      </div>
    </nav>
  )
}
