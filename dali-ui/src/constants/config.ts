export const CONFIG = {
    API: {
      BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:3000',
      TIMEOUT: 5000,
    },
    AUTH: {
      TOKEN_KEY: 'auth_token',
      REFRESH_TOKEN_KEY: 'refresh_token',
      SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
    },
    UI: {
      ITEMS_PER_PAGE: 10,
      MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
      ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'application/pdf'],
    }
  };