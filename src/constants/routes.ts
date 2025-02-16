export const ROUTES = {
  ROOT: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  HANDBOOK: {
    ROOT: '/handbook',
    WELCOME: '/welcome'
  },
  AUTH: {
    LOGIN: '/login',
    LOGOUT: '/logout'
  },
  USERCREATION: {
    ROOT: '/users',
    NEWUSER: '/users/new',
    USERBYROLES: '/users/roles',
    LASTLOGGIN: '/users/last-login'
  },
  EXTERNALMAPS: {
    ROOT: '/external-maps'
  },
  CONSULTVIAMAPS: {
    ROOT: '/mapModal',
  },
  PROJECTS: {
    ROOT: '/newUser',
  },
  SUPPORT: {
    ROOT: '/newUser',
  },
  SETTINGS: '/settings',
  ERROR: {
    NOT_FOUND: '/404',
    SERVER_ERROR: '/500',
  }
} as const;