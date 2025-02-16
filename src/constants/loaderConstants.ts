export const LOADER_CONSTANTS = {
    BACKGROUND_COLORS: {
      BLUE: 'loading-lib-loader-bg-blue',
      GREEN: 'loading-lib-loader-bg-green',
      RED: 'loading-lib-loader-bg-red',
      PINK: 'loading-lib-loader-bg-pink',
      PURPLE: 'loading-lib-loader-bg-purple',
      RAINBOW: 'loading-lib-loader-bg-rainbow',
      SHADOW: 'loading-lib-loader-bg-shadow',
      BLUESKY: 'loading-lib-loader-bg-bluesky'
    },
    
    TEXT_COLORS: {
      BLACK: 'loading-lib-loader-text-black',
      WHITE: 'loading-lib-loader-text-white',
      BLUE: 'loading-lib-loader-text-blue',
      GREEN: 'loading-lib-loader-text-green',
      RED: 'loading-lib-loader-text-red',
      PINK: 'loading-lib-loader-text-pink',
      PURPLE: 'loading-lib-loader-text-purple'
    },
    
    SPINNER_TYPES: {
      BASIC: 'basic-spinner',
      SIGNAL: 'signal-spinner',
      BOUNCY: 'bouncy-spinner',
      SQUARE: 'square-spinner',
      BUBBLE: 'bubble-spinner',
      RECT: 'rect-spinner',
      DOUBLE_BLOCKS: 'double-blocks-spinner',
      SK_CUBE_GRID: 'sk-cube-grid'
    },
    
    LOADING_MESSAGES: {
      DEFAULT: {
        NL: 'Bezig met laden...',
        EN: 'Loading...'
      },
      LOGIN: {
        NL: 'Bezig met inloggen...',
        EN: 'Logging in...'
      },
      PREPARE: {
        NL: 'Bezig met voorbereiden...',
        EN: 'Preparing...'
      },
      NIEUWEVERSIE: {
        NL: 'Nieuwe versie aanmaken. Een ogenblik geduld...',
        EN: null
      },
      EISENVERWERKEN: {
        NL: 'Bezig met overnemen van eisen...',
        EN: null
      }
    }
  } as const;
  
  export type BackgroundColor = keyof typeof LOADER_CONSTANTS.BACKGROUND_COLORS;
  export type TextColor = keyof typeof LOADER_CONSTANTS.TEXT_COLORS;
  export type SpinnerType = keyof typeof LOADER_CONSTANTS.SPINNER_TYPES;
  export type LoadingMessageKey = keyof typeof LOADER_CONSTANTS.LOADING_MESSAGES;