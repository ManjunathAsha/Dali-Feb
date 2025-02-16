import React from 'react';
import {
  Box,
  Typography,
  Avatar,
  styled,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import Grid from "@mui/material/Grid2";
import CustomModalHeader from '../../utils/CustomModalHeader';
import { COLORS } from '../../../constants/colors';

interface ProfileSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  userData: {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

const StyledHeadings = styled(Typography)(({ theme }) => ({
  padding: "8px 12px",
  background: COLORS.base.lightgray,
  fontWeight: "bold",
  color: COLORS.base.darkgray,
  marginBottom: "20px",
  fontSize: '16px',
}));

const FormRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  marginBottom: '16px',
  gap: '16px',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    gap: '8px',
  },
}));

const FormLabel = styled(Typography)(({ theme }) => ({
  flex: '0 0 150px',
  color: '#666',
  fontSize: '14px',
  textAlign: 'left',
  paddingTop: '8px',
  '&.required::after': {
    content: '" *"',
    color: '#666',
  },
  [theme.breakpoints.down('sm')]: {
    flex: 'none',
    width: '100%',
    paddingTop: 0,
  },
}));

const FormInput = styled('input')(({ theme }) => ({
  flex: 1,
  padding: '8px 12px',
  border: '1px solid #ddd',
  borderRadius: '4px',
  fontSize: '14px',
  width: '100%',
  boxSizing: 'border-box',
  '&:focus': {
    outline: 'none',
    borderColor: '#999',
  },
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
}));

const AvatarContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  marginBottom: '20px',
  gap: '16px',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
}));

const AvatarSection = styled(Box)(({ theme }) => ({
  width: '100px',
  textAlign: 'center',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    marginBottom: '16px',
  },
}));

const SaveButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#d64b4b',
  color: 'white',
  padding: '8px 24px',
  borderRadius: '4px',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: '#b73e3e',
  },
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    marginTop: '24px',
  },
}));

const ProfileContainer = styled(Box)(({ theme }) => ({
  padding: '16px',
  [theme.breakpoints.down('sm')]: {
    padding: '12px',
  },
}));

const FormSection = styled(Box)(({ theme }) => ({
  flex: 1,
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
}));

const UploadText = styled(Typography)({
  color: '#666',
  fontSize: '14px',
  marginTop: '8px',
});

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({
  isOpen,
  onClose,
  userData,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
  };

  return (
    <CustomModalHeader
      isOpen={isOpen}
      handleClose={onClose}
      title="Institutions"
    >
      <ProfileContainer>
        <form onSubmit={handleSubmit}>
          <StyledHeadings>Account details</StyledHeadings>
          
          <AvatarContainer>
            <AvatarSection>
              <Avatar
                sx={{
                  width: isMobile ? 60 : 80,
                  height: isMobile ? 60 : 80,
                  bgcolor: '#f0f0f0',
                  margin: '0 auto',
                }}
              >
                {userData.firstName?.[0]}
              </Avatar>
              <UploadText>Upload photo</UploadText>
            </AvatarSection>
            
            <FormSection>
              <FormRow>
                <FormLabel className="required">Username</FormLabel>
                <FormInput 
                  defaultValue={userData.username}
                  required
                />
              </FormRow>
              
              <FormRow>
                <FormLabel className="required">Email</FormLabel>
                <FormInput 
                  type="email"
                  defaultValue={userData.email}
                  required
                />
              </FormRow>
              
              <FormRow>
                <FormLabel className="required">New password</FormLabel>
                <FormInput 
                  type="password"
                  required
                />
              </FormRow>
              
              <FormRow>
                <FormLabel className="required">Confirm password</FormLabel>
                <FormInput 
                  type="password"
                  required
                />
              </FormRow>
            </FormSection>
          </AvatarContainer>

          <StyledHeadings>Personal data</StyledHeadings>
          
          <FormRow>
            <FormLabel>First name</FormLabel>
            <FormInput 
              defaultValue={userData.firstName}
            />
          </FormRow>
          
          <FormRow>
            <FormLabel>Surname</FormLabel>
            <FormInput 
              defaultValue={userData.lastName}
            />
          </FormRow>

          <SaveButton 
            type="submit" 
            variant="contained"
            fullWidth={isMobile}
          >
            Save
          </SaveButton>
        </form>
      </ProfileContainer>
    </CustomModalHeader>
  );
};

export default ProfileSettings;