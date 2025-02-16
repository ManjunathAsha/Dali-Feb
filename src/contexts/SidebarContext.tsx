import { createContext, useContext, useReducer, ReactNode } from 'react';
import { SidebarConfig } from '../data/types';

interface SidebarState {
  isSidebarOpen: boolean;
  expandedItems: string[];
  checkedItems: string[];
  searchTerm: string;
  activeItem: string | null;
  config: SidebarConfig;
  isLoading: boolean;
  isInitialized: boolean;
}

const initialState: SidebarState = {
  isSidebarOpen: true,
  expandedItems: [],
  checkedItems: [],
  searchTerm: '',
  activeItem: null,
  config: { title: '', items: [] },
  isLoading: true,
  isInitialized: false,
};

type SidebarAction =
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'TOGGLE_EXPAND'; itemId: string }
  | { type: 'TOGGLE_CHECK'; itemId: string }
  | { type: 'SET_SEARCH_TERM'; value: string }
  | { type: 'SET_ACTIVE_ITEM'; itemId: string }
  | { type: 'SET_CONFIG'; config: SidebarConfig }
  | { type: 'SET_LOADING'; isLoading: boolean }
  | { type: 'SET_INITIALIZED'; isInitialized: boolean };

const sidebarReducer = (state: SidebarState, action: SidebarAction): SidebarState => {
  switch (action.type) {
    case 'TOGGLE_SIDEBAR':
      return { ...state, isSidebarOpen: !state.isSidebarOpen };
    case 'TOGGLE_EXPAND':
      return {
        ...state,
        expandedItems: state.expandedItems.includes(action.itemId)
          ? state.expandedItems.filter(id => id !== action.itemId)
          : [...state.expandedItems, action.itemId],
      };
    case 'TOGGLE_CHECK':
      return {
        ...state,
        checkedItems: state.checkedItems.includes(action.itemId)
          ? state.checkedItems.filter(id => id !== action.itemId)
          : [...state.checkedItems, action.itemId],
      };
    case 'SET_SEARCH_TERM':
      return { ...state, searchTerm: action.value };
    case 'SET_ACTIVE_ITEM':
      return { ...state, activeItem: action.itemId };
    case 'SET_CONFIG':
      return { ...state, config: action.config };
    case 'SET_LOADING':
      return { ...state, isLoading: action.isLoading };
    case 'SET_INITIALIZED':
      return { ...state, isInitialized: action.isInitialized };
    default:
      return state;
  }
};

const SidebarContext = createContext<{
  state: SidebarState;
  dispatch: React.Dispatch<SidebarAction>;
}>({
  state: initialState,
  dispatch: () => {},
});

const SidebarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(sidebarReducer, initialState);

  return (
    <SidebarContext.Provider value={{ state, dispatch }}>
      {children}
    </SidebarContext.Provider>
  );
};

const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

export { SidebarContext, SidebarProvider, useSidebar }; 