import { SidebarConfig } from './types';




// Role-based handbook sidebar configs
const handbookSidebarConfigs: { [role: string]: SidebarConfig } = {
  

  Owner: {
    title: 'HANDBOEK',
    items: [
      {
        id: 'consultOwner',
        title: 'RAADPLEGEN',
        type: 'dropdown',
        children: [
          {
            id: 'sectionOwner',
            title: 'Hoofdstuk',
            type: 'dropdown',
            icon: 'Chapter',
            hasSearchBar: true,
            searchPlaceholder: 'Zoeken binnen Hoofdstuk',
            children: [],

          },
          {
            id: 'stageOwner',
            title: 'Niveau',
            type: 'dropdown',
            icon: 'Level',
            children: [],
          },

          {
            id: 'locationOwner',
            title: 'Woonkern',
            type: 'dropdown',
            icon: 'ResidentialArea',
            children: [],
          },

          {
            id: 'areaOwner',
            title: 'Gebied',
            type: 'dropdown',
            icon: 'Area',
            children: [],
          },

          {
            id: 'topicOwner', 
            title: 'Onderwerp',
            type: 'dropdown',
            icon: 'Subject',
            hasSearchBar: true,
            searchPlaceholder: 'Zoeken binnen Hoofdstuk',
            children: [
            ],
          },

         
          { id: 'theme', title: 'Thema', type: 'dropdown', action: 'navigate', path: '/thema', icon: 'Theme' },
          {
            id: 'favoritOwner',
            title: 'Favorieten',
            type: 'dropdown',
            icon: 'Star',
            hasSearchBar: true,
            searchPlaceholder: 'Zoeken binnen Hoofdstuk',
            children: [],
          },
          { id: 'attachment', title: 'Bijlage', type: 'section', action: 'navigate', path: '/NewRequirement', icon: 'Attachment' },
          { id: 'sourceRef', title: 'Bronverwijzing', type: 'section', action: 'navigate', path: '/NewRequirement', icon: 'Link' },
    
        ],
      },
     
      {
        id: 'chapterManagement',
        title: 'Collectiebeheer',
        type: 'dropdown',
        children: [
          { id: 'newRequirement', title: 'Nieuwe vereiste', type: 'section', action: 'navigate', path: '/NewRequirement', icon: 'Add' },
          { id: 'changeRequest', title: 'Wijzigingsverzoek', type: 'section', action: 'navigate', path: '/ChangeRequest', icon: 'Edit' },
          { id: 'frdChangeRequest', title: 'Doorgestuurd wijzigingsverzoek', type: 'section', action: 'navigate', path: '/ForwardedChangeRequests', icon: 'Forward' },
        ],
      },
    ],
  },
  Publisher: {
    title: 'HANDBOEK',
    items: [
      {
        id: 'consultPublisher',
        title: 'RAADPLEGEN',
        type: 'dropdown',
        children: [
          {
            id: 'sectionPublisher',
            title: 'Hoofdstuk',
            type: 'dropdown',
            icon: 'Chapter',
            hasSearchBar: true,
            searchPlaceholder: 'Zoeken binnen Hoofdstuk',
            children: [],
          },
          {
            id: 'stagePublisher',
            title: 'Niveau',
            type: 'dropdown',
            icon: 'Level',
            children: [],
          },
          {
            id: 'locationPublisher',
            title: 'Woonkern',
            type: 'dropdown',
            icon: 'ResidentialArea',
            children: [],
          },
          {
            id: 'areaPublisher',
            title: 'Gebied',
            type: 'dropdown',
            icon: 'Area',
            children: [],
          },
          {
            id: 'topicPublisher',
            title: 'Onderwerp',
            type: 'dropdown',
            icon: 'Subject',
            hasSearchBar: true,
            searchPlaceholder: 'Zoeken binnen Hoofdstuk',
            children: [],
          },
          { 
            id: 'themePublisher', 
            title: 'Thema', 
            type: 'dropdown', 
            icon: 'Theme',
            children: [],
          },
          {
            id: 'favoritesPublisher',
            title: 'Favorieten',
            type: 'dropdown',
            icon: 'Star',
            hasSearchBar: true,
            searchPlaceholder: 'Zoeken binnen Hoofdstuk',
            children: [],
          },
        ],
      },
      {
        id: 'publicationManagement',
        title: 'PUBLICATICATIEBEHEER',
        type: 'dropdown',
        children: [
          { id: 'newChangeRequest', title: 'Nieuwe Wijzigingverzoeken', type: 'section', icon: 'Inbox' },
          { id: 'changeRequestinProgress', title: 'Wijzigingsverzoek in behandeling', type: 'section', icon: 'Build' },
          { id: 'scheduleChangeReq', title: 'Ingeplande wijzigingsverzoek', type: 'section', icon: 'Check' },
          { id: 'publication', title: 'Publicatie', type: 'section', icon: 'Public' },
        ],
      },
      {
        id: 'manualManagement',
        title: 'HOOFDSTUKBEHEER',
        type: 'dropdown',
        children: [
          { id: 'customizechapter', title: 'Hoofdstukken aanpassen', type: 'section', icon: 'Edit' },
          { id: 'adjustArea', title: 'Gebieden aanpassen', type: 'section', icon: 'Edit' },
          { id: 'editTopics', title: 'Onderwerpen aanpassen', type: 'section', icon: 'Edit' },
        ],
      },
    ],
  },
  Reader: {
    title: 'HANDBOEK',
    items: [
      {
        id: 'consultReader',
        title: 'RAADPLEGEN',
        type: 'dropdown',
        children: [
          {
            id: 'sectionReader',
            title: 'Hoofdstuk',
            type: 'dropdown',
            icon: 'Chapter',
            hasSearchBar: true,
            searchPlaceholder: 'Zoeken binnen Hoofdstuk',
            children: [
              { id: 'hoofdstuk1', title: '01. Planproces', type: 'list', action: 'navigate', path: '/handbook' },
              { id: 'hoofdstuk2', title: '02. Groenvoorzieningen', type: 'list', action: 'navigate', path: '/welcomePage' },
              { id: 'hoofdstuk3', title: '03. Groenvoorzieningen', type: 'list', action: 'navigate', path: '/welcomePage' },
            ],
          },
          {
            id: 'stageReader',
            title: 'Niveau',
            type: 'dropdown',
            icon: 'Level',
            children: [
              { id: 'hoofdstuk1', title: '01. Planproces', type: 'list', action: 'navigate', path: '/handbook' },
              { id: 'hoofdstuk2', title: '02. Groenvoorzieningen', type: 'list', action: 'navigate', path: '/welcomePage' },
              { id: 'hoofdstuk3', title: '03. Groenvoorzieningen', type: 'list', action: 'navigate', path: '/welcomePage' },
            ],
          },

          {
            id: 'locationReader',
            title: 'Woonkern',
            type: 'dropdown',
            icon: 'ResidentialArea',
            children: [
              { id: 'hoofdstuk1', title: '01. Planproces', type: 'list', action: 'navigate', path: '/handbook' },
              { id: 'hoofdstuk2', title: '02. Groenvoorzieningen', type: 'list', action: 'navigate', path: '/welcomePage' },
              { id: 'hoofdstuk3', title: '03. Groenvoorzieningen', type: 'list', action: 'navigate', path: '/welcomePage' },
            ],
          },

          {
            id: 'areaReader',
            title: 'Gebied',
            type: 'dropdown',
            icon: 'Area',
            children: [
              { id: 'hoofdstuk1', title: '01. Planproces', type: 'list', action: 'navigate', path: '/handbook' },
              { id: 'hoofdstuk2', title: '02. Groenvoorzieningen', type: 'list', action: 'navigate', path: '/welcomePage' },
              { id: 'hoofdstuk3', title: '03. Groenvoorzieningen', type: 'list', action: 'navigate', path: '/welcomePage' },
            ],
          },

          {
            id: 'topicReader',
            title: 'Onderwerp',
            type: 'dropdown',
            icon: 'Subject',
            hasSearchBar: true,
            searchPlaceholder: 'Zoeken binnen Hoofdstuk',
            children: [
              { id: 'hoofdstuk1', title: '01. Planproces', type: 'list', action: 'navigate', path: '/handbook' },
              { id: 'hoofdstuk2', title: '02. Groenvoorzieningen', type: 'list', action: 'navigate', path: '/welcomePage' },
              { id: 'hoofdstuk3', title: '03. Groenvoorzieningen', type: 'list', action: 'navigate', path: '/welcomePage' },
            ],
          },

         
          { id: 'themeReader', title: 'Thema', type: 'dropdown', action: 'navigate', path: '/thema', icon: 'Theme' },
          {
            id: 'topicReader',
            title: 'Favorieten',
            type: 'dropdown',
            icon: 'Star',
            hasSearchBar: true,
            searchPlaceholder: 'Zoeken binnen Hoofdstuk',
            children: [
              { id: 'hoofdstuk1', title: '01. Planproces', type: 'list', action: 'navigate', path: '/handbook' },
              { id: 'hoofdstuk2', title: '02. Groenvoorzieningen', type: 'list', action: 'navigate', path: '/welcomePage' },
              { id: 'hoofdstuk3', title: '03. Groenvoorzieningen', type: 'list', action: 'navigate', path: '/welcomePage' },
            ],
          },
          
        ],
      },
      { id: 'attachmentReader', title: 'Bijlage', type: 'section', action: 'navigate', path: '/NewRequirement', icon: 'Attachment' },
      { id: 'sourceRefReader', title: 'Bronverwijzing', type: 'section', action: 'navigate', path: '/NewRequirement', icon: 'Link' },

  
    ],
  },
};


const accountsRightsSidebarConfigs: { [role: string]: SidebarConfig } = {
  Admin: {
    title: 'Account',
    items: [
      {
       
          
            id: 'userManagement',
            title: 'Gebruikersbeheer',
            type: 'dropdown',
            icon: 'Map',
           
            children: [
              { id: 'createUser', title: 'New User', type: 'section',icon: 'PersonAdd' , action: 'navigate', path: '/newUser' },
              { id: 'userOverview', title: 'User Overview', type: 'section',icon: 'Group' , action: 'navigate', path: '/UserOverview' },
              { id: 'lastLog', title: 'Last Logged In', type: 'section', action: 'navigate',icon: 'Group' , path: '/lastLoggedIn' },
              { id: 'userRole', title: 'Users By Role ', type: 'section', action: 'navigate',icon: 'Group' , path: '/usersByRole' },
          
            ],
          
        },
    ],
},
    };


    const mapsSidebarConfigs: { [role: string]: SidebarConfig } = {
      Owner: {
        title: 'HANDBOEK',
        items: [
          {
            id: 'consultMap',
            title: 'RAADPLEGEN',
            type: 'dropdown',
            children: [
              {
                id: 'externalMap',
                title: 'Hoofdstuk',
                type: 'dropdown',
                icon: 'Map',
                children: [], // Ensure this is an array, even if empty
              },
            ],
          },
        ],
      },
    
      Reader: {
        title: 'HANDBOEK',
        items: [
          {
            id: 'consultMapReader',
            title: 'RAADPLEGEN',
            type: 'dropdown',
            children: [
              {
                id: 'externalMapReader',
                title: 'Hoofdstuk',
                type: 'dropdown',
                icon: 'Map',
                children: [], // Ensure this is an array, even if empty
              },
            ],
          },
        ],
      },
    
      Publisher: {
        title: 'HANDBOEK',
        items: [
          {
            id: 'consultMapPublisher',
            title: 'RAADPLEGEN',
            type: 'dropdown',
            children: [
              {
                id: 'externalMapPublisher',
                title: 'Hoofdstuk',
                type: 'dropdown',
                icon: 'Map',
                children: [], // Ensure this is an array, even if empty
              },
            ],
          },
        ],
      },
    };






    

        

// Default Sidebar Configurations
const defaultSidebarConfigs: { [section: string]: { [role: string]: SidebarConfig } } = {
  handbook: handbookSidebarConfigs,
  externalMaps: mapsSidebarConfigs,
  accountsRights: accountsRightsSidebarConfigs,
};



// Function to Fetch Sidebar Configurations Dynamically
export const getSidebarConfig = (role: string, section: string): SidebarConfig | null => {
  const sectionConfig = defaultSidebarConfigs[section];
  if (!sectionConfig) {
    console.warn(`No configuration found for section: ${section}`);
    return null;
  }

  const roleConfig = sectionConfig[role];
  if (!roleConfig) {
    console.warn(`No sidebar configuration for role: ${role} in section: ${section}`);
    return null;
  }

  return roleConfig;
};