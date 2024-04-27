import React from 'react';

interface Submission {
  id: string;
  source: string;
  amount: number;
}

interface EntriesProps {
  submissions: Submission[];
  handleUndoSubmission: (id: string) => void;
}

const Entries: React.FC<EntriesProps> = ({ submissions, handleUndoSubmission }) => {
    return (
    <>
    <h2>Submissions</h2>
    <ul>
    {submissions.map((submission) => (
    <li key={submission.id}>
    {submission.source} - ${submission.amount}
    <button onClick={() => handleUndoSubmission(submission.id)}>
    Undo
    </button>
    </li>
    ))}
    </ul>
    </>
    );
    };
    
    export default Entries;