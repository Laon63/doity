import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { Task } from '../../../types';

interface SummaryBarProps {
  tasks: Task[];
}

function SummaryBar({ tasks }: SummaryBarProps) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.is_completed).length;
  const pending = total - completed;

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Box>
        <Typography variant="h4" component="h1">
          Today
        </Typography>
        <Typography color="text.secondary">2025년 11월 18일</Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Paper variant="outlined" sx={{ p: '4px 12px', textAlign: 'center' }}>
          <Typography variant="subtitle2">Total</Typography>
          <Typography variant="h6">{total}</Typography>
        </Paper>
        <Paper variant="outlined" sx={{ p: '4px 12px', textAlign: 'center' }}>
          <Typography variant="subtitle2">Completed</Typography>
          <Typography variant="h6">{completed}</Typography>
        </Paper>
        <Paper variant="outlined" sx={{ p: '4px 12px', textAlign: 'center' }}>
          <Typography variant="subtitle2">Pending</Typography>
          <Typography variant="h6">{pending}</Typography>
        </Paper>
      </Box>
    </Box>
  );
}

export default SummaryBar;
