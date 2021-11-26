export const Role = {
  owner: 'owner',
  member: 'member',
  super: 'super', // Scope関係なくこのシステムの管理者
} as const
export type RoleType = typeof Role[keyof typeof Role]
