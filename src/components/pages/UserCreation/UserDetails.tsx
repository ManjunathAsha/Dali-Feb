import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import PrimaryButton from "../../utils/PrimaryButton";
import { Edit, Delete, Block, Email } from "@mui/icons-material";
import ActionModify from "./common/ActionModify";
import {  Icon, IconButton, Tooltip } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import Profile from "@mui/icons-material/AccountCircleOutlined";

interface UserDetailsProps {
  user: {
    username: string;
    fullName: string;
    organization: string;
    status: string;
    registrationDate: string;
    lastLogin: string;
    roles: string;
  };
}

const sectionTitleStyles = {
  fontWeight: "bold",
  p: 1,
  color: "var(--darkgray)",
  background: "var(--lightgray)",
  display: "flex",
  justifyContent: "space-between"
};

const sectionContentStyles = {
  p: 1,
};

function Section({
  title,
  children,
  icon,
}: {
  title: string;
  children: React.ReactNode;
  icon?: any;
}) {
  return (
    <Box>
      <Typography variant="subtitle2" sx={sectionTitleStyles}>
        {title}
        {icon && icon}
      </Typography>
      {children}
    </Box>
  );
}

const UserDetails: React.FC<UserDetailsProps> = ({ user }) => {
  const [isEditing, setEditing] = useState(false);
  const [isBlocking, setBlocking] = useState(false);

  const handleEdit = () => setEditing(!isEditing);
  const handleBlock = () => setBlocking(!isBlocking);

  return (

    <Box
    sx={{
      backgroundColor: "var(--fade)",
      overflowY: "scroll",
      overflowX: "hidden",
    }}
  >
   <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          width: "100%",
          p: "2px",
          background: "var(--darkgray)",
        }}
      >
  <ActionModify/>

  
</Box>
  <Box>

  <Section
        title="Eigenaar"
        icon={
          <Icon
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Profile sx={{ fontSize: "20px" }} />
          </Icon>
        }
      >
        <Typography sx={sectionContentStyles}>Saanvi Owner</Typography>
      </Section>
        <Typography variant="h6">User Details</Typography>
        <Typography variant="body1">
          <strong>Username:</strong> {user.username}
        </Typography>
        <Typography variant="body1">
          <strong>Full Name:</strong> {user.fullName}
        </Typography>
        <Typography variant="body1">
          <strong>Organization:</strong> {user.organization}
        </Typography>
        <Typography variant="body1">
          <strong>Status:</strong> {user.status}
        </Typography>
        <Typography variant="body1">
          <strong>Registration Date:</strong> {user.registrationDate}
        </Typography>
        <Typography variant="body1">
          <strong>Last Login:</strong> {user.lastLogin}
        </Typography>
        <Typography variant="body1">
          <strong>Roles:</strong> {user.roles}
        </Typography>
      </Box>
  </Box>
   
  );
};

export default UserDetails;
