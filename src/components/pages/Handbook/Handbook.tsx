import { useState } from "react";
import { Box } from "@mui/material";
import { chapters } from "../../utils/HandbookSections";
import Expand from "@mui/icons-material/KeyboardDoubleArrowDown";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Export from "@mui/icons-material/ExitToApp";
import Compress from "@mui/icons-material/KeyboardDoubleArrowUp";
import PrimaryButton from "../../utils/PrimaryButton";
import Detail from "./Details";
import Paragraph from "./Paragraph";
import Chapter from "./Chapters";
import DrawerContainer from "../../utils/DrawerContainer";

function Handbook() {
  const [expandedAll, setExpandedAll] = useState(false);
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [isDefaultView, setDefaultView] = useState(true);
  const [selectedPoint, setSelectedPoint] = useState<string>("");
  const [actionBarType, setActionBarType] = useState("selected-chapters");
  const [isOpen, setIsOpen] = useState(false);

  const appBarHeight = 65;
  const bottomNavHeight = 60;

  const handleChange = (panelId: string) => {
    setExpandedIds((prev) =>
      prev.includes(panelId)
        ? prev.filter((id) => id !== panelId)
        : [...prev, panelId]
    );
  };

  const toggleExpandAll = () => {
    if (expandedAll) {
      setExpandedIds([]);
    } else {
      const allIds = chapters.flatMap((chapter: any) => [
        `chapter-${chapter.id}`,
        ...(chapter.level?.flatMap((level: any) => [
          `chapter-${chapter.id}-level-${level.id}`,
          ...(level.areas?.flatMap((area: any) => [
            `chapter-${chapter.id}-level-${level.id}-area-${area.id}`,
            ...(area.subject?.map(
              (subject: any) =>
                `chapter-${chapter.id}-level-${level.id}-area-${area.id}-subject-${subject.id}`
            ) || []),
          ]) || []),
        ]) || []),
      ]);
      setExpandedIds(allIds);
    }
    setExpandedAll(!expandedAll);
  };

  const toggleView = () => {
    setDefaultView((prev) => !prev);
  };

  const handleSelect = (point: any) => {
    console.log(isOpen)
    isOpen === false && setIsOpen(true);
    setActionBarType("selected-para");
    setSelectedPoint(point);
  };

  const handleShowSelected = () => {
    isOpen === false && setIsOpen(true);
    setActionBarType("selected-chapters");
  };

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  }

  return (
    <Box sx={{ display: "flex", padding: 2, height: `calc(79vh - ${appBarHeight}px + ${bottomNavHeight}px)` }}>
      <Box sx={{ overflowY: "scroll !important" }}>
        <Box sx={{ display: "flex", gap: 1 }}>
          <PrimaryButton
            label={expandedAll ? "Inklappen" : "Uitklappen"}
            icon={expandedAll ? <Compress /> : <Expand />}
            onClick={toggleExpandAll}
          />
          <PrimaryButton
            label="Selectie weergeven"
            icon={<CheckBoxIcon />}
            onClick={handleShowSelected}
          />
          <PrimaryButton
            label="Weergave veranderen"
            icon={<VisibilityIcon />}
            onClick={toggleView}
          />
          <PrimaryButton label="Resultaten exporteren" icon={<Export />} />
        </Box>

        <Detail
          expandedAll={expandedAll}
          expandedIds={expandedIds}
          handleChange={handleChange}
          isDefaultView={isDefaultView}
          selectedPoint={selectedPoint}
          handleSelect={handleSelect}
        />
      </Box>

      <DrawerContainer isOpen={isOpen} toggleDrawer={toggleDrawer}>
        {actionBarType === "selected-para" ? (
          <Paragraph selectedPoint={selectedPoint} />
        ) : (
          <Chapter />
        )}
      </DrawerContainer>
    </Box>
  );
}

export default Handbook;
