import Table from '@mui/joy/Table';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchOverview } from '../redux/thunks/fetchOverview';

const OverviewTable = () => {
    return (
        <Table aria-label="Overview Table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Cash-In</th>
                    <th>Cash-Out</th>
                    <th>Net Cash Flow</th>
                    <th>Cumulative Cash Flow</th>
                </tr>
            </thead>
        </Table>
    );
};

export default OverviewTable;

// Notes: consider Caching