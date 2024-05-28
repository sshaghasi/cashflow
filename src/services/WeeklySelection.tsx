// WeeklySelection.tsx
import React, { useEffect, useState } from "react";
import { FormLabel } from "@mui/joy"; // Adjust import paths as necessary
import PayOnSelect from "../services/PayOnSelect";
import StartDateSelect from "../services/StartDateSelect";
import EndDateSelect from "../services/EndDateSelect";
import { parse, getDay } from "date-fns";

interface WeeklySelectionProps {
  payOn: string;
  setPayOn: (payOn: string) => void;
  dateRange: string[];
  startDate: string;
  setStartDate: (startDate: string) => void;
  endDate: string;
  setEndDate: (endDate: string) => void;
  weekAmount: number;
}

// Utility function to filter dates by weekday and week amount
const filterDatesByDay = (dates: string[], dayOfWeek: string): string[] => {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dayIndex = days.indexOf(dayOfWeek);

  return dates.filter((dateString) => {
    // Use the correct format for parsing
    const date = parse(dateString, "MM-dd-yyyy", new Date());
    return getDay(date) === dayIndex;
  });
};

// Inside WeeklySelection component

const WeeklySelection: React.FC<WeeklySelectionProps> = ({
  payOn,
  setPayOn,
  dateRange,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  weekAmount
}) => {
  // Filter dateRange based on the selected payOn day
  const [filteredDateRange, setFilteredDateRange] = useState<string[]>([]);

  useEffect(() => {
    setFilteredDateRange(filterDatesByDay(dateRange, payOn));
  }, [dateRange, payOn]);

  useEffect(() => {
    const startDateIndex = filteredDateRange.indexOf(startDate);
    if (startDateIndex >= 0) {
      setFilteredDateRange(filteredDateRange.filter((date: string, id: number) => id % weekAmount === startDateIndex % weekAmount));
    }
  }, [startDate]);

  return (
    <>
      <FormLabel>Pay on</FormLabel>
      <PayOnSelect value={payOn} setPayOn={setPayOn} />
      <FormLabel>Start Date</FormLabel>
      <StartDateSelect
        dateRange={filteredDateRange} // Pass the filtered dates
        setStartDate={setStartDate}
        value={startDate}
        endDate={endDate}
      />
      <FormLabel>End Date</FormLabel>
      <EndDateSelect
        dateRange={filteredDateRange} // Pass the filtered dates
        setEndDate={setEndDate}
        value={endDate}
        startDate={startDate}
      />
    </>
  );
};

export default WeeklySelection;
