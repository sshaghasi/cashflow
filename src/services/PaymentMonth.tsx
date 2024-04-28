import React from "react";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";

interface PaymentMonthProps {
  setPaymentMonth: (month: string) => void;
  defaultValue: string;
}

const PaymentMonth: React.FC<PaymentMonthProps> = ({
  setPaymentMonth,
  defaultValue,
}) => {
  const handleChange = (
    event: React.SyntheticEvent | null,
    newValue: string | null
  ) => {
    if (newValue) {
      setPaymentMonth(newValue);
    }
  };

  // Define the list of months
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <Select
      defaultValue={defaultValue}
      onChange={handleChange}
      color="primary"
      size="sm"
    >
      {months.map((month, index) => (
        <Option key={index} value={month}>
          {month}
        </Option>
      ))}
    </Select>
  );
};

export default PaymentMonth;
