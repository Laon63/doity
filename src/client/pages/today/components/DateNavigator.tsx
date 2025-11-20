import React from 'react';
import { Box, Typography, IconButton, Button } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

interface DateNavigatorProps {
  selectedDate: Date;
  onPreviousDay: () => void;
  onNextDay: () => void;
}

function DateNavigator({
  selectedDate,
  onPreviousDay,
  onNextDay,
}: DateNavigatorProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  return (
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
          sx={{ mr: 1, color: 'text.secondary', borderColor: 'divider' }}
        >
          Today
        </Button>
        <IconButton
          size="small"
          sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}
        >
          <CalendarMonthIcon fontSize="small" />
        </IconButton>{' '}
      </Box>
    </Box>
  );
}

export default DateNavigator;
