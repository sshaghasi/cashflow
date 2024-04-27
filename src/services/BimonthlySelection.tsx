import React, { useState, useEffect } from 'react';
import { FormLabel } from "@mui/joy";
import FirstPaymentSelect from "./FirstPaymentSelect";
import StartDateSelect from "./StartDateSelect";
import EndDateSelect from "./EndDateSelect";
import { format, parse, getMonth, getYear, getDate, lastDayOfMonth } from 'date-fns';

interface BimonthlySelectionProps {
  paymentFirstDate: string;
  setPaymentFirstDate: (date: string) => void;
  dateRange: string[];
  startDate: string;
  setStartDate: (startDate: string) => void;
  endDate: string;
  setEndDate: (endDate: string) => void;
}

const BimonthlySelection: React.FC<BimonthlySelectionProps> = ({
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
    const formatDateAsLocalYYYYMMDD = (date: Date): string => {
      // Using date-fns to format the date
      return format(date, 'yyyy-MM-dd');
    };

    // Parse the start date once and use it throughout
    const baseDate = startDate ? parse(startDate, 'yyyy-MM-dd', new Date()) : new Date();
    const baseMonth = getMonth(baseDate);

    const newFilteredRange = dateRange.map(dateString => {
      const date = parse(dateString, 'yyyy-MM-dd', new Date());
      const formattedDate = formatDateAsLocalYYYYMMDD(date);
      return formattedDate;
    }).filter(formattedDate => {
      const date = parse(formattedDate, 'yyyy-MM-dd', new Date());
      const monthDiff = (getYear(date) - getYear(baseDate)) * 12 + getMonth(date) - baseMonth;
      const isEveryTwoMonths = monthDiff % 2 === 0;

      if (paymentFirstDate === "Last Day") {
        return isEveryTwoMonths && getDate(date) === getDate(lastDayOfMonth(date));
      }
      const dayOfMonth = parseInt(paymentFirstDate, 10);
      return !isNaN(dayOfMonth) && isEveryTwoMonths && getDate(date) === dayOfMonth;
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
        dateRange={filteredDateRange} // Pass the correctly formatted and filtered dates
        setStartDate={setStartDate}
        value={startDate}
      />
      <FormLabel>End Date</FormLabel>
      <EndDateSelect
        dateRange={filteredDateRange} // Similarly for End Date
        setEndDate={setEndDate}
        value={endDate}
      />
    </>
  );
};






export default BimonthlySelection;