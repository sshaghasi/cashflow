import React from "react";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import { compareDateStrings } from "../utils/helper";

interface EndDateSelectProps {
  dateRange: string[];
  setEndDate: (date: string) => void;
  value: string;
  startDate: string;
}

const EndDateSelect: React.FC<EndDateSelectProps> = ({
  dateRange,
  setEndDate,
  value,
  startDate
}) => {
  const handleChange = (
    event: React.SyntheticEvent | null,
    newValue: string | null
  ) => {
    // Update the parent component's startDate state
    if (newValue) {
      setEndDate(newValue);
    }
  };

  return (
    <Select value={value} onChange={handleChange} color="primary" size="sm">
      {/* Optionally add a default "Select a date" option */}

      {dateRange.map((date) => (
        compareDateStrings(date, startDate) > -1 && <Option key={date} value={date}>
          {date}
        </Option>
      ))}
    </Select>
  );
};

export default EndDateSelect;
