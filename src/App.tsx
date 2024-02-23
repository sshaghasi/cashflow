import React, { useState, useEffect } from "react";

import CashIn from "./components/CashIn";

import FrequentQuestions from "./components/FrequentQuestions";
import MyDivider from "./components/MyDivider";
import ForecastTimeFrame from "./components/ForecastTimeFrame";
import DetailedTable from "./components/DetailedTable";
import OverviewTable from "./components/OverviewTable";

import Box from "@mui/system/Box";
import Grid from "@mui/joy/Grid";
import Item from "@mui/joy/Grid";
import TabList from "@mui/joy/TabList";
import Tabs from "@mui/joy/Tabs";
import Tab from "@mui/joy/Tab";
import TabPanel from "@mui/joy/TabPanel";

import { DateStates, CashSubmitParam } from "./types/interfaces";
import { endOfMonth } from 'date-fns'


function App() {
  // My 2 states
  const [timeFrame, setTimeFrame] = useState("12 months");
  const [dateStates, setDateStates] = useState<DateStates>({});
  const dateRange = Object.keys(dateStates);
  console.log(dateStates);
  function generateDateRange(startDate: Date, endDate: Date): Date[] {
    const dates = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  }

  // Sets Date States
  useEffect(() => {
    const startDate = new Date();
    const endDate = new Date();

    switch (timeFrame) {
      case "3 months":
        endDate.setMonth(startDate.getMonth() + 3);
        break;
      case "6 months":
        endDate.setMonth(startDate.getMonth() + 6);
        break;
      case "12 months":
        endDate.setFullYear(startDate.getFullYear() + 1);
        break;
      default:
        break;
    }

    const dates = generateDateRange(startDate, endDate);
    const newDateStates: DateStates = {};

    dates.forEach((date) => {
      const formattedDate = date.toISOString().split("T")[0];
      newDateStates[formattedDate] = {
        cashIn: [],
        cashOut: [],
        netCashFlow: 0,
        cumulativeCashFlow: 0,
      };
    });

    setDateStates(newDateStates);
  }, [timeFrame]);

  const handleTimeFrameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTimeFrame(event.target.value);
  };

  function calculateAndUpdateNetCashFlow(dateStates: DateStates): DateStates {
    const updatedDateStates = { ...dateStates };
    const dates = Object.keys(updatedDateStates).sort(); // Sort dates to ensure chronological order

    let previousCumulativeCashFlow = 0; // Initialize previous day's cumulative cash flow

    dates.forEach((date) => {
      const dateEntry = updatedDateStates[date];
      const totalCashIn = dateEntry.cashIn.reduce(
        (acc, curr) => acc + curr.amount,
        0
      );
      const totalCashOut = dateEntry.cashOut.reduce(
        (acc, curr) => acc + curr.amount,
        0
      );
      const netCashFlow = totalCashIn - totalCashOut;
      const cumulativeCashFlow = previousCumulativeCashFlow + netCashFlow; // Calculate cumulative cash flow

      // Update the date entry with net and cumulative cash flow
      updatedDateStates[date].netCashFlow = netCashFlow;
      updatedDateStates[date].cumulativeCashFlow = cumulativeCashFlow;

      // Update previousCumulativeCashFlow for the next iteration
      previousCumulativeCashFlow = cumulativeCashFlow;
    });

    return updatedDateStates;
  }

  const handleCashInSubmit = ({
    source,
    amount,
    paymentDate,
    frequency,
    startDate,
    endDate,
    paymentFirstDate,
    paymentSecondDate,
    paymentMonth,
    payOn, // This assumes you've included "payOn" in your CashSubmitParam type
  }: CashSubmitParam) => {
    console.log({
      source,
      amount,
      paymentDate,
      frequency,
      startDate,
      endDate,
      payOn,
    }); // Before calling handleCashInSubmit

    setDateStates((prevState) => {
      let updatedState = { ...prevState };
      const newEntry = { source, amount };

      if (frequency === "Daily" && startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const datesInRange = generateDateRange(start, end);

        datesInRange.forEach((date) => {
          const formattedDate = date.toISOString().split("T")[0];
          if (!updatedState[formattedDate]) {
            updatedState[formattedDate] = {
              cashIn: [],
              cashOut: [],
              netCashFlow: 0,
              cumulativeCashFlow: 0,
            };
          }
          updatedState[formattedDate].cashIn.push(newEntry);
        });
      } else if (frequency === "One-time" && paymentDate) {
        if (!updatedState[paymentDate]) {
          updatedState[paymentDate] = {
            cashIn: [],
            cashOut: [],
            netCashFlow: 0,
            cumulativeCashFlow: 0,
          };
        }
        updatedState[paymentDate].cashIn.push(newEntry);
      } else if (frequency === "Weekly" && payOn && startDate && endDate) {
        const start = new Date(startDate);

        const end = new Date(endDate);
     
        const dayIndex = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ].indexOf(payOn);
      
        const datesInRange = generateDateRange(start, end).filter(
          (date) => date.getDay() === dayIndex
        );

        datesInRange.forEach((date) => {
          const formattedDate = date.toISOString().split("T")[0];

          if (!updatedState[formattedDate]) {
            updatedState[formattedDate] = {
              cashIn: [],
              cashOut: [],
              netCashFlow: 0,
              cumulativeCashFlow: 0,
            };
          }
          updatedState[formattedDate].cashIn.push(newEntry);
        });
      } else if (
        frequency === "Every 2 weeks" &&
        payOn &&
        startDate &&
        endDate
      ) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const dayIndex = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ].indexOf(payOn);
        let datesInRange = generateDateRange(start, end);

        // Find the first occurrence of `payOn` after the start date
        const firstOccurrenceIndex = datesInRange.findIndex(
          (date) => date.getDay() === dayIndex
        );
        if (firstOccurrenceIndex !== -1) {
          // Filter to keep only dates that are `payOn` and every 2 weeks from the first occurrence
          datesInRange = datesInRange.filter(
            (_, index) =>
              index >= firstOccurrenceIndex &&
              (index - firstOccurrenceIndex) % 14 === 0
          );
        }

        datesInRange.forEach((date) => {
          const formattedDate = date.toISOString().split("T")[0];

          if (!updatedState[formattedDate]) {
            updatedState[formattedDate] = {
              cashIn: [],
              cashOut: [],
              netCashFlow: 0,
              cumulativeCashFlow: 0,
            };
          }
          updatedState[formattedDate].cashIn.push(newEntry);
        });
      } else if ( frequency === "Every 4 weeks" && payOn && startDate && endDate ) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const dayIndex = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday", "Saturday", ].indexOf(payOn);
        let datesInRange = generateDateRange(start, end);

        // Find the first occurrence of `payOn` after the start date
        const firstOccurrenceIndex = datesInRange.findIndex(
          (date) => date.getDay() === dayIndex
        );

        if (firstOccurrenceIndex !== -1) {
          // Include only dates that are `payOn` and every 4 weeks from the first occurrence
          datesInRange = datesInRange.filter(
            (_, index) =>
              index >= firstOccurrenceIndex &&
              (index - firstOccurrenceIndex) % 28 === 0
          );
        }

        datesInRange.forEach((date) => {
          const formattedDate = date.toISOString().split("T")[0];

          if (!updatedState[formattedDate]) {
            updatedState[formattedDate] = {
              cashIn: [],
              cashOut: [],
              netCashFlow: 0,
              cumulativeCashFlow: 0,
            };
          }
          updatedState[formattedDate].cashIn.push(newEntry);
        });
      } 

      // Add any additional frequency handling as needed

      return calculateAndUpdateNetCashFlow(updatedState);
    });
  };

  const handleCashOutSubmit = ({
    source,
    amount,
    paymentDate,
    frequency,
    startDate,
    endDate,
    paymentFirstDate,
    paymentSecondDate,
    paymentMonth,
  }: CashSubmitParam) => {
    setDateStates((prevState) => {
      let updatedState = { ...prevState };
      const newEntry = { source, amount };

      if (frequency === "Daily" && startDate && endDate) {
        // Convert start and end dates to Date objects if they're not already
        const start = new Date(startDate);
        const end = new Date(endDate);
        const datesInRange = generateDateRange(start, end);

        datesInRange.forEach((date) => {
          const formattedDate = date.toISOString().split("T")[0];
          if (!updatedState[formattedDate]) {
            updatedState[formattedDate] = {
              cashIn: [],
              cashOut: [],
              netCashFlow: 0,
              cumulativeCashFlow: 0,
            };
          }
          updatedState[formattedDate].cashOut.push(newEntry);
        });
      } else if (frequency === "One-time" && paymentDate) {
        // Handle one-time frequency case as before
        if (!updatedState[paymentDate]) {
          updatedState[paymentDate] = {
            cashIn: [],
            cashOut: [],
            netCashFlow: 0,
            cumulativeCashFlow: 0,
          };
        }
        updatedState[paymentDate].cashOut.push(newEntry);
      }
      // Repeat similar logic for other frequencies if needed

      // Update dateStates with new entries and return the new state
      return calculateAndUpdateNetCashFlow(updatedState);
    });
  };

  return (
    <Box padding={10} margin={0}>
      <Grid container spacing={3}>
        <Grid padding={5} md={3}>
          <Item>
            <ForecastTimeFrame onTimeFrameChange={handleTimeFrameChange} />
          </Item>
          <Grid padding={0} mt={5}>
            <CashIn
              onSubmit={handleCashInSubmit}
              onCashOutSubmit={handleCashOutSubmit}
              dateRange={dateRange}
            />
          </Grid>
        </Grid>
        <Grid padding={5} md={9}>
          <Grid container direction="column">
            <Grid sx={{ mt: 7 }}>
              <Tabs aria-label="Basic tabs" defaultValue={0}>
                <TabList>
                  <Tab>Overview</Tab>
                  <Tab>Detailed</Tab>
                </TabList>
                <TabPanel value={0}>
                  <OverviewTable dateStates={dateStates} />
                </TabPanel>
                <TabPanel value={1}>
                  <DetailedTable dateStates={dateStates} />
                </TabPanel>
              </Tabs>
            </Grid>
          </Grid>
        </Grid>
        <Grid padding={5} md={12}>
          <Grid container direction="column">
            <Grid>
              <Item>
                <MyDivider />
              </Item>
            </Grid>
            <Grid sx={{ mt: 7 }}>
              <Item>
                <FrequentQuestions />
              </Item>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

export default App;
