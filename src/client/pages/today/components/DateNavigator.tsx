import React from 'react';
import { Box, Typography, IconButton, Button } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

interface DateNavigatorProps {
  selectedDate: Date;
  onPreviousDay: () => void;
  onNextDay: () => void;
  onTodayClick: () => void;
  isCalendarOpen: boolean;
  setIsCalendarOpen: (open: boolean) => void;
  onDateChange: (date: Date | null) => void;
}

function DateNavigator({
  selectedDate,
  onPreviousDay,
  onNextDay,
  onTodayClick,
  isCalendarOpen,
  setIsCalendarOpen,
  onDateChange,
}: DateNavigatorProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <IconButton onClick={onPreviousDay} size="small">
            <ArrowBackIosNewIcon fontSize="small" />
          </IconButton>
          <Typography variant="h6" component="h1" sx={{ fontWeight: 'bold' }}>
            {formatDate(selectedDate)}
          </Typography>
          <IconButton onClick={onNextDay} size="small">
            <ArrowForwardIosIcon fontSize="small" />
          </IconButton>
        </Box>
        <Box>
          <Button
            variant="outlined"
            size="small"
            onClick={onTodayClick}
            sx={{ mr: 1, color: 'text.secondary', borderColor: 'divider' }}
          >
            Today
          </Button>
          <IconButton
            size="small"
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
            }}
            onClick={() => setIsCalendarOpen(true)}
          >
            <CalendarMonthIcon fontSize="small" />
          </IconButton>
          <DatePicker
            open={isCalendarOpen}
            onClose={() => setIsCalendarOpen(false)}
            value={selectedDate}
            onChange={onDateChange}
            slotProps={{
              textField: {
                style: { display: 'none' }, // Hide the text field
              },
            }}
          />
        </Box>
      </Box>
    </LocalizationProvider>
  );
}

export default DateNavigator;
