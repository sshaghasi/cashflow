import * as React from "react";
import Input from '@mui/joy/Input';
import Stack from '@mui/joy/Stack';
import Typography from "@mui/joy/Typography";

import { ForecastTimeFrameProps } from "../types/interfaces";

const ForecastTimeFrame: React.FC<ForecastTimeFrameProps> = ({
  timeFrameStart,
  timeFrameEnd,
  onTimeFrameStartChange,
  onTimeFrameEndChange,
}: ForecastTimeFrameProps) => {
  return (
    <Stack spacing={1.5} sx={{ minWidth: 300 }}>
      <Typography level="h1" sx={{ paddingBottom: 2 }}>
        Time Frame
      </Typography>
      <Input
        type="date"
        value={timeFrameStart}
        onChange={onTimeFrameStartChange}
      />
      <Input
        type="date"
        value={timeFrameEnd}
        onChange={onTimeFrameEndChange}
      />
    </Stack>
  );
}

export default ForecastTimeFrame;
