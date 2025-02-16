import { ReactNode } from 'react';

export interface ApiConfig {
  headers: {
    'Content-Type': string;
    'Accept': string;
    'Authorization'?: string;
  };
  baseURL: string;
  params?: any;
}

export interface SidebarItem {
  id: string;
  title: string;
  type: 'list' | 'dropdown' | 'section' | 'stage' | 'area' | 'location' | 'topic';
  action?: 'navigate' | 'checkbox' | 'expand';
  path?: string;
  icon?: string;
  children?: SidebarItem[];
  hasSearchBar?: boolean;
  searchPlaceholder?: string;
  filterType?: string;
  filterValue?: string;
  orderIndex?: number;
}

export interface SidebarConfig {
  title: string;
  items: SidebarItem[];
}

export interface SidebarState {
  expandedItems: string[];
  checkedItems: string[];
  searchTerm: string;
  activeItem: string | null;
  currentSection: string;
  currentRole: string;
  isSidebarOpen: boolean;
  activeSection: string;
}

export interface SidebarContextType {
  state: SidebarState;
  dispatch: React.Dispatch<SidebarAction>;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
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
  | { type: 'RESET_CHECKED_ITEMS' };

export interface FilterParams {
  sectionOrders: number[];
  stageOrders: number[];
  locationOrders: number[];
  areaOrders: number[];
  topicOrders: number[];
}

export interface DocumentFile {
  externalId: string;
  fileName: string;
  filePath: string;
  fileType: string;
  url?: string;
}

export interface DocumentLink {
  id: string;
  url: string;
  description: string;
}
