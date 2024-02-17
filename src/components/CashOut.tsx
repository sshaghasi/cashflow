// CashOut.tsx
import React, { useState, FC } from "react";
import { Stack, Input, Button, FormLabel, Typography } from "@mui/joy";
import { inputBeforeStyle } from "../styles/inputBeforeStyle";
import { CashProps } from "../types/interfaces";
import FrequencySelect from "../services/FrequencySelect";
import PayOnSelect from "../services/PayOnSelect";

const CashOut: FC<CashProps> = ({ onSubmit }) => {
  const [source, setSource] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [frequency, setFrequency] = useState("One-time");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [payOn, setPayOn] = useState("Monday"); // Default to Sunday or your preference

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Optional: Add validation logic here to compare startDate and endDate

    onSubmit({
      source,
      amount: Number(amount),
      paymentDate,
      frequency,
      startDate,
      endDate,
    });

    // Resetting state to default values
    setSource("");
    setAmount("");
    setPaymentDate("");
    setFrequency("One-time");
    setStartDate("");
    setEndDate("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={0.5} direction="column">
        <Typography level="h1">Cash In</Typography>
        <FormLabel>Source</FormLabel>
        <Input
          sx={inputBeforeStyle}
          color="primary"
          size="sm"
          value={source}
          onChange={(e) => setSource(e.target.value)}
        />
        <FormLabel>Amount</FormLabel>
        <Input
          type="number"
          sx={inputBeforeStyle}
          color="primary"
          size="sm"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <FormLabel>Frequency</FormLabel>
        <FrequencySelect defaultValue={frequency} setFrequency={setFrequency} />
        <FormLabel>Payment Date</FormLabel>
        <Input
          type="date"
          sx={inputBeforeStyle}
          color="primary"
          size="sm"
          value={paymentDate}
          onChange={(e) => setPaymentDate(e.target.value)}
        />
        <FormLabel>Pay on</FormLabel>
        <PayOnSelect defaultValue={payOn} setPayOn={setPayOn} />
        <FormLabel>Start Date</FormLabel>
        <Input
          type="date"
          sx={{
            ...inputBeforeStyle,
            borderColor: frequency !== "One-time" && !startDate ? "red" : "",
          }}
          color="primary"
          size="sm"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required={frequency !== "One-time"}
        />
        <FormLabel>End Date</FormLabel>
        <Input
          type="date"
          sx={{
            ...inputBeforeStyle,
            borderColor: frequency !== "One-time" && !endDate ? "red" : "",
          }}
          color="primary"
          size="sm"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required={frequency !== "One-time"}
        />
        <Button type="submit">Submit</Button>
      </Stack>
    </form>
  );
};

export default CashOut;
