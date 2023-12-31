import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchOverview } from '../thunks/fetchOverview';
import { OverviewData } from '../thunks/fetchOverview';

interface DataState {
  data: OverviewData[] | null; 
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: DataState = {
  data: null,
  status: 'idle',
  error: null,
};

const overviewSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOverview.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOverview.fulfilled, (state, action: PayloadAction<any>) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchOverview.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Something went wrong';
      });
  },
});

export default overviewSlice.reducer;


