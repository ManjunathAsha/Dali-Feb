import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/AuthContext';
import '../../scss/dashboard.scss';
import {COLORS} from '../../constants/index';
import { styled } from '@mui/material/styles';
import { useA11y } from '../../hooks/useA11y';


interface DashboardTileProps {
  id: string;
  title: string;
  content: string;
  icon: any;
  requiredRoles: Role[];
  backgroundColor: string;
  hoverColor: string;
  onClick: (id: string) => void;
}

type Role = 'Admin' | 'Owner' | 'Reader' | 'Publisher' | 'SystemAdmin';

const StyledTile = styled(Box, {
  shouldForwardProp: (prop) => 
    !['isAuthorized', 'backgroundColor', 'hoverColor'].includes(prop.toString())
})<{
  isAuthorized: boolean;
  backgroundColor: string;
  hoverColor: string;
}>(({ isAuthorized, backgroundColor, hoverColor }) => ({
  transition: 'all 0.4s ease-out',
  background: isAuthorized ? backgroundColor : COLORS.base.lightgray,
  position: 'relative',
  cursor: isAuthorized ? 'pointer' : 'not-allowed',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'center',
  width: '100%',
  padding: '25px 15px',
  textAlign: 'center',
  borderRadius: '8px',
  opacity: isAuthorized ? 1 : 0.7,

  '&:hover': isAuthorized && {
    transition: 'all 0.4s ease-out',
    boxShadow: '0px 35px 77px -17px rgba(0,0,0,0.44)',
    transform: 'scale(1.05)',
    background: hoverColor,
    color: COLORS.base.white,
  },

  '&:focus-visible': {
    outline: `2px solid ${COLORS.base.red}`,
    outlineOffset: '2px',
  }
}));

const DashboardTile: React.FC<DashboardTileProps> = ({
  id,
  title,
  content,
  icon,
  requiredRoles,
  backgroundColor,
  hoverColor,
  onClick,
}) => {
  const { userInfo } = useUser();
  const { handleKeyboardSubmit } = useA11y();
  const userRole = userInfo?.role?.toLowerCase() || '';
  
  const isAuthorized = requiredRoles.some(
    role => role.toLowerCase() === userRole
  );

  const handleTileClick = () => {
    if (isAuthorized) {
      onClick(id);
    }
  };

  return (
    <StyledTile
      isAuthorized={isAuthorized}
      backgroundColor={backgroundColor}
      hoverColor={hoverColor}
      onClick={handleTileClick}
      onKeyDown={(e) => isAuthorized && handleKeyboardSubmit(e, () => onClick(id))}
      role="button"
      tabIndex={isAuthorized ? 0 : -1}
      aria-disabled={!isAuthorized}
      aria-label={`${title} - ${content}${!isAuthorized ? ' (Not authorized)' : ''}`}
    >
      <Box className="tile-content" aria-hidden={!isAuthorized}>
        <FontAwesomeIcon 
          icon={icon} 
          className="tile-icon" 
          aria-hidden="true"
          style={{ fontSize: '3rem' }}
        />
        <Typography 
          variant="h6" 
          component="h2"
          sx={{ 
            fontSize: '1.15em',
            paddingTop: '20px',
            fontWeight: 'bold',
            marginBottom: '5px'
          }}
        >
          {title}
        </Typography>
        <Typography 
          variant="h5" 
          component="p"
          sx={{
            fontSize: '0.8em',
            fontWeight: 'normal',
            lineHeight: 1.2,
            maxWidth: '90%',
            margin: '0 auto',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {content}
        </Typography>
        {!isAuthorized && (
          <Typography 
            variant="caption" 
            sx={{
              color: COLORS.base.red,
              fontSize: '0.7rem',
              marginTop: '5px'
            }}
            role="alert"
          >
            Not authorized
          </Typography>
        )}
      </Box>
    </StyledTile>
  );
};

export default DashboardTile;