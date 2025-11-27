import React from 'react';
import { Box, Chip, Stack, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next'; // Import useTranslation

interface TodoCategoryFilterProps {
  selectedCategory: string;
  setCategory: (category: string) => void;
}

function TodoCategoryFilter({
  selectedCategory,
  setCategory,
}: TodoCategoryFilterProps) {
  const theme = useTheme();
  const { t } = useTranslation('common'); // Initialize useTranslation

  const categories = [
    { name: 'All', label: t('all') },
    { name: 'personal', label: t('personal') },
    { name: 'work', label: t('work') },
    { name: 'other', label: t('other') },
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
                  ? 'primary.lighter'
                  : 'default',
              color:
                selectedCategory === categoryItem.name
                  ? '#000000'
                  : 'text.primary',
              borderColor:
                selectedCategory === categoryItem.name
                  ? 'primary.lighter'
                  : 'divider',
              '&:hover': {
                bgcolor:
                  selectedCategory === categoryItem.name
                    ? 'primary.lighter'
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
