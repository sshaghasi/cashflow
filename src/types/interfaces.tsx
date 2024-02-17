export interface ForecastTimeFrameProps {
  onTimeFrameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface OverviewTableProps {
  dateStates: Record<string, any>;
}

export interface CashProps {
  onSubmit: (data: {
    source: string;
    amount: number;
    effectiveDate: string;
  }) => void;
}

export interface CashEntry {
    source: string;
    amount: number;
  }

  export interface DisplayDataProps {
    dateStates: Record<string, DateEntry>;
  }

  export interface DateEntry {
    cashIn: CashEntry[];
    cashOut: CashEntry[];
    netCashFlow: number;
  }

  export interface DateStates {
    [date: string]: DateEntry;
  }
