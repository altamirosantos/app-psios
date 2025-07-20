// theme.ts
import { ColorSchemeName } from 'react-native';

export const lightColors = {
    text: '#000',
    background: '#fff',
    cardBackground: '#f1f5f9',
    subtitle: '#666',
    border: '#ccc',
    placeholder: '#555',
    inputBackground: '#ddd',
    link: '#4F46E5',
};

export const darkColors = {
    text: '#fff',
    background: '#000',
    cardBackground: '#1f1f1f',
    subtitle: '#ccc',
    border: '#555',
    placeholder: '#aaa',
    inputBackground: '#2d2d2d',
    link: '#8b5cf6',
};

export const getThemeColors = (scheme: ColorSchemeName) => {
    return scheme === 'dark' ? darkColors : lightColors;
};
