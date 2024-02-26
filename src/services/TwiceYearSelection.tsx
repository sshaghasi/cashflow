import React, { useState, useEffect } from 'react';
import { FormLabel } from "@mui/joy";
import FirstPaymentSelect from "./FirstPaymentSelect";
import StartDateSelect from "./StartDateSelect";
import EndDateSelect from "./EndDateSelect";

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
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const baseDate = new Date(startDate);
    const baseMonth = baseDate.getMonth();

    const newFilteredRange = dateRange.map(dateString => {
      const date = new Date(dateString);
      const formattedDate = formatDateAsLocalYYYYMMDD(date);
      return formattedDate;
    }).filter(formattedDate => {
      const date = new Date(formattedDate);
      const monthDiff = (date.getFullYear() - baseDate.getFullYear()) * 12 + date.getMonth() - baseMonth;
      // Adjust here for semi-annual: Check if the month difference is a multiple of 6
      const isSemiAnnual = monthDiff % 6 === 0;

      if (paymentFirstDate === "Last Day") {
        return isSemiAnnual && new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate() === date.getDate();
      }
      const dayOfMonth = parseInt(paymentFirstDate, 10);
      return !isNaN(dayOfMonth) && isSemiAnnual && date.getDate() === dayOfMonth;
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
