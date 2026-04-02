# Dark Mode - Rule

## 📋 Visão Geral

Sistema completo de Dark Mode implementado com temas dinâmicos baseados em `useColorScheme()` nativo do React Native. Todas as telas DEVEM seguir este padrão para consistência.

**Status**: ✅ Sistema implementado e pronto | ⏳ Migração de telas em progresso

---

## 🎨 Sistema de Cores

| Propriedade | Light | Dark | Uso |
|---|---|---|---|
| `text` | #000 | #fff | Texto principal |
| `textSecondary` | #666 | #ccc | Texto secundário |
| `textTertiary` | #999 | #999 | Texto terciário |
| `background` | #f2f5f9 | #0a0e27 | Fundo de tela |
| `backgroundAlt` | #fff | #1a1f3a | Fundo alternativo |
| `cardBackground` | #fff | #16213e | Card/Container |
| `border` | #ccc | #444 | Borda padrão |
| `borderLight` | #e0e0e0 | #333 | Borda sutil |
| `placeholder` | #555 | #aaa | Placeholder de input |
| `inputBackground` | #fff | #1a1f3a | Fundo de input |
| `link` | #4F46E5 | #8b5cf6 | Links |

**Cores Brand** (sempre idênticas em ambos temas):
- Roxo principal: `#9333ea`
- Laranja: `#FFA45E`

### Localização
- Definição: `theme/theme.ts` - Função `getThemeColors(colorScheme)`
- Helpers: `theme/themeUtils.ts` - `useAppTheme()`, `themeHelpers()`
- Factory: `theme/createThemedStyles.ts` - Hook `useThemedStyles()`

---

## 🚀 Como Implementar em Nova Tela

### Opção 1: Rápida (Essencial apenas)
Use quando a tela é muito simples ou prototipagem rápida.

```typescript
import { useColorScheme, View, Text, StyleSheet } from 'react-native';
import { getThemeColors } from '../../theme/theme';

export default function MyScreen() {
  const colorScheme = useColorScheme();
  const colors = getThemeColors(colorScheme);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        Olá! Eu sou temático
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center' },
});
```

### Opção 2: Completa (RECOMENDADA)
Use na maioria das telas. Separa estilos dinâmicos em `createDynamicStyles()`.

```typescript
import { useColorScheme, View, Text, StyleSheet } from 'react-native';
import { getThemeColors } from '../../theme/theme';

export default function MyScreen() {
  const colorScheme = useColorScheme();
  const colors = getThemeColors(colorScheme);
  const dynamicStyles = createDynamicStyles(colors);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Título</Text>
      
      <View style={[styles.card, dynamicStyles.card]}>
        <Text style={[styles.cardText, { color: colors.textSecondary }]}>
          Conteúdo do card
        </Text>
      </View>
    </View>
  );
}

const createDynamicStyles = (colors: ReturnType<typeof getThemeColors>) => ({
  card: {
    backgroundColor: colors.cardBackground,
    borderColor: colors.border,
  },
});

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  card: { borderWidth: 1, borderRadius: 12, padding: 16, marginBottom: 12 },
  cardText: { fontSize: 14 },
});
```

### Opção 3: Com Helpers (Mais Limpa)
Use em telas complexas para máxima reutilização de estilos.

```typescript
import { useAppTheme } from '../../theme/themeUtils';
import { themeHelpers } from '../../theme/themeUtils';

export default function MyScreen() {
  const { colors } = useAppTheme();
  const helpers = themeHelpers(colors);

  return (
    <View style={[helpers.container]}>
      <View style={[helpers.card]}>
        <Text style={[helpers.textStyles.primary]}>Hello</Text>
      </View>
    </View>
  );
}
```

---

## 📚 Snippets Prontos para Usar

### Snippet 1: Cards
```typescript
import { useColorScheme, View, Text, StyleSheet } from 'react-native';
import { getThemeColors } from '../../theme/theme';

export default function CardScreen() {
  const colorScheme = useColorScheme();
  const colors = getThemeColors(colorScheme);
  const dynamicStyles = createDynamicStyles(colors);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Meus Cards</Text>
      
      <View style={[styles.card, dynamicStyles.card]}>
        <Text style={[styles.cardText, { color: colors.textSecondary }]}>Card 1</Text>
      </View>

      <View style={[styles.card, dynamicStyles.card]}>
        <Text style={[styles.cardText, { color: colors.textSecondary }]}>Card 2</Text>
      </View>
    </View>
  );
}

const createDynamicStyles = (colors: ReturnType<typeof getThemeColors>) => ({
  card: {
    backgroundColor: colors.cardBackground,
    borderColor: colors.border,
  },
});

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  card: { borderWidth: 1, borderRadius: 12, padding: 16, marginBottom: 12 },
  cardText: { fontSize: 14 },
});
```

### Snippet 2: Componentes Temáticos Prontos
```typescript
import { 
  ThemedContainer, 
  ThemedCard, 
  ThemedButton, 
  ThemedText 
} from '@/components/ThemedComponents';

export default function EasyScreen() {
  return (
    <ThemedContainer>
      <ThemedText variant="title">Título da Tela</ThemedText>
      
      <ThemedCard>
        <ThemedText variant="body">Conteúdo do card</ThemedText>
      </ThemedCard>
      
      <ThemedButton 
        title="Clique aqui!" 
        onPress={() => console.log('Clicado')}
      />
    </ThemedContainer>
  );
}
```

### Snippet 3: Input com Validação
```typescript
import { useState } from 'react';
import { useColorScheme, View, Text, TextInput, StyleSheet } from 'react-native';
import { getThemeColors } from '../../theme/theme';

export default function FormScreen() {
  const [email, setEmail] = useState('');
  const colorScheme = useColorScheme();
  const colors = getThemeColors(colorScheme);
  const dynamicStyles = createDynamicStyles(colors);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.label, { color: colors.text }]}>Email</Text>
      <TextInput
        style={[styles.input, dynamicStyles.input]}
        placeholder="seu@email.com"
        placeholderTextColor={colors.placeholder}
        value={email}
        onChangeText={setEmail}
      />
      
      <Text style={[styles.info, { color: colors.textSecondary }]}>
        Preenchido: {email.length > 0 ? 'Sim' : 'Não'}
      </Text>
    </View>
  );
}

const createDynamicStyles = (colors: ReturnType<typeof getThemeColors>) => ({
  input: {
    backgroundColor: colors.inputBackground,
    borderColor: colors.border,
    color: colors.text,
  },
});

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  input: { borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 12 },
  info: { fontSize: 12, marginTop: 8 },
});
```

### Snippet 4: Modal Temático
```typescript
import { useState } from 'react';
import { useColorScheme, View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { getThemeColors } from '../../theme/theme';

export default function ModalScreen() {
  const [visible, setVisible] = useState(false);
  const colorScheme = useColorScheme();
  const colors = getThemeColors(colorScheme);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TouchableOpacity style={styles.button} onPress={() => setVisible(true)}>
        <Text style={styles.buttonText}>Abrir Modal</Text>
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalContent, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Modal Temático</Text>
            
            <Text style={[styles.modalText, { color: colors.textSecondary }]}>
              Este modal segue o tema do app!
            </Text>

            <TouchableOpacity style={styles.closeButton} onPress={() => setVisible(false)}>
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  button: { backgroundColor: '#9333ea', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 20 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { borderRadius: 20, padding: 30, width: '80%', maxWidth: 400 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  modalText: { fontSize: 14, marginBottom: 24, lineHeight: 20 },
  closeButton: { backgroundColor: '#FFA45E', paddingVertical: 12, borderRadius: 8 },
  closeButtonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
});
```

### Snippet 5: Lista (FlatList Padrão)
```typescript
import React, { useState } from 'react';
import { useColorScheme, FlatList, View, Text, StyleSheet } from 'react-native';
import { getThemeColors } from '../../theme/theme';

export default function ListScreen() {
  const [items] = useState([
    { id: '1', title: 'Item 1', desc: 'Descrição 1' },
    { id: '2', title: 'Item 2', desc: 'Descrição 2' },
    { id: '3', title: 'Item 3', desc: 'Descrição 3' },
  ]);

  const colorScheme = useColorScheme();
  const colors = getThemeColors(colorScheme);
  const dynamicStyles = createDynamicStyles(colors);

  const renderItem = ({ item }: any) => (
    <View style={[styles.item, dynamicStyles.item]}>
      <Text style={[styles.itemTitle, { color: colors.text }]}>{item.title}</Text>
      <Text style={[styles.itemDesc, { color: colors.textSecondary }]}>{item.desc}</Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
      />
    </View>
  );
}

const createDynamicStyles = (colors: ReturnType<typeof getThemeColors>) => ({
  item: {
    backgroundColor: colors.cardBackground,
    borderTopColor: colors.borderLight,
  },
});

const styles = StyleSheet.create({
  container: { flex: 1 },
  item: { padding: 16, borderTopWidth: 1 },
  itemTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  itemDesc: { fontSize: 12 },
});
```

---

## ⚠️ Erros Comuns e Como Evitar

| ❌ ERRADO | ✅ CERTO | Explicação |
|---|---|---|
| `backgroundColor: '#fff'` | `[{ backgroundColor: colors.background }]` | Hardcoded não funciona em dark |
| `color: '#333'` | `{ color: colors.text }` | Precisa de cores dinâmicas |
| `borderColor: '#ccc'` | `{ borderColor: colors.border }` | Bordas devem estar no tema |
| Sem `useColorScheme()` | `const colorScheme = useColorScheme()` | Necessário para detectar tema |
| Sem `getThemeColors()` | `const colors = getThemeColors(colorScheme)` | Necessário para obter cores |
| `placeholderTextColor: '#555'` | `placeholderTextColor={colors.placeholder}` | Placeholder precisa de tema |
| Sem testar dark mode | Testar em ambos light/dark | Sempre validar em ambos temas |

---

## 🎨 Padrões de Design

### 📐 Estrutura Recomendada
```typescript
// 1. Imports
import { useColorScheme, View, Text, StyleSheet } from 'react-native';
import { getThemeColors } from '../../theme/theme';

// 2. Component
export default function MyScreen() {
  // 3. Hooks
  const colorScheme = useColorScheme();
  const colors = getThemeColors(colorScheme);
  const dynamicStyles = createDynamicStyles(colors);

  // 4. Return JSX
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Conteúdo */}
    </View>
  );
}

// 5. Dynamic styles function
const createDynamicStyles = (colors: ReturnType<typeof getThemeColors>) => ({
  // Estilos que variam com tema
});

// 6. Static styles
const styles = StyleSheet.create({
  // Estilos que não variam
});
```

### 🎯 Regras de Cores
1. **Manter Brand Colors**: `#9333ea` (roxo) e `#FFA45E` (laranja) sempre iguais
2. **Contraste**: Mínimo WCAG AA (4.5:1 para texto regular)
3. **Sombras**: Use `colors.text` com opacidade baixa: `rgba(colors.text, 0.1)`
4. **Icons**: Podem variar ou manter color brand
5. **Gradients**: LinearGradient mantém cores, fundo externo varia

---

## 📦 Arquivos do Sistema

| Arquivo | Propósito |
|---|---|
| `theme/theme.ts` | Definição de `getThemeColors()` |
| `theme/themeUtils.ts` | Hooks `useAppTheme()` e `themeHelpers()` |
| `theme/createThemedStyles.ts` | Factory `useThemedStyles()` |
| `app/(tabs)/TemplateScreenDarkMode.tsx` | Template pronto para copiar |

---

## 🧪 Testes

### Ativar Dark Mode para Teste

**iOS Simulator:**
1. Settings → Developer → Dark Mode
2. Ou: Abrir Xcode → Device → Environment Overrides → Appearance → Dark

**iOS Device:**
1. Settings → Display & Brightness → Dark

**Android Emulator:**
1. Settings → Display → Dark Theme
2. Ou: Settings → System → Developer Options → Simulate secondary color (API 31+)

**Android Device:**
1. Settings → Display → Dark Theme (Android 10+)

### Validação Rápida

Após ativar Dark Mode, verificar:
- [ ] Background está escuro (`colors.background`)
- [ ] Texto está legível (branco ou cinza claro)
- [ ] Nenhuma cor hardcoded visível
- [ ] Cards têm bom contraste
- [ ] Cores brand (#9333ea, #FFA45E) iguais em ambos temas

---

## 💡 Pro Tips

1. **Use sempre `[styles.container, { backgroundColor: colors.background }]`** na View raiz
2. **TextInput precisa de `placeholderTextColor={colors.placeholder}`**
3. **Modal sempre precisa de `backgroundColor: colors.cardBackground`**
4. **Icons com cores variáveis**: `color={colors.text}`
5. **Extrair `createDynamicStyles` em função separada** para legibilidade
6. **Testar com tema invertido** (Settings > Accessibility > Color Filters)

---

## 📞 Referências

- Exemplo completo implementado: `app/(tabs)/home.tsx`
- Template para copiar: `app/(tabs)/TemplateScreenDarkMode.tsx`
- Guia detalhado: `docs/03-DARK_MODE_GUIA.md`
- Skill de migração: `.claude/skills/migrate-dark-mode.md`
