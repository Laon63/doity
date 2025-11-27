import React from 'react';
import { Box, Chip, Stack, useTheme } from '@mui/material';
import { getSidebarBackgroundColor, getContrastTextColor } from 'client/utils/colors';
import useThemeStore from 'client/store/themeStore';

interface CategoryFilterProps {
  selectedCategory: string;
  setCategory: (category: string) => void;
}

const getCategoryConfig = (primaryColor: string) => [
  {
    name: 'All',
    label: 'All',
    bgcolor: getSidebarBackgroundColor(primaryColor),
    textColor: getContrastTextColor(primaryColor),
  },
  {
    name: 'personal',
    label: 'Personal',
    bgcolor: getSidebarBackgroundColor(primaryColor),
    textColor: getContrastTextColor(primaryColor),
  },
  {
    name: 'work',
    label: 'Work',
    bgcolor: getSidebarBackgroundColor(primaryColor),
    textColor: getContrastTextColor(primaryColor),
  },
  {
    name: 'other',
    label: 'Other',
    bgcolor: getSidebarBackgroundColor(primaryColor),
    textColor: getContrastTextColor(primaryColor),
  },
];

function CategoryFilter({
  selectedCategory,
  setCategory,
}: CategoryFilterProps) {
  const theme = useTheme();
  const primaryColor = useThemeStore((state) => state.primaryColor);
  const categories = getCategoryConfig(primaryColor);

  const handleChipClick = (categoryName: string) => {
    setCategory(categoryName);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', py: 1 }}>
        {categories.map((categoryItem) => (
          <Chip
            key={categoryItem.name}
            label={categoryItem.label}
            onClick={() => handleChipClick(categoryItem.name)}
            sx={{
              cursor: 'pointer',
              textTransform: 'none',
              fontWeight: 600,
              px: 1,
              bgcolor:
                selectedCategory === categoryItem.name
                  ? categoryItem.bgcolor
                  : 'default',
              color:
                selectedCategory === categoryItem.name
                  ? '#000000'
                  : 'text.primary',
              borderColor:
                selectedCategory === categoryItem.name
                  ? categoryItem.bgcolor
                  : 'divider',
              '&:hover': {
                bgcolor:
                  selectedCategory === categoryItem.name
                    ? categoryItem.bgcolor
                    : 'action.hover',
              },
            }}
            variant={
              selectedCategory === categoryItem.name ? 'filled' : 'outlined'
            }
          />
        ))}
      </Stack>
    </Box>
  );
}

export default CategoryFilter;
