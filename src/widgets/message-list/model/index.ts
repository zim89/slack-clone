import { useProfileMemberId } from '@/features/member'
import { useParentMessageId } from '@/features/message'

export const usePanel = () => {
  const [parentMessageId, setParentMessageId] = useParentMessageId()
  const [profileMemberId, setProfileMemberId] = useProfileMemberId()

  const onOpenProfile = (memberId: string) => {
    setProfileMemberId(memberId)
    setParentMessageId(null)
  }

  const onOpenMessage = (messageId: string) => {
    setParentMessageId(messageId)
    setProfileMemberId(null)
  }

  const onClose = () => {
    setParentMessageId(null)
    setProfileMemberId(null)
  }

  return {
    parentMessageId,
    profileMemberId,
    onOpenProfile,
    onOpenMessage,
    onClose,
  }
}
