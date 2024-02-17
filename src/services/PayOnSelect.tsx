import React from "react";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";

interface PayOnSelectProps {
  defaultValue: string;
  setPayOn: (payOn: string) => void;
}

const PayOnSelect: React.FC<PayOnSelectProps> = ({
  defaultValue,
  setPayOn,
}) => {
  const handleChange = (
    event: React.SyntheticEvent | null,
    newValue: string | null,
  ) => {
    // Update the component's pay on state
    if (newValue) {
      setPayOn(newValue);
    }
  };

  return (
    <Select
      defaultValue={defaultValue}
      onChange={handleChange}
      color="primary"
      size="sm"
    >
      <Option value="Sunday">Sunday</Option>
      <Option value="Monday">Monday</Option>
      <Option value="Tuesday">Tuesday</Option>
      <Option value="Wednesday">Wednesday</Option>
      <Option value="Thursday">Thursday</Option>
      <Option value="Friday">Friday</Option>
      <Option value="Saturday">Saturday</Option>
    </Select>
  );
};

export default PayOnSelect;
