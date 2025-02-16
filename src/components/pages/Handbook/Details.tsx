import React, { useMemo } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Attachment } from "@mui/icons-material";

const Detail = ({
  sections,
  expandedIds,
  handleChange,
  isDefaultView,
  handleSelect,
  selectedRecordId,
  selectedTypes = [],
}: {
  sections: any[];
  expandedIds: string[];
  handleChange: (id: string) => void;
  isDefaultView: boolean;
  handleSelect: (description: string, id: string, enforcementLevel: string, file: any, link: any) => void;
  selectedRecordId: string | null;
  selectedTypes?: string[];
}) => {
  const getSxProps = (isDefaultView: boolean, bgColor: string) => ({
    color: isDefaultView ? "var(--white)" : "",
    background: isDefaultView ? `var(--${bgColor})` : "",
    minHeight: "40px !important",
    "& .MuiAccordionSummary-content.Mui-expanded": { margin: 0 },
  });

  const groupedSections = useMemo(() => {
    const groupedMap: { [key: string]: any } = {};
    sections.forEach(section => {
      if (!groupedMap[section.section]) {
        groupedMap[section.section] = section;
      }
    });
    return Object.values(groupedMap);
  }, [sections]);

  // Helper function to check if an item should be expanded
  const isExpanded = (id: string) => {
    return expandedIds.includes(id);
  };

  return (
    <Box sx={{ mt: 3 }}>
      {groupedSections.map((section: any) => (
        <Accordion
          key={`section-${section.section}`}
          expanded={isExpanded(`section-${section.section}`)}
          onChange={() => handleChange(`section-${section.section}`)}
          sx={{ mb: 1, boxShadow: "none", "& .Mui-expanded": { margin: 0 } }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: isDefaultView ? "var(--white)" : "none" }} />}
            sx={getSxProps(isDefaultView, "red")}
          >
            <Typography sx={{ fontWeight: "bold" }}>{section.section}</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: isDefaultView ? 0 : "0px 20px" }}>
            {section.stages?.map((stage: any) => (
              <Accordion
                key={`section-${section.section}-stage-${stage.stage}`}
                expanded={isExpanded(`section-${section.section}-stage-${stage.stage}`)}
                onChange={() => handleChange(`section-${section.section}-stage-${stage.stage}`)}
                sx={{ boxShadow: "none", "& .Mui-expanded": { margin: 0 } }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: isDefaultView ? "var(--white)" : "" }} />}
                  sx={getSxProps(isDefaultView, "gray")}
                >
                  <Typography sx={{ fontWeight: isDefaultView ? "" : "bold" }}>{stage.stage}</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ p: isDefaultView ? 0 : "0px 20px" }}>
                  {stage.areas?.map((area: any) => (
                    <Accordion
                      key={`section-${section.section}-stage-${stage.stage}-area-${area.area}`}
                      expanded={isExpanded(`section-${section.section}-stage-${stage.stage}-area-${area.area}`)}
                      onChange={() => handleChange(`section-${section.section}-stage-${stage.stage}-area-${area.area}`)}
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
                          {area.area}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails sx={{ p: isDefaultView ? 0 : "0px 20px" }}>
                        {area.topics?.map((topic: any) => (
                          <Accordion
                            key={`section-${section.section}-stage-${stage.stage}-area-${area.area}-topic-${topic.topic}`}
                            expanded={isExpanded(`section-${section.section}-stage-${stage.stage}-area-${area.area}-topic-${topic.topic}`)}
                            onChange={() => handleChange(`section-${section.section}-stage-${stage.stage}-area-${area.area}-topic-${topic.topic}`)}
                            sx={{ boxShadow: "none", "& .Mui-expanded": { margin: 0 } }}
                          >
                            <AccordionSummary
                              expandIcon={<ExpandMoreIcon sx={{ color: isDefaultView ? "" : "var(--red)" }} />}
                              sx={getSxProps(isDefaultView, "lightgray1")}
                            >
                              <Typography
                                sx={{
                                  fontWeight: isDefaultView ? "" : "bold",
                                  color: isDefaultView ? "var(--black)" : "var(--red)",
                                }}
                              >
                                {topic.topic}
                              </Typography>
                            </AccordionSummary>
                            <AccordionDetails sx={{ p: isDefaultView ? 0 : "0px 20px", backgroundColor: "#ffffff" }}>
                              <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
                                {topic.records?.map((record: any) => (
                                  <Box
                                    component="li"
                                    key={record.id}
                                    onClick={() => handleSelect(record.description, record.id, record.enforcementLevel, record.file, record.link)}
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      cursor: "pointer",
                                      p: 1,
                                      mb: 0.5,
                                      backgroundColor: record.id === selectedRecordId ? "#ffe7ec" : "transparent",
                                      "&:hover": {
                                        borderColor: "var(--red)",
                                        borderRadius: "4px",
                                        borderStyle: "solid",
                                        borderWidth: "1px",
                                        backgroundColor: "var(--white)",
                                      },
                                      "&::before": {
                                        content: '"•"',
                                        mr: 1,
                                        fontSize: "1.2rem",
                                        lineHeight: 1,
                                        color: "var(--darkgray)",
                                      },
                                    }}
                                  >
                                    <Typography>{record.description}</Typography>
                                    {record.file?.isPresent && (
                                      <Attachment sx={{ color: "var(--red)", ml: 1 }} />
                                    )}
                                  </Box>
                                ))}
                              </Box>
                            </AccordionDetails>
                          </Accordion>
                        ))}
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </AccordionDetails>
              </Accordion>
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default Detail;
