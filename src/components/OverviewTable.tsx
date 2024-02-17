import Table from "@mui/joy/Table";
import Sheet from "@mui/joy/Sheet";

import { OverviewTableProps } from "../types/interfaces";

const OverviewTable = ({ dateStates }: OverviewTableProps) => {
  return (
    <Sheet sx={{ height: 250, overflow: 'auto' }}>
      <Table stickyHeader aria-label="Overview Table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Cash-In</th>
            <th>Cash-Out</th>
            <th>Net Cash Flow</th>
            <th>Cumulative Cash Flow</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(dateStates).map((date, index) => (
            <tr key={index}>
              <td>{date}</td>
            </tr>
          ))}
            
        </tbody>
      </Table>
    </Sheet>
  );
};

export default OverviewTable;

// Notes: consider Caching