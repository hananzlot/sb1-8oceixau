import { useColorScheme as useNativeColorScheme } from 'react-native';
import { useEffect, useState } from 'react';

// Define color palette
type ColorScheme = 'light' | 'dark';

interface Colors {
  primary: string;
  secondary: string;
  background: string;
  card: string;
  text: string;
  secondaryText: string;
  border: string;
  notification: string;
  success: string;
  warning: string;
  error: string;
  lightGray: string;
  mediumGray: string;
  darkGray: string;
}

const lightColors: Colors = {
  primary: '#007AFF',
  secondary: '#5AC8FA',
  background: '#FFFFFF',
  card: '#F2F2F7',
  text: '#000000',
  secondaryText: '#8E8E93',
  border: '#E5E5EA',
  notification: '#FF3B30',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  lightGray: '#F2F2F7',
  mediumGray: '#C7C7CC',
  darkGray: '#8E8E93',
};

const darkColors: Colors = {
  primary: '#0A84FF',
  secondary: '#64D2FF',
  background: '#000000',
  card: '#1C1C1E',
  text: '#FFFFFF',
  secondaryText: '#8E8E93',
  border: '#38383A',
  notification: '#FF453A',
  success: '#30D158',
  warning: '#FF9F0A',
  error: '#FF453A',
  lightGray: '#38383A',
  mediumGray: '#48484A',
  darkGray: '#8E8E93',
};

export function useColorScheme() {
  // Get native color scheme
  const nativeColorScheme = useNativeColorScheme();
  const [colorScheme, setColorScheme] = useState<ColorScheme>(nativeColorScheme as ColorScheme || 'light');
  const [colors, setColors] = useState<Colors>(colorScheme === 'dark' ? darkColors : lightColors);

  // Update colors when color scheme changes
  useEffect(() => {
    if (nativeColorScheme) {
      setColorScheme(nativeColorScheme as ColorScheme);
      setColors(nativeColorScheme === 'dark' ? darkColors : lightColors);
    }
  }, [nativeColorScheme]);

  return {
    colorScheme,
    colors,
    lightColors,
    darkColors,
  };
}