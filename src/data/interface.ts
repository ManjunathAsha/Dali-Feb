// interfaces.ts
export type SidebarItemType = 'section' | 'stage' | 'location' | 'area' | 'topic' | 'list' | 'dropdown';
export type FilterType = 'section' | 'stage' | 'location' | 'area' | 'topic';
export type ActionType = 'navigate' | 'checkbox' | 'expand';
export type IconType = 
  | 'PersonAdd' 
  | 'Chapter' 
  | 'Level' 
  | 'ResidentialArea' 
  | 'Area' 
  | 'Subject'
  | 'Theme'
  | 'Star'
  | 'Attachment'
  | 'Link'
  | 'Add'
  | 'Edit'
  | 'Forward'
  | 'Map'
  | 'Group'
  | 'Inbox'
  | 'Build'
  | 'Check'
  | 'Public';

export interface FilterParams {
  sectionOrders: number[];
  stageOrders: number[];
  locationOrders: number[];
  areaOrders: number[];
  topicOrders: number[];
}

export interface FilterResponse {
  sections: Array<{
    name: string;
    orderIndex: number;
  }>;
  stages: Array<{
    name: string;
    orderIndex: number;
  }>;
  locations: Array<{
    name: string;
    orderIndex: number;
  }>;
  areas: Array<{
    name: string;
    orderIndex: number;
  }>;
  topics: Array<{
    name: string;
    orderIndex: number;
  }>;
}

export interface FilterDocumentResponse {
  data: Section[];
}

export interface Location {
  name: string;
  orderIndex: number;
}

export interface Record {
    id: number;
    description: string;
    hardness: string;
    sourcereference: {
      isPresent: boolean;
      value: string;
    };
    attachments: {
      isPresent: boolean;
      value: string;
    };
  }
  
  export interface Topic {
    topic: string;
    name: string;
    orderIndex: number;
    records: Record[];
  }
  
  export interface Area {
    area: string;
    name: string;
    orderIndex: number;
    topics?: Topic[];
    locations?: Array<{ orderIndex: number; name: string; }>;
  }
  
  export interface Stage {
    stage: string;
    name: string;
    orderIndex: number;
    areas?: Area[];
  }
  
  export interface Section {
    section: string;
    name: string;
    orderIndex: number;
    stages?: Stage[];
  }
  
  export interface DetailProps {
    sections: Section[];
    expandedIds: string[];
    handleChange: (id: string) => void;
    isDefaultView: boolean;
    selectedPoint: string;
    handleSelect: (
      point: string,
      id: string,
      hardness: string,
      attachments: any,
      sourceReference: any
    ) => void;
  }
  export interface CheckboxItemProps {
    item: {
      id: string;
      title: string;
      type: 'list' | 'dropdown' | 'section';
      path?: string;
      icon?: string;
      children?: Array<any>;
    };
    isChecked: boolean;
    toggleCheck: (id: string, event?: React.MouseEvent | React.ChangeEvent) => void;
    depth: number;
  }