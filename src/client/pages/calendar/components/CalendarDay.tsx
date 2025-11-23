import React from 'react';
import { Box, Typography, Tooltip, Stack } from '@mui/material';
import { Task } from 'client/types';

interface CalendarDayProps {
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  tasks: Task[];
  onDayClick: (date: Date) => void;
}

function CalendarDay({
  day,
  isCurrentMonth,
  isToday,
  tasks,
  onDayClick,
}: CalendarDayProps) {
  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'personal':
        return '#8FE3CD';
      case 'work':
        return '#64748B';
      case 'other':
        return '#F59E0B';
      default:
        return '#CBD5E1';
    }
  };

  const displayedTasks = tasks.slice(0, 3);
  const remainingCount = tasks.length > 3 ? tasks.length - 3 : 0;

  const handleDayClick = () => {
    // This would be used to navigate to the day view or show more details
    // For now, we'll just trigger the callback
  };

  return (
    <Box
      onClick={handleDayClick}
      sx={{
        minHeight: '100px',
        p: 1,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: isCurrentMonth
          ? isToday
            ? '#f0f7ff'
            : 'background.paper'
          : '#fafafa',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        '&:hover': {
          bgcolor: isCurrentMonth
            ? isToday
              ? '#e6f2ff'
              : '#f5f5f5'
            : '#f0f0f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        },
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography
        sx={{
          fontSize: '0.875rem',
          fontWeight: isToday ? 'bold' : '500',
          color: isCurrentMonth ? 'text.primary' : 'text.secondary',
          mb: 0.5,
          lineHeight: 1,
        }}
      >
        {day}
      </Typography>

      <Stack spacing={0.25} sx={{ flex: 1, minWidth: 0 }}>
        {displayedTasks.map((task) => (
          <Tooltip key={task.id} title={task.title} arrow>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                minWidth: 0,
              }}
            >
              <Box
                sx={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: getCategoryColor(task.category),
                  flexShrink: 0,
                }}
              />
              <Typography
                sx={{
                  fontSize: '0.75rem',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  color: task.is_completed ? 'text.secondary' : 'text.primary',
                  textDecoration: task.is_completed
                    ? 'line-through'
                    : 'none',
                }}
              >
                {task.title}
              </Typography>
            </Box>
          </Tooltip>
        ))}
        {remainingCount > 0 && (
          <Typography
            sx={{
              fontSize: '0.7rem',
              color: 'primary.main',
              fontWeight: '600',
            }}
          >
            +{remainingCount} more
          </Typography>
        )}
      </Stack>
    </Box>
  );
}

export default CalendarDay;
