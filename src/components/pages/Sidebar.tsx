// Sidebar.tsx
import React, { FC, memo, useEffect, useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Checkbox,
  Typography,
  Box,
  IconButton,
  TextField,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AccountTree from '@mui/icons-material/AccountTree';
import MapIcon from '@mui/icons-material/Map';
import StarIcon from '@mui/icons-material/Star';
import SubjectIcon from '@mui/icons-material/Subject';
import SearchIcon from '@mui/icons-material/Search';
import { InputAdornment } from '@mui/material';
import { SidebarConfig, SidebarItem } from '../../data/types';
import { useSidebar } from '../../context/SidebarContext';
import { COLORS, ARIA_LABELS } from '../../constants';
import { Group, ListAlt, ListAltOutlined, Menu, NearMe, PersonAdd, Place, Recycling, Star } from '@mui/icons-material';
import axios, { AxiosError } from 'axios';
import { Section, FilterParams } from '../../data/interface';
import { sidebarAPI } from '../../services/sidebarAPI';
import { parseFilterValue, updateSidebarChildren } from '../../data/sidebarTransform';
import { useUser } from '../../context/AuthContext';

interface SidebarProps {
  config: SidebarConfig;
  onItemClick: (itemId: string) => void;
  onItemToggle: (itemId: string, enabled: boolean) => void;
}

interface CheckboxItemProps {
  item: SidebarItem;
  isChecked: boolean;
  toggleCheck: (id: string) => void;
  depth: number;
}

const MemoizedCheckboxItem: React.FC<CheckboxItemProps> = memo(({ item, isChecked, toggleCheck, depth }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleCheck(item.id);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    toggleCheck(item.id);
  };

  return (
    <ListItem
      onClick={handleClick}
      sx={{
        pl: depth * 2,
        py: 0.1,
        fontSize: '0.875rem',
        bgcolor: isChecked ? COLORS.base.lightred : COLORS.base.black,
        color: COLORS.base.lightgray,
        transition: 'all 0.4s ease',
        '&:hover': {
          bgcolor: COLORS.base.darkgray,
        },
      }}
    >
      <Checkbox
        checked={isChecked}
        onChange={handleCheckboxChange}
        onClick={(e) => e.stopPropagation()}
        sx={{
          color: COLORS.base.lightgray,
          padding: '3px',
          '&.Mui-checked': {
            color: COLORS.base.red,
          },
        }}
      />
      <ListItemText 
        primary={item.title}
       primaryTypographyProps={{
        sx: { 
          fontSize: '0.8rem', 
          color: COLORS.base.lightgray,
          whiteSpace: 'nowrap', 
          overflow: 'hidden', 
          textOverflow: 'ellipsis', 
        },
        }} 
      />
    </ListItem>
  );
});

const Sidebar: FC<SidebarProps> = ({ config: initialConfig, onItemClick, onItemToggle }): JSX.Element => {
  const { state, dispatch } = useSidebar();
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo } = useUser();

  useEffect(() => {
    console.log('Sidebar State:', state);
    console.log('Config:', state.config);
    console.log('Expanded Items:', state.expandedItems);
    console.log('Checked Items:', state.checkedItems);
  }, [state]);

  const handleCheckboxChange = async (itemId: string) => {
    const { type, value } = parseFilterValue(itemId);
    
    // Immediately toggle the checkbox without waiting for API
    dispatch({ type: 'TOGGLE_CHECK', itemId });

    // Only navigate to handbook if we're not already there
    if (location.pathname !== '/handbook') {
      navigate('/handbook');
    }

    // Get all checked items
    const filterParams: FilterParams = {
      sectionOrders: [],
      stageOrders: [],
      locationOrders: [],
      areaOrders: [],
      topicOrders: []
    };

    // Update filter params based on checked items
    const newCheckedItems = state.checkedItems.includes(itemId) 
      ? state.checkedItems.filter(id => id !== itemId)
      : [...state.checkedItems, itemId];

    // Update filter params based on checked items
    newCheckedItems.forEach(item => {
      const { type, value } = parseFilterValue(item);
      const orderIndex = parseInt(value);
      
      switch (type) {
        case 'section':
          filterParams.sectionOrders.push(orderIndex);
          break;
        case 'stage':
          filterParams.stageOrders.push(orderIndex);
          break;
        case 'location':
          filterParams.locationOrders.push(orderIndex);
          break;
        case 'area':
          filterParams.areaOrders.push(orderIndex);
          break;
        case 'topic':
          filterParams.topicOrders.push(orderIndex);
          break;
      }
    });

    try {
      // Only show loading in handbook content area
      dispatch({ type: 'SET_LOADING', isLoading: true });

      // Run API calls in parallel for better performance
      const apiCalls = [];

      // If sections are selected or deselected, update other dropdowns
      if (type === 'section' && userInfo?.role) {
        apiCalls.push(
          sidebarAPI.getFilteredSections(1, filterParams.sectionOrders)
            .then(filteredResponse => {
              // Update children of stage, area, location, and topic dropdowns
              const updatedConfig = { ...state.config };
              const dropdownMappings = [
                { id: `stage${userInfo.role}`, data: filteredResponse.stages, type: 'stage' },
                { id: `location${userInfo.role}`, data: filteredResponse.locations, type: 'location' },
                { id: `area${userInfo.role}`, data: filteredResponse.areas, type: 'area' },
                { id: `topic${userInfo.role}`, data: filteredResponse.topics, type: 'topic' }
              ];

              // Find the RAADPLEGEN dropdown for the current role
              const consultId = `consult${userInfo.role}`;
              const consultItem = updatedConfig.items.find(item => item.id === consultId);

              if (consultItem && consultItem.children) {
                dropdownMappings.forEach(mapping => {
                  const dropdown = consultItem.children?.find(child => child.id === mapping.id);
                  
                  if (dropdown && mapping.data) {
                    dropdown.children = mapping.data.map(item => ({
                      id: `${mapping.type}-${item.orderIndex}`,
                      title: item.name,
                      type: 'list',
                      orderIndex: item.orderIndex
                    }));
                  }
                });

                // Update sidebar state with new config
                dispatch({ type: 'SET_CONFIG', config: updatedConfig });
              }
            })
        );
      }

      // Always get filtered documents when any checkbox is clicked
      apiCalls.push(
        sidebarAPI.getFilteredDocuments(1, filterParams)
          .then(filteredDocuments => {
            dispatch({ type: 'SET_FILTERED_DOCUMENTS', data: filteredDocuments.data });
          })
      );

      // Wait for all API calls to complete
      await Promise.all(apiCalls);
    } catch (error) {
      console.error('Error updating filters:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', isLoading: false });
    }
  };

  const findDropdownById = (config: SidebarConfig, id: string): SidebarItem | null => {
    for (const item of config.items) {
      if (item.id === id) return item;
      if (item.children) {
        for (const child of item.children) {
          if (child.id === id) return child;
        }
      }
    }
    return null;
  };

  const renderCheckboxItem = (item: SidebarItem, depth = 0) => {
    const isChecked = state.checkedItems.includes(item.id);
    
    return (
      <MemoizedCheckboxItem
        key={item.id}
        item={item}
        isChecked={isChecked}
        toggleCheck={handleCheckboxChange}
        depth={depth}
      />
    );
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    dispatch({ type: 'SET_SEARCH_TERM', value: e.target.value });
  };

  const toggleExpand = (itemId: string) => {
    dispatch({ type: 'TOGGLE_EXPAND', itemId });
  };

  const handleItemClick = (item: SidebarItem) => {
    dispatch({ type: 'SET_ACTIVE_ITEM', itemId: item.id });
    
    if (item.children?.length) {
      toggleExpand(item.id);
    }
    
    if (item.path) {
      navigate(item.path);
    }
    
    onItemClick(item.id);
  };

  const renderDropdownItem = (item: SidebarItem, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = state.expandedItems.includes(item.id);
    const isActive = state.activeItem === item.id;
    
    console.log('Rendering dropdown item:', {
      id: item.id,
      title: item.title,
      hasChildren,
      isExpanded,
      children: item.children
    });

    const getBackgroundColor = () => {
      if (depth === 0) {
        if (isExpanded) return COLORS.base.red;
        if (isActive) return COLORS.base.gray1;
        return COLORS.base.darkred;
      }
      return COLORS.base.darkred;
    };

    return (
      <React.Fragment key={item.id}>
        <ListItem
          sx={{
            py: 0.8,
            fontSize: '1rem',
            pl: depth === 0 ? 2 : 3,
            bgcolor: isActive
              ? '#FBF4F6'
              : getBackgroundColor(),
            color: isActive
              ? COLORS.base.red
              : COLORS.base.white,
            borderBottom: `1px solid ${COLORS.base.black}`,
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            '&:hover': {
              bgcolor: isActive
                ? '#3A3A3A'
                : depth === 0
                  ? (isExpanded ? '#D81B60' : '#3A3A3A')
                  : '#3A3A3A',
              transform: 'translateX(4px)',
            },
          }}
          onClick={() => handleItemClick(item)}
        >
          {item.icon && (
            <ListItemIcon 
              sx={{ 
                minWidth: 36,
                color: isActive
                  ? COLORS.base.red
                  : COLORS.base.white,
                transition: 'transform 0.2s ease',
                transform: isActive || isExpanded ? 'scale(1.1)' : 'scale(1)',
              }}
            >
              {React.createElement(getIconComponent(item.icon))}
            </ListItemIcon>
          )}
          <ListItemText
            primary={item.title}
            primaryTypographyProps={{
              sx: { 
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                fontWeight: depth === 0 ? 500 : 400,
                fontSize: depth === 0 ? '1rem' : '0.875rem',
              },
            }}
          />
          {hasChildren && (
            <IconButton
              edge="end"
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(item.id);
              }}
              sx={{ 
                color: isActive
                  ? COLORS.base.red
                  : COLORS.base.white,
                padding: '4px',
                transition: 'transform 0.3s ease',
                transform: isExpanded ? 'rotate(-180deg)' : 'rotate(0)',
                '&:hover': {
                  backgroundColor: COLORS.base.lightred,
                },
              }}
            >
              {depth === 0
                ? isExpanded
                  ? <RemoveIcon fontSize="small" />
                  : <AddIcon fontSize="small" />
                : isExpanded
                  ? <ExpandLessIcon fontSize="small" />
                  : <ExpandMoreIcon fontSize="small" />}
            </IconButton>
          )}
        </ListItem>
        
        {hasChildren && (
          <Collapse in={isExpanded} timeout={300}>
            {item.hasSearchBar && (
              <Box sx={{ p: 0.5, bgcolor: COLORS.base.black }}>
                <TextField
                  variant="outlined"
                  size="small"
                  placeholder={item.searchPlaceholder || `Search within ${item.title}`}
                  fullWidth
                  value={state.searchTerm}
                  onChange={handleSearch}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: COLORS.base.white }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    color: COLORS.base.white,
                    '& .MuiOutlinedInput-root': {
                      transition: 'all 0.2s ease',
                      fontSize: '0.9rem',
                      '& fieldset': {
                        borderColor: COLORS.base.gray,
                      },
                      '&:hover fieldset': {
                        borderColor: COLORS.base.red,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: COLORS.base.red,
                      },
                    },
                    '& input': {
                      color: COLORS.base.white,
                    },
                  }}
                />
              </Box>
            )}
            <List component="div" disablePadding>
              {(item.children || []).map((child) =>
                child.type === 'list'
                  ? renderCheckboxItem(child, depth + 1)
                  : renderDropdownItem(child, depth + 1)
              )}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Chapter':
        return MenuBookIcon;
      case 'Level':
        return AccountTree;
      case 'ResidentialArea':
        return NearMe;
      case 'Area':
        return Place;
      case 'Subject':
        return Menu;
      case 'Theme':
        return Recycling;
      case 'Star':
        return Star;
        case 'PersonAdd':
        return PersonAdd;
        case 'Group':
        return Group;
       
      default:
        return MenuBookIcon;
    }
  };

  return (
    <Drawer
    variant="persistent"
    anchor="left"
    open={state.isSidebarOpen}
    sx={{
      width: state.isSidebarOpen ? 300 : 0,
      flexShrink: 0,
      transition: 'width 0.3s ease',
      '& .MuiDrawer-paper': {
        width: state.isSidebarOpen ? 300 : 0,
        boxSizing: 'border-box',
        overflowX: 'hidden',
        bgcolor: COLORS.base.darkred,
        '&::-webkit-scrollbar': {
            display: 'none',
          },
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
      },
    }}
  >
      <Box sx={{ bgcolor: COLORS.base.darkred, color: COLORS.base.white, p: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
          {state.config.title}
        </Typography>
      </Box>
      <List 
        sx={{ 
          flexGrow: 1, 
          paddingTop: '0px', 
          overflowY: 'auto',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {state.config.items.map(item =>
          item.type === 'list' ? renderCheckboxItem(item) : renderDropdownItem(item)
        )}
      </List>
      <Box sx={{ 
        p: 2, 
        bgcolor: COLORS.base.red, 
        color: COLORS.base.white, 
        display: 'flex', 
        justifyContent: 'space-between',
        mt: 'auto'
      }}>
        <Typography variant="body1">Handbook publication</Typography>
        <Box sx={{ 
          bgcolor: COLORS.base.lightred,
          borderRadius: '50%',
          width: 25,
          height: 25,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Typography variant="body2" sx={{ color: COLORS.base.white }}>3</Typography>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;