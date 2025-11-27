// Utility functions for color manipulation
export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

export const rgbToHex = (r: number, g: number, b: number): string => {
  return (
    '#' +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      })
      .join('')
  );
};

// Calculate relative luminance for WCAG contrast calculation
export const getLuminance = (hex: string): number => {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0.5;

  const { r, g, b } = rgb;
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
};

// Get contrast ratio between two colors
export const getContrastRatio = (hex1: string, hex2: string): number => {
  const lum1 = getLuminance(hex1);
  const lum2 = getLuminance(hex2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
};

// Lighten a color by a percentage (0-1)
export const lightenColor = (hex: string, percent: number): string => {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const { r, g, b } = rgb;
  const factor = 1 + percent;

  return rgbToHex(
    Math.min(255, Math.round(r * factor)),
    Math.min(255, Math.round(g * factor)),
    Math.min(255, Math.round(b * factor))
  );
};

// Darken a color by a percentage (0-1)
export const darkenColor = (hex: string, percent: number): string => {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const { r, g, b } = rgb;
  const factor = 1 - percent;

  return rgbToHex(
    Math.round(r * factor),
    Math.round(g * factor),
    Math.round(b * factor)
  );
};

// Get the best text color (light or dark) based on background color
export const getContrastTextColor = (bgColor: string): string => {
  const luminance = getLuminance(bgColor);
  // If luminance is high (light background), use dark text, otherwise use light text
  return luminance > 0.5 ? '#1E293B' : '#F8FAFC';
};

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
