import { useState } from 'react'
import { ChevronDown, ListFilter, SquarePen } from 'lucide-react'
import { Doc } from '@convex/_generated/dataModel'
import { Button } from '@/shared/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import { Hint } from '@/shared/components'
import { InviteModal } from './invite-modal'
import { PreferencesModal } from './preferences-modal'

interface Props {
  workspace: Doc<'workspaces'>
  isAdmin: boolean
}

export const AsideHeader = ({ workspace, isAdmin }: Props) => {
  const [inviteOpen, setInviteOpen] = useState(false)
  const [preferencesOpen, setPreferencesOpen] = useState(false)

  return (
    <>
      <InviteModal
        open={inviteOpen}
        setOpen={setInviteOpen}
        name={workspace.name}
        joinCode={workspace.joinCode}
      />
      <PreferencesModal
        open={preferencesOpen}
        setOpen={setPreferencesOpen}
        initialValue={workspace.name}
      />
      <div className='flex h-[49px] items-center justify-between gap-0.5 px-4'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='transparent'
              className='w-auto overflow-hidden p-1.5 text-lg font-semibold'
              size='sm'
            >
              <span className='truncate'>{workspace.name}</span>
              <ChevronDown className='ml-1 size-4 shrink-0' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side='bottom' align='start' className='w-64'>
            <DropdownMenuItem className='cursor-pointer capitalize'>
              <div className='relative mr-2 flex size-9 items-center justify-center overflow-hidden rounded-md bg-[#616061] text-xl font-semibold text-white'>
                {workspace.name.charAt(0).toUpperCase()}
              </div>
              <div className='flex flex-col items-start'>
                <p className='font-bold'>{workspace.name}</p>
                <p className='text-muted-foreground text-xs'>
                  Active workspace
                </p>
              </div>
            </DropdownMenuItem>

            {isAdmin && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className='cursor-pointer py-2'
                  onClick={() => setInviteOpen(true)}
                >
                  Invite people to {workspace.name}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className='cursor-pointer py-2'
                  onClick={() => setPreferencesOpen(true)}
                >
                  Preferences
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className='flex items-center gap-0.5'>
          <Hint label='Filter conversations' side='bottom'>
            <Button variant='transparent' size='iconSm'>
              <ListFilter className='size-4' />
            </Button>
          </Hint>
          <Hint label='New message' side='bottom'>
            <Button variant='transparent' size='iconSm'>
              <SquarePen className='size-4' />
            </Button>
          </Hint>
        </div>
      </div>
    </>
  )
}
