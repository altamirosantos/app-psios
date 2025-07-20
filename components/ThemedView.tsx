import { View, type ViewProps, useColorScheme } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

function getCustomColor(lightColor?: string, darkColor?: string) {
  const colorScheme = useColorScheme();
  return colorScheme === 'dark' ? darkColor : lightColor;
}

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const customColor = getCustomColor(lightColor, darkColor);
  const backgroundColor = customColor ?? useThemeColor('background');

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
