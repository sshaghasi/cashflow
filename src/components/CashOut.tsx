import React, { useState, FC } from "react";
import {
  Stack,
  Input,
  Button,
  FormLabel,
  Typography,
  Select,
  Option,
} from "@mui/joy";
import { inputBeforeStyle } from "../styles/inputBeforeStyle";

import { CashProps } from "../types/interfaces";

const CashOut: FC<CashProps> = ({ onSubmit }) => {
  const [source, setSource] = useState("");
  const [amount, setAmount] = useState("");
  const [effectiveDate, setEffectiveDate] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission behavior
    // Assuming amount is intended to be a number, ensure conversion if necessary
    onSubmit({ source, amount: Number(amount), effectiveDate });

    setSource("");
    setAmount("");
    setEffectiveDate("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={0.5} direction="column">
        <Typography level="h1">Cash Out</Typography>
        <FormLabel>Source</FormLabel>
        <Input
          sx={inputBeforeStyle}
          color="primary"
          size="sm"
          placeholder="Paycheck"
          value={source}
          onChange={(e) => setSource(e.target.value)}
        />
        <FormLabel>Amount</FormLabel>
        <Input
          type="number" // Ensure numerical input
          sx={inputBeforeStyle}
          color="primary"
          size="sm"
          placeholder="$"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <FormLabel>Frequency</FormLabel>
        <Select defaultValue="One-time" color="primary" size="sm">
          <Option value="One-time">One-time</Option>
          <Option value="Daily">Daily</Option>
          <Option value="Weekly">Weekly</Option>
          <Option value="Every 2 weeks">Every 2 weeks</Option>
          <Option value="Quarterly">Twice per month</Option>
          <Option value="Semiannual">Semiannual</Option>
          <Option value="Annual">Annual</Option>
          <Option value="Semiannual">Semiannual</Option>
          <Option value="Semiannual">Semiannual</Option>
          <Option value="Semiannual">Semiannual</Option>
          <Option value="Semiannual">Semiannual</Option>

        </Select>
        <FormLabel>Effective Date</FormLabel>
        <Input
          // Suggest using the date input type for better user experience
          type="date"
          sx={inputBeforeStyle}
          color="primary"
          size="sm"
          value={effectiveDate}
          onChange={(e) => setEffectiveDate(e.target.value)}
        />
        <Button type="submit">Submit</Button>
      </Stack>
    </form>
  );
};

export default CashOut;