import React from "react";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";

interface StartDateSelectProps {
  dateRange: string[];
  setStartDate: (date: string) => void;
  value: string;
}

const StartDateSelect: React.FC<StartDateSelectProps> = ({
  dateRange,
  setStartDate,
  value,
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
        <Option key={date} value={date}>
          {date}
        </Option>
      ))}
    </Select>
  );
};

export default StartDateSelect;
