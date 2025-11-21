import React from 'react';
import { Box, Chip, Stack } from '@mui/material';

interface CategoryFilterProps {
  selectedCategory: string;
  setCategory: (category: string) => void;
}

const categories = [
  {
    name: 'All',
    label: 'All',
    bgcolor: '#c0ccd5',
    textColor: '#000000de',
  },
  {
    name: 'personal',
    label: 'Personal',
    bgcolor: '#bed9ff',
    textColor: '#4a8ae2',
  },
  {
    name: 'work',
    label: 'Work',
    bgcolor: '#C4B5E0',
    textColor: '#6b21a8',
  },
  {
    name: 'other',
    label: 'Other',
    bgcolor: '#E8A5C0',
    textColor: '#831843',
  },
];

function CategoryFilter({
  selectedCategory,
  setCategory,
}: CategoryFilterProps) {
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
                  ? categoryItem.textColor
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
