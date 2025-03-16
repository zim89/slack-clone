import { atom, useAtom } from 'jotai'

const workspaceModalState = atom(false)

export const useWorkspaceModalStore = () => {
  return useAtom(workspaceModalState)
}
