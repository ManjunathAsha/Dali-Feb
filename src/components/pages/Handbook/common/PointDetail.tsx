import React, { useEffect, useState } from "react";
import { Box, Icon, IconButton, Tooltip, Typography, CircularProgress } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import Profile from "@mui/icons-material/AccountCircleOutlined";
import { Download, Visibility, InsertDriveFile, Link as LinkIcon } from "@mui/icons-material";
import axios from "axios";

const sectionTitleStyles = {
  fontWeight: "bold",
  p: 1,
  color: "var(--darkgray)",
  background: "var(--lightgray)",
  display: "flex",
  justifyContent: "space-between",
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
  icon?: React.ReactNode;
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

interface PointDetailProps {
  selectedPoint: string;
  ownerName?: string;
  id: string;
  hardness: string;
  files: { isPresent: boolean; value: string };
  links: { isPresent: boolean; value: string };
  onViewFile: (fileUrl: string) => void;
}

interface DocumentFile {
  externalId: string;
  fileName: string;
  filePath: string;
  fileType: string;
}

interface DocumentLink {
  externalId: string;
  fileName: string;
  filePath: string;
  fileType: string;
}

function PointDetail({
  selectedPoint,
  ownerName = "Unknown Owner",
  id,
  hardness,
  files,
  links,
  onViewFile,
}: PointDetailProps) {
  const [fileDetails, setFileDetails] = useState<DocumentFile[]>([]);
  const [linkDetails, setLinkDetails] = useState<DocumentLink[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = (filePath: string, fileName: string) => {
    const baseUrl = `${process.env.REACT_APP_API_URL || 'http://localhost:8080'}/api/DocumentDetails/download`;
    const downloadUrl = `${baseUrl}/${filePath}`;
    
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        // Only fetch file details if files are present
        if (files?.isPresent) {
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL || 'http://localhost:8080'}/api/DocumentDetails/files/${id}`
          );
          setFileDetails(response.data);
        } else {
          setFileDetails([]);
        }

        // Only fetch link details if links are present
        if (links?.isPresent) {
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL || 'http://localhost:8080'}/api/DocumentDetails/links/${id}`
          );
          setLinkDetails(response.data);
        } else {
          setLinkDetails([]);
        }
      } catch (error) {
        console.error("Error fetching details:", error);
        setFileDetails([]);
        setLinkDetails([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [id, files?.isPresent, links?.isPresent]);

  return (
    <Box>
      <Section
        title="Eigenaar"
        icon={<Profile sx={{ fontSize: "20px" }} />}
      >
        <Typography sx={sectionContentStyles}>{ownerName}</Typography>
      </Section>

      <Section title="Geselecteerde eis">
        <Typography sx={sectionContentStyles}>{selectedPoint}</Typography>
      </Section>

      <Section 
        title="Bijlagen" 
        icon={<InsertDriveFile sx={{ fontSize: "20px" }} />}
      >
        {files?.isPresent ? (
          isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : fileDetails.length > 0 ? (
            fileDetails.map((file) => (
              <Box
                key={file.externalId}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                  p: 1,
                  borderRadius: '4px',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <InsertDriveFile sx={{ color: 'var(--darkgray)' }} />
                  <Typography>{file.fileName}</Typography>
                </Box>
                <Box>
                  <Tooltip title="Download">
                    <IconButton
                      onClick={() => handleDownload(file.filePath, file.fileName)}
                      size="small"
                    >
                      <Download />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="View">
                    <IconButton 
                      onClick={() => onViewFile(file.filePath)}
                      size="small"
                    >
                      <Visibility />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            ))
          ) : (
            <Typography sx={sectionContentStyles}>
              Geen bijlagen gevonden
            </Typography>
          )
        ) : (
          <Typography sx={sectionContentStyles}>
            Momenteel zijn er geen bijlagen gekoppeld
          </Typography>
        )}
      </Section>

      <Section 
        title="Bronverwijzingen" 
        icon={<LinkIcon sx={{ fontSize: "20px" }} />}
      >
        {links?.isPresent ? (
          isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : linkDetails.length > 0 ? (
            linkDetails.map((link) => (
              <Box
                key={link.externalId}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                  p: 1,
                  borderRadius: '4px',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LinkIcon sx={{ color: 'var(--darkgray)' }} />
                  <Typography>{link.fileName}</Typography>
                </Box>
                <Tooltip title="View">
                  <IconButton 
                    onClick={() => onViewFile(link.filePath)}
                    size="small"
                  >
                    <Visibility />
                  </IconButton>
                </Tooltip>
              </Box>
            ))
          ) : (
            <Typography sx={sectionContentStyles}>
              Geen bronverwijzingen gevonden
            </Typography>
          )
        ) : (
          <Typography sx={sectionContentStyles}>
            Momenteel zijn er geen bronverwijzingen gekoppeld
          </Typography>
        )}
      </Section>

      <Section title="Hardheid">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pb: 2,
          }}
        >
          <Typography sx={sectionContentStyles}>{hardness}</Typography>
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
