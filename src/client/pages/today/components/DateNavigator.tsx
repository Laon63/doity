import React from 'react';
import { Box, Typography, IconButton, Button } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useTranslation } from 'react-i18next'; // Import useTranslation

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
  const { t, i18n } = useTranslation('common'); // Initialize useTranslation and get i18n instance
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleCalendarOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setIsCalendarOpen(true);
  };

  const handleCalendarClose = () => {
    setIsCalendarOpen(false);
    // setAnchorEl(null);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(i18n.language, { // Use i18n.language for locale
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
            {t('today')}
          </Button>
          <IconButton
            size="small"
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
            }}
            onClick={handleCalendarOpen}
          >
            <CalendarMonthIcon fontSize="small" />
          </IconButton>
          <DatePicker
            open={isCalendarOpen}
            onClose={handleCalendarClose}
            value={selectedDate}
            onChange={onDateChange}
            slotProps={{
              popper: {
                anchorEl,
              },
              textField: {
                style: { display: 'none' },
              },
            }}
          />
        </Box>
      </Box>
    </LocalizationProvider>
  );
}

export default DateNavigator;
