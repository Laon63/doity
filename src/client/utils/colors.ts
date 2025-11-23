export const getCategoryColor = (category?: string) => {
  switch (category) {
    case 'personal':
      return '#8FE3CD';
    case 'work':
      return '#64748B';
    case 'other':
      return '#F59E0B';
    default:
      return '#CBD5E1';
  }
};

export const getCategoryLightColor = (category?: string) => {
  switch (category) {
    case 'personal':
      return '#E0F9F5';
    case 'work':
      return '#F1F5F9';
    case 'other':
      return '#FFFBEB';
    default:
      return '#F1F5F9';
  }
};
