import React, { useState } from "react";
import {
  Box,
  Checkbox,
  TextField,
  Typography,
  FormControlLabel,
  styled,
} from "@mui/material";

interface AttachmentListComponentProps {
  initialList: string[];
  onListSelected: (attachment: string) => void;
  title: string;
}

const StyledTextField = styled(TextField)(() => ({
  ".MuiOutlinedInput-root": {
    background: "var(--white)",
    fontSize: "0.875rem",
    height: "30px",
  },
  ".MuiOutlinedInput-root .Mui-focused": {
    borderColor: "none",
  },
}));

const AttachmentReferenceList = ({
  initialList,
  onListSelected,
  title,
}: AttachmentListComponentProps) => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleAttachmentSelect = (
    event: React.ChangeEvent<HTMLInputElement>,
    value: string
  ) => {
    if (event.target.checked) {
      onListSelected(value);
    }
  };

  const filteredAttachments = initialList.filter((attachment) =>
    attachment.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box
      sx={{ width: "100%", display: "flex", flexDirection: "column", mb: 3 }}
    >
      <Typography sx={{ mt: 2, fontWeight: "bold", color: "var(--darkgray)" }}>
        {title}
      </Typography>
      <Box sx={{ background: "var(--white)", maxWidth: "100%" }}>
        <StyledTextField
          placeholder="Search"
          onChange={handleSearch}
          fullWidth
          size="small"
          value={searchQuery}
        />
        <Box sx={{ height: "150px", overflowY: "auto", overflowX: "hidden" }}>
          {filteredAttachments.map((attachment) => (
            <FormControlLabel
              key={attachment}
              sx={{
                width: "100%",
                p: "0px 10px",
                borderBottom: "0.5px solid var(--lightgray)",
              }}
              control={
                <Checkbox
                  value={attachment}
                  onChange={(e) => handleAttachmentSelect(e, attachment)}
                />
              }
              label={attachment}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default AttachmentReferenceList;
