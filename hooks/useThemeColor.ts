// hooks/useThemeColor.ts
import { useColorScheme } from 'react-native';
import { getThemeColors } from '../theme/theme';

export function useThemeColor(key: keyof ReturnType<typeof getThemeColors>) {
  const colorScheme = useColorScheme();
  const colors = getThemeColors(colorScheme);
  return colors[key];
}
