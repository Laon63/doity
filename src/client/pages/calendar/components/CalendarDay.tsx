import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, Tooltip, Stack } from '@mui/material';
import { Task } from 'client/types';
import { useNavigate } from 'react-router-dom';
import { getCategoryColor, getCategoryLightColor } from 'client/utils/colors';
import { formatDate } from 'client/utils/date';

interface CalendarDayProps {
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  tasks: Task[];
  date: Date;
}

const TASK_ITEM_HEIGHT = 16; // Approximate height of a single task item
const TASK_ITEM_MARGIN_BOTTOM = 2.4; // Approximate margin-bottom from Stack spacing={0.3} (0.3 * 8px)
const TYPOGRAPHY_MORE_HEIGHT = 12; // Height of the "+ more" typography

function CalendarDay({
  day,
  isCurrentMonth,
  isToday,
  tasks,
  date,
}: CalendarDayProps) {
  const navigate = useNavigate();
  const [hoveredTaskId, setHoveredTaskId] = useState<string | null>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const [maxTasksToShow, setMaxTasksToShow] = useState(3); // Default to 3
  const [contentHeight, setContentHeight] = useState(0); // State to store observed height

  // Observe the height of the stackRef element
  useEffect(() => {
    const currentRef = stackRef.current;
    if (!currentRef) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        // Changed 'let entry' to 'const entry'
        if (entry.target === currentRef) {
          setContentHeight(entry.contentRect.height);
        }
      }
    });

    resizeObserver.observe(currentRef);

    return () => {
      resizeObserver.unobserve(currentRef);
    };
  }, []); // Empty dependency array to run once on mount

  // Calculate maxTasksToShow when tasks or contentHeight changes
  useEffect(() => {
    if (contentHeight > 0) {
      // Subtract the potential height of the "+ more" text if it were to appear
      const effectiveAvailableHeight = contentHeight - TYPOGRAPHY_MORE_HEIGHT;
      const calculatedMax = Math.floor(
        effectiveAvailableHeight / (TASK_ITEM_HEIGHT + TASK_ITEM_MARGIN_BOTTOM)
      );
      if (calculatedMax !== maxTasksToShow) {
        // Only update if different
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMaxTasksToShow(Math.max(0, calculatedMax)); // Ensure it's not negative
      }
    }
  }, [tasks, contentHeight, maxTasksToShow]);

  const handleTaskClick = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/todo?taskId=${taskId}`, {
      state: { selectedDate: date },
    });
  };

  const displayedTasks = tasks.slice(0, maxTasksToShow);
  const remainingCount =
    tasks.length > maxTasksToShow ? tasks.length - maxTasksToShow : 0;

  const handleDayClick = () => {
    navigate('/todo', {
      state: { selectedDate: date },
    });
  };

  return (
    <Box
      onClick={handleDayClick}
      sx={{
        p: 1,
        bgcolor: isCurrentMonth ? (isToday ? '#e3f2fd' : '#ffffff') : '#f5f5f5',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        '&:hover': {
          bgcolor: isCurrentMonth
            ? isToday
              ? '#bbdefb'
              : '#f5f5f5'
            : '#efefef',
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
            color: isCurrentMonth ? '#000' : '#aaa',
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

      <Stack
        ref={stackRef} // Attach ref here
        spacing={0.3}
        sx={{ flex: 1, minWidth: 0, width: '100%', overflow: 'hidden' }}
      >
        {displayedTasks.map((task) => (
          <Tooltip
            key={task.id}
            title={
              <React.Fragment>
                <Typography color="inherit">{task.title}</Typography>
                {task.due_date && (
                  <Typography variant="caption" color="inherit">
                    Due: {formatDate(task.due_date, 'MMM d, yyyy')}
                  </Typography>
                )}
              </React.Fragment>
            }
            arrow
            placement="right"
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
                bgcolor:
                  hoveredTaskId === task.id
                    ? getCategoryLightColor(task.category)
                    : 'transparent',
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
                  textDecoration: task.is_completed ? 'line-through' : 'none',
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
              flexShrink: 0,
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
