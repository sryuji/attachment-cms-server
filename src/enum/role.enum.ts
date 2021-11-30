export const Role = {
  owner: 'owner',
  member: 'member',
} as const
export type RoleType = typeof Role[keyof typeof Role]
