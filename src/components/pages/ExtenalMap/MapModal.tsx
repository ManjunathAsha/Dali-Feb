import React from 'react';
import { 
  Box, 
  Typography, 
  styled,
  Button,
  Link,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import { COLORS } from '../../../constants/colors';
import CustomModalHeader from '../../utils/CustomModalHeader';

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InfoSection = styled(Box)({
  backgroundColor: COLORS.base.fade,
  padding: '24px',
  borderRadius: '4px',
  marginBottom: '24px',
});

const StyledButton = styled(Button)({
  backgroundColor: COLORS.base.red,
  color: COLORS.base.white,
  padding: '8px 24px',
  '&:hover': {
    backgroundColor: COLORS.base.darkred,
  },
  '&:focus': {
    outline: `2px solid ${COLORS.base.darkgray}`,
    outlineOffset: '2px',
  },
});

export const MapModal: React.FC<MapModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <CustomModalHeader
      isOpen={isOpen}
      handleClose={onClose}
      title="Using external cards in DALI"
    >
      <Box
        sx={{
          p: 3,
          maxWidth: '800px',
          margin: '0 auto',
        }}
      >
        <InfoSection>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ color: COLORS.base.darkgray }}
          >
            View external maps quickly and easily. This is possible with DALI version 5.
          </Typography>
          <Typography
            sx={{ 
              color: COLORS.base.darkgray,
              mb: 3,
            }}
          >
            To activate this function, further details are required. If you would like to know more now, 
            please send an email to{' '}
            <Link 
              href="mailto:dali-support@burocite.nl"
              sx={{ 
                color: COLORS.base.blue,
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
                '&:focus': {
                  outline: `2px solid ${COLORS.base.darkgray}`,
                  outlineOffset: '2px',
                },
              }}
              aria-label="Send email to DALI support"
            >
              dali-support@burocite.nl
            </Link>
            . One of our advisors will then contact you to schedule an appointment.
          </Typography>
          <StyledButton
            startIcon={<EmailIcon />}
            variant="contained"
            onClick={() => window.location.href = 'mailto:dali-support@burocite.nl'}
            aria-label="Send email to DALI support"
          >
            Contact Support
          </StyledButton>
        </InfoSection>
{/* 
        <Box
          sx={{
            backgroundColor: COLORS.base.lightgray1,
            p: 2,
            borderRadius: '4px',
            textAlign: 'center',
          }}
        >
          <Typography
            sx={{ color: COLORS.base.darkgray }}
          >
            Click at least 1 checkbox to consult an external map
          </Typography>
        </Box> */}
      </Box>
    </CustomModalHeader>
  );
};