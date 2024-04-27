import React from 'react';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';


interface PaymentDateProps {
  dateRange: string[];
  setPaymentDate: (date: string) => void;
  defaultValue: string;
}

const PaymentDate: React.FC<PaymentDateProps> = ({
  dateRange,
  setPaymentDate,
  defaultValue,
}) => {
  const handleChange = (event: React.SyntheticEvent | null, newValue: string | null) => {
    // Update the parent component's startDate state
    if (newValue) {
      setPaymentDate(newValue);
    }
  };

  return (
    <Select
      value={defaultValue}
      onChange={handleChange}
      color="primary"
      size="sm"
    >
      
      {dateRange.map((date) => (
        <Option key={date} value={date}>
          {date}
        </Option>
      ))}
    </Select>
  );
};

export default PaymentDate;
