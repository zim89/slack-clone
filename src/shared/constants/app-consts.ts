export const StatusEnum = {
  Pending: 'pending',
  Success: 'success',
  Error: 'error',
  Settled: 'settled',
} as const

export type StatusType = (typeof StatusEnum)[keyof typeof StatusEnum]

export const ResourceEnum = {
  Workspace: 'workspaces',
} as const

export type ResourceType = (typeof ResourceEnum)[keyof typeof ResourceEnum]
