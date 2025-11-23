import React, { useMemo, useState } from 'react';
import { Box, Typography, IconButton, Button, Paper } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'; // Corrected import
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'; // Import CalendarMonthIcon
import { Task } from 'client/types';
import CalendarDay from './CalendarDay';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

interface MonthlyCalendarProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  tasks: Task[];
}

function MonthlyCalendar({
  currentDate,
  onDateChange,
  tasks,
}: MonthlyCalendarProps) {
  const today = new Date();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const { days } = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const firstDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const days = [];
    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      days.push({
        day: prevMonthLastDay - i,
        isCurrentMonth: false,
        date: new Date(year, month - 1, prevMonthLastDay - i),
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
        date: new Date(year, month, i),
      });
    }

    // Next month days
    const remainingDays = 42 - days.length; // 6 rows * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        date: new Date(year, month + 1, i),
      });
    }

    return { days };
  }, [currentDate]);

  const getTasksForDate = (date: Date): Task[] => {
    const dateString = date.toDateString();
    return tasks.filter((task) => {
      const taskDate = new Date(task.created_at).toDateString();
      return taskDate === dateString;
    });
  };

  const handlePreviousMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    onDateChange(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    onDateChange(newDate);
  };

  const handleTodayClick = () => {
    const newDate = new Date(today);
    onDateChange(newDate);
  };

  const handleCalendarOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setIsCalendarOpen(true);
  };

  const handleCalendarClose = () => {
    setIsCalendarOpen(false);
  };

  const handleDateSelect = (date: Date | null) => {
    if (date) {
      onDateChange(date);
      setIsCalendarOpen(false);
    }
  };

  const monthName = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  }).format(currentDate);

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box
        sx={{
          p: 2.5,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: '#fafafa',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2.5,
          }}
        >
          <Typography
            variant="h5"
            component="h1"
            sx={{ fontWeight: '700', letterSpacing: '-0.5px', color: '#000' }}
          >
            {monthName}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <IconButton
              onClick={handlePreviousMonth}
              size="small"
              sx={{
                color: '#666',
                '&:hover': {
                  bgcolor: '#e0e0e0',
                },
              }}
            >
              <ArrowBackIosNewIcon fontSize="small" />
            </IconButton>
            <Button
              variant="outlined"
              size="small"
              onClick={handleTodayClick}
              sx={{
                textTransform: 'none',
                fontWeight: '500',
                color: '#666',
                borderColor: '#ccc',
                '&:hover': {
                  bgcolor: '#e0e0e0',
                  borderColor: '#ccc',
                },
              }}
            >
              Today
            </Button>
            <IconButton
              onClick={handleCalendarOpen}
              size="small"
              sx={{
                color: '#666',
                border: '1px solid #ccc',
                borderRadius: '4px',
                '&:hover': {
                  bgcolor: '#e0e0e0',
                },
              }}
            >
              <CalendarMonthIcon fontSize="small" />
            </IconButton>
            <DatePicker
              open={isCalendarOpen}
              onClose={handleCalendarClose}
              value={currentDate}
              onChange={handleDateSelect}
              views={['month', 'year']}
              slotProps={{
                popper: {
                  anchorEl,
                },
                textField: {
                  style: { display: 'none' },
                },
              }}
            />
            <IconButton
              onClick={handleNextMonth}
              size="small"
              sx={{
                color: '#666',
                '&:hover': {
                  bgcolor: '#e0e0e0',
                },
              }}
            >
              <ArrowForwardIosIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        <Paper
          sx={{
            bgcolor: '#ffffff',
            overflow: 'hidden',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
            border: '1px solid #e0e0e0',
          }}
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              borderBottom: '1px solid #d0d0d0',
            }}
          >
            {dayLabels.map((label, idx) => (
              <Box
                key={label}
                sx={{
                  p: 1.5,
                  textAlign: 'center',
                  bgcolor: '#2c3e50',
                  borderRight: idx === 6 ? 'none' : '0.5px solid #bbb',
                }}
              >
                <Typography
                  sx={{
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    color: '#ffffff',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  {label}
                </Typography>
              </Box>
            ))}
          </Box>

          <Box
            sx={{
              flex: 1,
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gridAutoRows: '1fr',
              minHeight: 0,
            }}
          >
            {days.map((dayObj, index) => {
              const tasksList = getTasksForDate(dayObj.date);
              const isToday =
                dayObj.date.toDateString() === today.toDateString();
              const rowIndex = Math.floor(index / 7);
              const isLastRow = rowIndex === 5;
              const isLastCol = (index + 1) % 7 === 0;

              return (
                <Box
                  key={index}
                  sx={{
                    borderRight: isLastCol ? 'none' : '0.5px solid #ddd',
                    borderBottom: isLastRow ? 'none' : '0.5px solid #ddd',
                    display: 'flex',
                    minHeight: 0,
                  }}
                >
                  <CalendarDay
                    day={dayObj.day}
                    isCurrentMonth={dayObj.isCurrentMonth}
                    isToday={isToday}
                    tasks={tasksList}
                    date={dayObj.date}
                  />
                </Box>
              );
            })}
          </Box>
        </Paper>
      </Box>
    </LocalizationProvider>
  );
}

export default MonthlyCalendar;
