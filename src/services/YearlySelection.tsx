import React, { useState, useEffect } from 'react';
import { FormLabel } from "@mui/joy";
import PaymentMonth from "./PaymentMonth";
import FirstPaymentSelect from "./FirstPaymentSelect";
import StartDateSelect from "./StartDateSelect";
import EndDateSelect from "./EndDateSelect";
import { getMonth, getDate, lastDayOfMonth, parse } from 'date-fns';

interface YearlySelectionProps {
  paymentMonth: string; // This is now a month name, e.g., "January"
  setPaymentMonth: (month: string) => void;
  paymentFirstDate: string;
  setPaymentFirstDate: (date: string) => void;
  dateRange: string[];
  startDate: string;
  setStartDate: (startDate: string) => void;
  endDate: string;
  setEndDate: (endDate: string) => void;
}

const YearlySelection: React.FC<YearlySelectionProps> = ({
  paymentMonth,
  setPaymentMonth,
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
  // Use date-fns parse to convert month name to a Date object then get the month index (0-11)
  const targetMonth = getMonth(parse(`${paymentMonth} 1`, 'MMMM d', new Date()));

  const targetDay = paymentFirstDate === "Last Day" ? -1 : parseInt(paymentFirstDate, 10);

  const newFilteredRange = dateRange.filter(dateStr => {
    // Parse the date string assuming it's in 'yyyy-MM-dd' format, adjust format if necessary
    const date = parse(dateStr, 'yyyy-MM-dd', new Date());
    const dayOfMonth = getDate(date);
    const lastDayOfMonthValue = lastDayOfMonth(date).getDate();

    if (getMonth(date) !== targetMonth) return false;

    if (targetDay === -1) return dayOfMonth === lastDayOfMonthValue;
    return dayOfMonth === targetDay;
  });

  setFilteredDateRange(newFilteredRange);
}, [paymentMonth, paymentFirstDate, dateRange]);


  return (
    <>
      <FormLabel>Payment month</FormLabel>
      <PaymentMonth defaultValue={paymentMonth} setPaymentMonth={setPaymentMonth} />
      <FormLabel>First payment date</FormLabel>
      <FirstPaymentSelect defaultValue={paymentFirstDate} setPaymentFirstDate={setPaymentFirstDate} />
      <FormLabel>Start Date</FormLabel>
      <StartDateSelect dateRange={filteredDateRange} setStartDate={setStartDate} defaultValue={startDate} />
      <FormLabel>End Date</FormLabel>
      <EndDateSelect dateRange={filteredDateRange} setEndDate={setEndDate} defaultValue={endDate} />
    </>
  );
};

export default YearlySelection;
