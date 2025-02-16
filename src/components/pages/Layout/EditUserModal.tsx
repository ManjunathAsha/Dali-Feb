import React, { useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Checkbox,
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  styled,
  InputAdornment,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";

const StyledButton = styled(Button)(({ theme }) => ({
  margin: "8px 4px",
  backgroundColor: "#d64b4b",
  color: "white",
  textTransform: "none",
  "&:hover": {
    backgroundColor: "#b73e3e",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: "#f9f9f9",
  },
  "&:hover": {
    backgroundColor: "#f1f1f1",
  },
  cursor: "pointer",
}));

const dummyData = [
  {
    username: "A Karreman",
    name: "Karreman Arthur",
    roles: "Consultant, Owner",
  },
  {
    username: "A.Vergeer",
    name: "Forget Arjan",
    roles: "Consultant",
  },
  {
    username: "AdeJong",
    name: "Young Alma the",
    roles: "Consultant, Owner",
  },
  {
    username: "B.Versteeg",
    name: "Versteeg Bart",
    roles: "Consultant",
  },
  {
    username: "Baba",
    name: "s Jai",
    roles: "Consulter, Application Manager, Owner, Publisher",
  },
  {
    username: "E.Diepnhorst",
    name: "Diepenhorst - Elisabeth of Leussen",
    roles: "Consultant",
  },
];

const UserOverview: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [modalData, setModalData] = useState<any>(null); // Data for the modal

  const handleRowClick = (user: any) => {
    setSelectedUser(user);
  };

  const handleOpenModal = () => {
    setModalData(selectedUser); // Set selectedUser data for the modal
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleModalSave = () => {
    console.log("Updated Data:", modalData);
    // Perform save operation here
    setIsModalOpen(false);
  };

  // Filter records based on search query
  const filteredData = dummyData.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ padding: "16px", height: "100vh", overflow: "hidden" }}>
      <Grid container spacing={2} sx={{ height: "100%" }}>
        {/* Left Section - Table */}
        <Grid item xs={8} sx={{ height: "100%", overflow: "auto" }}>
          <Paper sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            {/* Table Header */}
            <Box
              sx={{
                padding: "16px",
                borderBottom: "1px solid #ddd",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
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
                sx={{
                  width: "100%",
                  backgroundColor: "#fff",
                  borderRadius: "4px",
                }}
              />
            </Box>
            {/* Table Body */}
            <TableContainer sx={{ flexGrow: 1 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox"></TableCell>
                    <TableCell>User</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Roles</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredData.map((user, index) => (
                    <StyledTableRow
                      key={index}
                      onClick={() => handleRowClick(user)}
                      selected={selectedUser?.username === user.username}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox />
                      </TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.roles}</TableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
        {/* Right Section - Details */}
        <Grid item xs={4} sx={{ height: "100%", overflow: "auto" }}>
          <Paper sx={{ height: "100%", padding: "16px", display: "flex", flexDirection: "column" }}>
            {selectedUser ? (
              <>
                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                <StyledButton onClick={handleOpenModal}>Change</StyledButton>
                  <StyledButton>Block Account</StyledButton>
                </Box>
                <Box sx={{ marginTop: "16px" }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: "bold",
                      backgroundColor: "#f5f5f5",
                      padding: "8px",
                      marginBottom: "8px",
                      borderRadius: "4px",
                      color: "#666",
                    }}
                  >
                    User Data
                  </Typography>
                  <Typography>Username: {selectedUser.username}</Typography>
                  <Typography>Own name: {selectedUser.name}</Typography>
                  <Typography>Organization: Baba constructions</Typography>

                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: "bold",
                      backgroundColor: "#f5f5f5",
                      padding: "8px",
                      marginTop: "16px",
                      marginBottom: "8px",
                      borderRadius: "4px",
                      color: "#666",
                    }}
                  >
                    Account Details
                  </Typography>
                  <Typography>Status: Account is active</Typography>
                  <Typography>Registration Date: September 18, 2024</Typography>
                  <Typography>Last Logged In: September 18, 2024 at 10:32 am</Typography>

                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: "bold",
                      backgroundColor: "#f5f5f5",
                      padding: "8px",
                      marginTop: "16px",
                      marginBottom: "8px",
                      borderRadius: "4px",
                      color: "#666",
                    }}
                  >
                    User Rights
                  </Typography>
                  <Typography>Roles: {selectedUser.roles}</Typography>
                </Box>
              </>
            ) : (
              <Typography
                variant="subtitle1"
                sx={{
                  color: "#666",
                  textAlign: "center",
                  marginTop: "50%",
                }}
              >
                Select a user to view details
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Modal for Editing User */}
      <Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField
            label="Username"
            fullWidth
            margin="normal"
            value={modalData?.username || ""}
            onChange={(e) =>
              setModalData((prev: any) => ({ ...prev, username: e.target.value }))
            }
          />
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            value={modalData?.name || ""}
            onChange={(e) => setModalData((prev: any) => ({ ...prev, name: e.target.value }))}
          />
          <TextField
            label="Roles"
            fullWidth
            margin="normal"
            value={modalData?.roles || ""}
            onChange={(e) => setModalData((prev: any) => ({ ...prev, roles: e.target.value }))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancel</Button>
          <Button onClick={handleModalSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserOverview;