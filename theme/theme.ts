// theme.ts
import { ColorSchemeName } from 'react-native';

export const lightColors = {
    // Textos
    text: '#000',
    textSecondary: '#666',
    textTertiary: '#999',
    
    // Backgrounds
    background: '#f2f5f9',
    backgroundAlt: '#fff',
    cardBackground: '#fff',
    
    // Borders
    border: '#ccc',
    borderLight: '#e0e0e0',
    
    // Form
    placeholder: '#555',
    inputBackground: '#fff',
    
    // Links e Actions
    link: '#4F46E5',
    
    // Legacy (mantém compatibilidade)
    subtitle: '#666',
};

export const darkColors = {
    // Textos
    text: '#fff',
    textSecondary: '#ccc',
    textTertiary: '#999',
    
    // Backgrounds
    background: '#0a0e27',
    backgroundAlt: '#1a1f3a',
    cardBackground: '#16213e',
    
    // Borders
    border: '#444',
    borderLight: '#333',
    
    // Form
    placeholder: '#aaa',
    inputBackground: '#1a1f3a',
    
    // Links e Actions
    link: '#8b5cf6',
    
    // Legacy (mantém compatibilidade)
    subtitle: '#ccc',
};

export type ThemeColors = typeof lightColors;

export const getThemeColors = (scheme: ColorSchemeName): ThemeColors => {
    return scheme === 'dark' ? darkColors : lightColors;
};
