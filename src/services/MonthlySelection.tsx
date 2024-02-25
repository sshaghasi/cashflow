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
    const formatDateAsLocalYYYYMMDD = (date: Date) => {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
  
    const newFilteredRange = dateRange.map(dateString => {
      const date = new Date(dateString);
      console.log("Original Date: ", date);
      const formattedDate = formatDateAsLocalYYYYMMDD(date);
      console.log("Formatted Date: ", formattedDate);
      return formattedDate;
      

    }).filter(formattedDate => {
      const date = new Date(formattedDate);
      if (paymentFirstDate === "Last Day") {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate() === date.getDate();
      }
      const dayOfMonth = parseInt(paymentFirstDate, 10);
      return !isNaN(dayOfMonth) && date.getDate() === dayOfMonth;
    });

  

    
  
    setFilteredDateRange(newFilteredRange);
    console.log(newFilteredRange)
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
