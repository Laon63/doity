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
        minHeight: '120px',
        p: 1.25,
        bgcolor: isCurrentMonth
          ? isToday
            ? '#f0f7ff'
            : 'background.paper'
          : '#fafbfc',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        '&:hover': {
          bgcolor: isCurrentMonth
            ? isToday
              ? '#e6f2ff'
              : '#f8f9fa'
            : '#f2f3f5',
        },
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          mb: 0.75,
        }}
      >
        <Typography
          sx={{
            fontSize: '0.875rem',
            fontWeight: isToday ? '700' : '600',
            color: isCurrentMonth ? 'text.primary' : 'text.secondary',
            lineHeight: '20px',
            minWidth: '20px',
            textAlign: 'center',
            ...(isToday && {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              bgcolor: 'primary.main',
              color: '#fff',
            }),
          }}
        >
          {day}
        </Typography>
      </Box>

      <Stack spacing={0.4} sx={{ flex: 1, minWidth: 0 }}>
        {displayedTasks.map((task) => (
          <Tooltip key={task.id} title={task.title} arrow>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.6,
                minWidth: 0,
                minHeight: '16px',
              }}
            >
              <Box
                sx={{
                  width: '5px',
                  height: '5px',
                  borderRadius: '50%',
                  backgroundColor: getCategoryColor(task.category),
                  flexShrink: 0,
                  marginTop: '1px',
                }}
              />
              <Typography
                sx={{
                  fontSize: '0.7rem',
                  lineHeight: '14px',
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
              fontSize: '0.65rem',
              color: 'primary.main',
              fontWeight: '600',
              lineHeight: '12px',
              mt: 0.25,
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
