import { createTheme, ThemeProvider } from "@mui/material/styles";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";

// Create a custom MuiThemeProvider with desired styles
const theme = createTheme({
  palette: {
    primary: {
      light: "#757ce8",
      main: "#3f50b5",
      dark: "#002884",
      contrastText: "#fff",
    },
  },
});

// Usage of DatePicker with custom styles
const StyledDatePicker = () => {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());

  return (
    <ThemeProvider theme={theme}>
      <DatePicker
        label="Controlled picker"
        value={selectedDate}
        defaultValue={dayjs()}
        onChange={(newValue) => setSelectedDate(newValue)}
      />
    </ThemeProvider>
  );
};

export default StyledDatePicker;
