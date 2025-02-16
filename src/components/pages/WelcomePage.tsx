import React, { useEffect } from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import Layout from './Layout/Layout';
import { useNavigate } from 'react-router-dom';
import { sidebarAPI } from '../../services/sidebarAPI';
import { FilterResponse } from '../../data/interface';
import { useSidebar } from '../../context/SidebarContext';
import { useUser } from '../../context/AuthContext';
import { updateSidebarChildren } from '../../data/sidebarTransform';
import { getSidebarConfig } from '../../data/sidebarItemsConfig';
import { SidebarConfig, SidebarItem } from '../../data/types';

const WelcomePage: React.FC = () => {
    const navigate = useNavigate();
    const { dispatch, state } = useSidebar();
    const { userInfo } = useUser();

    useEffect(() => {
      const loadInitialData = async () => {
        // Skip if already initialized or no user role
        if (state.isInitialized || !userInfo?.role || state.isLoading) return;

        try {
          console.log('Current user role:', userInfo.role);
          dispatch({ type: 'SET_LOADING', isLoading: true });
          
          // Get initial filters
          const filterResponse = await sidebarAPI.getFilters(1);
          console.log('Filter Response:', filterResponse);
          
          // Get base config for user's role
          const baseConfig = getSidebarConfig(userInfo.role, 'handbook');
          console.log('Base Config:', baseConfig);
          console.log('Base Config Items:', baseConfig?.items);
          
          if (!baseConfig) {
            throw new Error('No sidebar configuration found for user role');
          }

          // Find the RAADPLEGEN dropdown
          const consultId = `consult${userInfo.role}`;
          console.log('Looking for consult ID:', consultId);
          console.log('Available item IDs:', baseConfig.items.map(item => item.id));
          
          const consultItem = baseConfig.items.find((item: SidebarItem) => {
            console.log('Checking item:', item.id, 'against', consultId);
            return item.id === consultId;
          });
          console.log('Found consult item:', consultItem);

          if (consultItem && consultItem.children) {
            // Create a deep copy of the config to modify
            const updatedConfig: SidebarConfig = JSON.parse(JSON.stringify(baseConfig));
            const updatedConsultItem = updatedConfig.items.find((item: SidebarItem) => item.id === consultId);

            if (updatedConsultItem && updatedConsultItem.children) {
              // Update children of section, stage, area, location, and topic dropdowns
              const dropdownMappings = [
                { id: 'section', role: userInfo.role, data: filterResponse.sections },
                { id: 'stage', role: userInfo.role, data: filterResponse.stages },
                { id: 'location', role: userInfo.role, data: filterResponse.locations },
                { id: 'area', role: userInfo.role, data: filterResponse.areas },
                { id: 'topic', role: userInfo.role, data: filterResponse.topics }
              ];
              
              dropdownMappings.forEach(mapping => {
                const dropdownId = `${mapping.id}${userInfo.role}`;
                console.log('Processing dropdown ID:', dropdownId);
                
                const dropdown = updatedConsultItem.children?.find((child: SidebarItem) => {
                  console.log('Checking child:', child.id, 'against', dropdownId);
                  return child.id === dropdownId;
                });
                console.log('Found dropdown:', dropdown);

                if (dropdown && mapping.data) {
                  dropdown.children = mapping.data.map(item => ({
                    id: `${mapping.id}-${item.orderIndex}`,
                    title: item.name,
                    type: 'list',
                    orderIndex: item.orderIndex
                  }));
                  console.log(`Updated ${dropdownId} children:`, dropdown.children);
                }
              });

              // Update sidebar state with new config
              console.log('Updating config:', updatedConfig);
              dispatch({ type: 'SET_CONFIG', config: updatedConfig });
            }
          }
          
          // Ensure main sections are expanded
          const defaultExpanded = [consultId, `section${userInfo.role}`];
          console.log('Setting expanded items:', defaultExpanded);
          
          defaultExpanded.forEach(itemId => {
            if (!state.expandedItems.includes(itemId)) {
              dispatch({ type: 'TOGGLE_EXPAND', itemId });
            }
          });

          dispatch({ type: 'SET_INITIALIZED', isInitialized: true });
        } catch (err) {
          console.error('Error loading initial data:', err);
        } finally {
          dispatch({ type: 'SET_LOADING', isLoading: false });
        }
      };

      loadInitialData();
    }, [userInfo?.role, dispatch, state.isInitialized, state.isLoading]);

    const handleViewHandbook = () => {
      navigate('/handbook');
    };

    return (
      <Layout>
        <Box sx={{ padding: 3, backgroundColor: '#616161', color: 'white', maxWidth: '600px', margin: 'auto', borderRadius: '8px' }}>
          {state.isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress sx={{ color: 'white' }} />
            </Box>
          ) : (
            <>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                {`Beste ${userInfo?.name || 'gebruiker'},`}
              </Typography>
              <Typography sx={{ mb: 2 }}>
                Welkom in de DALI Handboek module. Wil je snel informatie over een onderwerp zoeken? Vul in het zoekveld in de bovenbalk van dit scherm een trefwoord in en druk op ENTER.
              </Typography>
              <Typography sx={{ mb: 2 }}>
                Als je gebruik wil maken van de filterknoppen, klik dan op een van de 'Filters' onder het kopje 'RAADPLEGEN' aan de linkerkant van dit scherm.
              </Typography>
              <Typography sx={{ mb: 2 }}>
                Liever het volledig handboek raadplegen? Klik op de volgende BUTTON:
              </Typography>
              <Button 
                variant="contained" 
                color="error" 
                onClick={handleViewHandbook}
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  '&:hover': {
                    backgroundColor: '#d32f2f'
                  }
                }}
              >
                <span>✔</span>&nbsp; Volledig handboek
              </Button>
            </>
          )}
        </Box>
      </Layout>
    );
};

export default WelcomePage;