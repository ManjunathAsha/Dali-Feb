import React, { useState, useEffect } from "react";
import { Box, CircularProgress, Grid, LinearProgress, Typography } from "@mui/material";
import Expand from "@mui/icons-material/KeyboardDoubleArrowDown";
import Compress from "@mui/icons-material/KeyboardDoubleArrowUp";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ExportIcon from "@mui/icons-material/ExitToApp";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import PrimaryButton from "../../utils/PrimaryButton";
import DrawerContainer from "../../utils/DrawerContainer";
import Layout from "../Layout/Layout";
import axios from "axios";
import { Section, FilterResponse } from "../../../data/interface";
import Detail from "./Details";
import Paragraph from "./Paragraph";
import { useUser } from "../../../context/AuthContext";
import { useSidebar } from "../../../context/SidebarContext";
import { useLocation, useNavigate } from "react-router-dom";
import WelcomePage from "../WelcomePage";
import { SidebarConfig, SidebarItem } from '../../../data/types';
import { parseFilterValue } from '../../../data/sidebarTransform';
import { FilterParams } from '../../../data/interface';
import { sidebarAPI } from '../../../services/sidebarAPI';
import SectionInfo from "./Sectionnfo";

interface SidebarState {
  expandedItems: string[];
  checkedItems: string[];
  searchTerm: string;
  activeItem: string | null;
  currentSection: string;
  currentRole: string;
  isSidebarOpen: boolean;
  activeSection: string;
  isLoading: boolean;
}

const DRAWER_WIDTH = 400;

function Handbook() {
  const { userInfo } = useUser();
  const { state, dispatch } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();

  const [sidebarConfig, setSidebarConfig] = useState<SidebarConfig | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedSections, setSelectedSections] = useState<Section[]>([]);
  const [expandedAll, setExpandedAll] = useState<boolean>(false);
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [isDefaultView, setDefaultView] = useState<boolean>(true);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedButton, setSelectedButton] = useState<string>("");
  const [actionBarType, setActionBarType] = useState("selected-sections");

  // State for selected record details
  const [selectedPoint, setSelectedPoint] = useState<string>("");
  const [selectedId, setSelectedId] = useState<string>("");
  const [selectedHardness, setSelectedHardness] = useState<string>("");
  const [selectedAttachments, setSelectedAttachments] = useState<any>(null);
  const [selectedSourcereference, setSelectedSourcereference] = useState<any>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const appBarHeight = 65;

  const isWelcomePage = location.pathname.includes('welcome');

  // Close sidebar initially when component mounts or when navigating to welcome page
  useEffect(() => {
    if (isWelcomePage) {
      dispatch({ type: 'SET_SIDEBAR_OPEN', isOpen: true });
      dispatch({ type: 'RESET_CHECKED_ITEMS' });
      
      const defaultExpanded = ['consultOwner', 'sectionOwner'];
      defaultExpanded.forEach(itemId => {
        if (!state.expandedItems.includes(itemId)) {
          dispatch({ type: 'TOGGLE_EXPAND', itemId });
        }
      });
    }
  }, [isWelcomePage, dispatch, state.expandedItems]);

  // Handle navigation changes
  useEffect(() => {
    if (state.checkedItems.length > 0 && isWelcomePage) {
      navigate('/handbook');
    }
  }, [state.checkedItems, isWelcomePage, navigate]);

  // Update sections when filtered documents change
  useEffect(() => {
    if (state.filteredDocuments && state.checkedItems.length > 0) {
      setSections(state.filteredDocuments);
    } else {
      setSections([]); // Clear sections if nothing is selected
    }
  }, [state.filteredDocuments, state.checkedItems]);

  const toggleExpandAll = () => {
    if (expandedAll) {
      setExpandedIds([]);
    } else {
      const allIds = sections.flatMap((section: Section) => [
        `section-${section.section}`,
        ...(section.stages?.flatMap((stage) => [
          `section-${section.section}-stage-${stage.stage}`,
          ...(stage.areas?.flatMap((area) => [
            `section-${section.section}-stage-${stage.stage}-area-${area.area}`,
            ...(area.topics?.map(
              (topic) =>
                `section-${section.section}-stage-${stage.stage}-area-${area.area}-topic-${topic.topic}`
            ) || []),
          ]) || []),
        ]) || []),
      ]);
      setExpandedIds(allIds);
    }
    setExpandedAll(!expandedAll);
    setSelectedButton("expand");
  };

  const toggleView = () => {
    setDefaultView((prev) => !prev);
    setSelectedButton("view");
  };

  const handleShowSelected = () => {
    if (!isOpen) setIsOpen(true);
    setSelectedButton("selected");
    setActionBarType("selected-sections");
    setSelectedSections(sections); // Now correctly assigns the chapters array
  };
  

  const handleSelect = (
    description: string,
    id: string,
    enforcementLevel: string,
    file: any,
    link: any
  ) => {
    setSelectedPoint(description);
    setSelectedId(id);
    setSelectedHardness(enforcementLevel);
   
    setIsOpen(true);
    setActionBarType("selected-para");
    setSelectedRecordId(id);
  };

  const handleChange = (id: string) => {
    const parts = id.split('-');
    const level = Math.floor(parts.length / 2); // Each level adds 2 parts to the ID
    const parentId = parts.slice(0, -2).join('-');

    if (expandedIds.includes(id)) {
      // If clicking an expanded item, collapse it and all its children
      setExpandedIds(expandedIds.filter(expandedId => !expandedId.startsWith(id)));
    } else {
      // If clicking a collapsed item:
      // 1. Keep all parent IDs expanded
      // 2. Remove any sibling expansions at the same level
      // 3. Add the clicked item to expanded IDs
      const newExpandedIds = expandedIds.filter(expandedId => {
        const expandedParts = expandedId.split('-');
        const expandedLevel = Math.floor(expandedParts.length / 2);
        const expandedParentId = expandedParts.slice(0, parts.length - 2).join('-');
        
        // Keep if:
        // - It's a parent of the clicked item
        // - It's at a different level
        // - It's under a different parent
        return (
          expandedId === parentId ||
          expandedLevel < level ||
          (expandedLevel === level && expandedParentId !== parentId)
        );
      });
      
      setExpandedIds([...newExpandedIds, id]);
    }
  };

  const handleViewAttachment = (attachmentUrl: string) => {
    console.log("Attachment URL:", attachmentUrl);
    setPdfUrl(attachmentUrl);
  };
  

  const closePdfViewer = () => {
    setPdfUrl(null); // Close the PDF viewer
  };

  const toggleDrawer = () => {
    setIsOpen((prev) => !prev);
  };

  // Add this function to get selected types from checked items
  const getSelectedTypes = () => {
    const types = new Set<string>();
    state.checkedItems.forEach(itemId => {
      const { type } = parseFilterValue(itemId);
      types.add(type);
    });
    return Array.from(types);
  };

  return (
    <Layout>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: `calc(100vh - ${appBarHeight}px)`,
          transition: 'all 0.3s ease',
          position: 'relative',
          overflow: "hidden",
          width: isOpen ? `calc(100% - ${DRAWER_WIDTH}px)` : '100%',
        }}
      >
        {/* Action Buttons */}
        <Grid 
          container 
          spacing={1} 
          sx={{ 
            p: 1,
            backgroundColor: '#fff',
            borderBottom: '1px solid #e0e0e0',
            width: '100%',
            margin: 0,
          }}
        >
          <Grid item xs={6} sm={3}>
            <PrimaryButton
              label={expandedAll ? "Inklappen" : "Uitklappen"}
              icon={expandedAll ? <Compress /> : <Expand />}
              onClick={toggleExpandAll}
              isActive={selectedButton === "expand"}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <PrimaryButton
              label="Selectie weergeven"
              icon={<CheckBoxIcon />}
              onClick={handleShowSelected}
              isActive={selectedButton === "selected"}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <PrimaryButton
              label="Weergave veranderen"
              icon={<VisibilityIcon />}
              onClick={toggleView}
              isActive={selectedButton === "view"}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <PrimaryButton
              label="Resultaten exporteren"
              icon={<ExportIcon />}
              onClick={() => setSelectedButton("export")}
              isActive={selectedButton === "export"}
            />
          </Grid>
        </Grid>

        {/* Content Area */}
        <Box
          sx={{
            flexGrow: 1,
            overflow: "auto",
            backgroundColor: "#f5f5f5",
            position: "relative",
            p: 2,
            transition: 'width 0.3s ease',
            width: '100%',
          }}
        >
          {state.isLoading && (
            <Box sx={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              zIndex: 1000
            }}>
              <LinearProgress 
                sx={{ 
                  height: 2,
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: 'var(--red)'
                  }
                }} 
              />
            </Box>
          )}
          
          {state.checkedItems.length > 0 && sections.length > 0 ? (
            <Box sx={{ 
              opacity: state.isLoading ? 0.7 : 1,
              transition: 'opacity 0.2s ease',
              position: 'relative'
            }}>
              <Detail
                sections={sections}
                expandedIds={expandedIds}
                handleChange={handleChange}
                isDefaultView={isDefaultView}
                handleSelect={handleSelect}
                selectedRecordId={selectedRecordId}
                selectedTypes={getSelectedTypes()}
              />
            </Box>
          ) : (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '100%',
              flexDirection: 'column',
              gap: 2
            }}>
              <Typography variant="h6" color="textSecondary" sx={{ color: 'var(--darkgray)' }}>
                No Content Selected
              </Typography>
              <Typography variant="body1" color="textSecondary" sx={{ color: 'var(--darkgray)', textAlign: 'center' }}>
                Please select a section from the sidebar under "RAADPLEGEN" to view its content
              </Typography>
            </Box>
          )}
        </Box>

        {/* Right Panel */}
        <DrawerContainer isOpen={isOpen} toggleDrawer={toggleDrawer}>
          {actionBarType === "selected-para" ? (
            <Paragraph
              selectedPoint={selectedPoint}
              ownerName={userInfo?.name}
              id={selectedId}
              hardness={selectedHardness}
              files={selectedAttachments}
              links={selectedSourcereference}
              onViewFile={handleViewAttachment}
              onViewLink={handleViewAttachment}
            />
          ) : (
            <SectionInfo sections={selectedSections}/>
          )}
        </DrawerContainer>
      </Box>
    </Layout>
  );
}

export default Handbook;