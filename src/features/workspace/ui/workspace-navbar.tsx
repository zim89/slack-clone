import { usePathname } from 'next/navigation'
import { Bell, Home, MessagesSquare, MoreHorizontal } from 'lucide-react'
import { UserButton } from '@/features/user'
import { NavbarItem } from './navbar-item'
import { WorkspaceSwitcher } from './workspace-switcher'

export const WorkspaceNavbar = () => {
  const pathname = usePathname()

  return (
    <nav className='flex h-full w-[70px] flex-col items-center gap-y-4 bg-[#481349] pt-[9px] pb-4'>
      <WorkspaceSwitcher />

      <NavbarItem
        icon={Home}
        label='Home'
        isActive={pathname.includes('/workspace')}
      />
      <NavbarItem icon={MessagesSquare} label='DMs' />
      <NavbarItem icon={Bell} label='Activity' />
      <NavbarItem icon={MoreHorizontal} label='More' />

      <div className='mt-auto flex flex-col items-center justify-center gap-y-1'>
        <UserButton />
      </div>
    </nav>
  )
}
