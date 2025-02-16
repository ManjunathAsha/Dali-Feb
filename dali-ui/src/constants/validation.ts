export const VALIDATION = {
    USERNAME: {
      REQUIRED: 'Username is required',
      MIN_LENGTH: 'Username must be at least 3 characters',
      MAX_LENGTH: 'Username cannot exceed 50 characters',
    },
    PASSWORD: {
      REQUIRED: 'Password is required',
      MIN_LENGTH: 'Password must be at least 8 characters',
      PATTERN: 'Password must contain at least one number and one letter',
    },
    EMAIL: {
      REQUIRED: 'Email is required',
      INVALID: 'Please enter a valid email address',
    },
    GENERAL: {
      REQUIRED: 'This field is required',
      INVALID: 'Invalid input',
    }
  };