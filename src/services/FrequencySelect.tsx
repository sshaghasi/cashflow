// FrequencySelect.tsx
import React from "react";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";

interface FrequencySelectProps {
  defaultValue: string;
  setFrequency: (frequency: string) => void;
}

const FrequencySelect: React.FC<FrequencySelectProps> = ({
  defaultValue,
  setFrequency,
}) => {
  const handleChange = (
    event: React.SyntheticEvent | null,
    newValue: string | null
  ) => {
    // Update the CashIn component's frequency state
    if (newValue) {
      setFrequency(newValue);
    }
  };

  return (
    <Select
      defaultValue={defaultValue}
      onChange={handleChange}
      color="primary"
      size="sm"
    >
      <Option value="One-time">One-time</Option>
      <Option value="Daily">Daily</Option>
      <Option value="Weekly">Weekly</Option>
      <Option value="Every 2 weeks">Every 2 weeks</Option>
      <Option value="Twice per month">Twice per month</Option>
      <Option value="Every 4 weeks">Every 4 weeks</Option>
      <Option value="Monthly">Monthly</Option>
      <Option value="Every 2 months">Every 2 months</Option>
      <Option value="Quarterly">Quarterly</Option>
      <Option value="Twice per year">Twice per year</Option>
      <Option value="Yearly">Yearly</Option>
    </Select>
  );
};

export default FrequencySelect;
