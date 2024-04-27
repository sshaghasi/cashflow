import React from "react";
import Table from "@mui/joy/Table";
import Sheet from "@mui/joy/Sheet";

import IconButton from '@mui/joy/IconButton';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';


interface Submission {
  id: string;
  source: string;
  amount: number;
  frequency: string;
  startDate: string;
  endDate: string;
  type: 'Cash-In' | 'Cash-Out'; // Add this line to distinguish between Cash In and Cash Out
}

interface EntriesProps {
  submissions: Submission[];
  handleUndoSubmission: (id: string) => void;
}

const Entries: React.FC<EntriesProps> = ({
  submissions,
  handleUndoSubmission,
}) => {
  return (
    <Sheet style={{ height: 500, overflow: "auto" }}>
      <Table stickyHeader aria-label="Entries Table">
        <thead>
          <tr>
            <th>Source</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Frequency</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((submission) => (
            <tr key={submission.id}>
              <td>{submission.source}</td>
              <td>{submission.type}</td>
              <td>${submission.amount.toFixed(2)}</td>
              <td>{submission.frequency}</td>
              <td>{submission.startDate}</td>
              <td>{submission.endDate}</td>
              <td>
                <IconButton
                  color="danger"
                  onClick={() => handleUndoSubmission(submission.id)}>
                  <DeleteForeverIcon/>
                </IconButton>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Sheet>
  );
};

export default Entries;
