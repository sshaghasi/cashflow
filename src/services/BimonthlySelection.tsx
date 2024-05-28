import React, { useState, useEffect } from "react";
import { FormLabel } from "@mui/joy";
import FirstPaymentSelect from "./FirstPaymentSelect";
import StartDateSelect from "./StartDateSelect";
import EndDateSelect from "./EndDateSelect";
import {
  format,
  parse,
  getDate,
  lastDayOfMonth,
  differenceInCalendarMonths,
} from "date-fns";

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
    const formatDateAsLocalYYYYMMDD = (date: Date): string =>
      format(date, "MM-dd-yyyy");
    const today = new Date();
    const baseDate = startDate ? parse(startDate, "MM-dd-yyyy", today) : today;

    // If the selected day has already passed in the base month, adjust the base date to the next occurrence.
    const dayOfMonthSelected = parseInt(paymentFirstDate, 10);
    if (!isNaN(dayOfMonthSelected) && getDate(baseDate) > dayOfMonthSelected) {
      baseDate.setMonth(baseDate.getMonth() + 1);
      baseDate.setDate(dayOfMonthSelected);
    }

    const newFilteredRange = dateRange
      .map((dateString) => {
        const date = parse(dateString, "MM-dd-yyyy", new Date());
        return formatDateAsLocalYYYYMMDD(date);
      })
      .filter((formattedDate) => {
        const date = parse(formattedDate, "MM-dd-yyyy", new Date());
        const monthDiff = differenceInCalendarMonths(date, baseDate);
        const isEveryTwoMonths = monthDiff % 2 === 0 && monthDiff >= 0;

        if (paymentFirstDate === "Last Day") {
          return (
            isEveryTwoMonths && getDate(date) === getDate(lastDayOfMonth(date))
          );
        }
        return (
          !isNaN(dayOfMonthSelected) &&
          isEveryTwoMonths &&
          getDate(date) === dayOfMonthSelected
        );
      });

    setFilteredDateRange(newFilteredRange);
    console.log(newFilteredRange); // Optional: Keep this log to check the adjusted outputs
  }, [paymentFirstDate, dateRange, startDate]);

  return (
    <>
      <FormLabel>First Payment Date</FormLabel>
      <FirstPaymentSelect
        defaultValue={paymentFirstDate}
        setPaymentFirstDate={setPaymentFirstDate}
      />
      <FormLabel>Start Date</FormLabel>
      <StartDateSelect
        dateRange={filteredDateRange} // Pass the correctly formatted and filtered dates
        setStartDate={setStartDate}
        value={startDate}
        endDate={endDate}
      />
      <FormLabel>End Date</FormLabel>
      <EndDateSelect
        dateRange={filteredDateRange} // Similarly for End Date
        setEndDate={setEndDate}
        value={endDate}
        startDate={startDate}
      />
    </>
  );
};

export default BimonthlySelection;
