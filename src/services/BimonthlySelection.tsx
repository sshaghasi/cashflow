import React, { useState, useEffect } from 'react';
import { FormLabel } from "@mui/joy";
import FirstPaymentSelect from "./FirstPaymentSelect";
import StartDateSelect from "./StartDateSelect";
import EndDateSelect from "./EndDateSelect";

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
    const formatDateAsLocalYYYYMMDD = (date: Date) => {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    // Assume the base month is the month of the startDate. Adjust accordingly if needed.
    const baseDate = new Date(startDate);
    const baseMonth = baseDate.getMonth(); // Get the month of the base date (0-indexed)

    const newFilteredRange = dateRange.map(dateString => {
      const date = new Date(dateString);
      console.log("Original Date: ", date);
      const formattedDate = formatDateAsLocalYYYYMMDD(date);
      console.log("Formatted Date: ", formattedDate);
      return formattedDate;
    }).filter(formattedDate => {
      const date = new Date(formattedDate);
      // Calculate the month difference from the base month
      const monthDiff = (date.getFullYear() - baseDate.getFullYear()) * 12 + date.getMonth() - baseMonth;
      // Check if the month difference is a multiple of 2 (every two months)
      const isEveryTwoMonths = monthDiff % 2 === 0;

      if (paymentFirstDate === "Last Day") {
        // Include the date if it's the last day of the month and falls in the two-month interval
        return isEveryTwoMonths && new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate() === date.getDate();
      }
      const dayOfMonth = parseInt(paymentFirstDate, 10);
      // Include the date if it matches the payment day and falls in the two-month interval
      return !isNaN(dayOfMonth) && isEveryTwoMonths && date.getDate() === dayOfMonth;
    });

    setFilteredDateRange(newFilteredRange);
    console.log(newFilteredRange)
  }, [paymentFirstDate, dateRange, startDate]);

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

export default BimonthlySelection;