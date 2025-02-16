import React, { useState } from "react";
import {
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  styled,
  Tabs,
  Tab,
} from "@mui/material";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import PointDetail from "../common/PointDetail";
import CustomModalHeader from "../../../utils/CustomModalHeader";
import PrimaryButton from "../../../utils/PrimaryButton";

const ContentWrapper = styled(Box)({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "flex-start",
});

const LeftSection = styled(Box)({
  width: "65%",
  display: "flex",
  flexDirection: "column",
});

const RightSection = styled(Box)({
  width: "30%",
  padding: "10px",
  backgroundColor: "#f5f5f5",
  borderRadius: "5px",
});

const ButtonSection = styled(Box)({
  display: "flex",
  justifyContent: "flex-end",
  marginTop: "50px",
});

const StyledTabs = styled(Tabs)({
  backgroundColor: "var(--darkgray)",
  minHeight: "40px",
  marginBottom: "10px",
  ".MuiTabs-indicator": {
    display: "none",
  },
});

const StyledTab = styled(Tab)({
  color: "white",
  fontWeight: "bold",
  minHeight: "40px",
  textTransform: "none",
  width: "50%",
  "&.Mui-selected": {
    backgroundColor: "var(--gray)",
    color: "white",
  },
});

const TabPanel: React.FC<{
  value: number;
  index: number;
  children: React.ReactNode;
}> = ({ value, index, children }) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && (
        <Box p={3} sx={{ minHeight: "70vh", p: 0 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

interface SubmitProps {
  submitRequest: boolean;
  setSubmitRequest: () => void;
  selectedPoint: any;
  id: string; 
  hardness: string; 
  files: any; 
  links: any; 
  onViewFile: (fileUrl: string) => void;
  onViewLink: (linkUrl: string) => void;

}

const Submit: React.FC<SubmitProps> = ({
  submitRequest,
  setSubmitRequest,
  selectedPoint,
  id,
  hardness,
  files,
  links,
  onViewFile,
  onViewLink,
}) => {
  const [value, setValue] = useState(0);
  const [editorContent, setEditorContent] = useState("");

  const handleEditorChange = (content: string) => {
    setEditorContent(content);
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    event.preventDefault();
    setValue(newValue);
  };

  const handleSubmit = () => {
    console.log("Form submitted!");
    setSubmitRequest();
  };

  return (
    <CustomModalHeader
      isOpen={submitRequest}
      handleClose={setSubmitRequest}
      title=" Bericht aan de eigenaar"
    >
      {/* Content Wrapper */}
      <ContentWrapper>
        {/* Left Section */}
        <LeftSection>
          {/* Subject Radio Group */}
          <Typography
            sx={{
              p: "8px 12px",
              background: "var(--lightgray)",
              fontWeight: "bold",
              color: "var(--darkgray)",
            }}
          >
            Onderwerp
          </Typography>
          <RadioGroup defaultValue="toevoegen" sx={{ p: "8px 12px" }}>
            <FormControlLabel
              value="toevoegen"
              control={<Radio />}
              label="Toevoegen"
            />
            <FormControlLabel
              value="wijzigen"
              control={<Radio />}
              label="Wijzigen"
            />
            <FormControlLabel
              value="verwijderen"
              control={<Radio />}
              label="Verwijderen"
            />
          </RadioGroup>

          {/* Text Area */}
          <Typography
            sx={{
              p: "8px 12px",
              background: "var(--lightgray)",
              fontWeight: "bold",
              color: "var(--darkgray)",
            }}
          >
            Bericht
          </Typography>
          <ReactQuill
            style={{ height: "200px", width: "100%", padding: "8px 10px" }}
            value={editorContent}
            onChange={handleEditorChange}
          />
          {/* Bottom Section */}
          <ButtonSection>
            <PrimaryButton
              onClick={handleSubmit}
              label="Verzoek"
              theme="dark"
            ></PrimaryButton>
          </ButtonSection>
        </LeftSection>

        {/* Right Section */}
        <RightSection sx={{ borderRadius: "none" }}>
          <Box>
            {/* Tab headers */}
            <StyledTabs value={value} onChange={handleChange}>
              <StyledTab label="Gegevens" />
              <StyledTab label="Bijlagen" />
            </StyledTabs>

            {/* Tab Panels */}
            <TabPanel value={value} index={0}>
              <PointDetail 
              selectedPoint={selectedPoint}  
              id={id}
        hardness={hardness}
        files={files}
        links={links} 
        onViewFile={onViewFile}
      />
            </TabPanel>
            <TabPanel value={value} index={1}>
              Content for Bijlagen (Attachments)
            </TabPanel>
          </Box>
        </RightSection>
      </ContentWrapper>
    </CustomModalHeader>
  );
};

export default Submit;
