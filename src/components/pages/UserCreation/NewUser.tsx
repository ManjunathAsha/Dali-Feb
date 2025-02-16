import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  styled,
  Button,
  Modal,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  SelectChangeEvent,
  Alert,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { COLORS } from "../../../constants/colors";
import { Navigate, useNavigate } from "react-router-dom";


const ModalContainer = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: "100%",
  height: "90vh",
  backgroundColor: "white",
  // boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
  borderRadius: "8px",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden"
}));

const ConfirmationModalContainer = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "400px",
  padding: "24px",
  backgroundColor: "white",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
  borderRadius: "8px",
  textAlign: "center",
}));

const Header = styled(Box)(({ theme }) => ({
  backgroundColor: "#4a4a4a", // Dark grey background for header
  color: "white",
  padding: "12px",
  borderRadius: "8px",
  fontWeight: "bold",
  fontSize: "18px",
}));

const ConfirmationText = styled(Typography)(({ theme }) => ({
  margin: "16px 0 24px",
  fontSize: "16px",
  color: "#333", // Dark grey text
}));

const ButtonContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  gap: "16px",
}));

const ConfirmButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#4a4a4a", // Dark grey
  color: "white",
  textTransform: "none",
  fontWeight: "bold",
  width: "100px",
  "&:hover": {
    backgroundColor: "#333", // Darker grey on hover
  },
}));

const CancelButton = styled(Button)(({ theme }) => ({
  backgroundColor: "white",
  color: "#4a4a4a",
  textTransform: "none",
  fontWeight: "bold",
  border: "1px solid #4a4a4a",
  width: "100px",
  "&:hover": {
    backgroundColor: "#f5f5f5", // Light grey on hover
  },
}));

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  return (
    <Modal open={isOpen} onClose={onClose}>
      <ConfirmationModalContainer>
        <Header>Close notification</Header>
        <ConfirmationText>Are you sure you want to close the screen?</ConfirmationText>
        <ButtonContainer>
          <ConfirmButton onClick={onConfirm}>Yes</ConfirmButton>
          <CancelButton onClick={onClose}>No</CancelButton>
        </ButtonContainer>
      </ConfirmationModalContainer>
    </Modal>
  );
};

export { ConfirmationModal };
const HeaderSection = styled(Box)(({ theme }) => ({
  backgroundColor: COLORS.base.darkgray,
  color: "white",
  padding: "16px 24px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderTopLeftRadius: "8px",
  borderTopRightRadius: "8px",
}));

const StyledHeading = styled(Typography)(({ theme }) => ({
  fontSize: "24px",
  fontWeight: "bold",
}));

const StyledHeadings = styled(Typography)(({ theme }) => ({
  padding: "8px 16px",
  backgroundColor: COLORS.base.lightgray,
  fontWeight: "bold",
  color: "#333",
  marginBottom: "16px",
  fontSize: "16px",
  borderRadius: "4px",
}));

const FormContainer = styled(Box)`
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  margin-right: 8px;

  /* Hide scrollbar but keep functionality */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
`;

const FormSection = styled(Box)`
  margin-bottom: 24px;
  padding-right: 8px;
`;

const FormRow = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "flex-start",
  marginBottom: "16px",
  gap: "16px",
  width: "100%",
  '@media (max-width: 600px)': {
    flexDirection: "column",
    gap: "8px"
  }
}));

const FormLabel = styled(Typography)(({ theme }) => ({
  width: "150px",
  minWidth: "150px",
  fontWeight: "bold",
  color: "#333",
  fontSize: "14px",
  textAlign: "left",
  '@media (max-width: 600px)': {
    width: "100%",
    minWidth: "unset",
  },
  "&.required::after": {
    content: '" *"',
    color: "#d64b4b",
  }
}));

const FormInputContainer = styled(Box)`
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;

  .MuiFormControl-root {
    width: 100%;
  }

  .MuiSelect-root {
    width: 100%;
  }

  .MuiOutlinedInput-root {
    width: 100%;
  }
`;

const ErrorText = styled(Typography)`
  color: #d32f2f;
  font-size: 12px;
  margin-top: 4px;
`;

const FormInput = styled("input")<{ error?: boolean }>(({ error }) => ({
  padding: "8px 12px",
  border: `1px solid ${error ? '#d32f2f' : '#ddd'}`,
  borderRadius: "4px",
  fontSize: "14px",
  width: "100%",
  "&:focus": {
    outline: "none",
    borderColor: error ? '#d32f2f' : '#666',
  },
  "&:hover": {
    borderColor: error ? '#d32f2f' : '#999',
  }
}));

const SaveButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#d64b4b",
  color: "white",
  padding: "10px 24px",
  borderRadius: "4px",
  marginTop: "20px",
  alignSelf: "flex-end",
  "&:hover": {
    backgroundColor: "#b73e3e",
  },
  "&.Mui-disabled": {
    backgroundColor: "rgba(214, 75, 75, 0.5)",
    color: "white"
  }
}));

// Add styled component for success message
const SuccessAlert = styled(Alert)(({ theme }) => ({
  position: 'fixed',
  top: '20px',
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 9999,
  minWidth: '300px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  '& .MuiAlert-message': {
    fontWeight: 500
  }
}));

// Add Role interface
interface Role {
  id: string;
  name: string;
  description: string;
}

// Add this interface for tenant data
interface Tenant {
  id: string;
  name: string;
  tenantCode: string;
  description: string;
  isActive: boolean;
  createdDate: string;
  lastModifiedDate: string | null;
  userCount: number;
}

// Update FormData interface
interface FormData {
  username: string;
  password: string;
  email: string;
  tenantId: string;
  tenantName: string; // Add this field to store tenant name
  firstName: string;
  lastName: string;
  role: string;
  [key: string]: string;
}

// Add type interface for MessageContainer props
interface MessageContainerProps {
  type: 'success' | 'error';
}

// Update MessageContainer to use Box
const MessageContainer = styled(Box)<MessageContainerProps>`
  padding: 10px 20px;
  margin: 10px 0;
  border-radius: 4px;
  background-color: ${(props: MessageContainerProps) => props.type === 'success' ? '#d4edda' : '#f8d7da'};
  color: ${(props: MessageContainerProps) => props.type === 'success' ? '#155724' : '#721c24'};
  border: 1px solid ${(props: MessageContainerProps) => props.type === 'success' ? '#c3e6cb' : '#f5c6cb'};
`;

interface NewUserProps {
  isModalOpen: boolean;
  onClose: () => void;
  toggleSidebar: (open: boolean) => (event?: React.KeyboardEvent | React.MouseEvent) => void;
}

const parseJwt = (token: string) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

const NewUser: React.FC<NewUserProps> = ({ isModalOpen, onClose, toggleSidebar }) => {
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>(() => {
    const storedData = localStorage.getItem('newUserFormData');
    let initialData = {
      username: '',
      password: '',
      email: '',
      tenantId: '',
      tenantName: '',
      firstName: '',
      lastName: '',
      role: ''
    };

    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        initialData = { ...parsedData, password: '' };
      } catch (e) {
        console.error('Error parsing stored form data:', e);
      }
    }

    return initialData;
  });
  
  const [error, setError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isLoadingTenants, setIsLoadingTenants] = useState(true);
  const navigate = useNavigate();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(true);

  // Fetch tenants only when modal is opened
  useEffect(() => {
    let mounted = true;

    const fetchTenants = async () => {
      if (!isModalOpen) return;
      
      setIsLoadingTenants(true);
      try {
        const userToken = localStorage.getItem('userToken');
        if (!userToken) return;

        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://185.84.140.118:8080'}/api/Tenant`, {
          method: 'GET',
          headers: {
            'accept': 'text/plain',
            'Authorization': `Bearer ${userToken}`
          }
        });

        if (!mounted) return;

        if (response.ok) {
          const data = await response.json();
          setTenants(data);

          if (formData.tenantId) {
            const selectedTenant = data.find((t: Tenant) => t.id === formData.tenantId);
            if (selectedTenant) {
              setFormData(prev => ({
                ...prev,
                tenantName: selectedTenant.name
              }));
            }
          }
        }
      } catch (error) {
        console.error('Error fetching tenants:', error);
      } finally {
        if (mounted) {
          setIsLoadingTenants(false);
        }
      }
    };

    fetchTenants();

    return () => {
      mounted = false;
    };
  }, [isModalOpen]);

  // Add useEffect for fetching roles
  useEffect(() => {
    let mounted = true;

    const fetchRoles = async () => {
      if (!isModalOpen) return;
      
      setIsLoadingRoles(true);
      try {
        const userToken = localStorage.getItem('userToken');
        if (!userToken) return;

        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://185.84.140.118:8080'}/api/Roles`, {
          method: 'GET',
          headers: {
            'accept': 'text/plain',
            'Authorization': `Bearer ${userToken}`
          }
        });

        if (!mounted) return;

        if (response.ok) {
          const data = await response.json();
          setRoles(data);
        }
      } catch (error) {
        console.error('Error fetching roles:', error);
      } finally {
        if (mounted) {
          setIsLoadingRoles(false);
        }
      }
    };

    fetchRoles();

    return () => {
      mounted = false;
    };
  }, [isModalOpen]);

  const handleCloseModal = () => {
    setIsConfirmationOpen(true);
  };

  const confirmClose = () => {
    setIsConfirmationOpen(false);
    onClose();
    navigate("/userOverview");
    toggleSidebar(true)();
  };

  const cancelClose = () => {
    setIsConfirmationOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const userToken = localStorage.getItem('userToken');
      if (!userToken) {
        setError('No authentication token found');
        return;
      }

      const selectedTenant = tenants.find((t: Tenant) => t.id === formData.tenantId);
      if (!selectedTenant) {
        setError('Please select a valid organization');
        return;
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://185.84.140.118:8080'}/api/Auth/register`, {
        method: 'POST',
        headers: {
          'accept': '*/*',
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userName: formData.username.trim(),
          password: formData.password,
          email: formData.email.trim(),
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          tenantName: selectedTenant.name,
          role: formData.role,
          additionalRoles: ["string"]
        })
      });

      if (response.ok) {
        localStorage.setItem('newUserFormData', JSON.stringify({
          ...formData,
          password: ''
        }));

        // Show success message
        setSuccessMessage('Account created successfully!');
        setShowSuccessMessage(true);

        // Wait for a moment to show the success message
        setTimeout(() => {
          // Close modal and navigate
          onClose();
          navigate("/userOverview", { 
            state: { 
              fromNewUser: true,
              message: 'User account created successfully!'
            }
          });
          toggleSidebar(true)();
        }, 1500); // Show success message for 1.5 seconds
      } else {
        const errorData = await response.json();
        throw new Error(
          typeof errorData === 'string' 
            ? errorData 
            : errorData.message || errorData.title || 
              (errorData.errors ? Object.values(errorData.errors).flat().join(', ') : null) ||
              'Registration failed'
        );
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  // Add cleanup effect for success message
  useEffect(() => {
    return () => {
      setShowSuccessMessage(false);
      setSuccessMessage(null);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (event: SelectChangeEvent<string>) => {
    setFormData((prev) => ({ ...prev, role: event.target.value }));
  };

  const validateForm = () => {
    let isValid = true;
    
    // Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      setPasswordError('Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character');
      isValid = false;
    } else {
      setPasswordError(null);
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    } else {
      setEmailError(null);
    }

    return isValid;
  };

  return (
    <>
      {showSuccessMessage && successMessage && (
        <Alert
          severity="success"
          sx={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9999,
            minWidth: '300px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            '& .MuiAlert-message': {
              fontWeight: 500
            }
          }}
        >
          {successMessage}
        </Alert>
      )}

      <Modal 
        open={isModalOpen} 
        onClose={handleCloseModal}
        disablePortal
      >
        <ModalContainer>
          <HeaderSection>
            <StyledHeading>New User</StyledHeading>
            <IconButton onClick={handleCloseModal}>
              <CloseIcon style={{ color: "white" }} />
            </IconButton>
          </HeaderSection>

          {error && (
            <Box sx={{ padding: "16px 24px 0" }}>
              <Alert 
                severity="error" 
                onClose={() => setError(null)}
                sx={{ marginBottom: 1 }}
              >
                {error}
              </Alert>
            </Box>
          )}

          <FormContainer>
            <form onSubmit={handleSubmit} style={{ maxWidth: "100%" }}>
              <FormSection>
                <StyledHeadings>Account Details</StyledHeadings>
                <FormRow>
                  <FormLabel className="required">Username</FormLabel>
                  
                    <FormInput 
                      name="username" 
                      value={formData.username} 
                      onChange={handleChange} 
                      required 
                    />
                  
                </FormRow>
                <FormRow>
                  <FormLabel className="required">Password</FormLabel>
                  
                    <FormInput
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      error={!!passwordError}
                    />
                    {passwordError && <ErrorText>{passwordError}</ErrorText>}
                  
                </FormRow>
                <FormRow>
                  <FormLabel className="required">Email</FormLabel>
                  
                    <FormInput 
                      name="email" 
                      type="email" 
                      value={formData.email} 
                      onChange={handleChange} 
                      required
                      error={!!emailError}
                    />
                    {emailError && <ErrorText>{emailError}</ErrorText>}
                  
                </FormRow>

                <FormRow>
                  <FormLabel className="required">Organization</FormLabel>
                  <FormControl fullWidth>
                    <Select
                      value={formData.tenantId}
                      onChange={(e) => {
                        const selectedTenant = tenants.find((t: Tenant) => t.id === e.target.value);
                        setFormData(prev => ({
                          ...prev,
                          tenantId: e.target.value,
                          tenantName: selectedTenant?.name || ''
                        }));
                      }}
                      required
                      disabled={isLoadingTenants}
                    >
                      {isLoadingTenants ? (
                        <MenuItem value="">Loading organizations...</MenuItem>
                      ) : tenants.length === 0 ? (
                        <MenuItem value="">No organizations available</MenuItem>
                      ) : (
                        tenants.map((tenant) => (
                          <MenuItem 
                            key={tenant.id} 
                            value={tenant.id}
                            disabled={!tenant.isActive}
                          >
                            {tenant.name}
                          </MenuItem>
                        ))
                      )}
                    </Select>
                  </FormControl>
                </FormRow>
              </FormSection>

              <FormSection>
                <StyledHeadings>Personal Details</StyledHeadings>
                <FormRow>
                  <FormLabel className="required">First Name</FormLabel>
                  <FormInput name="firstName" value={formData.firstName} onChange={handleChange} required />
                </FormRow>
                <FormRow>
                  <FormLabel className="required">Last Name</FormLabel>
                  <FormInput name="lastName" value={formData.lastName} onChange={handleChange} required />
                </FormRow>
                <FormRow>
                  <FormLabel className="required">Role</FormLabel>
                  <FormControl fullWidth>
                    <Select
                      value={formData.role}
                      onChange={handleRoleChange}
                      required
                      disabled={isLoadingRoles}
                    >
                      {isLoadingRoles ? (
                        <MenuItem value="">Loading roles...</MenuItem>
                      ) : roles.length === 0 ? (
                        <MenuItem value="">No roles available</MenuItem>
                      ) : (
                        roles.map((role) => (
                          <MenuItem key={role.id} value={role.name}>
                            {role.name}
                          </MenuItem>
                        ))
                      )}
                    </Select>
                  </FormControl>
                </FormRow>
              </FormSection>

              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'flex-end', 
                mt: 3,
                position: 'sticky',
                bottom: 0,
                backgroundColor: 'white',
                padding: '16px 0 0 0'
              }}>
                <SaveButton 
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CircularProgress size={20} color="inherit" />
                      Creating...
                    </Box>
                  ) : (
                    'Add User'
                  )}
                </SaveButton>
              </Box>
            </form>
          </FormContainer>
        </ModalContainer>
      </Modal>

      {isConfirmationOpen && (
        <ConfirmationModal
          isOpen={isConfirmationOpen}
          onClose={cancelClose}
          onConfirm={confirmClose}
        />
      )}
    </>
  );
};

export default NewUser;