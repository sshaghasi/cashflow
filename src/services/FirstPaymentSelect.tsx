import React from "react";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";

interface FirstPaymentSelectProps {
  setPaymentFirstDate: (date: string) => void;
  defaultValue: string;
}

const FirstPaymentSelect: React.FC<FirstPaymentSelectProps> = ({
  setPaymentFirstDate,
  defaultValue,
}) => {
  const handleChange = (event: React.SyntheticEvent | null, newValue: string | null) => {
    if (newValue) {
      setPaymentFirstDate(newValue);
    }
  };

  // Generate the options list dynamically
  const optionsList = Array.from({ length: 30 }, (_, i) => {
    const day = i + 1;
    let suffix = 'th';
    if (day % 10 === 1 && day !== 11) suffix = 'st';
    else if (day % 10 === 2 && day !== 12) suffix = 'nd';
    else if (day % 10 === 3 && day !== 13) suffix = 'rd';
    return `${day}${suffix}`;
  }).concat("Last Day"); // Adding "Last Day" as the final option

  return (
    <Select
      defaultValue={defaultValue}
      onChange={handleChange}
      color="primary"
      size="sm"
    >
      {optionsList.map((label, index) => (
        <Option key={index} value={label}>
          {label}
        </Option>
      ))}
    </Select>
  );
};

export default FirstPaymentSelect;
