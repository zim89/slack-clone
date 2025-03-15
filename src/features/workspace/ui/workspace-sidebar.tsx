import { usePathname } from 'next/navigation'
import { Bell, Home, MessagesSquare, MoreHorizontal } from 'lucide-react'
import { UserButton } from '@/features/user'
import { SidebarButton } from './sidebar-button'
import { WorkspaceSwitcher } from './workspace-switcher'

export const WorkspaceSidebar = () => {
  const pathname = usePathname()

  return (
    <aside className='flex h-full w-[70px] flex-col items-center gap-y-4 bg-[#481349] pt-[9px] pb-4'>
      <WorkspaceSwitcher />

      <SidebarButton
        icon={Home}
        label='Home'
        isActive={pathname.includes('/workspace')}
      />
      <SidebarButton icon={MessagesSquare} label='DMs' />
      <SidebarButton icon={Bell} label='Activity' />
      <SidebarButton icon={MoreHorizontal} label='More' />

      <div className='mt-auto flex flex-col items-center justify-center gap-y-1'>
        <UserButton />
      </div>
    </aside>
  )
}
