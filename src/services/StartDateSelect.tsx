import React from "react";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import { compareDateStrings } from "../utils/helper";

interface StartDateSelectProps {
  dateRange: string[];
  setStartDate: (date: string) => void;
  value: string;
  endDate: string;
}

const StartDateSelect: React.FC<StartDateSelectProps> = ({
  dateRange,
  setStartDate,
  value,
  endDate
}) => {
  const handleChange = (
    event: React.SyntheticEvent | null,
    newValue: string | null
  ) => {
    // Update the parent component's startDate state
    if (newValue) {
      setStartDate(newValue);
    }
  };

  return (
    <Select value={value} onChange={handleChange} color="primary" size="sm">
      {/* Optionally add a default "Select a date" option */}

      {dateRange.map((date) => (
        compareDateStrings(date, endDate) < 1 && <Option key={date} value={date}>
          {date}
        </Option>
      ))}
    </Select>
  );
};

export default StartDateSelect;
