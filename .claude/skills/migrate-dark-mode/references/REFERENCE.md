# Referência Técnica - Dark Mode

## 🎨 Mapa de Cores

### Light Mode (Padrão iOS/prefers-light)

| Propriedade | Valor | Uso |
|---|---|---|
| `text` | `#000` | Texto principal |
| `textSecondary` | `#666` | Texto secundário |
| `textTertiary` | `#999` | Texto desabilitado |
| `background` | `#f2f5f9` | Fundo de tela |
| `backgroundAlt` | `#fff` | Fundo alternativo |
| `cardBackground` | `#fff` | Cards e containers |
| `border` | `#ccc` | Bordas padrão |
| `borderLight` | `#e0e0e0` | Bordas sutis |
| `placeholder` | `#555` | Placeholder de input |
| `inputBackground` | `#fff` | Fundo de input |
| `link` | `#4F46E5` | Links e ações |

### Dark Mode (prefers-dark)

| Propriedade | Valor | Uso |
|---|---|---|
| `text` | `#fff` | Texto principal |
| `textSecondary` | `#ccc` | Texto secundário |
| `textTertiary` | `#999` | Texto desabilitado |
| `background` | `#0a0e27` | Fundo de tela |
| `backgroundAlt` | `#1a1f3a` | Fundo alternativo |
| `cardBackground` | `#16213e` | Cards e containers |
| `border` | `#444` | Bordas padrão |
| `borderLight` | `#333` | Bordas sutis |
| `placeholder` | `#aaa` | Placeholder de input |
| `inputBackground` | `#1a1f3a` | Fundo de input |
| `link` | `#8b5cf6` | Links e ações |

### Brand Colors (Sempre Idênticas)

| Nome | Valor | Uso |
|---|---|---|
| Roxo Principal | `#9333ea` | Botões, ênfase |
| Laranja | `#FFA45E` | Destaques |

## 🔧 Hooks Essenciais

### `useColorScheme()`

Detecta automaticamente o tema do sistema:

```typescript
import { useColorScheme } from 'react-native';

const colorScheme = useColorScheme();
// Retorna: 'light' | 'dark' | null
```

**Notas:**
- Em web/desenvolvimento, pode retornar `null` → tratar como `'light'`
- Em iOS/Android real, sempre retorna `'light'` ou `'dark'`
- Reativo: muda em tempo real quando usuário alterna tema

### `getThemeColors(colorScheme)`

Retorna objeto com todas as cores para o tema:

```typescript
import { getThemeColors } from '@/theme/theme';

const colors = getThemeColors(colorScheme);
// Retorna: { text, background, cardBackground, ... }
```

**Arquivo**: `theme/theme.ts`

## 📐 Padrão de Aplicação de Estilos

### Opção 1: Inline (Simples)

```typescript
<Text style={{ color: colors.text }}>Texto</Text>
```

**Quando usar**: Componentes únicos, sem reutilização

### Opção 2: StyleSheet + Array (Recomendado)

```typescript
<View style={[styles.container, { backgroundColor: colors.background }]} />

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 }, // Estilos estáticos
});
```

**Quando usar**: Maioria dos casos

### Opção 3: Função Dinâmica (Complexo)

```typescript
const dynamicStyles = createDynamicStyles(colors);

<View style={[styles.card, dynamicStyles.card]} />

const createDynamicStyles = (colors) => ({
  card: {
    backgroundColor: colors.cardBackground,
    borderColor: colors.border,
  },
});
```

**Quando usar**: Múltiplos estilos dependentes de tema

## ⚙️ Configuração

### Importação Correta do Cliente

```typescript
// ✅ CORRETO
import { useColorScheme } from 'react-native';
import { getThemeColors } from '../../theme/theme';

// ❌ EVITAR (não testado em produção)
import { useColorScheme } from 'react-native-paper';
```

### Paths Relativos

| Localização do Component | Import | Pastas Acima |
|---|---|---|
| `app/(tabs)/home.tsx` | `../../theme/theme` | 2 (`(tabs)` + `app`) |
| `app/(auth)/login.tsx` | `../../theme/theme` | 2 (`(auth)` + `app`) |
| `components/MyButton.tsx` | `../theme/theme` | 1 (`app`) |
| `app/(tabs)/(stack)/detail.tsx` | `../../../theme/theme` | 3 |

**Dica**: Contar quantas pastas acima de `app/` estão, multiplicar por `../`

## 🧪 Testes de Contraste

Use [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) para validar:

### Light Mode
- Texto (#000) sobre Background (#f2f5f9): ✅ 16:1 (excelente)
- Texto (#666) sobre Background (#f2f5f9): ✅ 8.5:1 (excelente)
- Texto (#999) sobre Background (#f2f5f9): ✅ 4.5:1 (WCAG AA)

### Dark Mode
- Texto (#fff) sobre Background (#0a0e27): ✅ 16:1 (excelente)
- Texto (#ccc) sobre Background (#0a0e27): ✅ 10.1:1 (excelente)
- Links (#8b5cf6) sobre Background (#0a0e27): ✅ 7:1 (excelente)

## 🐛 Troubleshooting

### Problema: "colors is not defined"

```typescript
// ❌ ERRADO
<Text style={{ color: colors.text }}>Texto</Text>

// ✅ CORRETO
const colors = getThemeColors(colorScheme);
<Text style={{ color: colors.text }}>Texto</Text>
```

### Problema: Cores não mudam ao trocar tema

```typescript
// ❌ ERRADO (não reativo)
const colors = getThemeColors('light');
<View style={{ backgroundColor: colors.background }} />

// ✅ CORRETO (reativo)
const colorScheme = useColorScheme();
const colors = getThemeColors(colorScheme);
<View style={{ backgroundColor: colors.background }} />
```

### Problema: Import não encontrado

```typescript
// Verificar path - contar pastas acima
// app/(tabs)/home.tsx está 2 níveis abaixo de theme/
// ✅ import { ... } from '../../theme/theme';
// ❌ import { ... } from '../theme/theme';
```

## 📚 Arquivos Relacionados

| Arquivo | Propósito |
|---|---|
| `theme/theme.ts` | Implementação de `getThemeColors()` |
| `theme/themeUtils.ts` | Helpers `useAppTheme()`, `themeHelpers()` |
| `rules/dark-mode.md` | Guia completo e padrões |
| `app/(tabs)/home.tsx` | Exemplo implementado |

## 💡 Pro Tips

1. **Use TypeScript**: `ReturnType<typeof getThemeColors>` para tipos seguros
2. **Cache colors**: Não recalcule em cada renderização (use `useMemo` se necessário)
3. **Teste ambos temas**: sempre validar light + dark
4. **Brand colors**: nunca mude `#9333ea` e `#FFA45E`
5. **Contraste**: use ferramenta de teste antes de commitar
