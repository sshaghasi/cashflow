import React from "react";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";

interface EndDateSelectProps {
  dateRange: string[];
  setEndDate: (date: string) => void;
  value: string;
}

const EndDateSelect: React.FC<EndDateSelectProps> = ({
  dateRange,
  setEndDate,
  value,
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
        <Option key={date} value={date}>
          {date}
        </Option>
      ))}
    </Select>
  );
};

export default EndDateSelect;
