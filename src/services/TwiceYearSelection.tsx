import React, { useState, useEffect } from 'react';
import { FormLabel } from "@mui/joy";
import FirstPaymentSelect from "./FirstPaymentSelect";
import StartDateSelect from "./StartDateSelect";
import EndDateSelect from "./EndDateSelect";
import { format, parse, getYear, getMonth, getDate, lastDayOfMonth } from 'date-fns';


interface TwiceYearSelectionProps {
  paymentFirstDate: string;
  setPaymentFirstDate: (date: string) => void;
  dateRange: string[];
  startDate: string;
  setStartDate: (startDate: string) => void;
  endDate: string;
  setEndDate: (endDate: string) => void;
}

const TwiceYearSelection: React.FC<TwiceYearSelectionProps> = ({
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
    // Using date-fns to format the date as YYYY-MM-DD
    return format(date, 'yyyy-MM-dd');
  };

  // Parsing the startDate and assuming it is in 'yyyy-MM-dd' format, adjust if necessary
  const baseDate = parse(startDate, 'yyyy-MM-dd', new Date());
  const baseMonth = getMonth(baseDate); // getMonth is zero-indexed

  const newFilteredRange = dateRange.map(dateString => {
    // Parsing each date in the date range assuming they are in 'yyyy-MM-dd' format
    const date = parse(dateString, 'yyyy-MM-dd', new Date());
    const formattedDate = formatDateAsLocalYYYYMMDD(date);
    return formattedDate;
  }).filter(formattedDate => {
    // Re-parsing to convert string back to date
    const date = parse(formattedDate, 'yyyy-MM-dd', new Date());
    // Calculate the month difference from the base month for semi-annual adjustment
    const monthDiff = (getYear(date) - getYear(baseDate)) * 12 + getMonth(date) - baseMonth;
    // Check if the month difference is a multiple of 6
    const isSemiAnnual = monthDiff % 6 === 0;

    if (paymentFirstDate === "Last Day") {
      // Check if it's the last day of the month and matches the semi-annual criteria
      return isSemiAnnual && getDate(date) === getDate(lastDayOfMonth(date));
    }
    const dayOfMonth = parseInt(paymentFirstDate, 10);
    // Check if it's the specific day of the month and matches the semi-annual criteria
    return !isNaN(dayOfMonth) && isSemiAnnual && getDate(date) === dayOfMonth;
  });

  setFilteredDateRange(newFilteredRange);
}, [paymentFirstDate, dateRange, startDate]);

  return (
    <>
      <FormLabel>First Payment Date</FormLabel>
      <FirstPaymentSelect defaultValue={paymentFirstDate} setPaymentFirstDate={setPaymentFirstDate} />
      <FormLabel>Start Date</FormLabel>
      <StartDateSelect
        dateRange={filteredDateRange}
        setStartDate={setStartDate}
        defaultValue={startDate}
      />
      <FormLabel>End Date</FormLabel>
      <EndDateSelect
        dateRange={filteredDateRange}
        setEndDate={setEndDate}
        defaultValue={endDate}
      />
    </>
  );
};

export default TwiceYearSelection;
