import React from 'react';
import { Box, Chip, Stack } from '@mui/material';

interface TabFilterProps {
  selectedTab: string;
  setTab: (tab: string) => void;
}

const tabs = [
  {
    name: 'All',
    label: 'All',
    bgcolor: '#c0ccd5',
    textColor: '#000000de',
  },
  {
    name: 'Pinned',
    label: 'Pinned',
    bgcolor: '#FFD700',
    textColor: '#5f6d7b',
  },
];

function TabFilter({ selectedTab, setTab }: TabFilterProps) {
  const handleTabClick = (tabName: string) => {
    setTab(tabName);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stack direction="row" spacing={1} sx={{ py: 1 }}>
        {tabs.map((tabItem) => (
          <Chip
            key={tabItem.name}
            label={tabItem.label}
            onClick={() => handleTabClick(tabItem.name)}
            sx={{
              cursor: 'pointer',
              textTransform: 'none',
              fontWeight: 600,
              px: 1,
              bgcolor:
                selectedTab === tabItem.name ? tabItem.bgcolor : 'default',
              color:
                selectedTab === tabItem.name
                  ? tabItem.textColor
                  : 'text.primary',
              borderColor:
                selectedTab === tabItem.name ? tabItem.bgcolor : 'divider',
              '&:hover': {
                bgcolor:
                  selectedTab === tabItem.name
                    ? tabItem.bgcolor
                    : 'action.hover',
              },
            }}
            variant={selectedTab === tabItem.name ? 'filled' : 'outlined'}
          />
        ))}
      </Stack>
    </Box>
  );
}

export default TabFilter;
