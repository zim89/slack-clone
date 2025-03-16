export const StatusEnum = {
  Pending: 'pending',
  Success: 'success',
  Error: 'error',
  Settled: 'settled',
} as const

export type StatusType = (typeof StatusEnum)[keyof typeof StatusEnum]

export const ResourceEnum = {
  Workspace: 'workspace',
  Channel: 'channel',
  Member: 'member',
  Message: 'message',
} as const

export type ResourceType = (typeof ResourceEnum)[keyof typeof ResourceEnum]

export const RoleEnum = {
  Admin: 'admin',
  Member: 'member',
} as const

export type RoleType = (typeof RoleEnum)[keyof typeof RoleEnum]
