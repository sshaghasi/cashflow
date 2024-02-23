import React, { useState, useEffect } from 'react';
import { FormLabel } from "@mui/joy";
import FirstPaymentSelect from "./FirstPaymentSelect";
import StartDateSelect from "./StartDateSelect";
import EndDateSelect from "./EndDateSelect";

interface MonthlySelectionProps {
  paymentFirstDate: string;
  setPaymentFirstDate: (date: string) => void;
  dateRange: string[];
  startDate: string;
  setStartDate: (startDate: string) => void;
  endDate: string;
  setEndDate: (endDate: string) => void;
}

const MonthlySelection: React.FC<MonthlySelectionProps> = ({
  paymentFirstDate,
  setPaymentFirstDate,
  dateRange,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}) => {
  const [filteredDateRange, setFilteredDateRange] = useState<string[]>([]);

  useEffect(() => {
    const newFilteredRange = dateRange.map(dateString => {
      const date = new Date(dateString);
      // Ensure the date is formatted as "YYYY-MM-DD"
      const formattedDate = date.toISOString().split('T')[0];
      return formattedDate;
    }).filter(formattedDate => {
      const date = new Date(formattedDate);
      if (paymentFirstDate === "Last Day") {
        // Check if the date is the last day of its month
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate() === date.getDate();
      }
      // Filter dates that match the specified day of the month
      const dayOfMonth = parseInt(paymentFirstDate, 10);
      // Adjust date to the correct format if dayOfMonth is not NaN
      return !isNaN(dayOfMonth) && date.getDate() === dayOfMonth;
    });

    setFilteredDateRange(newFilteredRange);
  }, [paymentFirstDate, dateRange]);

  return (
    <>
      <FormLabel>First Payment Date</FormLabel>
      <FirstPaymentSelect defaultValue={paymentFirstDate} setPaymentFirstDate={setPaymentFirstDate} />
      <FormLabel>Start Date</FormLabel>
      <StartDateSelect
        dateRange={filteredDateRange} // Pass the correctly formatted and filtered dates
        setStartDate={setStartDate}
        defaultValue={startDate}
      />
      <FormLabel>End Date</FormLabel>
      <EndDateSelect
        dateRange={filteredDateRange} // Similarly for End Date
        setEndDate={setEndDate}
        defaultValue={endDate}
      />
    </>
  );
};

export default MonthlySelection;
