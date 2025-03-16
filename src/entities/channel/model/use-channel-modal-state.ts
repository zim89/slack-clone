import { atom, useAtom } from 'jotai'

const channelModalState = atom(false)

export const useChannelModalState = () => {
  return useAtom(channelModalState)
}
