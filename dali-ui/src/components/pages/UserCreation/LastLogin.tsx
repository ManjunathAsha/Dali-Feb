import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  Chip,
  Grid,
  Tooltip,
  Button,
  Modal,
  Dialog as MuiDialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  Select,
  MenuItem,
  IconButton,
  Checkbox,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Search as SearchIcon,
  Block as BlockIcon,
  Edit as EditIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import Layout from "../Layout/Layout";
import { styled } from "@mui/material/styles";
import { authenticatedFetch } from '../../../utils/apiUtils';

const StyledPaper = {
  padding: "24px",
  borderRadius: "12px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
};

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
  backgroundColor: "#4a4a4a",
  color: "white",
  padding: "12px",
  borderRadius: "8px",
  fontWeight: "bold",
  fontSize: "18px",
}));

const ConfirmationText = styled(Typography)(({ theme }) => ({
  margin: "16px 0 24px",
  fontSize: "16px",
  color: "#333",
}));

const ButtonContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  gap: "16px",
}));

const ConfirmButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#4a4a4a",
  color: "white",
  textTransform: "none",
  fontWeight: "bold",
  width: "100px",
  "&:hover": {
    backgroundColor: "#333",
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
    backgroundColor: "#f5f5f5",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: "#eddddd",
  },
  "&:hover": {
    backgroundColor: "#f1f1f1",
  },
  cursor: "pointer",
  transition: "background-color 0.2s ease",
}));

const SectionTitle = styled(Typography)({
  fontWeight: "bold",
  backgroundColor: "#f5f5f5",
  padding: "12px 16px",
  marginBottom: "16px",
  borderRadius: "8px",
  color: "#333",
  fontSize: "15px",
});

const DetailLabel = styled(Typography)({
  color: "#666",
  fontSize: "14px",
  marginBottom: "4px",
  width: "150px",
});

const DetailValue = styled(Typography)({
  color: "#333",
  fontSize: "14px",
  marginBottom: "16px",
  fontWeight: "500",
});

const StyledButton = styled(Button)(({ theme }) => ({
  margin: "8px 4px",
  backgroundColor: "#d64b4b",
  color: "white",
  textTransform: "none",
  padding: "6px 16px",
  borderRadius: "8px",
  fontSize: "14px",
  fontWeight: "500",
  "&:hover": {
    backgroundColor: "#b73e3e",
  },
}));

const StyledDialogTitle = styled(DialogTitle)({
  backgroundColor: "#4f4f4f",
  color: "white",
  fontSize: "20px",
  fontWeight: "500",
  padding: "16px 24px",
  borderBottom: "1px solid #e0e0e0",
  position: "relative",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
});

const StyledDialogContent = styled(DialogContent)({
  backgroundColor: "#f9f9f9",
  padding: "24px",
});

const StyledDialogActions = styled(DialogActions)({
  backgroundColor: "#f9f9f9",
  borderTop: "1px solid #e0e0e0",
  padding: "16px 24px",
});

const StyledCloseButton = styled(IconButton)({
  color: "white",
  position: "absolute",
  right: "8px",
  top: "50%",
  transform: "translateY(-50%)",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.1)"
  }
});

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  tenantId: string;
  isActive: boolean | string;
  createdDate: string;
  updatedAt: string;
  lastLoginDate: string | null;
}

const StatusChip = ({ status }: { status: boolean | string | undefined }) => {
  const isUserActive = status === true || status === "True";

  return (
    <Chip
      label={isUserActive ? "Active" : "Inactive"}
      icon={isUserActive ? <CheckCircleIcon /> : <CancelIcon />}
      size="small"
      sx={{
        backgroundColor: isUserActive ? "#e6f4ea" : "#fde7e7",
        color: isUserActive ? "#1e4620" : "#c62828",
        "& .MuiChip-icon": { color: "inherit" },
        fontWeight: "500",
      }}
    />
  );
};

const BlockConfirmationModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  user: User | null;
  isLoading: boolean;
}> = ({ isOpen, onClose, onConfirm, user, isLoading }) => {
  if (!user) return null;

  const isUserActive = user.isActive === true || user.isActive === "True";

  return (
    <Modal open={isOpen} onClose={onClose}>
      <ConfirmationModalContainer>
        <Header>{isUserActive ? 'Block User' : 'Unblock User'}</Header>
        <Box sx={{ my: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography>Current Status:</Typography>
          <StatusChip status={user.isActive} />
        </Box>
        <ConfirmationText>
          Are you sure you want to {isUserActive ? 'block' : 'unblock'} user "{user.username}"?
        </ConfirmationText>
        <ButtonContainer>
          <ConfirmButton 
            onClick={onConfirm}
            disabled={isLoading}
            sx={{
              backgroundColor: isUserActive ? '#d32f2f' : '#2e7d32',
              '&:hover': {
                backgroundColor: isUserActive ? '#b71c1c' : '#1b5e20',
              },
              '&.Mui-disabled': {
                backgroundColor: isUserActive ? '#d32f2f' : '#2e7d32',
                opacity: 0.7,
              }
            }}
          >
            {isLoading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              `Yes, ${isUserActive ? 'Block' : 'Unblock'}`
            )}
          </ConfirmButton>
          <CancelButton onClick={onClose} disabled={isLoading}>Cancel</CancelButton>
        </ButtonContainer>
      </ConfirmationModalContainer>
    </Modal>
  );
};

const LastLogin: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isBlockDialogOpen, setIsBlockDialogOpen] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editData, setEditData] = useState<User | null>(null);
  const [isEditConfirmationOpen, setIsEditConfirmationOpen] = useState(false);

  const formatDate = (date: string | null) => {
    if (!date) return "Never";
    try {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        return "Invalid Date";
      }
      return parsedDate.toLocaleString();
    } catch {
      return "Invalid Date";
    }
  };

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await authenticatedFetch(
        `${process.env.REACT_APP_API_URL || 'http://185.84.140.118:8080'}/api/Auth/users`
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch users: ${errorText}`);
      }

        const data = await response.json();
      
      if (!Array.isArray(data)) {
        throw new Error('Invalid API response format');
      }
      
      // Process and sort users by lastLoginDate in descending order
      const processedUsers = data
        .map((user: any) => ({
          id: user.id,
          username: user.userName || user.username || '',
          email: user.email || '',
          role: user.role || '',
          tenantId: user.tenantId || '',
          isActive: user.isActive === true || user.isActive === "True",
          createdDate: user.createdDate || new Date().toISOString(),
          updatedAt: user.updatedAt || new Date().toISOString(),
          lastLoginDate: user.lastLoginDate
        }))
        .filter(user => user.lastLoginDate)
        .sort((a: User, b: User) => {
          const dateA = new Date(a.lastLoginDate!);
          const dateB = new Date(b.lastLoginDate!);
          return dateB.getTime() - dateA.getTime();
        });
      
      setUsers(processedUsers);
      setFilteredUsers(processedUsers);
      } catch (err) {
      console.error('Error fetching users:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
      } finally {
        setIsLoading(false);
      }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Filter users when search query changes
  useEffect(() => {
    if (!users.length) return;
    
    const filtered = users.filter(user =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  const handleBlockUser = async () => {
    if (!selectedUser) return;

    try {
      setIsActionLoading(true);
      setError(null);

      const response = await authenticatedFetch(
        `${process.env.REACT_APP_API_URL || 'http://185.84.140.118:8080'}/api/Auth/users/${selectedUser.id}/toggle-status`,
        { method: 'POST' }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to update user status');
      }

      // Update local state
      const updatedUsers = users.map(user => 
        user.id === selectedUser.id 
          ? { ...user, isActive: !user.isActive }
          : user
      );
      
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers.filter(user => 
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
      ));
      setSelectedUser(prev => prev ? { ...prev, isActive: !prev.isActive } : null);
      setIsBlockDialogOpen(false);

    } catch (error) {
      console.error('Block/Unblock Error:', error);
      setError(error instanceof Error ? error.message : 'Failed to update user status');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleEditClick = () => {
    if (selectedUser) {
      setEditData(selectedUser);
    setIsEditModalOpen(true);
    }
  };

  const handleCloseEditDialog = () => {
    setIsEditConfirmationOpen(true);
  };

  const handleConfirmEditClose = () => {
    setIsEditConfirmationOpen(false);
    setIsEditModalOpen(false);
  setEditData(null);
  };

  const handleCancelEditClose = () => {
    setIsEditConfirmationOpen(false);
  };

  const handleSaveEdit = async () => {
    if (editData) {
      try {
        setIsLoading(true);
        setError(null);

        // If role has changed, update it via API
        if (editData.role !== selectedUser?.role) {
          // Close dialog immediately
          setIsEditModalOpen(false);
          setEditData(null);

          const response = await authenticatedFetch(
            `${process.env.REACT_APP_API_URL || 'http://185.84.140.118:8080'}/api/Auth/users/${editData.id}/role`,
            {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                newRole: editData.role
              })
            }
          );

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Failed to update user role');
          }

          setSuccessMessage('Role updated successfully');

          // Refresh users list
          await fetchUsers();
        }

        // Update local state
        setUsers(prevUsers =>
          prevUsers.map(user =>
            user.id === editData.id ? { ...user, ...editData } : user
          )
        );
        setSelectedUser(editData);

        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(null), 3000);
      } catch (error) {
        console.error('Error updating user:', error);
        setError(error instanceof Error ? error.message : 'Failed to update user');
        setSuccessMessage(null);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Layout>
      <Box sx={{ 
        padding: { xs: "12px", sm: "16px", md: "24px" }, 
        height: "100vh", 
        overflow: "hidden", 
        backgroundColor: "#f5f7fa" 
      }}>
        {error && (
          <Alert 
            severity="error" 
            sx={{ marginBottom: 2 }}
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}
        {successMessage && (
          <Alert 
            severity="success" 
            sx={{ marginBottom: 2 }}
            onClose={() => setSuccessMessage(null)}
          >
            {successMessage}
          </Alert>
        )}
        
        <Grid container spacing={{ xs: 2, sm: 2, md: 3 }} sx={{ height: "100%" }}>
          {/* Left Section - Table */}
          <Grid item xs={12} md={8} sx={{ 
            height: { xs: "auto", md: "100%" },
            overflow: "auto",
            marginBottom: { xs: 2, md: 0 }
          }}>
            <Paper sx={{ 
              height: "100%", 
              display: "flex", 
              flexDirection: "column", 
              borderRadius: { xs: "8px", sm: "12px" }, 
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)" 
            }}>
              <Typography variant="h5" sx={{ p: 3, fontWeight: "600", color: "#333" }}>
                Users by Last Login
              </Typography>

              <Box sx={{ 
                padding: { xs: "12px", sm: "16px", md: "20px" }, 
                borderBottom: "1px solid #eee" 
              }}>
                <TextField
                  variant="outlined"
                  size="small"
                  placeholder="Search by username"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: "#888" }} />
                      </InputAdornment>
                    ),
                  }}
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: { xs: '6px', sm: '8px' },
                      fontSize: { xs: '13px', sm: '14px' }
                    }
                  }}
                />
              </Box>

              {/* Table Container */}
              <TableContainer sx={{ 
                flexGrow: 1,
                overflow: "auto",
                '& .MuiTable-root': {
                  minWidth: { xs: 500, sm: 650, md: 750 }
                }
              }}>
              {isLoading ? (
                <Box sx={{ display: "flex", justifyContent: "center", padding: "20px" }}>
                  <CircularProgress />
                </Box>
                ) : filteredUsers.length > 0 ? (
                    <Table>
                      <TableHead>
                        <TableRow>
                        <TableCell padding="checkbox">
                          
                        </TableCell>
                        <TableCell sx={{ fontWeight: "600" }}>Username</TableCell>
                        <TableCell sx={{ fontWeight: "600" }}>Email</TableCell>
                        <TableCell sx={{ fontWeight: "600" }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: "600" }}>Last Login</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                      {filteredUsers.map((user) => (
                          <StyledTableRow
                            key={user.id}
                            hover
                            onClick={() => setSelectedUser(user)}
                          selected={selectedUser?.id === user.id}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox 
                              checked={selectedUser?.id === user.id}
                              sx={{ '&.Mui-checked': { color: '#d64b4b' } }}
                            />
                          </TableCell>
                          <TableCell>{user.username}</TableCell>
                            <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <StatusChip status={user.isActive} />
                          </TableCell>
                          <TableCell>{formatDate(user.lastLoginDate)}</TableCell>
                          </StyledTableRow>
                        ))}
                      </TableBody>
                    </Table>
                ) : (
                  <Box sx={{ 
                    display: "flex", 
                    flexDirection: "column", 
                    alignItems: "center", 
                    justifyContent: "center",
                    minHeight: "300px",
                    color: "#666"
                  }}>
                    <SearchIcon sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
                    <Typography>
                      {error ? 'Error loading users' : 'No users found'}
                            </Typography>
                          </Box>
                )}
              </TableContainer>
            </Paper>
          </Grid>

          {/* Right Section */}
          <Grid item xs={12} md={4} sx={{ 
            height: { xs: "auto", md: "100%" },
            display: "block"
          }}>
            <Paper sx={{ 
              height: "100%", 
                padding: { xs: "16px", sm: "20px", md: "24px" }, 
                display: "flex", 
                flexDirection: "column",
                borderRadius: { xs: "8px", sm: "12px" },
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
            }}>
              {selectedUser ? (
                <>
                  <Box sx={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginBottom: "24px" }}>
                    <Tooltip title="Edit User">
                      <StyledButton
                        onClick={handleEditClick}
                        startIcon={<EditIcon />}
                      >
                        Edit
                      </StyledButton>
                    </Tooltip>
                    <Tooltip title={selectedUser.isActive ? "Block Account" : "Unblock Account"}>
                      <StyledButton
                        startIcon={<BlockIcon />}
                        onClick={() => setIsBlockDialogOpen(true)}
                        sx={{
                          backgroundColor: selectedUser.isActive ? '#d32f2f' : '#2e7d32',
                          '&:hover': {
                            backgroundColor: selectedUser.isActive ? '#b71c1c' : '#1b5e20',
                          }
                        }}
                      >
                        {selectedUser.isActive ? 'Block' : 'Unblock'}
                      </StyledButton>
                    </Tooltip>
                  </Box>

                  <Box sx={{overflow: "auto" }}>
                    <SectionTitle>User Data</SectionTitle>
                    <DetailLabel>Username</DetailLabel>
                    <DetailValue>{selectedUser.username}</DetailValue>
                    <DetailLabel>Email</DetailLabel>
                    <DetailValue>{selectedUser.email}</DetailValue>

                    <SectionTitle>Account Details</SectionTitle>
                    <DetailLabel>Status</DetailLabel>
                    <DetailValue>
                      <StatusChip status={selectedUser.isActive} />
                    </DetailValue>
                    <DetailLabel>Registration Date</DetailLabel>
                    <DetailValue>{formatDate(selectedUser.createdDate)}</DetailValue>
                    <DetailLabel>Last Login</DetailLabel>
                    <DetailValue>{selectedUser.lastLoginDate ? formatDate(selectedUser.lastLoginDate) : 'Never'}</DetailValue>

                    <SectionTitle>User Rights</SectionTitle>
                    <DetailLabel>Role</DetailLabel>
                    <DetailValue>{selectedUser.role}</DetailValue>
                  </Box>
                </>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    color: "#666",
                    gap: "12px",
                  }}
                >
                  <SearchIcon sx={{ fontSize: 48, color: '#ccc' }} />
                  <Typography variant="subtitle1">
                    Select a user to view details
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>

        {/* Block Dialog */}
        <BlockConfirmationModal
          isOpen={isBlockDialogOpen}
          onClose={() => setIsBlockDialogOpen(false)}
          onConfirm={handleBlockUser}
          user={selectedUser}
          isLoading={isActionLoading}
        />

        {/* Add Edit Dialog */}
        <MuiDialog
          open={isEditModalOpen}
          onClose={handleCloseEditDialog}
          PaperProps={{
            sx: {
              borderRadius: "12px",
              maxWidth: "100%",
              width: "95%",
              maxHeight: "100vh",
              height: "90vh",
            },
          }}
        >
          <StyledDialogTitle>
            Edit User
            <StyledCloseButton onClick={handleCloseEditDialog} aria-label="close">
              <CloseIcon />
            </StyledCloseButton>
          </StyledDialogTitle>
          <StyledDialogContent>
            {/* Username Row */}
            <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <Typography sx={{ minWidth: "120px", fontWeight: "500" }}>Username</Typography>
              <TextField
                fullWidth
                margin="normal"
                value={editData?.username || ""}
                InputProps={{
                  readOnly: true,
                }}
                sx={{
                  "& .MuiInputBase-input.Mui-readOnly": {
                    backgroundColor: "#f5f5f5",
                    cursor: "not-allowed"
                  }
                }}
              />
            </Box>

            {/* Email Row */}
            <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <Typography sx={{ minWidth: "120px", fontWeight: "500" }}>Email</Typography>
              <TextField
                fullWidth
                margin="normal"
                value={editData?.email || ""}
                InputProps={{
                  readOnly: true,
                }}
                sx={{
                  "& .MuiInputBase-input.Mui-readOnly": {
                    backgroundColor: "#f5f5f5",
                    cursor: "not-allowed"
                  }
                }}
              />
            </Box>

            {/* Role Row */}
            <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <Typography sx={{ minWidth: "120px", fontWeight: "500" }}>Role</Typography>
              <FormControl fullWidth margin="normal">
                <Select
                  value={editData?.role || ""}
                  onChange={(e) =>
                    setEditData((prev) =>
                      prev ? { ...prev, role: e.target.value as string } : null
                    )
                  }
                  displayEmpty
                >
                  <MenuItem value="Admin">Admin</MenuItem>
                  <MenuItem value="Reader">Reader</MenuItem>
                  <MenuItem value="User">User</MenuItem>
                  <MenuItem value="Owner">Owner</MenuItem>
                  <MenuItem value="Publisher">Publisher</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </StyledDialogContent>
          <StyledDialogActions>
            <Button
              onClick={handleCloseEditDialog}
              sx={{
                textTransform: "none",
                fontWeight: "500",
                color: "#666",
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              variant="contained"
              sx={{
                backgroundColor: "#d64b4b",
                textTransform: "none",
                fontWeight: "500",
                "&:hover": {
                  backgroundColor: "#b73e3e",
                },
              }}
            >
              Save Changes
            </Button>
          </StyledDialogActions>
        </MuiDialog>

        {/* Add Edit Confirmation Modal */}
        <ConfirmationModal
          isOpen={isEditConfirmationOpen}
          onClose={handleCancelEditClose}
          onConfirm={handleConfirmEditClose}
        />
      </Box>
    </Layout>
  );
};

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

export default LastLogin;
