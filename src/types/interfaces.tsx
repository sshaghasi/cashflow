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
    paymentDate: string;
    frequency: string;
    startDate: string;
    endDate: string;
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
    cumulativeCashFlow: number;
  }

  export interface DateStates {
    [date: string]: DateEntry;
  }

  export interface CashInSubmitParam {
    source: string;
    amount: number;
    paymentDate: string;
    frequency: string;
    startDate: string;
    endDate: string;
  }
  