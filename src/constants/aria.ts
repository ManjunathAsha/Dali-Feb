export const ARIA_LABELS = {
  NAVIGATION: {
    MAIN: 'Main navigation',
    SIDEBAR: 'Sidebar navigation',
    SKIP_LINK: 'Skip to main content',
    DRAWER: 'Side drawer',
    MENU: 'Menu',
    BREADCRUMB: 'Breadcrumb navigation',
    PAGINATION: 'Page navigation',
    TABS: 'Tab navigation',
    DROPDOWN: 'Dropdown menu',
    BACK: 'Go back to previous page',
    FORWARD: 'Go forward to next page',
  },

  BUTTONS: {
    CLOSE: 'Close',
    SUBMIT: 'Submit',
    CANCEL: 'Cancel',
    EDIT: 'Edit',
    DELETE: 'Delete',
    EXPAND: 'Expand',
    COLLAPSE: 'Collapse',
    HELP: 'Help',
    SETTINGS: 'Settings',
    SEARCH: 'Search',
    REFRESH: 'Refresh page',
    DOWNLOAD: 'Download',
    UPLOAD: 'Upload',
    SAVE: 'Save changes',
    ADD: 'Add new item',
    REMOVE: 'Remove item',
    NEXT: 'Next',
    PREVIOUS: 'Previous',
    PLAY: 'Play',
    PAUSE: 'Pause',
    MENU_TOGGLE: 'Toggle menu',
    FILTER: 'Filter results',
    SORT: 'Sort results',
    SELECT_ALL: 'Select all',
    DESELECT_ALL: 'Deselect all',
  },

  FORMS: {
    LOGIN: 'Login form',
    SIGNUP: 'Sign up form',
    SEARCH: 'Search form',
    FEEDBACK: 'Feedback form',
    CONTACT: 'Contact form',
    EMAIL: 'Enter your email address', // Added this line

    
    INPUTS: {
      USERNAME: 'Enter your username',
      PASSWORD: 'Enter your password',
      EMAIL: 'Enter your email address',
      SEARCH: 'Enter search terms',
      REQUIRED: 'This field is required',
      OPTIONAL: 'This field is optional',
      INVALID: 'Input is invalid',
      VALID: 'Input is valid',
    },

    VALIDATION: {
      ERROR: 'Form contains errors',
      SUCCESS: 'Form submitted successfully',
      REQUIRED: 'Required field',
      INVALID_EMAIL: 'Invalid email address',
      INVALID_PASSWORD: 'Invalid password',
      PASSWORD_MISMATCH: 'Passwords do not match',
    }
  },

  MODAL: {
    CLOSE: 'Close modal',
    OPEN: 'Open modal',
    DIALOG: 'Dialog window',
    ALERT: 'Alert dialog',
    CONFIRM: 'Confirmation dialog',
    WARNING: 'Warning dialog',
    SUCCESS: 'Success dialog',
    ERROR: 'Error dialog',
  },

  SECTIONS: {
    DASHBOARD: 'Dashboard section',
    HANDBOOK: 'Handbook section',
    SETTINGS: 'Settings section',
    PROFILE: 'Profile section',
    PROJECTS: 'Projects section',
    REPORTS: 'Reports section',
    ANALYTICS: 'Analytics section',
    USERS: 'Users section',
    ADMIN: 'Administration section',
    HELP: 'Help section',
  },

  STATUS: {
    LOADING: 'Loading content',
    ERROR: 'Error occurred',
    SUCCESS: 'Operation successful',
    WARNING: 'Warning',
    INFO: 'Information',
    EMPTY: 'No items to display',
    UPDATING: 'Updating content',
    SAVING: 'Saving changes',
    DELETING: 'Deleting item',
    PROCESSING: 'Processing request',
    COMPLETED: 'Operation completed',
    FAILED: 'Operation failed',
    TIMEOUT: 'Operation timed out',
  },

  TABLES: {
    HEADER: 'Table header',
    ROW: 'Table row',
    CELL: 'Table cell',
    SORT_ASC: 'Sort ascending',
    SORT_DESC: 'Sort descending',
    SELECT_ROW: 'Select row',
    EXPAND_ROW: 'Expand row',
    COLLAPSE_ROW: 'Collapse row',
    NO_DATA: 'No data available',
    LOADING: 'Loading table data',
    FILTER: 'Filter table',
  },

  CARDS: {
    DASHBOARD: {
      HANDBOOK: 'Open handbook section',
      CONSULT_MAP: 'Open map consultation',
      EXTERNAL_MAPS: 'Open external maps',
      PROJECTS: 'Open projects section',
      ACCOUNTS: 'Open accounts and rights',
      SUPPORT: 'Open support section',
    },
    EXPAND: 'Expand card',
    COLLAPSE: 'Collapse card',
    MORE: 'Show more',
    LESS: 'Show less',
  },

  LOADING: {
    SPINNER: 'Loading spinner',
    PROGRESS: 'Loading progress',
    INITIAL: 'Initial loading',
    DATA: 'Loading data',
    PAGE: 'Loading page',
    IMAGE: 'Loading image',
    FILE: 'Loading file',
    OVERLAY: 'Loading overlay',
  },

  ANNOUNCEMENTS: {
    PAGE_LOADED: 'Page loaded',
    DATA_UPDATED: 'Data updated',
    CHANGES_SAVED: 'Changes saved',
    ACTION_COMPLETED: 'Action completed',
    NEW_CONTENT: 'New content available',
  },

  ERRORS: {
    PAGE_ERROR: 'Error loading page',
    DATA_ERROR: 'Error loading data',
    NETWORK_ERROR: 'Network connection error',
    PERMISSION_ERROR: 'Permission denied',
    VALIDATION_ERROR: 'Validation error',
    UNKNOWN_ERROR: 'Unknown error occurred',
  }
} as const;

// Type for all possible ARIA label paths
type AriaLabelKeys = {
  [K1 in keyof typeof ARIA_LABELS]: {
    [K2 in keyof typeof ARIA_LABELS[K1]]: string;
  };
};

// Helper function to get ARIA labels with type safety
export const getAriaLabel = (
  section: keyof typeof ARIA_LABELS,
  key: keyof AriaLabelKeys[typeof section]
): string => {
  return ARIA_LABELS[section][key];
};