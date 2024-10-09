import React from "react";
import { Box, Icon, IconButton, Tooltip, Typography } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import Profile from "@mui/icons-material/AccountCircleOutlined";

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

function PointDetail({ selectedPoint }: any) {
  return (
    <Box>
      {/* Owner Section */}
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

      {/* Selected Requirement Section */}
      <Section title="Geselecteerde eis">
        <Typography sx={sectionContentStyles}>{selectedPoint}</Typography>
      </Section>

      {/* Attachments Section */}
      <Section title="Bijlagen">
        <Typography sx={sectionContentStyles}>
          Momenteel zijn er geen bijlagen gekoppeld
        </Typography>
      </Section>

      {/* References Section */}
      <Section title="Bronverwijzingen">
        <Typography sx={sectionContentStyles}>
          Momenteel zijn er geen bronverwijzingen gekoppeld
        </Typography>
      </Section>

      {/* Hardness Section */}
      <Section title="Hardheid">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pb: 2,
          }}
        >
          <Typography sx={sectionContentStyles}>Richtlijn (R)</Typography>
          <Tooltip title="Hardheid informatie" arrow>
            <IconButton>
              <InfoIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Section>
    </Box>
  );
}

export default PointDetail;
