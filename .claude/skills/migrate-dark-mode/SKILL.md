---
name: migrate-dark-mode
description: Migra telas React Native existentes para suportar Dark Mode, transformando cores hardcoded em componentes responsivos ao tema dinâmico do projeto. Use quando precisar migrar uma tela com cores estáticas ou ao adicionar novas telas que devem suportar ambos os temas.
compatibility: React Native com sistema de cores do app-psios (theme/theme.ts)
metadata:
  version: "1.0"
  tags: ["dark-mode", "react-native", "theming"]
---

## 🎯 Quando Usar Esta Skill

Use esta skill quando:
- Você precisa migrar uma tela existente para suportar Dark Mode
- A tela tem cores hardcoded em `styles.js` ou inline
- Quer validar que a migração segue os padrões da rule `dark-mode.md`

## 📋 Checklist de Migração

Execute estes passos IN ORDER. Não pule nenhum.

### Fase 1: Preparação (2 min)

- [ ] Identificar a tela a migrar (ex: `app/(tabs)/assinatura.tsx`)
- [ ] Abrir a tela no editor
- [ ] Backup: Fazer commit do estado atual com `git add && git commit -m "backup: [screename] antes dark mode"`

### Fase 2: Adicionar Imports (1 min)

- [ ] Adicionar: `import { useColorScheme } from 'react-native';`
- [ ] Adicionar: `import { getThemeColors } from '../../theme/theme';` (ajustar path conforme necessário)
  - Contar quantas pastas acima: `../` para cada pasta acima de `app/`
  - Exemplo: `app/(tabs)/myscreen.tsx` → `../../theme/theme`
  - Exemplo: `app/(autoavaliacao)/myscreen.tsx` → `../../theme/theme`
  - Exemplo: `app/(auth)/subpasta/myscreen.tsx` → `../../../theme/theme`

**Validação:**
```bash
npm run lint
```

### Fase 3: Adicionar Hooks (1 min)

Dentro do component, adicionar APÓS `export default function ScreenName() {`:

```typescript
const colorScheme = useColorScheme();
const colors = getThemeColors(colorScheme);
```

**Validação:** Nenhuma cor vermelha de erro no editor.

### Fase 4: Criar Função de Estilos Dinâmicos (2 min)

Antes do export, ANTES de `const styles = StyleSheet.create()`, adicionar:

```typescript
const createDynamicStyles = (colors: ReturnType<typeof getThemeColors>) => ({
  // Aqui vão estilos que variam com o tema
  // Exemplo:
  // container: {
  //   backgroundColor: colors.background,
  // },
  // card: {
  //   backgroundColor: colors.cardBackground,
  //   borderColor: colors.border,
  // },
});
```

**O quê incluir nesta função:**
- `backgroundColor` que era branco ou cinza
- `color` que era preto ou cinza
- `borderColor` 
- `placeholderTextColor`
- Qualquer cor que varia entre light/dark

**O quê NÃO incluir:**
- Cores brand (`#9333ea`, `#FFA45E`)
- Tamanhos (`width`, `height`, `padding`, `margin`, `fontSize`)
- Estilos estruturais (`flexDirection`, `borderRadius`, etc)

### Fase 5: Substituir Cores Hardcoded (5-10 min)

Para cada componente, seguir este padrão:

#### 5a. View com background
**ANTES:**
```typescript
<View style={styles.container}>
```

**DEPOIS:**
```typescript
<View style={[styles.container, { backgroundColor: colors.background }]}>
```

#### 5b. Text com color
**ANTES:**
```typescript
<Text style={styles.title}>Título</Text>
```

**DEPOIS:**
```typescript
<Text style={[styles.title, { color: colors.text }]}>Título</Text>
```

#### 5c. Componentes com múltiplas cores dinâmicas
**ANTES:**
```typescript
<View style={styles.card}>
  <Text style={styles.cardText}>Conteúdo</Text>
</View>
```

**DEPOIS:**
```typescript
const dynamicStyles = createDynamicStyles(colors);
return (
  <View style={[styles.card, dynamicStyles.card]}>
    <Text style={[styles.cardText, { color: colors.textSecondary }]}>
      Conteúdo
    </Text>
  </View>
);
```

#### 5d. TextInput
**ANTES:**
```typescript
<TextInput 
  style={styles.input}
  placeholder="Digite algo"
  placeholderTextColor="#999"
/>
```

**DEPOIS:**
```typescript
<TextInput 
  style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.text }]}
  placeholder="Digite algo"
  placeholderTextColor={colors.placeholder}
/>
```

#### 5e. Modal
**ANTES:**
```typescript
<Modal>
  <View style={{ backgroundColor: '#fff' }}>
    {/* conteúdo */}
  </View>
</Modal>
```

**DEPOIS:**
```typescript
<Modal>
  <View style={[styles.modalContent, { backgroundColor: colors.cardBackground }]}>
    {/* conteúdo */}
  </View>
</Modal>
```

### Fase 6: Validação de Erros (2 min)

```bash
npm run lint
```

**Resolver erros comuns:**
- `colors is not defined` → Verificar se `useColorScheme()` e `getThemeColors()` foram adicionados
- `Module not found` → Ajustar o path do import `theme/theme`
- `getThemeColors is not a function` → Verificar se `getThemeColors` está exportado em `theme/theme.ts`

### Fase 7: Teste em Light Mode (3 min)

1. Abrir o app em simulator/device
2. Settings → Display → Light Mode
3. Navegar para a tela migrada
4. Verificar:
   - [ ] Background está branco/cinza claro
   - [ ] Texto está legível (preto ou cinza escuro)
   - [ ] Cards têm contraste bom
   - [ ] Nenhuma cor hardcoded visível
   - [ ] Inputs visíveis e funcionam

### Fase 8: Teste em Dark Mode (3 min)

1. Settings → Display → Dark Mode
2. Navegar para a tela migrada
3. Verificar:
   - [ ] Background está cinza/preto escuro
   - [ ] Texto está legível (branco ou cinza claro)
   - [ ] Cards têm contraste bom
   - [ ] Nenhuma cor hardcoded visível (ex: branco sobre branco)
   - [ ] Inputs visíveis e funcionam
   - [ ] Cores brand (#9333ea, #FFA45E) continuam iguais

### Fase 9: Validação de Acessibilidade (2 min)

Para cada texto, verificar contraste:

| Elemento | Light Mode | Dark Mode |
|---|---|---|
| Título principal | `colors.text` | `colors.text` |
| Texto corpo | `colors.text` | `colors.text` |
| Texto secundário | `colors.textSecondary` | `colors.textSecondary` |

Usar ferramenta online: [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

- [ ] Títulos: 4.5:1 mínimo (WCAG AA)
- [ ] Texto corpo: 4.5:1 mínimo
- [ ] Ícones: 3:1 mínimo

### Fase 10: Commit e Conclusão (1 min)

```bash
git add app/(pasta)/sua-tela.tsx
git commit -m "feat: dark mode para [SCREEN_NAME]"
```

## 📚 Exemplo Prático: Migração Completa

### Tela ANTES

```typescript
// app/(tabs)/assinatura.tsx
import { View, Text, StyleSheet } from 'react-native';

export default function AssinaturaScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minha Assinatura</Text>
      
      <View style={styles.card}>
        <Text style={styles.cardText}>Status: Ativo</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f5f9',  // ❌ Hardcoded light
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',               // ❌ Hardcoded dark
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',     // ❌ Hardcoded white
    borderColor: '#ccc',         // ❌ Hardcoded grey
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
  },
  cardText: {
    fontSize: 14,
    color: '#666',               // ❌ Hardcoded grey
  },
});
```

### Tela DEPOIS (Migrada)

```typescript
// app/(tabs)/assinatura.tsx
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { getThemeColors } from '../../theme/theme'; // ✅ ADICIONADO

export default function AssinaturaScreen() {
  // ✅ ADICIONADO
  const colorScheme = useColorScheme();
  const colors = getThemeColors(colorScheme);
  const dynamicStyles = createDynamicStyles(colors);

  return (
    // ✅ MODIFICADO: backgroundColor dinâmica
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* ✅ MODIFICADO: color dinâmica */}
      <Text style={[styles.title, { color: colors.text }]}>
        Minha Assinatura
      </Text>
      
      {/* ✅ MODIFICADO: estilos dinâmicos aplicados */}
      <View style={[styles.card, dynamicStyles.card]}>
        <Text style={[styles.cardText, { color: colors.textSecondary }]}>
          Status: Ativo
        </Text>
      </View>
    </View>
  );
}

// ✅ ADICIONADO: Função para estilos que variam
const createDynamicStyles = (colors: ReturnType<typeof getThemeColors>) => ({
  card: {
    backgroundColor: colors.cardBackground,
    borderColor: colors.border,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // ❌ REMOVIDO: backgroundColor (agora dinâmica)
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    // ❌ REMOVIDO: color (agora dinâmica)
    marginBottom: 16,
  },
  card: {
    // ❌ REMOVIDO: backgroundColor (agora dinâmica)
    // ❌ REMOVIDO: borderColor (agora dinâmica)
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
  },
  cardText: {
    fontSize: 14,
    // ❌ REMOVIDO: color (agora dinâmica)
  },
});
```

## 🔍 Checklist de Validação Final

Antes de fazer commit, verificar:

- [ ] Tela renderiza sem erros em Light Mode
- [ ] Tela renderiza sem erros em Dark Mode
- [ ] Nenhuma cor está hardcoded em `styles.js`
- [ ] `useColorScheme()` está sendo usado
- [ ] `getThemeColors()` está sendo importado corretamente
- [ ] `createDynamicStyles()` contém todas as cores variáveis
- [ ] Contraste está ok (WCAG AA: 4.5:1)
- [ ] `npm run lint` passa sem erros
- [ ] Commit foi feito com mensagem clara

## ⚠️ Armadilhas Comuns

| Armadilha | Solução |
|---|---|
| Esquecer `useColorScheme()` | Adicionar no topo do component |
| Import de `theme/theme` com path errado | Contar pastas acima e ajustar `../` |
| Deixar cores hardcoded em `styles` | Mover para `createDynamicStyles()` |
| Aplicar estilo dinâmico em View raiz | Usar `[styles.container, { backgroundColor: colors.background }]` |
| Esquecer `placeholderTextColor` em inputs | Sempre adicionar com `colors.placeholder` |
| Testar só em Light Mode | SEMPRE testar em ambos light/dark |
| Modificar cores brand accidentalmente | Manter `#9333ea` e `#FFA45E` sempre iguais |

## 📞 Referências

Consulte a documentação completa de Dark Mode na regra do projeto:
- **Rule**: `rules/dark-mode.md` - Padrões e cores do sistema
- **Exemplo**: `app/(tabs)/home.tsx` - Tela completa implementada
- **Cores**: `theme/theme.ts` - Definições das cores
