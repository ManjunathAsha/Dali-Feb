import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { SidebarConfig } from '../data/types';
import { FilterResponse, Section } from '../data/interface';

// Define SidebarState and SidebarAction interfaces
interface SidebarState {
  expandedItems: string[];
  checkedItems: string[];
  searchTerm: string;
  lastActiveItem: string;
  activeSection: string;
  activeItem: string | null;
  isSidebarOpen: boolean;
  role: string;
  config: SidebarConfig;
  isLoading: boolean;
  filterData: FilterResponse | null;
  isInitialized: boolean;
  filteredDocuments: Section[];
}

export type SidebarAction =
  | { type: 'TOGGLE_EXPAND'; itemId: string }
  | { type: 'TOGGLE_CHECK'; itemId: string }
  | { type: 'SET_SEARCH_TERM'; value: string }
  | { type: 'SET_ACTIVE_ITEM'; itemId: string }
  | { type: 'SET_SECTION'; section: string }
  | { type: 'SET_ROLE'; role: string }
  | { type: 'SET_ACTIVE_SECTION'; section: string; role: string }
  | { type: 'RESET_STATE' }
  | { type: 'RESET_CHECKED_ITEMS' }
  | { type: 'SET_SIDEBAR_OPEN'; isOpen: boolean }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_CONFIG'; config: SidebarConfig }
  | { type: 'SET_LOADING'; isLoading: boolean }
  | { type: 'SET_FILTER_DATA'; data: FilterResponse }
  | { type: 'SET_FILTERED_DOCUMENTS'; data: Section[] }
  | { type: 'SET_INITIALIZED'; isInitialized: boolean };

const initialState: SidebarState = {
  expandedItems: [],
  checkedItems: [],
  searchTerm: '',
  lastActiveItem: '',
  activeSection: '',
  activeItem: null,
  isSidebarOpen: true,
  role: '',
  config: {
    title: '',
    items: []
  },
  isLoading: false,
  filterData: null,
  isInitialized: false,
  filteredDocuments: []
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

function sidebarReducer(state: SidebarState, action: SidebarAction): SidebarState {
  switch (action.type) {
    case 'SET_SIDEBAR_OPEN':
      return {
        ...state,
        isSidebarOpen: action.isOpen
      };

    case 'TOGGLE_SIDEBAR':
      return {
        ...state,
        isSidebarOpen: !state.isSidebarOpen
      };

    case 'TOGGLE_EXPAND':
      const isCurrentlyExpanded = state.expandedItems.includes(action.itemId);
      return {
        ...state,
        expandedItems: isCurrentlyExpanded
          ? state.expandedItems.filter(id => !id.startsWith(action.itemId))
          : [...state.expandedItems, action.itemId],
        isSidebarOpen: true
      };

    case 'TOGGLE_CHECK': {
      const { itemId } = action;
      const isCurrentlyChecked = state.checkedItems.includes(itemId);
      
      // Simply toggle the clicked item without affecting others
      return {
        ...state,
        checkedItems: isCurrentlyChecked
          ? state.checkedItems.filter(id => id !== itemId)
          : [...state.checkedItems, itemId],
        isSidebarOpen: true
      };
    }

    case 'SET_SEARCH_TERM':
      return {
        ...state,
        searchTerm: action.value
      };

    case 'SET_ACTIVE_ITEM':
      return {
        ...state,
        activeItem: action.itemId,
        lastActiveItem: state.activeItem || ''
      };

    case 'SET_ACTIVE_SECTION':
      return {
        ...state,
        activeSection: action.section,
        role: action.role
      };

    case 'RESET_STATE':
      return {
        ...initialState,
        activeSection: state.activeSection,
        role: state.role
      };

    case 'RESET_CHECKED_ITEMS':
      return {
        ...state,
        checkedItems: []
      };

    case 'SET_CONFIG':
      return {
        ...state,
        config: action.config
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.isLoading
      };

    case 'SET_FILTER_DATA':
      return {
        ...state,
        filterData: action.data
      };

    case 'SET_FILTERED_DOCUMENTS':
      return {
        ...state,
        filteredDocuments: action.data
      };

    case 'SET_INITIALIZED':
      return {
        ...state,
        isInitialized: action.isInitialized
      };

    default:
      return state;
  }
}

interface SidebarContextType {
  state: SidebarState;
  dispatch: React.Dispatch<SidebarAction>;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer<typeof sidebarReducer>(sidebarReducer, initialState);

  // Save sidebar state to localStorage
  useEffect(() => {
    localStorage.setItem('isSidebarOpen', state.isSidebarOpen.toString());
  }, [state.isSidebarOpen]);

  useEffect(() => {
    localStorage.setItem('expandedItems', JSON.stringify(state.expandedItems));
  }, [state.expandedItems]);

  useEffect(() => {
    localStorage.setItem('checkedItems', JSON.stringify(state.checkedItems));
  }, [state.checkedItems]);

  useEffect(() => {
    if (state.activeItem !== null) {
      localStorage.setItem('activeItem', state.activeItem);
    }
  }, [state.activeItem]);

  useEffect(() => {
    if (state.activeSection) {
      localStorage.setItem('activeSection', state.activeSection);
    }
    if (state.role) {
      localStorage.setItem('userRole', state.role);
    }
  }, [state.activeSection, state.role]);

  const toggleSidebar = () => {
    dispatch({ type: 'TOGGLE_SIDEBAR' });
  };

  return (
    <SidebarContext.Provider value={{ state, dispatch, isSidebarOpen: state.isSidebarOpen, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};
