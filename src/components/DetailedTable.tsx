import React from 'react';
import Table from "@mui/joy/Table";
import Sheet from "@mui/joy/Sheet";

// Assuming DateStates is imported from your types/interfaces
import { DateStates } from "../types/interfaces";

interface DetailedTableProps {
  dateStates: DateStates;
}

const DetailedTable: React.FC<DetailedTableProps> = ({ dateStates }) => {
  return (
    <Sheet style={{ height: 500, overflow: 'auto' }}>
      <Table stickyHeader aria-label="Detailed Cash Flow Table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Source</th>
            <th>(+) Amount</th> {/* Separate column for Cash-In Amount */}
            <th>(-) Amount</th> {/* Separate column for Cash-Out Amount */}
            <th>Net Cash Flow</th>
            <th>Cumulative Cash Flow</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(dateStates).map(([date, entry], dateIndex) => {
            if (entry.cashIn.length === 0 && entry.cashOut.length === 0) {
              return null; // Skip rendering rows for this date if no data
            }

            const transactions = [...entry.cashIn.map(item => ({...item, type: 'Cash-In'})), 
                                   ...entry.cashOut.map(item => ({...item, type: 'Cash-Out'}))];
            const totalRowsForDate = transactions.length + 1; // +1 for the summary row
            
            return (
              <>
                {transactions.map((transaction, index) => (
                  <tr key={`${transaction.type}-${date}-${index}`}>
                    <td>{index === 0 ? date : ''}</td>
                    <td>{transaction.type}</td>
                    <td>{transaction.source}</td>
                    <td>{transaction.type === 'Cash-In' ? transaction.amount.toFixed(2) : ''}</td>
                    <td>{transaction.type === 'Cash-Out' ? `(${transaction.amount.toFixed(2)})` : ''}</td>
                    {/* Empty cells for Net Cash Flow and Cumulative Cash Flow, to be filled in the summary row */}
                    {index === 0 ? <><td></td><td></td></> : null}
                  </tr>
                ))}
                {/* Separate summary row for net and cumulative cash flow */}
                <tr key={`summary-${date}`}>
                  <td colSpan={5}></td> {/* Adjust colSpan as needed */}
                  <td>{entry.netCashFlow?.toFixed(2)}</td>
                  <td>{entry.cumulativeCashFlow?.toFixed(2)}</td>
                </tr>
              </>
            );
          })}
        </tbody>
      </Table>
    </Sheet>
  );
};

export default DetailedTable;
