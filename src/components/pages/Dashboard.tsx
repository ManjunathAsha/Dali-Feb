import React ,{useState}from 'react';
import { Box, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { 
  faBook, 
  faMapMarkerAlt, 
  faMap, 
  faFolder, 
  faUsers, 
  faQuestionCircle 
} from '@fortawesome/free-solid-svg-icons';

import CustomAppBar from './Layout/CustomAppBar';
import DashboardTile from './DashboardTile';
import { COLORS } from '../../constants/colors';
import { useA11y } from '../../hooks/useA11y';
import { ROUTES } from '../../constants/index';
import { useLoading } from '../../context/LoadingContext';
import { ARIA_LABELS } from '../../constants/aria';
import { ShowLoadingParams } from '../../context/LoadingContext';
import { useSidebar } from '../../context/SidebarContext';
import { useUser } from '../../context/AuthContext';
import { MapModal } from './ExtenalMap/MapModal';

type Role = 'Admin' | 'Owner' | 'Reader' | 'Publisher' | 'SystemAdmin';

interface DashboardCardProps {
  id: string;
  title: string;
  content: string;
  icon: any;
  requiredRoles: Role[];
  backgroundColor: string;
  hoverColor: string;
}

const loadingConfigs: Record<string, ShowLoadingParams> = {
  'handbook': {
    messageKey: 'EISENVERWERKEN',
    backgroundColor: 'RED',
    textColor: 'WHITE',
    spinnerType: 'DOUBLE_BLOCKS'
  },
  'consultViaMap': {
    messageKey: 'EISENVERWERKEN',
    backgroundColor: 'BLUE',
    textColor: 'WHITE',
    spinnerType: 'SIGNAL'
  },
  'externalMaps': {
    messageKey: 'DEFAULT',
    backgroundColor: 'BLUE',
    textColor: 'WHITE',
    spinnerType: 'BASIC'
  },
  'projects': {
    messageKey: 'DEFAULT',
    backgroundColor: 'PURPLE',
    textColor: 'WHITE',
    spinnerType: 'BOUNCY'
  },
  'accountsRights': {
    messageKey: 'DEFAULT',
    backgroundColor: 'GREEN',
    textColor: 'WHITE',
    spinnerType: 'RECT'
  },
  'support': {
    messageKey: 'DEFAULT',
    backgroundColor: 'GREEN',
    textColor: 'WHITE',
    spinnerType: 'BASIC'
  }
};

const dashboardCards: DashboardCardProps[] = [
  {
    id: 'handbook',
    title: 'Handbook',
    content: 'Guidelines for Public Space Design (LIOR)',
    icon: faBook,
    requiredRoles: ['Owner', 'Reader', 'Publisher'],
    backgroundColor: COLORS.dashboard.red,
    hoverColor: COLORS.dashboard.redHover,
  },
  {
    id: 'consultViaMap',
    title: 'Consult via map',
    content: 'Consulting the manual via map view',
    icon: faMapMarkerAlt,
    requiredRoles: ['Owner', 'Reader', 'Publisher'],
    backgroundColor: COLORS.dashboard.desert,
    hoverColor: COLORS.dashboard.desertHover,
  },
  {
    id: 'externalMaps',
    title: 'External maps',
    content: 'Consulting online maps',
    icon: faMap,
    requiredRoles: ['Owner', 'Reader', 'Publisher'],
    backgroundColor: COLORS.dashboard.blue,
    hoverColor: COLORS.dashboard.blueHover,
  },
  {
    id: 'projects',
    title: 'Projects',
    content: 'Project Specific Program of Requirements',
    icon: faFolder,
    requiredRoles: ['Owner', 'Reader', 'Publisher'],
    backgroundColor: COLORS.dashboard.purple,
    hoverColor: COLORS.dashboard.purpleHover,
  },
  {
    id: 'accountsRights',
    title: 'Accounts and Rights',
    content: 'User Administration',
    icon: faUsers,
    requiredRoles: ['Admin', 'SystemAdmin'],
    backgroundColor: COLORS.dashboard.meangreen,
    hoverColor: COLORS.dashboard.meangreenHover,
  },
  {
    id: 'support',
    title: 'Support',
    content: 'How can we help?',
    icon: faQuestionCircle,
    requiredRoles: ['Owner', 'Reader', 'Publisher', 'Admin', 'SystemAdmin'],
    backgroundColor: COLORS.dashboard.green,
    hoverColor: COLORS.dashboard.greenHover,
  },
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { announceToScreenReader } = useA11y();
  const { showLoading, hideLoading } = useLoading();
  const { dispatch } = useSidebar();
  const { userInfo } = useUser();
  const userRole = userInfo?.role?.toLowerCase() || '';
  const [isMapModalOpen, setMapModalOpen] = useState(false);

  const hasRequiredRole = (requiredRoles: Role[]) => {
    const normalizedUserRole = userRole.toLowerCase();
    return requiredRoles.some(role => role.toLowerCase() === normalizedUserRole);
  };

  const handleDashboardCardClick = async (cardId: string, cardTitle: string) => {
    if (cardId === 'externalMaps') {
      setMapModalOpen(true); // Open modal for "External Maps"
      dispatch({ type: 'SET_ACTIVE_SECTION', section: 'externalMaps', role: userRole });

      return;
    }
    try {
      const config = loadingConfigs[cardId] || {
        messageKey: 'DEFAULT',
        backgroundColor: 'BLUE',
        textColor: 'WHITE',
        spinnerType: 'BASIC'
      };

      // Announce to screen reader
      announceToScreenReader(
        `${ARIA_LABELS.STATUS.LOADING} ${cardTitle}`
      );

      showLoading(config);
      dispatch({ type: 'RESET_CHECKED_ITEMS' });

      dispatch({ type: 'SET_ACTIVE_SECTION', section: cardId, role: userRole });
      console.log('SET_ACTIVE_SECTION dispatched:', { section: cardId, role: userRole });


      // Simulated loading time
      await new Promise(resolve => setTimeout(resolve, 1500));

      switch (cardId) {
        case 'handbook':
  dispatch({ type: 'SET_ACTIVE_SECTION', section: 'handbook', role: userRole });
  dispatch({ type: 'RESET_CHECKED_ITEMS' }); // Reset any checked items
  navigate(ROUTES.HANDBOOK.WELCOME); // Navigate to welcome page first
  break;
        case 'accountsRights':
          navigate(ROUTES.USERCREATION.ROOT);
          break;
        case 'consultViaMap':
          navigate(ROUTES.CONSULTVIAMAPS.ROOT);
          break;
        case 'projects':
          navigate(ROUTES.PROJECTS.ROOT);
          break;
        case 'support':
          navigate(ROUTES.SUPPORT.ROOT);
          break;
        default:
          console.warn(`No route defined for card: ${cardId}`);
      }
    } catch (error) {
      console.error('Navigation error:', error);
      announceToScreenReader(ARIA_LABELS.STATUS.ERROR);
    } finally {
      hideLoading();
    }
  };


  const handleCloseMapModal = () => {
    setMapModalOpen(false);
    navigate(ROUTES.EXTERNALMAPS.ROOT); // Navigate to "External Maps" page after modal closes
  };

  return (
    <Box 
      sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflowY: 'auto' }}
      role="main"
      aria-label={ARIA_LABELS.SECTIONS.DASHBOARD}
    >
      <CustomAppBar
        title="DALI - APPLICATIONS"
        isSidebarOpen={false}
        isDashboard={true}
      />
      <Box 
        sx={{ flexGrow: 1, p: 3, mt: '64px' }}
        component="section"
        aria-labelledby="dashboard-heading"
      >
        <h1 id="dashboard-heading" className="visually-hidden">
          {ARIA_LABELS.SECTIONS.DASHBOARD}
        </h1>
        
        <Grid 
          container 
          spacing={2} 
          id="dashboardTiles"
          role="grid"
          aria-label={ARIA_LABELS.NAVIGATION.MAIN}
        >
          {dashboardCards.map((card) => (
            <Grid 
              item 
              xs={12} 
              sm={6} 
              md={4} 
              lg={2} 
              key={card.id}
              role="gridcell"
            >
              <DashboardTile 
                {...card} 
                onClick={() => hasRequiredRole(card.requiredRoles) && handleDashboardCardClick(card.id, card.title)}
                aria-label={`${ARIA_LABELS.BUTTONS.EXPAND} ${card.title}`}
                aria-expanded="false"
              />
            </Grid>
          ))}
        </Grid>
      </Box>
      <MapModal isOpen={isMapModalOpen} onClose={handleCloseMapModal} />

    </Box>
  );
};

export default Dashboard;