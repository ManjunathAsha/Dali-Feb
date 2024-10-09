import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  ListItem,
  ListItemIcon,
  ListItemText,
  styled,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CircleIcon from "@mui/icons-material/Circle";
import { chapters } from "../../utils/HandbookSections";

const StyledListItem = styled(ListItem)(({ theme }) => ({
  margin: "8px 0",
  padding: "2px",
  cursor: "pointer",
  backgroundColor: "#fff",
  borderRadius: "8px",
  transition: "background-color 0.3s ease",
  "&:hover": {
    backgroundColor: theme.palette.grey[200],
  },
  "&.selected": {
    backgroundColor: "#fddde6",
  },
}));

interface DetailProps {
  expandedAll: boolean;
  expandedIds: string[];
  handleChange: (panelId: string) => void;
  isDefaultView: boolean;
  selectedPoint: string;
  handleSelect: (point: any) => void;
}

const Detail: React.FC<DetailProps> = ({
  expandedIds,
  handleChange,
  isDefaultView,
  selectedPoint,
  handleSelect,
}) => {
  
  const getSxProps = (isDefaultView: boolean, bgColor: string) => ({
    color: isDefaultView ? "var(--white)" : "",
    background: isDefaultView ? `var(--${bgColor})` : "",
    minHeight: "40px !important",
    "& .MuiAccordionSummary-content.Mui-expanded": { margin: 0 },
  });

  const renderDetails = (details: any[]) =>
    details?.map((detail, index) => (
      <StyledListItem
        key={index}
        className={selectedPoint === detail ? "selected" : ""}
        onClick={() => handleSelect(detail)}
      >
        <Box sx={{ display: "flex" }}>
          <ListItemIcon sx={{ minWidth: 10, padding: "12px 5px" }}>
            <CircleIcon sx={{ fontSize: 5, width: 10 }} />
          </ListItemIcon>
          <ListItemText primary={detail} />
        </Box>
      </StyledListItem>
    ));

  const renderSubject = (
    subject: any,
    chapterId: string,
    levelId: string,
    areaId: string
  ) => (
    <Accordion
      key={subject.id}
      expanded={expandedIds.includes(
        `chapter-${chapterId}-level-${levelId}-area-${areaId}-subject-${subject.id}`
      )}
      onChange={() =>
        handleChange(
          `chapter-${chapterId}-level-${levelId}-area-${areaId}-subject-${subject.id}`
        )
      }
      sx={{ boxShadow: "none", "& .Mui-expanded": { margin: 0 } }}
    >
      <AccordionSummary
        expandIcon={
          <ExpandMoreIcon sx={{ color: isDefaultView ? "" : "var(--red)" }} />
        }
        sx={getSxProps(isDefaultView, "fade")}
      >
        <Typography
          sx={{
            fontWeight: isDefaultView ? "" : "bold",
            color: isDefaultView ? "var(--black)" : "var(--red)",
          }}
        >
          {subject.title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ p: isDefaultView ? 0 : "0px 20px" }}>
        {renderDetails(subject.details)}
      </AccordionDetails>
    </Accordion>
  );

  const renderArea = (area: any, chapterId: string, levelId: string) => (
    <Accordion
      key={area.id}
      expanded={expandedIds.includes(
        `chapter-${chapterId}-level-${levelId}-area-${area.id}`
      )}
      onChange={() =>
        handleChange(`chapter-${chapterId}-level-${levelId}-area-${area.id}`)
      }
      sx={{ boxShadow: "none", "& .Mui-expanded": { margin: 0 } }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={getSxProps(isDefaultView, "lightgray")}
      >
        <Typography
          sx={{
            fontWeight: isDefaultView ? "" : "bold",
            color: isDefaultView ? "var(--black)" : "none",
          }}
        >
          {area.title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ p: isDefaultView ? 0 : "0px 20px" }}>
        {area.subject?.map((subject: any) =>
          renderSubject(subject, chapterId, levelId, area.id)
        )}
      </AccordionDetails>
    </Accordion>
  );

  const renderLevel = (level: any, chapterId: string) => (
    <Accordion
      key={level.id}
      expanded={expandedIds.includes(`chapter-${chapterId}-level-${level.id}`)}
      onChange={() => handleChange(`chapter-${chapterId}-level-${level.id}`)}
      sx={{ boxShadow: "none", "& .Mui-expanded": { margin: 0 } }}
    >
      <AccordionSummary
        expandIcon={
          <ExpandMoreIcon sx={{ color: isDefaultView ? "var(--white)" : "" }} />
        }
        sx={getSxProps(isDefaultView, "gray")}
      >
        <Typography sx={{ fontWeight: isDefaultView ? "" : "bold" }}>
          {level.name}
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ p: isDefaultView ? 0 : "0px 20px" }}>
        {level.areas?.map((area: any) => renderArea(area, chapterId, level.id))}
      </AccordionDetails>
    </Accordion>
  );

  return (
    <Box sx={{ mt: 3}}>
      {chapters?.map(({ id, name, level }: any) => (
        <Accordion
          key={id}
          sx={{ mb: 1, boxShadow: "none", "& .Mui-expanded": { margin: 0 } }}
          expanded={expandedIds.includes(`chapter-${id}`)}
          onChange={() => handleChange(`chapter-${id}`)}
        >
          <AccordionSummary
            expandIcon={
              <ExpandMoreIcon
                sx={{ color: isDefaultView ? "var(--white)" : "none" }}
              />
            }
            sx={getSxProps(isDefaultView, "red")}
          >
            <Typography sx={{ fontWeight: "bold" }}>
              {id} &nbsp; {name}
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: isDefaultView ? 0 : "0px 20px" }}>
            {level?.map((lvl: any) => renderLevel(lvl, id))}
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default Detail;
