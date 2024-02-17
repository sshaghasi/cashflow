import * as React from "react";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import Radio from "@mui/joy/Radio";
import RadioGroup from "@mui/joy/RadioGroup";
import Typography from "@mui/joy/Typography";

import { ForecastTimeFrameProps } from "../types/interfaces";

// Accept the onTimeFrameChange prop
export default function ForecastTimeFrame({ onTimeFrameChange, }: ForecastTimeFrameProps) { 
  return (
    <RadioGroup
      aria-label="Your plan"
      name="people"
      defaultValue="12 months"
      onChange={onTimeFrameChange} // Use the callback here
    >
      <Typography level="h1" sx={{ paddingBottom: 2 }}>
        Time Frame
      </Typography>
      <List
        sx={{
          maxWidth: 250,
          "--List-gap": "0rem",
          "--ListItem-paddingY": "1rem",
          "--ListItem-radius": "8px",
          "--ListItemDecorator-size": "32px",
          flexDirection: "row",
          gap: 2,
        }}
      >
        {["3 months", "6 months", "12 months"].map((item) => (
          <ListItem variant="outlined" key={item} sx={{ boxShadow: "sm" }}>
            <Radio
              overlay
              value={item}
              label={item}
              sx={{ flexGrow: 1, flexDirection: "row-reverse" }}
              slotProps={{
                action: ({ checked }) => ({
                  sx: (theme) => ({
                    ...(checked && {
                      inset: -1,
                      border: "2px solid",
                      borderColor: theme.vars.palette.primary[500],
                    }),
                  }),
                }),
              }}
            />
          </ListItem>
        ))}
      </List>
    </RadioGroup>
  );
}