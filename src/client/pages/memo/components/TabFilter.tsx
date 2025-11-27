import React from 'react';
import { Box, Chip, Stack, useTheme } from '@mui/material';

interface TabFilterProps {
  selectedTab: string;
  setTab: (tab: string) => void;
}

function TabFilter({ selectedTab, setTab }: TabFilterProps) {
  const theme = useTheme();

  const tabs = [
    { name: 'All', label: 'All' },
    { name: 'Pinned', label: 'Pinned' },
  ];
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
                selectedTab === tabItem.name ? 'primary.lighter' : 'default',
              color:
                selectedTab === tabItem.name
                  ? '#000000'
                  : 'text.primary',
              borderColor:
                selectedTab === tabItem.name ? 'primary.lighter' : 'divider',
              '&:hover': {
                bgcolor:
                  selectedTab === tabItem.name
                    ? 'primary.lighter'
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
