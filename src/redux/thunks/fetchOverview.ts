import { createAsyncThunk } from '@reduxjs/toolkit';

export interface OverviewData {
    date: string;
    cashIn: number;
    cashOut: number;
    netCashFlow: number;
    cumulativeCashFlow: number;
}

export const fetchOverview = createAsyncThunk(
    'data/fetchOverview',
    async (): Promise<OverviewData> => {
        const response = await fetch('my-api-endpoint');
        const data = await response.json();
        return data;
    }
)