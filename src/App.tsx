import React, { useState, useEffect } from "react";

import CashIn from "./components/CashIn";
import CashOut from "./components/CashOut";
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

import { CashEntry, DateStates } from "./types/interfaces"


function App() {
  
  // My 2 states
  const [timeFrame, setTimeFrame] = useState("12 months");
  const [dateStates, setDateStates] = useState<DateStates>({});

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
      newDateStates[formattedDate] = { cashIn: [], cashOut: [], netCashFlow: 0 };
    });

    setDateStates(newDateStates);
  }, [timeFrame]);

  function generateDateRange(startDate: Date, endDate: Date): Date[] {
    const dates = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  }

  // Callback function to update the parent's state
  const handleTimeFrameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTimeFrame(event.target.value);
  };

  const handleCashInSubmit = ({
    source,
    amount,
    effectiveDate,
  }: {
    source: string;
    amount: number;
    effectiveDate: string;
  }) => {
    setDateStates((prevState) => {
      const newEntry: CashEntry = { source, amount };
      const dateEntry = prevState[effectiveDate] || { cashIn: [] };
      return {
        ...prevState,
        [effectiveDate]: {
          ...dateEntry,
          cashIn: [...dateEntry.cashIn, newEntry],
        },
      };
    });
  };

  const handleCashOutSubmit = ({
    source,
    amount,
    effectiveDate,
  }: {
    source: string;
    amount: number;
    effectiveDate: string;
  }) => {
    setDateStates((prevState) => {
      const newEntry: CashEntry = { source, amount };
      const dateEntry = prevState[effectiveDate] || { cashOut: [] };
      return {
        ...prevState,
        [effectiveDate]: {
          ...dateEntry,
          cashOut: [...dateEntry.cashOut, newEntry],
        },
      };
    });
  };

  return (
    <Box padding={20} margin={0}>
      <Grid container spacing={3}>
        <Grid padding={5} md={3}>
          <Item>
            <CashIn onSubmit={handleCashInSubmit} />
            <pre>{JSON.stringify(dateStates, null, 2)}</pre>
          </Item>
        </Grid>
        <Grid padding={5} md={3}>
          <Item>
            <CashOut onSubmit={handleCashOutSubmit} />
          </Item>
        </Grid>
        <Grid padding={5} md={5.5}>
          <Grid container direction="column">
            <Grid>
              <Item>
                <ForecastTimeFrame onTimeFrameChange={handleTimeFrameChange} />
              </Item>
            </Grid>
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
                  <DetailedTable />
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
