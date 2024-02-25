import React, { useState, useEffect } from "react";
import { Stack, Input, Button, FormLabel, Typography } from "@mui/joy";
import { inputBeforeStyle } from "../styles/inputBeforeStyle";
import { CashProps } from "../types/interfaces";

import FrequencySelect from "../services/FrequencySelect";
import PayOnSelect from "../services/PayOnSelect";
import StartDateSelect from "../services/StartDateSelect";
import EndDateSelect from "../services/EndDateSelect";
import FirstPaymentSelect from "../services/FirstPaymentSelect";
import SecondPaymentSelect from "../services/SecondPaymentSelect";
import PaymentMonth from "../services/PaymentMonth";
import PaymentDate from "../services/PaymentDate";

import WeeklySelection from "../services/WeeklySelection";
import MonthlySelection from "../services/MonthlySelection";

// Assuming CashProps is already defined appropriately in your types/interfaces
const CashIn: React.FC<CashProps> = ({
  onSubmit,
  onCashOutSubmit,
  dateRange,
}) => {
  const [source, setSource] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [paymentDate, setPaymentDate] = useState<string>("");
  const [frequency, setFrequency] = useState<string>("One-time");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [payOn, setPayOn] = useState<string>("");
  const [paymentFirstDate, setPaymentFirstDate] = useState<string>("");
  const [paymentSecondDate, setPaymentSecondDate] = useState<string>("");
  const [paymentMonth, setPaymentMonth] = useState<string>("January"); 

  console.log(paymentFirstDate)

  const resetForm = () => {
    setSource("");
    setAmount("");
   
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onSubmit({
      source,
      amount: parseFloat(amount), // Assuming amount is a number; ensure validation
      paymentDate,
      frequency,
      startDate,
      endDate,
      paymentFirstDate,
      paymentSecondDate,
      paymentMonth,
      payOn,
    });

    resetForm();
  };

  const handleCashOut = () => {
    onCashOutSubmit({
      source,
      amount: parseFloat(amount), // Ensure conversion from string to number if needed
      paymentDate,
      frequency,
      startDate,
      endDate,
      paymentFirstDate,
      paymentSecondDate,
      paymentMonth,
      payOn,
    });

    resetForm(); // Reset form fields after Cash Out submission
  };

  useEffect(() => {
    if (dateRange && dateRange.length > 0) {
      setPaymentDate(dateRange[0]);
      setStartDate(dateRange[0]);
      setEndDate(dateRange[dateRange.length - 1]);
    }
  }, [dateRange]);

  const renderConditionalInputs = () => {
    switch (frequency) {
      case "One-time":
        return (
          <>
            <FormLabel>Payment Date</FormLabel>
            <PaymentDate
              dateRange={dateRange}
              setPaymentDate={setPaymentDate}
              defaultValue={paymentDate}
            />
          </>
        );
      case "Daily":
        return (
          <>
            <FormLabel>Start Date</FormLabel>
            <StartDateSelect
              dateRange={dateRange} // This prop is passed down from App
              setStartDate={setStartDate}
              defaultValue={startDate} // Ensure this is managed if you want a default value
            />
            <FormLabel>End Date</FormLabel>
            <EndDateSelect
              dateRange={dateRange}
              setEndDate={setEndDate}
              defaultValue={endDate}
            />
          </>
        );
      case "Weekly":
        return (
          <>
            <WeeklySelection
              payOn={payOn}
              setPayOn={setPayOn}
              dateRange={dateRange}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
            />
          </>
        );
      case "Every 2 weeks":
        return (
          <>
            <WeeklySelection
              payOn={payOn}
              setPayOn={setPayOn}
              dateRange={dateRange}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
            />
          </>
        );
      case "Every 4 weeks":
        return (
          <>
            <WeeklySelection
              payOn={payOn}
              setPayOn={setPayOn}
              dateRange={dateRange}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
            />
          </>
        );
      case "Monthly":
        return (
          <>
          <MonthlySelection
            paymentFirstDate={paymentFirstDate}
            setPaymentFirstDate={setPaymentFirstDate}
            dateRange={dateRange}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
          />
        </>
        );
      case "Every 2 months":
        return (
          <>
            <FormLabel>First payment</FormLabel>
            <FirstPaymentSelect
              defaultValue={paymentFirstDate}
              setPaymentFirstDate={setPaymentFirstDate}
            />
            <FormLabel>Start Date</FormLabel>
            <StartDateSelect
              dateRange={dateRange} // This prop is passed down from App
              setStartDate={setStartDate}
              defaultValue={startDate} // Ensure this is managed if you want a default value
            />
            <FormLabel>End Date</FormLabel>
            <EndDateSelect
              dateRange={dateRange}
              setEndDate={setEndDate}
              defaultValue={endDate}
            />
          </>
        );
      case "Quarterly":
        return (
          <>
            <FormLabel>First payment</FormLabel>
            <FirstPaymentSelect
              defaultValue={paymentFirstDate}
              setPaymentFirstDate={setPaymentFirstDate}
            />
            <FormLabel>Start Date</FormLabel>
            <StartDateSelect
              dateRange={dateRange} // This prop is passed down from App
              setStartDate={setStartDate}
              defaultValue={startDate} // Ensure this is managed if you want a default value
            />
            <FormLabel>End Date</FormLabel>
            <EndDateSelect
              dateRange={dateRange}
              setEndDate={setEndDate}
              defaultValue={endDate}
            />
          </>
        );
      case "Yearly":
        return (
          <>
            <FormLabel>Payment month</FormLabel>
            <PaymentMonth
              defaultValue={paymentMonth}
              setPaymentMonth={setPaymentMonth}
            />
            <FormLabel>First payment</FormLabel>
            <FirstPaymentSelect
              defaultValue={paymentFirstDate}
              setPaymentFirstDate={setPaymentFirstDate}
            />
            <FormLabel>Start Date</FormLabel>
            <StartDateSelect
              dateRange={dateRange} // This prop is passed down from App
              setStartDate={setStartDate}
              defaultValue={startDate} // Ensure this is managed if you want a default value
            />
            <FormLabel>End Date</FormLabel>
            <EndDateSelect
              dateRange={dateRange}
              setEndDate={setEndDate}
              defaultValue={endDate}
            />
          </>
        );
      case "Twice per month":
        return (
          <>
            <FormLabel>First payment</FormLabel>
            <FirstPaymentSelect
              defaultValue={paymentFirstDate}
              setPaymentFirstDate={setPaymentFirstDate}
            />
            <FormLabel>Second payment</FormLabel>
            <SecondPaymentSelect
              defaultValue={paymentSecondDate}
              setPaymentSecondDate={setPaymentSecondDate}
            />
            <FormLabel>Start Date</FormLabel>
            <StartDateSelect
              dateRange={dateRange} // This prop is passed down from App
              setStartDate={setStartDate}
              defaultValue={startDate} // Ensure this is managed if you want a default value
            />
            <FormLabel>End Date</FormLabel>
            <EndDateSelect
              dateRange={dateRange}
              setEndDate={setEndDate}
              defaultValue={endDate}
            />
          </>
        );
      case "Twice per year":
        return (
          <>
            <FormLabel>First payment</FormLabel>
            <FirstPaymentSelect
              defaultValue={paymentFirstDate}
              setPaymentFirstDate={setPaymentFirstDate}
            />
            <FormLabel>Start Date</FormLabel>
            <StartDateSelect
              dateRange={dateRange} // This prop is passed down from App
              setStartDate={setStartDate}
              defaultValue={startDate} // Ensure this is managed if you want a default value
            />
            <FormLabel>End Date</FormLabel>
            <EndDateSelect
              dateRange={dateRange}
              setEndDate={setEndDate}
              defaultValue={endDate}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={0.5} direction="column">
        <Typography level="h1">Cash In & Out</Typography>
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
        {renderConditionalInputs()}
        <Button type="submit">Submit Cash-In</Button>
        <Button type="button" onClick={handleCashOut}>
          Submit Cash-Out
        </Button>
      </Stack>
    </form>
  );
};

export default CashIn;
