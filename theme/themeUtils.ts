// 🎨 Theme Utilities - Padrões Reutilizáveis para Dark Mode
// Arquivo: theme/themeUtils.ts

import { useColorScheme, StyleSheet } from 'react-native';
import { getThemeColors, ThemeColors } from './theme';

/**
 * Hook para usar tema em qualquer componente
 */
export function useAppTheme() {
  const colorScheme = useColorScheme();
  const colors = getThemeColors(colorScheme);
  return { colors, colorScheme, isDark: colorScheme === 'dark' };
}

/**
 * Padrões de estilos comuns reutilizáveis
 */
export const themeHelpers = (colors: ThemeColors) => ({
  // Container padrão
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Card padrão
  card: {
    backgroundColor: colors.cardBackground,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    elevation: 3,
    shadowColor: colors.text,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },

  // Input padrão
  input: {
    backgroundColor: colors.inputBackground,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    color: colors.text,
    fontSize: 14,
  },

  // Button padrão (usando cor brand)
  button: {
    backgroundColor: '#9333ea',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 30,
    elevation: 2,
    shadowColor: '#9333ea',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  // Text styles
  textStyles: {
    primary: { color: colors.text, fontSize: 16 },
    secondary: { color: colors.textSecondary, fontSize: 14 },
    tertiary: { color: colors.textTertiary, fontSize: 12 },
    title: { color: colors.text, fontSize: 24, fontWeight: 'bold' },
    subtitle: { color: colors.textSecondary, fontSize: 16, fontWeight: '600' },
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 12,
  },

  // Skeleton loader effect
  skeletonLoader: {
    backgroundColor: colors.background,
    borderRadius: 8,
  },

  // Modal backdrop
  modalBackdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },

  // Status badge
  statusBadge: (status: 'success' | 'error' | 'warning' | 'info') => {
    const statusColors = {
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      info: '#3b82f6',
    };
    return {
      backgroundColor: statusColors[status] + '20',
      borderColor: statusColors[status],
      borderWidth: 1,
      borderRadius: 8,
      paddingVertical: 6,
      paddingHorizontal: 12,
    };
  },
});

/**
 * Utilitário para opacidade dinâmica
 */
export const getColorWithOpacity = (color: string, opacity: number): string => {
  // Converter hex para rgba
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

/**
 * Exemplo de uso em um componente customizado
 */
export const Card = ({ colors, children, style }: any) => {
  const helpers = themeHelpers(colors);
  return (
    <div style={[helpers.card, style]}>
      {children}
    </div>
  );
};
