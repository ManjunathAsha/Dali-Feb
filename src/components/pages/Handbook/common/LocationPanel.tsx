import React from "react";
import {
  Box,
  styled,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";

interface Row {
  label: string;
  value: string;
}

interface LocationTableProps {
  rows?: Row[];
}

const StyledTableCell = styled(TableCell)(() => ({
  border: "none",
  padding: "10px 12px",
  fontSize: "16px",
}));

const StyledHeadings = styled(Typography)(() => ({
  fontWeight: "bold",
  color: "var(--darkgray)",
}));

const SectionHeading: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <StyledHeadings
    sx={{ padding: "5px 0px 5px 10px", background: "var(--lightgray)" }}
  >
    {children}
  </StyledHeadings>
);

const LocationTable: React.FC<LocationTableProps> = ({ rows }) => (
  <Box sx={{ background: "var(--fade)", color: "var(--darkgray)" }}>
    <Table sx={{ borderCollapse: "collapse" }}>
      <TableBody>
        {rows?.map((row) => (
          <TableRow key={row.label}>
            <StyledTableCell component="th" scope="row">
              {row.label}
            </StyledTableCell>
            <StyledTableCell>{row.value}</StyledTableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </Box>
);

// ChangeRequests Component
const ChangeRequests: React.FC = () => (
  <Typography sx={{ padding: 2 }}>
    Voor deze eis zijn er geen wijzigingsverzoeken in behandeling genomen.{" "}
  </Typography>
);

// Main LocationPanel component
interface LocationPanelProps {
  rows?: Row[];
}

const LocationPanel: React.FC<LocationPanelProps> = ({ rows }) => (
  <Box sx={{ flex: 1, background: "var(--fade)", height: "100%" }}>
    <SectionHeading>Locatie</SectionHeading>
    <LocationTable rows={rows} />
    <SectionHeading>In behandeling genomen wijzigingsverzoeken</SectionHeading>
    <ChangeRequests />
  </Box>
);

export default LocationPanel;
