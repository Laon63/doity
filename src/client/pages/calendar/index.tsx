import React, { useState } from 'react';
import { Box } from '@mui/material';
import MonthlyCalendar from './components/MonthlyCalendar';
import { useCalendarTasksQuery } from 'client/hooks/queries/useCalendarTasksQuery';
import LoadingSpinner from 'client/components/LoadingSpinner';

function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { data: tasks = [], isLoading } = useCalendarTasksQuery(currentDate);

  return (
    <Box sx={{ height: '100%', overflow: 'auto' }}>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <MonthlyCalendar
          currentDate={currentDate}
          onDateChange={setCurrentDate}
          tasks={tasks}
        />
      )}
    </Box>
  );
}

export default CalendarPage;
