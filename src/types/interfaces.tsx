export interface ForecastTimeFrameProps {
  timeFrameStart: string;
  timeFrameEnd: string;
  onTimeFrameStartChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onTimeFrameEndChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  
}

export interface OverviewTableProps {
  dateStates: Record<string, any>;
}

export interface CashProps {
  onSubmit: (data: {
    id: string;
    source: string;
    amount: number;
    paymentDate: string;
    frequency: string;
    startDate: string;
    endDate: string;
    paymentFirstDate: string;
    paymentSecondDate: string;
    paymentMonth: string;
    payOn?: string;
  }) => void;
  onCashOutSubmit: (data: {
    id: string;
    source: string;
    amount: number;
    paymentDate: string;
    frequency: string;
    startDate: string;
    endDate: string;
    paymentFirstDate: string;
    paymentSecondDate: string;
    paymentMonth: string;
    payOn?: string;
  }) => void; // Add this line
  dateRange: string[];
}


export interface CashEntry {
  id: string;
  source: string;
  amount: number;
  type?: 'Cash-In' | 'Cash-Out';
}

export interface DisplayDataProps {
  dateStates: Record<string, DateEntry>;
}

export interface DateEntry {
  cashIn: CashEntry[];
  cashOut: CashEntry[];
  netCashFlow: number;
  cumulativeCashFlow: number;
}

export interface DateStates {
  [keys: string]: DateEntry;
}

export interface CashSubmitParam {
  id: string;
  source: string;
  amount: number;
  paymentDate: string;
  frequency: string;
  startDate: string;
  endDate: string;
  paymentFirstDate: string;
  paymentSecondDate: string;
  paymentMonth: string;
  payOn?: string;
}

export interface SubmissionEntry {
  id: string;
  source: string;
  amount: number;
  frequency: string;
  startDate: string;
  endDate: string;
  paymentDate: string;
  // Include other properties as needed
}
