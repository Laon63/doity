import React from 'react';
import { Box, Chip, Stack, useTheme } from '@mui/material';
import useThemeStore from 'client/store/themeStore';

interface CategoryFilterProps {
  selectedCategory: string;
  setCategory: (category: string) => void;
}

function CategoryFilter({
  selectedCategory,
  setCategory,
}: CategoryFilterProps) {
  const theme = useTheme();

  const categories = [
    { name: 'All', label: 'All' },
    { name: 'personal', label: 'Personal' },
    { name: 'work', label: 'Work' },
    { name: 'other', label: 'Other' },
  ];

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
