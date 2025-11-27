import React from 'react';
import { Box, Chip, Stack, useTheme } from '@mui/material';
import { getSidebarBackgroundColor, getContrastTextColor } from 'client/utils/colors';
import useThemeStore from 'client/store/themeStore';

interface TabFilterProps {
  selectedTab: string;
  setTab: (tab: string) => void;
}

const getTabConfig = (primaryColor: string) => [
  {
    name: 'All',
    label: 'All',
    bgcolor: getSidebarBackgroundColor(primaryColor),
    textColor: getContrastTextColor(primaryColor),
  },
  {
    name: 'Pinned',
    label: 'Pinned',
    bgcolor: getSidebarBackgroundColor(primaryColor),
    textColor: getContrastTextColor(primaryColor),
  },
];

function TabFilter({ selectedTab, setTab }: TabFilterProps) {
  const theme = useTheme();
  const primaryColor = useThemeStore((state) => state.primaryColor);
  const tabs = getTabConfig(primaryColor);
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
                  ? '#000000'
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
