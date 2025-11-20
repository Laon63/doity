import React from 'react';
import { Tabs, Tab, Box } from '@mui/material';

interface CategoryFilterProps {
  selectedCategory: string;
  setCategory: (category: string) => void;
}

function CategoryFilter({
  selectedCategory,
  setCategory,
}: CategoryFilterProps) {
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setCategory(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs
        value={selectedCategory}
        onChange={handleChange}
        aria-label="task category filter"
        indicatorColor="primary"
        textColor="primary"
      >
        <Tab label="All" value="All" />
        <Tab label="Personal" value="personal" />
        <Tab label="Work" value="work" />
        <Tab label="Other" value="other" />
      </Tabs>
    </Box>
  );
}

export default CategoryFilter;
