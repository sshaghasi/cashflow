import React, { useState, useEffect } from 'react';
import { FormLabel } from "@mui/joy";
import FirstPaymentSelect from "./FirstPaymentSelect";
import SecondPaymentSelect from './SecondPaymentSelect';
import StartDateSelect from "./StartDateSelect";
import EndDateSelect from "./EndDateSelect";

interface TwicePerMonthProps {
  paymentFirstDate: string;
  setPaymentFirstDate: (date: string) => void;
  paymentSecondDate: string;
  setPaymentSecondDate: (date: string) => void;
  startDate: string;
  setStartDate: (startDate: string) => void;
  endDate: string;
  setEndDate: (endDate: string) => void;
  dateRange: string[];
}
  
const parseDayFromString = (dayString: string): number | 'Last Day' | undefined => {
    if (dayString === 'Last Day') {
      return 'Last Day';
    }
    const numericPart = dayString.replace(/\D/g, '');
    const day = parseInt(numericPart, 10);
    return isNaN(day) ? undefined : day;
  };
  

const TwicePerMonth: React.FC<TwicePerMonthProps> = ({
  paymentFirstDate,
  setPaymentFirstDate,
  paymentSecondDate,
  setPaymentSecondDate,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  dateRange
}) => {
  const [filteredDateRange, setFilteredDateRange] = useState<string[]>([]);

  useEffect(() => {
    const firstDay = parseDayFromString(paymentFirstDate);
    const secondDay = parseDayFromString(paymentSecondDate);
  
    const newFilteredRange = dateRange.filter(dateStr => {
      const date = new Date(dateStr);
      const dayOfMonth = date.getDate();
      const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  
      return (
        (firstDay === 'Last Day' && dayOfMonth === lastDayOfMonth) ||
        (secondDay === 'Last Day' && dayOfMonth === lastDayOfMonth) ||
        (firstDay !== undefined && dayOfMonth === firstDay) ||
        (secondDay !== undefined && dayOfMonth === secondDay)
      );
    });
  
    setFilteredDateRange(newFilteredRange);
  }, [paymentFirstDate, paymentSecondDate, dateRange]);
  

  return (
    <>
      <FormLabel>First Payment Day</FormLabel>
      <FirstPaymentSelect setPaymentFirstDate={setPaymentFirstDate} defaultValue={paymentFirstDate} />
      <FormLabel>Second Payment Day</FormLabel>
      <SecondPaymentSelect setPaymentSecondDate={setPaymentSecondDate} defaultValue={paymentSecondDate} />
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

export default TwicePerMonth;