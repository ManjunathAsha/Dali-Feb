import { Box } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import { useState } from "react";
import Submit from "./action/Submit";
import PointDetail from "./common/PointDetail";
import ActionsDropdown from "./common/ActionsDropdown";
import { Edit, Delete } from "@mui/icons-material";
import Remove from "./action/Remove";
import EditHandbook from "./action/edit/Edit";
import Share from "./action/Publish";
import PrimaryButton from "../../utils/PrimaryButton";


interface ParagraphProps {
  selectedPoint: string;
  ownerName?: string;
  id: string; 
  hardness: string; 
  files: any; 
  links: any; 
  onViewFile: (fileUrl: string) => void;
  onViewLink: (linkUrl: string) => void;

}
function Paragraph({ 
  selectedPoint, 
  ownerName = "Unknown Owner" ,
  id,
  hardness,
  files,
  links,
  onViewFile,
  onViewLink,
}: ParagraphProps) {
  const [submitRequest, setSubmitRequest] = useState(false);
  const [isEdit, setEdit] = useState(false);
  const [isDelete, setDelete] = useState(false);
  const [isShare, setShare] = useState(false);
  const [ownerAccess, setOwnerAccess] = useState({
    isOwner: true,
    hasForwardAccess: true,
  });

  const handleRequest = () => {
    setSubmitRequest((prev) => !prev);
  };

  const handleEdit = () => {
    setEdit((prev) => !prev);
  };

  const handleDelete = () => {
    setDelete((prev) => !prev);
  };

  const handleShare = () => {
    setShare((prev) => !prev);
  };

  return (
    <Box
      sx={{
        backgroundColor: "var(--fade)",
        overflowY: "scroll",
        overflowX: "hidden",
      }}
    >
      {/* Button Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          width: "100%",
          p: "2px",
          background: "var(--darkgray)",
        }}
      >
        {ownerAccess.isOwner ? (
          ownerAccess.hasForwardAccess ? (
            <ActionsDropdown
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              handleShare={handleShare}
            />
          ) : (
            <Box sx={{ display: "flex", gap: 1 }}>
              <PrimaryButton
                theme="dark"
                icon={<Edit />}
                label="Wijzigen"
                onClick={handleEdit}
              ></PrimaryButton>
              <PrimaryButton
                theme="dark"
                label="Verwijderen uit handboek"
                icon={<Delete />}
                onClick={handleDelete}
              ></PrimaryButton>
            </Box>
          )
        ) : (
          <PrimaryButton
            theme="dark"
            label="Verzoek indienen"
            icon={<EmailIcon />}
            onClick={handleRequest}
          ></PrimaryButton>
        )}
      </Box>

      {/* Main Content */}
      <PointDetail selectedPoint={selectedPoint} ownerName={ownerName} id={id}
        hardness={hardness}
        files={files}
        links={links} 
        onViewFile={onViewFile}
        />

      <Submit
        submitRequest={submitRequest}
        setSubmitRequest={handleRequest}
        selectedPoint={selectedPoint}
        id={id}
        hardness={hardness}
        files={files}
        links={links}
        onViewFile={onViewFile}
        onViewLink={onViewLink}
      />

      <EditHandbook isEdit={isEdit} setEdit={setEdit} />
      <Remove isDelete={isDelete} setDelete={setDelete} />
      <Share isShare={isShare} setShare={setShare} />
    </Box>
  );
}

export default Paragraph;
