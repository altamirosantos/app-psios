// theme/createThemedStyles.ts
import { useColorScheme } from 'react-native';
import { getThemeColors, ThemeColors } from './theme';

/**
 * Hook para criar StyleSheets adaptativos ao tema
 * Uso: const styles = useThemedStyles(createStyles);
 * 
 * @param styleFactory Função que recebe as cores do tema e retorna os estilos
 * @returns Objeto com os estilos adaptados ao tema atual
 */
export function useThemedStyles<T extends Record<string, any>>(
    styleFactory: (colors: ThemeColors) => T
): T {
    const colorScheme = useColorScheme();
    const colors = getThemeColors(colorScheme);
    return styleFactory(colors);
}

/**
 * Função auxiliar para inicializar cores com facilidade
 */
export const createColoredStyle = (colors: ThemeColors) => ({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    text: {
        color: colors.text,
    },
    textSecondary: {
        color: colors.textSecondary,
    },
    card: {
        backgroundColor: colors.cardBackground,
        borderColor: colors.border,
    },
    input: {
        backgroundColor: colors.inputBackground,
        color: colors.text,
        borderColor: colors.border,
    },
});
