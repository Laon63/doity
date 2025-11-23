import React, { useState } from 'react';
import { Box, Typography, Tooltip, Stack } from '@mui/material';
import { Task } from 'client/types';
import { useNavigate } from 'react-router-dom';

interface CalendarDayProps {
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  tasks: Task[];
  date: Date;
  onDayClick: (date: Date) => void;
}

function CalendarDay({
  day,
  isCurrentMonth,
  isToday,
  tasks,
  date,
  onDayClick,
}: CalendarDayProps) {
  const navigate = useNavigate();
  const [hoveredTaskId, setHoveredTaskId] = useState<string | null>(null);

  const handleTaskClick = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/today?taskId=${taskId}`, {
      state: { selectedDate: date },
    });
  };

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

  const getCategoryLightColor = (category?: string) => {
    switch (category) {
      case 'personal':
        return '#E0F9F5';
      case 'work':
        return '#F1F5F9';
      case 'other':
        return '#FFFBEB';
      default:
        return '#F1F5F9';
    }
  };

  const displayedTasks = tasks.slice(0, 3);
  const remainingCount = tasks.length > 3 ? tasks.length - 3 : 0;

  const handleDayClick = () => {
    if (isCurrentMonth) {
      navigate('/today', {
        state: { selectedDate: date },
      });
    }
  };

  return (
    <Box
      onClick={handleDayClick}
      sx={{
        p: 1,
        bgcolor: isCurrentMonth
          ? isToday
            ? '#e3f2fd'
            : '#ffffff'
          : '#f5f5f5',
        cursor: isCurrentMonth ? 'pointer' : 'default',
        transition: 'all 0.15s ease',
        '&:hover': {
          bgcolor: isCurrentMonth
            ? isToday
              ? '#bbdefb'
              : '#f5f5f5'
            : '#f5f5f5',
        },
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          mb: 0.5,
          height: '24px',
          flexShrink: 0,
        }}
      >
        <Typography
          sx={{
            fontSize: '0.875rem',
            fontWeight: isToday ? '700' : '600',
            color: isCurrentMonth ? '#000' : '#999',
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
              bgcolor: '#1976d2',
              color: '#fff',
              mb: 0,
            }),
          }}
        >
          {day}
        </Typography>
      </Box>

      <Stack spacing={0.3} sx={{ flex: 1, minWidth: 0, width: '100%', overflow: 'hidden' }}>
        {displayedTasks.map((task) => (
          <Tooltip
            key={task.id}
            title={task.title}
            arrow
            slotProps={{
              tooltip: {
                sx: {
                  bgcolor: 'rgba(0, 0, 0, 0.87)',
                  color: 'rgba(255, 255, 255, 0.87)',
                  fontSize: '0.75rem',
                },
              },
              popper: {
                modifiers: [
                  {
                    name: 'offset',
                    options: {
                      offset: [0, -8],
                    },
                  },
                ],
              },
            }}
          >
            <Box
              onClick={(e) => handleTaskClick(task.id, e)}
              onMouseEnter={() => setHoveredTaskId(task.id)}
              onMouseLeave={() => setHoveredTaskId(null)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.6,
                minWidth: 0,
                height: '16px',
                px: 0.5,
                py: 0.25,
                borderRadius: '4px',
                bgcolor: hoveredTaskId === task.id ? getCategoryLightColor(task.category) : 'transparent',
                transition: 'all 0.15s ease',
                cursor: 'pointer',
                flexShrink: 0,
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
                  color: task.is_completed ? '#999' : '#000',
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
              color: '#1976d2',
              fontWeight: '600',
              lineHeight: '12px',
              height: '12px',
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
