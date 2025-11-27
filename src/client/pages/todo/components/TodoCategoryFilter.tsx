import React from 'react';
import { Box, Chip, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next'; // Import useTranslation

interface TodoCategoryFilterProps {
  selectedCategory: string;
  setCategory: (category: string) => void;
}

function TodoCategoryFilter({
  selectedCategory,
  setCategory,
}: TodoCategoryFilterProps) {
  const { t } = useTranslation('common'); // Initialize useTranslation

  const categories = [
    {
      name: 'All',
      label: t('all'),
      bgcolor: '#c0ccd5',
      textColor: '#000000de',
    },
    {
      name: 'personal',
      label: t('personal'),
      bgcolor: '#bed9ff',
      textColor: '#4a8ae2',
    },
    {
      name: 'work',
      label: t('work'),
      bgcolor: '#C4B5E0',
      textColor: '#6b21a8',
    },
    {
      name: 'other',
      label: t('other'),
      bgcolor: '#E8A5C0',
      textColor: '#831843',
    },
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

export default TodoCategoryFilter;
