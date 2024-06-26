import React, { useState, useEffect } from "react";

import CashIn from "./components/CashIn";

import FrequentQuestions from "./components/FrequentQuestions";
import MyDivider from "./components/MyDivider";
import ForecastTimeFrame from "./components/ForecastTimeFrame";
import DetailedTable from "./components/DetailedTable";
import OverviewTable from "./components/OverviewTable";
import Entries from "./components/Entries";

import Box from "@mui/system/Box";
import Grid from "@mui/joy/Grid";
import Item from "@mui/joy/Grid";
import TabList from "@mui/joy/TabList";
import Tabs from "@mui/joy/Tabs";
import Tab from "@mui/joy/Tab";
import TabPanel from "@mui/joy/TabPanel";
import Button from "@mui/joy/Button";

import {
  DateStates,
  CashSubmitParam,
  SubmissionEntry,
} from "./types/interfaces";
import {
  eachDayOfInterval,
  parseISO,
  parse,
  format,
  addDays,
  addWeeks,
  addMonths,
  addQuarters,
  addYears,
  getDay,
  formatISO,
} from "date-fns";

import { PDFDownloadLink } from "@react-pdf/renderer";
import PdfDocument from "./components/PdfDocument"; // Import your PDF document component

function App() {
  const [dateStates, setDateStates] = useState<DateStates>({});
  const dateRange = Object.keys(dateStates);
  const [timeFrameStart, setTimeFrameStart] = useState("");
  const [timeFrameEnd, setTimeFrameEnd] = useState("");
  const [submissions, setSubmissions] = useState<SubmissionEntry[]>([]);

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

  useEffect(() => {
    if (timeFrameStart && timeFrameEnd) {
      // Direct parsing to Date objects using date-fns for ISO strings
      const start = parseISO(timeFrameStart);
      const end = parseISO(timeFrameEnd);

      const dates = eachDayOfInterval({ start, end });

      const newDateStates: DateStates = {};
      dates.forEach((date) => {
        const formattedDate = format(date, "MM-dd-yyyy"); // Formatting to string for keys
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
    id,
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
      const newEntry = { id, source, amount };

      setSubmissions((currentSubmissions) => [
        ...currentSubmissions,
        {
          id,
          source,
          amount,
          paymentDate,
          frequency,
          startDate,
          endDate,
          paymentFirstDate,
          paymentSecondDate,
          paymentMonth,
          payOn,
          type: "Cash-In",
        },
      ]);

      if (frequency === "Daily" && startDate && endDate) {
        const start = parse(startDate, "MM-dd-yyyy", new Date());
        const end = parse(endDate, "MM-dd-yyyy", new Date());

        // Generate an array of dates from start to end (inclusive)
        const datesInRange = eachDayOfInterval({ start, end });

        // Process each date in the generated range
        datesInRange.forEach((date) => {
          const formattedDate = format(date, "MM-dd-yyyy"); // Format each date once

          // Initialize state for the date if it doesn't already exist
          updatedState[formattedDate] = updatedState[formattedDate] || {
            cashIn: [],
            cashOut: [],
            netCashFlow: 0,
            cumulativeCashFlow: 0,
          };

          // Add the newEntry to the cashIn array for the formattedDate
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
        const start = parse(startDate, "MM-dd-yyyy", new Date());
        const end = parse(endDate, "MM-dd-yyyy", new Date());

        const dayIndex = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ].indexOf(payOn);

        // Generate all dates in the range and then filter by the specified day of the week
        const datesInRange = eachDayOfInterval({ start, end }).filter(
          (date) => date.getDay() === dayIndex
        );

        datesInRange.forEach((date) => {
          const formattedDate = format(date, "MM-dd-yyyy"); // Formatting to the new required format

          // Initialize or use existing state for the date
          updatedState[formattedDate] = updatedState[formattedDate] || {
            cashIn: [],
            cashOut: [],
            netCashFlow: 0,
            cumulativeCashFlow: 0,
          };

          // Add the newEntry to the cashIn array for the formattedDate
          updatedState[formattedDate].cashIn.push(newEntry);
        });
      } else if (
        frequency === "Every 2 weeks" &&
        payOn &&
        startDate &&
        endDate
      ) {
        const start = parse(startDate, "MM-dd-yyyy", new Date());
        const end = parse(endDate, "MM-dd-yyyy", new Date());
        const days = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];
        const dayIndex = days.indexOf(payOn);
        let datesInRange = eachDayOfInterval({ start, end });

        // Find the first occurrence of `payOn` after the start date
        const firstOccurrenceIndex = datesInRange.findIndex(
          (date) => getDay(date) === dayIndex
        );
        if (firstOccurrenceIndex !== -1) {
          // Calculate the initial occurrence date
          let currentDay = datesInRange[firstOccurrenceIndex];
          let biWeeklyDates = [];

          // Collect all bi-weekly occurrences starting from the first found `payOn`
          while (currentDay <= end) {
            biWeeklyDates.push(currentDay);
            currentDay = addDays(currentDay, 14); // Add 14 days for the bi-weekly interval
          }

          // Process each bi-weekly date
          biWeeklyDates.forEach((date) => {
            const formattedDate = format(date, "MM-dd-yyyy");
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
      } else if (
        frequency === "Every 4 weeks" &&
        payOn &&
        startDate &&
        endDate
      ) {
        const start = parse(startDate, "MM-dd-yyyy", new Date());
        const end = parse(endDate, "MM-dd-yyyy", new Date());
        const days = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];
        const dayIndex = days.indexOf(payOn);

        let datesInRange = eachDayOfInterval({ start, end });
        let datesToProcess = [];

        // Find the first occurrence of `payOn` after the start date and calculate subsequent occurrences every 4 weeks
        for (let i = 0; i < datesInRange.length; i++) {
          if (getDay(datesInRange[i]) === dayIndex) {
            let currentDate = datesInRange[i];
            while (currentDate <= end) {
              datesToProcess.push(currentDate);
              currentDate = addWeeks(currentDate, 4); // Add 4 weeks to the current date
            }
            break; // Break after setting up the initial and subsequent dates
          }
        }

        // Process each bi-weekly date
        datesToProcess.forEach((date) => {
          const formattedDate = format(date, "MM-dd-yyyy"); // Use the correct format

          // Initialize or use existing state for the date
          updatedState[formattedDate] = updatedState[formattedDate] || {
            cashIn: [],
            cashOut: [],
            netCashFlow: 0,
            cumulativeCashFlow: 0,
          };

          // Add the newEntry to the cashIn array for the formattedDate
          updatedState[formattedDate].cashIn.push(newEntry);
        });
      } else if (frequency === "Monthly" && startDate && endDate) {
        const start = parse(startDate, "MM-dd-yyyy", new Date());
        const end = parse(endDate, "MM-dd-yyyy", new Date());
        let currentDate = start;

        while (currentDate <= end) {
          const formattedDate = format(currentDate, "MM-dd-yyyy");
          updatedState[formattedDate] = updatedState[formattedDate] || {
            cashIn: [],
            cashOut: [],
            netCashFlow: 0,
            cumulativeCashFlow: 0,
          };
          updatedState[formattedDate].cashIn.push(newEntry);

          // Move to the same day next month
          currentDate = addMonths(currentDate, 1);
        }
      } else if (frequency === "Every 2 months" && startDate && endDate) {
        const start = parse(startDate, "MM-dd-yyyy", new Date());
        const end = parse(endDate, "MM-dd-yyyy", new Date());
        let currentDate = start;

        while (currentDate <= end) {
          const formattedDate = format(currentDate, "MM-dd-yyyy");
          updatedState[formattedDate] = updatedState[formattedDate] || {
            cashIn: [],
            cashOut: [],
            netCashFlow: 0,
            cumulativeCashFlow: 0,
          };
          updatedState[formattedDate].cashIn.push(newEntry);
          // Move to the same day next month
          currentDate = addMonths(currentDate, 2); // Move to two months later
        }
      } else if (frequency === "Quarterly" && startDate && endDate) {
        const start = parse(startDate, "MM-dd-yyyy", new Date());
        const end = parse(endDate, "MM-dd-yyyy", new Date());
        let currentDate = start;

        while (currentDate <= end) {
          const formattedDate = format(currentDate, "MM-dd-yyyy");
          updatedState[formattedDate] = updatedState[formattedDate] || {
            cashIn: [],
            cashOut: [],
            netCashFlow: 0,
            cumulativeCashFlow: 0,
          };
          updatedState[formattedDate].cashIn.push(newEntry);
          currentDate = addMonths(currentDate, 3); // Move to the next quarter
        }
      } else if (frequency === "Twice per year" && startDate && endDate) {
        const start = parse(startDate, "MM-dd-yyyy", new Date());
        const end = parse(endDate, "MM-dd-yyyy", new Date());
        let currentDate = start;

        while (currentDate <= end) {
          const formattedDate = format(currentDate, "MM-dd-yyyy");
          updatedState[formattedDate] = updatedState[formattedDate] || {
            cashIn: [],
            cashOut: [],
            netCashFlow: 0,
            cumulativeCashFlow: 0,
          };
          updatedState[formattedDate].cashIn.push(newEntry);
          // Now, update currentDate to the next semi-annual date since we're continuing the loop
          currentDate = addMonths(currentDate, 6); // Move to the next half-year point
        }
      } else if (frequency === "Twice per month" && startDate && endDate) {
        const startDateObj = parse(startDate, "MM-dd-yyyy", new Date());
        const endDateObj = parse(endDate, "MM-dd-yyyy", new Date());
        let currentDate = new Date(startDateObj.getTime()); // Clone the start date

        const parseDayFromString = (
          dayString: string,
          month: number,
          year: number
        ): number => {
          if (dayString === "Last Day") {
            return new Date(year, month + 1, 0).getDate();
          } else {
            const day = parseInt(dayString, 10);
            return isNaN(day) ? 1 : day; // Default to 1 if parsing fails
          }
        };

        while (currentDate <= endDateObj) {
          const month = currentDate.getMonth();
          const year = currentDate.getFullYear();

          [paymentFirstDate, paymentSecondDate].forEach((dayString) => {
            const day = parseDayFromString(dayString, month, year);
            const paymentDate = new Date(year, month, day);

            if (paymentDate >= startDateObj && paymentDate <= endDateObj) {
              const formattedDate = format(paymentDate, "MM-dd-yyyy");

              if (!updatedState[formattedDate]) {
                updatedState[formattedDate] = {
                  cashIn: [],
                  cashOut: [],
                  netCashFlow: 0,
                  cumulativeCashFlow: 0,
                };
              }
              updatedState[formattedDate].cashIn.push({ id, source, amount });
            }
          });

          // Increment currentDate to the first day of the next month to avoid infinite loop and ensure proper iteration
          currentDate = new Date(year, month + 1, 1);
        }
      } else if (
        frequency === "Yearly" &&
        paymentMonth &&
        paymentFirstDate &&
        startDate &&
        endDate
      ) {
        const startDateObj = parse(startDate, "MM-dd-yyyy", new Date());
        const endDateObj = parse(endDate, "MM-dd-yyyy", new Date());

        const parseDayFromString = (
          dayString: string,
          month: number,
          year: number
        ): number => {
          if (dayString === "Last Day") {
            return new Date(year, month + 1, 0).getDate(); // Get the last day of the month
          } else {
            const day = parseInt(dayString, 10);
            return isNaN(day) ? 1 : day; // Default to 1 if parsing fails
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
            const formattedDate = format(paymentDate, "MM-dd-yyyy"); // Formatting date to "MM-dd-yyyy"
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
    id,
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
      const newEntry = { id, source, amount };

      setSubmissions((currentSubmissions) => [
        ...currentSubmissions,
        {
          id,
          source,
          amount,
          paymentDate,
          frequency,
          startDate,
          endDate,
          paymentFirstDate,
          paymentSecondDate,
          paymentMonth,
          payOn,
          type: "Cash-Out",
        },
      ]);

      if (frequency === "Daily" && startDate && endDate) {
        const start = parse(startDate, "MM-dd-yyyy", new Date());
        const end = parse(endDate, "MM-dd-yyyy", new Date());

        // Generate an array of dates from start to end (inclusive)
        const datesInRange = eachDayOfInterval({ start, end });

        // Process each date in the generated range
        datesInRange.forEach((date) => {
          const formattedDate = format(date, "MM-dd-yyyy"); // Format each date once

          // Initialize state for the date if it doesn't already exist
          updatedState[formattedDate] = updatedState[formattedDate] || {
            cashIn: [],
            cashOut: [],
            netCashFlow: 0,
            cumulativeCashFlow: 0,
          };

          // Add the newEntry to the cashIn array for the formattedDate
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
        updatedState[paymentDate].cashOut.push(newEntry);
      } else if (frequency === "Weekly" && payOn && startDate && endDate) {
        const start = parse(startDate, "MM-dd-yyyy", new Date());
        const end = parse(endDate, "MM-dd-yyyy", new Date());

        const dayIndex = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ].indexOf(payOn);

        // Generate all dates in the range and then filter by the specified day of the week
        const datesInRange = eachDayOfInterval({ start, end }).filter(
          (date) => date.getDay() === dayIndex
        );

        datesInRange.forEach((date) => {
          const formattedDate = format(date, "MM-dd-yyyy"); // Formatting to the new required format

          // Initialize or use existing state for the date
          updatedState[formattedDate] = updatedState[formattedDate] || {
            cashIn: [],
            cashOut: [],
            netCashFlow: 0,
            cumulativeCashFlow: 0,
          };

          // Add the newEntry to the cashIn array for the formattedDate
          updatedState[formattedDate].cashOut.push(newEntry);
        });
      } else if (
        frequency === "Every 2 weeks" &&
        payOn &&
        startDate &&
        endDate
      ) {
        const start = parse(startDate, "MM-dd-yyyy", new Date());
        const end = parse(endDate, "MM-dd-yyyy", new Date());
        const days = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];
        const dayIndex = days.indexOf(payOn);
        let datesInRange = eachDayOfInterval({ start, end });

        // Find the first occurrence of `payOn` after the start date
        const firstOccurrenceIndex = datesInRange.findIndex(
          (date) => getDay(date) === dayIndex
        );
        if (firstOccurrenceIndex !== -1) {
          // Calculate the initial occurrence date
          let currentDay = datesInRange[firstOccurrenceIndex];
          let biWeeklyDates = [];

          // Collect all bi-weekly occurrences starting from the first found `payOn`
          while (currentDay <= end) {
            biWeeklyDates.push(currentDay);
            currentDay = addDays(currentDay, 14); // Add 14 days for the bi-weekly interval
          }

          // Process each bi-weekly date
          biWeeklyDates.forEach((date) => {
            const formattedDate = format(date, "MM-dd-yyyy");
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
        }
      } else if (
        frequency === "Every 4 weeks" &&
        payOn &&
        startDate &&
        endDate
      ) {
        const start = parse(startDate, "MM-dd-yyyy", new Date());
        const end = parse(endDate, "MM-dd-yyyy", new Date());
        const days = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];
        const dayIndex = days.indexOf(payOn);

        let datesInRange = eachDayOfInterval({ start, end });
        let datesToProcess = [];

        // Find the first occurrence of `payOn` after the start date and calculate subsequent occurrences every 4 weeks
        for (let i = 0; i < datesInRange.length; i++) {
          if (getDay(datesInRange[i]) === dayIndex) {
            let currentDate = datesInRange[i];
            while (currentDate <= end) {
              datesToProcess.push(currentDate);
              currentDate = addWeeks(currentDate, 4); // Add 4 weeks to the current date
            }
            break; // Break after setting up the initial and subsequent dates
          }
        }

        // Process each bi-weekly date
        datesToProcess.forEach((date) => {
          const formattedDate = format(date, "MM-dd-yyyy"); // Use the correct format

          // Initialize or use existing state for the date
          updatedState[formattedDate] = updatedState[formattedDate] || {
            cashIn: [],
            cashOut: [],
            netCashFlow: 0,
            cumulativeCashFlow: 0,
          };

          // Add the newEntry to the cashIn array for the formattedDate
          updatedState[formattedDate].cashOut.push(newEntry);
        });
      } else if (frequency === "Monthly" && startDate && endDate) {
        const start = parse(startDate, "MM-dd-yyyy", new Date());
        const end = parse(endDate, "MM-dd-yyyy", new Date());
        let currentDate = start;

        while (currentDate <= end) {
          const formattedDate = format(currentDate, "MM-dd-yyyy");
          updatedState[formattedDate] = updatedState[formattedDate] || {
            cashIn: [],
            cashOut: [],
            netCashFlow: 0,
            cumulativeCashFlow: 0,
          };
          updatedState[formattedDate].cashOut.push(newEntry);

          // Move to the same day next month
          currentDate = addMonths(currentDate, 1);
        }
      } else if (frequency === "Every 2 months" && startDate && endDate) {
        const start = parse(startDate, "MM-dd-yyyy", new Date());
        const end = parse(endDate, "MM-dd-yyyy", new Date());
        let currentDate = start;

        while (currentDate <= end) {
          const formattedDate = format(currentDate, "MM-dd-yyyy");
          updatedState[formattedDate] = updatedState[formattedDate] || {
            cashIn: [],
            cashOut: [],
            netCashFlow: 0,
            cumulativeCashFlow: 0,
          };
          updatedState[formattedDate].cashOut.push(newEntry);
          // Move to the same day next month
          currentDate = addMonths(currentDate, 2); // Move to two months later
        }
      } else if (frequency === "Quarterly" && startDate && endDate) {
        const start = parse(startDate, "MM-dd-yyyy", new Date());
        const end = parse(endDate, "MM-dd-yyyy", new Date());
        let currentDate = start;

        while (currentDate <= end) {
          const formattedDate = format(currentDate, "MM-dd-yyyy");
          updatedState[formattedDate] = updatedState[formattedDate] || {
            cashIn: [],
            cashOut: [],
            netCashFlow: 0,
            cumulativeCashFlow: 0,
          };
          updatedState[formattedDate].cashOut.push(newEntry);
          currentDate = addMonths(currentDate, 3); // Move to the next quarter
        }
      } else if (frequency === "Twice per year" && startDate && endDate) {
        const start = parse(startDate, "MM-dd-yyyy", new Date());
        const end = parse(endDate, "MM-dd-yyyy", new Date());
        let currentDate = start;

        while (currentDate <= end) {
          const formattedDate = format(currentDate, "MM-dd-yyyy");
          updatedState[formattedDate] = updatedState[formattedDate] || {
            cashIn: [],
            cashOut: [],
            netCashFlow: 0,
            cumulativeCashFlow: 0,
          };
          updatedState[formattedDate].cashOut.push(newEntry);
          // Now, update currentDate to the next semi-annual date since we're continuing the loop
          currentDate = addMonths(currentDate, 6); // Move to the next half-year point
        }
      } else if (frequency === "Twice per month" && startDate && endDate) {
        const startDateObj = parse(startDate, "MM-dd-yyyy", new Date());
        const endDateObj = parse(endDate, "MM-dd-yyyy", new Date());
        let currentDate = new Date(startDateObj.getTime()); // Clone the start date

        const parseDayFromString = (
          dayString: string,
          month: number,
          year: number
        ): number => {
          if (dayString === "Last Day") {
            return new Date(year, month + 1, 0).getDate();
          } else {
            const day = parseInt(dayString, 10);
            return isNaN(day) ? 1 : day; // Default to 1 if parsing fails
          }
        };

        while (currentDate <= endDateObj) {
          const month = currentDate.getMonth();
          const year = currentDate.getFullYear();

          [paymentFirstDate, paymentSecondDate].forEach((dayString) => {
            const day = parseDayFromString(dayString, month, year);
            const paymentDate = new Date(year, month, day);

            if (paymentDate >= startDateObj && paymentDate <= endDateObj) {
              const formattedDate = format(paymentDate, "MM-dd-yyyy");

              if (!updatedState[formattedDate]) {
                updatedState[formattedDate] = {
                  cashIn: [],
                  cashOut: [],
                  netCashFlow: 0,
                  cumulativeCashFlow: 0,
                };
              }
              updatedState[formattedDate].cashOut.push({ id, source, amount });
            }
          });

          // Increment currentDate to the first day of the next month to avoid infinite loop and ensure proper iteration
          currentDate = new Date(year, month + 1, 1);
        }
      } else if (
        frequency === "Yearly" &&
        paymentMonth &&
        paymentFirstDate &&
        startDate &&
        endDate
      ) {
        const startDateObj = parse(startDate, "MM-dd-yyyy", new Date());
        const endDateObj = parse(endDate, "MM-dd-yyyy", new Date());

        const parseDayFromString = (
          dayString: string,
          month: number,
          year: number
        ): number => {
          if (dayString === "Last Day") {
            return new Date(year, month + 1, 0).getDate(); // Get the last day of the month
          } else {
            const day = parseInt(dayString, 10);
            return isNaN(day) ? 1 : day; // Default to 1 if parsing fails
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
            const formattedDate = format(paymentDate, "MM-dd-yyyy"); // Formatting date to "MM-dd-yyyy"
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


  const handleUndoSubmission = (submissionId: string) => {
    // Find the submission to undo
    const submission = submissions.find((sub) => sub.id === submissionId);
    if (!submission) {
      console.error("Submission not found");
      return;
    }

    setDateStates((prevState) => {
      const newState = { ...prevState };
      let datesToClear = [];

      // Directly handle the one-time event
      if (submission.frequency === "One-time") {
        datesToClear.push(
          format(
            parse(submission.paymentDate, "MM-dd-yyyy", new Date()),
            "MM-dd-yyyy"
          )
        );
      } else {
        let currentDate = parse(submission.startDate, "MM-dd-yyyy", new Date());
        const endDate = parse(submission.endDate, "MM-dd-yyyy", new Date());

        while (currentDate <= endDate) {
          datesToClear.push(format(currentDate, "MM-dd-yyyy"));

          switch (submission.frequency) {
            case "Daily":
              currentDate = addDays(currentDate, 1);
              break;
            case "Weekly":
              currentDate = addWeeks(currentDate, 1);
              break;
            case "Every 2 weeks":
              currentDate = addWeeks(currentDate, 2);
              break;
            case "Every 4 weeks":
              currentDate = addWeeks(currentDate, 4);
              break;
            case "Monthly":
              currentDate = addMonths(currentDate, 1);
              break;
            case "Every 2 months":
              currentDate = addMonths(currentDate, 2);
              break;
            case "Quarterly":
              currentDate = addQuarters(currentDate, 1);
              break;
            case "Twice per year":
              currentDate = addMonths(currentDate, 6);
              break;
            case "Yearly":
              currentDate = addYears(currentDate, 1);
              break;
            default:
              currentDate = addDays(currentDate, 1); // Default case to avoid infinite loops
              break;
          }
        }
      }

      // Remove the submission from each of the affected dates
      for (const date of datesToClear) {
        if (newState[date]) {
          newState[date].cashIn = newState[date].cashIn.filter(
            (entry) => entry.id !== submissionId
          );
          newState[date].cashOut = newState[date].cashOut.filter(
            (entry) => entry.id !== submissionId
          );
        }
      }

      // Recalculate net and cumulative cash flows after removing entries
      return calculateAndUpdateNetCashFlow(newState);
    });

    // Also remove the submission from the submissions list
    setSubmissions((currentSubmissions) =>
      currentSubmissions.filter((sub) => sub.id !== submissionId)
    );
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
                  <Tab>Entries</Tab>
                  <Tab>Overview</Tab>
                  <Tab>Detailed</Tab>
                </TabList>
                <TabPanel value={0}>
                  <Entries
                    submissions={submissions}
                    handleUndoSubmission={handleUndoSubmission}
                  />
                </TabPanel>
                <TabPanel value={1}>
                  <OverviewTable dateStates={dateStates} />
                </TabPanel>
                <TabPanel value={2}>
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
                <Button
                  color="primary"
                  disabled={false}
                  loading={false}
                  size="sm"
                  variant="solid"
                >
                  <PDFDownloadLink
                    document={<PdfDocument dateStates={dateStates} />}
                    fileName="detailed-report.pdf"
                    style={{ color: "white" }}
                  >
                    {({ blob, url, loading, error }) =>
                      loading ? "Loading document..." : "Download PDF"
                    }
                  </PDFDownloadLink>
                </Button>
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
