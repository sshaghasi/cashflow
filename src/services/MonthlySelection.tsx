import React, { useState, useEffect } from 'react';
import { FormLabel } from "@mui/joy";
import FirstPaymentSelect from "./FirstPaymentSelect";
import StartDateSelect from "./StartDateSelect";
import EndDateSelect from "./EndDateSelect";
import { format, lastDayOfMonth, getDate, parse } from 'date-fns';

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
    const formatDateAsLocalYYYYMMDD = (date: Date) => {
      // format the date in YYYY-MM-DD format using date-fns
      return format(date, 'yyyy-MM-dd');
    };

    const newFilteredRange = dateRange.map(dateString => {
      // Parse the date string assuming it is in YYYY-MM-DD format
      const date = parse(dateString, 'yyyy-MM-dd', new Date());
      const formattedDate = formatDateAsLocalYYYYMMDD(date);
      return formattedDate;
    }).filter(formattedDate => {
      // Re-parse the formatted date string
      const date = parse(formattedDate, 'yyyy-MM-dd', new Date());
      if (paymentFirstDate === "Last Day") {
        // Check if the date is the last day of the month
        return getDate(date) === getDate(lastDayOfMonth(date));
      }
      const dayOfMonth = parseInt(paymentFirstDate, 10);
      // Check if the date's day matches the expected day of the month
      return !isNaN(dayOfMonth) && getDate(date) === dayOfMonth;
    });

    setFilteredDateRange(newFilteredRange);
    
  }, [paymentFirstDate, dateRange]);

  // Further JSX and hooks can be handled here.


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

  }
export default MonthlySelection;
