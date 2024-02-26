import React, { useState, useEffect } from 'react';
import { FormLabel } from "@mui/joy";
import PaymentMonth from "./PaymentMonth";
import FirstPaymentSelect from "./FirstPaymentSelect";
import StartDateSelect from "./StartDateSelect";
import EndDateSelect from "./EndDateSelect";

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
    // Convert month name to its numeric value (0-11)
    const targetMonth = new Date(`${paymentMonth} 1`).getMonth();

    const targetDay = paymentFirstDate === "Last Day" ? -1 : parseInt(paymentFirstDate, 10);

    const newFilteredRange = dateRange.filter(dateStr => {
      const date = new Date(dateStr);
      const dayOfMonth = date.getDate();
      const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

      if (date.getMonth() !== targetMonth) return false;

      if (targetDay === -1) return dayOfMonth === lastDayOfMonth;
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
