# 🎨 Guia de Implementação Dark Mode - Sistema PSIOS

## 📌 Visão Geral

O sistema agora possui suporte completo a **Dark Mode** via React Native's `useColorScheme()`. Todas as telas devem ser migradas para usar o sistema de temas centralizado.

---

## 🎯 Estrutura de Cores

### Cores Disponíveis

```typescript
// Light Mode
text: '#000'                    // Texto principal
textSecondary: '#666'          // Texto secundário
textTertiary: '#999'           // Texto terciário
background: '#f2f5f9'          // Background principal
backgroundAlt: '#fff'          // Background alternativo
cardBackground: '#fff'         // Fundo de cards
border: '#ccc'                 // Border principal
borderLight: '#e0e0e0'         // Border claro
placeholder: '#555'            // Placeholder
inputBackground: '#fff'        // Fundo de input

// Dark Mode
text: '#fff'
textSecondary: '#ccc'
textTertiary: '#999'
background: '#0a0e27'
backgroundAlt: '#1a1f3a'
cardBackground: '#16213e'
border: '#444'
borderLight: '#333'
placeholder: '#aaa'
inputBackground: '#1a1f3a'
```

---

## 🚀 Guia Passo a Passo

### Passo 1: Importar Dependências

```typescript
import { useColorScheme } from 'react-native';
import { StyleSheet } from 'react-native';
import { getThemeColors } from '../../theme/theme';
```

### Passo 2: Adicionar Hook no Componente

```typescript
export default function MinhaScreen() {
  const colorScheme = useColorScheme();
  const colors = getThemeColors(colorScheme);
  
  // ... resto do código
}
```

### Passo 3: Criar Factory Function para Estilos Dinâmicos

```typescript
const createDynamicStyles = (colors: ReturnType<typeof getThemeColors>) => ({
  card: {
    backgroundColor: colors.cardBackground,
    borderColor: colors.border,
  },
  text: {
    color: colors.text,
  },
  // Adicione mais estilos conforme necessário
});
```

### Passo 4: Usar no JSX

```typescript
<View style={[styles.container, { backgroundColor: colors.background }]}>
  <Text style={[styles.title, { color: colors.text }]}>
    Título
  </Text>
  <View style={[styles.card, dynamicStyles.card]}>
    <Text style={[styles.cardText, { color: colors.textSecondary }]}>
      Conteúdo do Card
    </Text>
  </View>
</View>
```

### Passo 5: Manter StyleSheet Base

```typescript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    // NÃO adicione backgroundColor aqui - use dinâmico
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    // NÃO adicione color aqui - use dinâmico
  },
  card: {
    borderRadius: 10,
    padding: 15,
    elevation: 3,
    // NÃO adicione backgroundColor ou borderColor - use dinâmico
  },
  // Estilos estáticos apenas
});
```

---

## 📋 Checklist de Migração

- [ ] Adicionar imports (useColorScheme, getThemeColors)
- [ ] Adicionar hook no componente
- [ ] Criar createDynamicStyles function
- [ ] Remover cores hardcoded de backgroundColor, color, borderColor
- [ ] Aplicar cores dinâmicas em todas as Views/Texts
- [ ] Testar em Light Mode
- [ ] Testar em Dark Mode
- [ ] Verificar contraste de cores legível

---

## 🎨 Exemplo Completo - Converter Tela Existente

### ❌ ANTES (Sem Dark Mode)

```typescript
import { StyleSheet, Text, View } from 'react-native';

export default function ListScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minha Lista</Text>
      <View style={styles.card}>
        <Text style={styles.cardText}>Item 1</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f5f9',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  card: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 15,
  },
  cardText: {
    color: '#333',
  },
});
```

### ✅ DEPOIS (Com Dark Mode)

```typescript
import { useColorScheme, StyleSheet, Text, View } from 'react-native';
import { getThemeColors } from '../../theme/theme';

export default function ListScreen() {
  const colorScheme = useColorScheme();
  const colors = getThemeColors(colorScheme);
  const dynamicStyles = createDynamicStyles(colors);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Minha Lista</Text>
      <View style={[styles.card, dynamicStyles.card]}>
        <Text style={[styles.cardText, { color: colors.textSecondary }]}>Item 1</Text>
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
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  card: {
    borderWidth: 1,
    padding: 15,
  },
  cardText: {
    // color será aplicado dinamicamente
  },
});
```

---

## 🔍 Sugestões Importantes

1. **Cores Brand**: Manter cores brand (roxo, laranja) iguais em ambos temas
2. **Contraste**: Sempre verificar acessibilidade e contraste
3. **Sombras**: Ajustar shadowColor para cores dinâmicas
4. **Gradients**: LinearGradient mantém cores brand, fundo varia
5. **Ícones**: Cores de ícones podem variar ou manter brand color

---

## 🐛 Testes

Ativar Dark Mode no dispositivo/emulador:
- **iOS**: Settings > Developer > Dark Mode
- **Android**: Settings > Display > Dark Theme

---

## 📚 Referências

- Arquivo de Temas: `theme/theme.ts`
- Template Reutilizável: `app/(tabs)/TemplateScreenDarkMode.tsx`
- Tela Exemplo: `app/(tabs)/home.tsx`
