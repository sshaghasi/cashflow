import React, { useState, useEffect } from 'react';
import { FormLabel } from "@mui/joy";
import FirstPaymentSelect from "./FirstPaymentSelect";
import StartDateSelect from "./StartDateSelect";
import EndDateSelect from "./EndDateSelect";
import { format, parse, getYear, getMonth, getDate, lastDayOfMonth } from 'date-fns';

interface QuarterlySelectionProps {
  paymentFirstDate: string;
  setPaymentFirstDate: (date: string) => void;
  dateRange: string[];
  startDate: string;
  setStartDate: (startDate: string) => void;
  endDate: string;
  setEndDate: (endDate: string) => void;
}

const QuarterlySelection: React.FC<QuarterlySelectionProps> = ({
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

  const baseDate = parse(startDate, 'yyyy-MM-dd', new Date());
  const baseMonth = getMonth(baseDate); // Get the month of the base date (0-indexed)

  const newFilteredRange = dateRange.map(dateString => {
    const date = parse(dateString, 'yyyy-MM-dd', new Date());
    console.log("Original Date: ", date);
    const formattedDate = formatDateAsLocalYYYYMMDD(date);
    console.log("Formatted Date: ", formattedDate);
    return formattedDate;
  }).filter(formattedDate => {
    const date = parse(formattedDate, 'yyyy-MM-dd', new Date());
    const monthDiff = (getYear(date) - getYear(baseDate)) * 12 + getMonth(date) - baseMonth;
    // Check if the month difference is a multiple of 3 for quarterly
    const isQuarterly = monthDiff % 3 === 0;

    if (paymentFirstDate === "Last Day") {
      return isQuarterly && getDate(date) === getDate(lastDayOfMonth(date));
    }
    const dayOfMonth = parseInt(paymentFirstDate, 10);
    return !isNaN(dayOfMonth) && isQuarterly && getDate(date) === dayOfMonth;
  });

  setFilteredDateRange(newFilteredRange);
  console.log(newFilteredRange);
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

export default QuarterlySelection;
