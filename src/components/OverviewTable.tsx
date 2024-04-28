import Table from "@mui/joy/Table";
import Sheet from "@mui/joy/Sheet";

import { OverviewTableProps } from "../types/interfaces";

const OverviewTable = ({ dateStates }: OverviewTableProps) => {
  return (
    <Sheet sx={{ height: 500, overflow: "auto" }}>
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
          {Object.entries(dateStates).map(([date, entry], index) => (
            <tr key={index}>
              <td>{date}</td>
              <td>
                {entry.cashIn
                  .reduce(
                    (acc: number, curr: { amount: number }) =>
                      acc + curr.amount,
                    0
                  )
                  .toFixed(2)}
              </td>
              <td>
                {entry.cashOut
                  .reduce(
                    (acc: number, curr: { amount: number }) =>
                      acc + curr.amount,
                    0
                  )
                  .toFixed(2)}
              </td>
              <td>{entry.netCashFlow?.toFixed(2)}</td>
              <td>{entry.cumulativeCashFlow?.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Sheet>
  );
};

export default OverviewTable;
