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
import Button from "@mui/joy/Button";

import { DateStates, CashSubmitParam } from "./types/interfaces";
import { eachDayOfInterval, parseISO, format } from "date-fns";

function App() {
  const [dateStates, setDateStates] = useState<DateStates>({});
  const dateRange = Object.keys(dateStates);
  const [timeFrameStart, setTimeFrameStart] = useState("");
  const [timeFrameEnd, setTimeFrameEnd] = useState("");
  const [history, setHistory] = useState<DateStates[]>([]);


  const handleTimeFrameStart = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTimeFrameStart(event.target.value);
  };
  const handleTimeFrameEnd = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTimeFrameEnd(event.target.value);
  };

  function generateDateRange(startDate: Date, endDate: Date): Date[] {
    // Use eachDayOfInterval directly with Date objects
    const dateRange = eachDayOfInterval({
      start: startDate,
      end: endDate,
    });

    return dateRange;
  }

  const handleUpdateDateStates = (newDateStates: DateStates) => {
    // Capture the current state in history before updating
    setHistory((prevHistory) => [...prevHistory.slice(-10), dateStates]); // Keep last 10 states for example
    setDateStates(newDateStates);
  };

  const undo = () => {
    setHistory((prevHistory) => {
      const newHistory = [...prevHistory];
      const lastState = newHistory.pop(); // Remove the most recent state
      if (lastState) {
        setDateStates(lastState); // Revert to the most recent state
      }
      return newHistory; // Update history without the reverted state
    });
  };
  
  

  useEffect(() => {
    if (timeFrameStart && timeFrameEnd) {
      // Direct parsing to Date objects using date-fns for ISO strings
      const start = parseISO(timeFrameStart);
      const end = parseISO(timeFrameEnd);

      const dates = eachDayOfInterval({ start, end });

      const newDateStates: DateStates = {};
      dates.forEach((date) => {
        const formattedDate = format(date, "yyyy-MM-dd"); // Formatting to string for keys
        newDateStates[formattedDate] = {
          cashIn: [],
          cashOut: [],
          netCashFlow: 0,
          cumulativeCashFlow: 0,
        };
      });

      setDateStates(newDateStates);
    }
  }, [timeFrameStart, timeFrameEnd]);

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
    setDateStates((prevState) => {
      let updatedState = { ...prevState };
      const newEntry = { source, amount };

      if (frequency === "Daily" && startDate && endDate) {
        const start = parseISO(startDate);
        const end = parseISO(endDate);

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
        const start = parseISO(startDate);
        const end = parseISO(endDate);

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
        const start = parseISO(startDate);
        const end = parseISO(endDate);
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
      } else if (
        frequency === "Every 4 weeks" &&
        payOn &&
        startDate &&
        endDate
      ) {
        const start = parseISO(startDate);
        const end = parseISO(endDate);
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
      } else if (frequency === "Monthly" && startDate && endDate) {
        const start = parseISO(startDate);

        const end = parseISO(endDate);
        let currentDate = start;

        while (currentDate <= end) {
          const formattedDate = currentDate.toISOString().split("T")[0];
          if (!updatedState[formattedDate]) {
            updatedState[formattedDate] = {
              cashIn: [],
              cashOut: [],
              netCashFlow: 0,
              cumulativeCashFlow: 0,
            };
          }
          updatedState[formattedDate].cashIn.push(newEntry);

          // Move to the same day next month
          currentDate = new Date(
            currentDate.setMonth(currentDate.getMonth() + 1)
          );
        }
      } else if (frequency === "Every 2 months" && startDate && endDate) {
        const start = parseISO(startDate);
        const end = parseISO(endDate);
        let currentDate = start;

        while (currentDate <= end) {
          const formattedDate = currentDate.toISOString().split("T")[0];
          if (!updatedState[formattedDate]) {
            updatedState[formattedDate] = {
              cashIn: [],
              cashOut: [],
              netCashFlow: 0,
              cumulativeCashFlow: 0,
            };
          }
          updatedState[formattedDate].cashIn.push(newEntry);

          // Move to the same day next month
          currentDate = new Date(
            currentDate.setMonth(currentDate.getMonth() + 2)
          );
        }
      } else if (frequency === "Quarterly" && startDate && endDate) {
        const start = parseISO(startDate);
        const end = parseISO(endDate);
        let currentDate = start;

        while (currentDate <= end) {
          const formattedDate = currentDate.toISOString().split("T")[0];
          if (!updatedState[formattedDate]) {
            updatedState[formattedDate] = {
              cashIn: [],
              cashOut: [],
              netCashFlow: 0,
              cumulativeCashFlow: 0,
            };
          }
          updatedState[formattedDate].cashIn.push(newEntry);

          // Calculate next quarter's date without updating currentDate yet
          let nextQuarterDate = new Date(currentDate);
          nextQuarterDate.setMonth(currentDate.getMonth() + 3);

          // Check if the next quarter date is after the end date
          if (nextQuarterDate > end) {
            // If adding one quarter exceeds the end date, check if we need to add the end date itself
            if (formattedDate !== end.toISOString().split("T")[0]) {
              // Only add the end date if it's not the same as the already added date
              const endDateFormatted = end.toISOString().split("T")[0];
              if (!updatedState[endDateFormatted]) {
                updatedState[endDateFormatted] = {
                  cashIn: [],
                  cashOut: [],
                  netCashFlow: 0,
                  cumulativeCashFlow: 0,
                };
              }
              updatedState[endDateFormatted].cashIn.push(newEntry);
            }
            break; // Exit the loop since we've reached or passed the end date
          }
          // Now, update currentDate to the next quarter since we're continuing the loop
          currentDate = nextQuarterDate;
        }
      } else if (frequency === "Twice per year" && startDate && endDate) {
        const start = parseISO(startDate);
        const end = parseISO(endDate);
        let currentDate = start;

        while (currentDate <= end) {
          const formattedDate = currentDate.toISOString().split("T")[0];
          if (!updatedState[formattedDate]) {
            updatedState[formattedDate] = {
              cashIn: [],
              cashOut: [],
              netCashFlow: 0,
              cumulativeCashFlow: 0,
            };
          }
          updatedState[formattedDate].cashIn.push(newEntry);

          // Calculate the next semi-annual date without updating currentDate yet
          let nextSemiAnnualDate = new Date(currentDate);
          nextSemiAnnualDate.setMonth(currentDate.getMonth() + 6);

          // Check if the next semi-annual date is after the end date
          if (nextSemiAnnualDate > end) {
            // If adding six months exceeds the end date, check if we need to add the end date itself
            if (formattedDate !== end.toISOString().split("T")[0]) {
              // Only add the end date if it's not the same as the already added date
              const endDateFormatted = end.toISOString().split("T")[0];
              if (!updatedState[endDateFormatted]) {
                updatedState[endDateFormatted] = {
                  cashIn: [],
                  cashOut: [],
                  netCashFlow: 0,
                  cumulativeCashFlow: 0,
                };
              }
              updatedState[endDateFormatted].cashIn.push(newEntry);
            }
            break; // Exit the loop since we've reached or passed the end date
          }
          // Now, update currentDate to the next semi-annual date since we're continuing the loop
          currentDate = nextSemiAnnualDate;
        }
      } else if (frequency === "Twice per month" && startDate && endDate) {
        const startDateObj = parseISO(startDate);
        const endDateObj = parseISO(endDate);
        const currentDate = startDateObj;

        const parseDayFromString = (
          dayString: string,
          month: number,
          year: number
        ): number => {
          if (dayString === "Last Day") {
            return new Date(year, month + 1, 0).getDate();
          } else {
            const day = parseInt(dayString, 10);
            return !isNaN(day) ? day : 1; // Default to 1 if parsing fails
          }
        };

        while (currentDate <= endDateObj) {
          [paymentFirstDate, paymentSecondDate].forEach((dayString) => {
            const day = parseDayFromString(
              dayString,
              currentDate.getMonth(),
              currentDate.getFullYear()
            );
            const paymentDate = new Date(
              currentDate.getFullYear(),
              currentDate.getMonth(),
              day
            );

            // Ensure paymentDate is within the start and end date range
            if (paymentDate >= startDateObj && paymentDate <= endDateObj) {
              const formattedDate = paymentDate.toISOString().split("T")[0];
              if (!updatedState[formattedDate]) {
                updatedState[formattedDate] = {
                  cashIn: [],
                  cashOut: [],
                  netCashFlow: 0,
                  cumulativeCashFlow: 0,
                };
              }
              updatedState[formattedDate].cashIn.push({ source, amount });
            }
          });

          // Increment currentDate to the first day of the next month to avoid infinite loop and ensure proper iteration
          currentDate.setMonth(currentDate.getMonth() + 1, 1);
        }
      } else if (
        frequency === "Yearly" &&
        paymentMonth &&
        paymentFirstDate &&
        startDate &&
        endDate
      ) {
        const startDateObj = parseISO(startDate);
        const endDateObj = parseISO(endDate);

        const parseDayFromString = (
          dayString: string,
          month: number,
          year: number
        ): number => {
          if (dayString === "Last Day") {
            return new Date(year, month + 1, 0).getDate();
          } else {
            const day = parseInt(dayString, 10);
            return !isNaN(day) ? day : 1;
          }
        };

        // Convert month name to its numeric value (0-11)
        const targetMonth = new Date(`${paymentMonth} 1, 2000`).getMonth();

        for (
          let year = startDateObj.getFullYear();
          year <= endDateObj.getFullYear();
          year++
        ) {
          const day = parseDayFromString(paymentFirstDate, targetMonth, year);
          const paymentDate = new Date(year, targetMonth, day);

          if (paymentDate >= startDateObj && paymentDate <= endDateObj) {
            const formattedDate = paymentDate.toISOString().split("T")[0];
            updatedState[formattedDate] = updatedState[formattedDate] || {
              cashIn: [],
              cashOut: [],
              netCashFlow: 0,
              cumulativeCashFlow: 0,
            };
            updatedState[formattedDate].cashIn.push(newEntry);
          }
        }
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
    }); // Before calling handleCashOutSubmit

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
          updatedState[formattedDate].cashOut.push(newEntry);
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
          updatedState[formattedDate].cashOut.push(newEntry);
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
          updatedState[formattedDate].cashOut.push(newEntry);
        });
      } else if (
        frequency === "Every 4 weeks" &&
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
          updatedState[formattedDate].cashOut.push(newEntry);
        });
      } else if (frequency === "Monthly" && startDate && endDate) {
        const start = new Date(startDate);

        const end = new Date(endDate);
        let currentDate = start;

        while (currentDate <= end) {
          const formattedDate = currentDate.toISOString().split("T")[0];
          if (!updatedState[formattedDate]) {
            updatedState[formattedDate] = {
              cashIn: [],
              cashOut: [],
              netCashFlow: 0,
              cumulativeCashFlow: 0,
            };
          }
          updatedState[formattedDate].cashOut.push(newEntry);

          // Move to the same day next month
          currentDate = new Date(
            currentDate.setMonth(currentDate.getMonth() + 1)
          );
        }
      } else if (frequency === "Every 2 months" && startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        let currentDate = start;

        while (currentDate <= end) {
          const formattedDate = currentDate.toISOString().split("T")[0];
          if (!updatedState[formattedDate]) {
            updatedState[formattedDate] = {
              cashIn: [],
              cashOut: [],
              netCashFlow: 0,
              cumulativeCashFlow: 0,
            };
          }
          updatedState[formattedDate].cashOut.push(newEntry);

          // Move to the same day next month
          currentDate = new Date(
            currentDate.setMonth(currentDate.getMonth() + 2)
          );
        }
      } else if (frequency === "Quarterly" && startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        let currentDate = start;

        while (currentDate <= end) {
          const formattedDate = currentDate.toISOString().split("T")[0];
          if (!updatedState[formattedDate]) {
            updatedState[formattedDate] = {
              cashIn: [],
              cashOut: [],
              netCashFlow: 0,
              cumulativeCashFlow: 0,
            };
          }
          updatedState[formattedDate].cashOut.push(newEntry);

          // Calculate next quarter's date without updating currentDate yet
          let nextQuarterDate = new Date(currentDate);
          nextQuarterDate.setMonth(currentDate.getMonth() + 3);

          // Check if the next quarter date is after the end date
          if (nextQuarterDate > end) {
            // If adding one quarter exceeds the end date, check if we need to add the end date itself
            if (formattedDate !== end.toISOString().split("T")[0]) {
              // Only add the end date if it's not the same as the already added date
              const endDateFormatted = end.toISOString().split("T")[0];
              if (!updatedState[endDateFormatted]) {
                updatedState[endDateFormatted] = {
                  cashIn: [],
                  cashOut: [],
                  netCashFlow: 0,
                  cumulativeCashFlow: 0,
                };
              }
              updatedState[endDateFormatted].cashIn.push(newEntry);
            }
            break; // Exit the loop since we've reached or passed the end date
          }
          // Now, update currentDate to the next quarter since we're continuing the loop
          currentDate = nextQuarterDate;
        }
      } else if (frequency === "Twice per year" && startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        let currentDate = start;

        while (currentDate <= end) {
          const formattedDate = currentDate.toISOString().split("T")[0];
          if (!updatedState[formattedDate]) {
            updatedState[formattedDate] = {
              cashIn: [],
              cashOut: [],
              netCashFlow: 0,
              cumulativeCashFlow: 0,
            };
          }
          updatedState[formattedDate].cashOut.push(newEntry);

          // Calculate the next semi-annual date without updating currentDate yet
          let nextSemiAnnualDate = new Date(currentDate);
          nextSemiAnnualDate.setMonth(currentDate.getMonth() + 6);

          // Check if the next semi-annual date is after the end date
          if (nextSemiAnnualDate > end) {
            // If adding six months exceeds the end date, check if we need to add the end date itself
            if (formattedDate !== end.toISOString().split("T")[0]) {
              // Only add the end date if it's not the same as the already added date
              const endDateFormatted = end.toISOString().split("T")[0];
              if (!updatedState[endDateFormatted]) {
                updatedState[endDateFormatted] = {
                  cashIn: [],
                  cashOut: [],
                  netCashFlow: 0,
                  cumulativeCashFlow: 0,
                };
              }
              updatedState[endDateFormatted].cashIn.push(newEntry);
            }
            break; // Exit the loop since we've reached or passed the end date
          }
          // Now, update currentDate to the next semi-annual date since we're continuing the loop
          currentDate = nextSemiAnnualDate;
        }
      } else if (frequency === "Twice per month" && startDate && endDate) {
        const startDateObj = new Date(startDate);
        const endDateObj = new Date(endDate);
        const currentDate = new Date(startDateObj);

        const parseDayFromString = (
          dayString: string,
          month: number,
          year: number
        ): number => {
          if (dayString === "Last Day") {
            return new Date(year, month + 1, 0).getDate();
          } else {
            const day = parseInt(dayString, 10);
            return !isNaN(day) ? day : 1; // Default to 1 if parsing fails
          }
        };

        while (currentDate <= endDateObj) {
          [paymentFirstDate, paymentSecondDate].forEach((dayString) => {
            const day = parseDayFromString(
              dayString,
              currentDate.getMonth(),
              currentDate.getFullYear()
            );
            const paymentDate = new Date(
              currentDate.getFullYear(),
              currentDate.getMonth(),
              day
            );

            // Ensure paymentDate is within the start and end date range
            if (paymentDate >= startDateObj && paymentDate <= endDateObj) {
              const formattedDate = paymentDate.toISOString().split("T")[0];
              if (!updatedState[formattedDate]) {
                updatedState[formattedDate] = {
                  cashIn: [],
                  cashOut: [],
                  netCashFlow: 0,
                  cumulativeCashFlow: 0,
                };
              }
              updatedState[formattedDate].cashIn.push({ source, amount });
            }
          });

          // Increment currentDate to the first day of the next month to avoid infinite loop and ensure proper iteration
          currentDate.setMonth(currentDate.getMonth() + 1, 1);
        }
      } else if (
        frequency === "Yearly" &&
        paymentMonth &&
        paymentFirstDate &&
        startDate &&
        endDate
      ) {
        const startDateObj = new Date(startDate);
        const endDateObj = new Date(endDate);

        const parseDayFromString = (
          dayString: string,
          month: number,
          year: number
        ): number => {
          if (dayString === "Last Day") {
            return new Date(year, month + 1, 0).getDate();
          } else {
            const day = parseInt(dayString, 10);
            return !isNaN(day) ? day : 1;
          }
        };

        // Convert month name to its numeric value (0-11)
        const targetMonth = new Date(`${paymentMonth} 1, 2000`).getMonth();

        for (
          let year = startDateObj.getFullYear();
          year <= endDateObj.getFullYear();
          year++
        ) {
          const day = parseDayFromString(paymentFirstDate, targetMonth, year);
          const paymentDate = new Date(year, targetMonth, day);

          if (paymentDate >= startDateObj && paymentDate <= endDateObj) {
            const formattedDate = paymentDate.toISOString().split("T")[0];
            updatedState[formattedDate] = updatedState[formattedDate] || {
              cashIn: [],
              cashOut: [],
              netCashFlow: 0,
              cumulativeCashFlow: 0,
            };
            updatedState[formattedDate].cashOut.push(newEntry);
          }
        }
      }

      // Add any additional frequency handling as needed
      return calculateAndUpdateNetCashFlow(updatedState);
    });
  };

  return (
    <Box padding={10} margin={0}>
      <Grid container spacing={3}>
        <Grid padding={5} md={3}>
          <Item>
            <ForecastTimeFrame
              timeFrameStart={timeFrameStart}
              timeFrameEnd={timeFrameEnd}
              onTimeFrameStartChange={handleTimeFrameStart}
              onTimeFrameEndChange={handleTimeFrameEnd}
            />
            <Button onClick={undo}>Undo</Button>

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
