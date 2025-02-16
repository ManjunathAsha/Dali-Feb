export const ROLES = {
  ADMIN: 'admin',
  SYSTEM_ADMIN: 'systemadmin',
  OWNER: 'owner',
  READER: 'reader',
  PUBLISHER: 'publisher',
} as const;

export type UserRole = typeof ROLES[keyof typeof ROLES];

export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: {
    canEdit: true,
    canDelete: true,
    canPublish: true,
    canManageUsers: true,
  },
  [ROLES.SYSTEM_ADMIN]: {
    canEdit: true,
    canDelete: true,
    canPublish: true,
    canManageUsers: true,
  },
  [ROLES.OWNER]: {
    canEdit: true,
    canDelete: true,
    canPublish: true,
    canManageUsers: false,
  },
  [ROLES.PUBLISHER]: {
    canEdit: true,
    canDelete: false,
    canPublish: true,
    canManageUsers: false,
  },
  [ROLES.READER]: {
    canEdit: false,
    canDelete: false,
    canPublish: false,
    canManageUsers: false,
  }
};