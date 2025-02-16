import {
  Box,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

interface SectionInfoProps {
  sections?: any[];
}

const StyledTable = styled(Table)({
  borderCollapse: "collapse",
});

const StyledTableCell = styled(TableCell)({
  padding: "10px 12px",
  border: "none",
  fontSize: "16px",
});

const StyledTableBodyCell = styled(TableCell)({
  border: "none",
  padding: "0px 12px 30px 12px",
  fontSize: "16px",
});

const StyledTableHeaderCell = styled(StyledTableCell)({
  fontWeight: "bold",
});

const SectionInfo: React.FC<SectionInfoProps> = ({ sections = [] }) => {
  return (
    <Box sx={{ overflowY: "scroll" }}>
      <Typography
        sx={{
          background: "var(--black)",
          color: "var(--white)",
          p: 1,
        }}
      >
        Resultaten op basis van selecties
      </Typography>
      <Typography
        sx={{
          background: "var(--lightgray)",
          color: "var(--darkgray)",
          p: 1,
          fontWeight: "bold",
        }}
      >
        Hoofdstukken ({sections.length})
      </Typography>
      <TableContainer sx={{ background: "var(--fade)" }}>
        <StyledTable aria-label="borderless table">
          <TableHead>
            <TableRow>
              <StyledTableHeaderCell>Hoofdstuk</StyledTableHeaderCell>
              <StyledTableHeaderCell>Eigenaar</StyledTableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sections.map((sectionItem, index) => (
              <TableRow key={index}>
                <StyledTableBodyCell>
                  {sectionItem.section}
                </StyledTableBodyCell>
                <StyledTableBodyCell>
                  {sectionItem.ownerName }
                </StyledTableBodyCell>
              </TableRow>
            ))}
          </TableBody>
        </StyledTable>
      </TableContainer>
    </Box>
  );
};

export default SectionInfo;
