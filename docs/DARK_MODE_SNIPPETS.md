# 📖 Dark Mode - Snippets de Código Pronto

Copie e cole diretamente em suas telas!

## 🚀 Snippet 1: Tela Simples com Dark Mode

```typescript
// MyScreen.tsx
import { useColorScheme, View, Text, StyleSheet } from 'react-native';
import { getThemeColors } from '@/theme/theme';

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

---

## 🚀 Snippet 2: Tela com Cards

```typescript
import { useColorScheme, View, Text, StyleSheet } from 'react-native';
import { getThemeColors } from '@/theme/theme';

export default function CardScreen() {
  const colorScheme = useColorScheme();
  const colors = getThemeColors(colorScheme);
  const dynamicStyles = createDynamicStyles(colors);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Meus Cards</Text>
      
      <View style={[styles.card, dynamicStyles.card]}>
        <Text style={[styles.cardText, { color: colors.textSecondary }]}>
          Card 1
        </Text>
      </View>

      <View style={[styles.card, dynamicStyles.card]}>
        <Text style={[styles.cardText, { color: colors.textSecondary }]}>
          Card 2
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
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cardText: { fontSize: 14 },
});
```

---

## 🚀 Snippet 3: Usando Componentes Temáticos

```typescript
import { ThemedContainer, ThemedCard, ThemedButton, ThemedText } from '@/components/ThemedComponents';

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

---

## 🚀 Snippet 4: Tela com Input e Validação

```typescript
import { useState } from 'react';
import { useColorScheme, View, Text, StyleSheet } from 'react-native';
import { getThemeColors } from '@/theme/theme';

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

---

## 🚀 Snippet 5: Tela com Modal Temático

```typescript
import { useState } from 'react';
import { useColorScheme, View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { getThemeColors } from '@/theme/theme';

export default function ModalScreen() {
  const [visible, setVisible] = useState(false);
  const colorScheme = useColorScheme();
  const colors = getThemeColors(colorScheme);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TouchableOpacity 
        style={styles.button}
        onPress={() => setVisible(true)}
      >
        <Text style={styles.buttonText}>Abrir Modal</Text>
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalContent, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Modal Temático
            </Text>
            
            <Text style={[styles.modalText, { color: colors.textSecondary }]}>
              Este modal segue o tema do app!
            </Text>

            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setVisible(false)}
            >
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
  button: { 
    backgroundColor: '#9333ea', 
    paddingVertical: 12, 
    paddingHorizontal: 30, 
    borderRadius: 20 
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    borderRadius: 20,
    padding: 30,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  modalText: { fontSize: 14, marginBottom: 24, lineHeight: 20 },
  closeButton: {
    backgroundColor: '#FFA45E',
    paddingVertical: 12,
    borderRadius: 8,
  },
  closeButtonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
});
```

---

## 🎨 Snippet 6: Padrão ListScreen (Frequente)

```typescript
import React, { useState } from 'react';
import { useColorScheme, FlatList, View, Text, StyleSheet } from 'react-native';
import { getThemeColors } from '@/theme/theme';

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
      <Text style={[styles.itemTitle, { color: colors.text }]}>
        {item.title}
      </Text>
      <Text style={[styles.itemDesc, { color: colors.textSecondary }]}>
        {item.desc}
      </Text>
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
  item: {
    padding: 16,
    borderTopWidth: 1,
  },
  itemTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  itemDesc: { fontSize: 12 },
});
```

---

## 📋 Checklist Rápido

- [ ] Copiar código do snippet desejado
- [ ] Ajustar imports para seus caminhos
- [ ] Adicionar `useColorScheme()` e `getThemeColors()`
- [ ] Usar `[styles.name, { dynamicProp: colors.dynamicColor }]` para cores dinâmicas
- [ ] Testar em Light Mode
- [ ] Testar em Dark Mode
- [ ] Commit! ✅

---

## 💡 Pro Tips

1. **Use sempre** `[styles.container, { backgroundColor: colors.background }]` no View raiz
2. **TextInput** precisa de `placeholderTextColor={colors.placeholder}`
3. **Modal** sempre precisa de `backgroundColor: colors.cardBackground` no content
4. **Icons** com cores variáveis: `color={colors.text}`
5. **Gradients** mantêm cores, background externo varia

---

## 🚨 Erros Comuns

```javascript
❌ ERRADO: backgroundColor: '#fff' (hardcoded)
✅ CERTO: [{ backgroundColor: colors.cardBackground }]

❌ ERRADO: color: '#333' (sem considerar dark)
✅ CERTO: { color: colors.text }

❌ ERRADO: borderColor: '#ccc' (não funciona bem em dark)
✅ CERTO: { borderColor: colors.border }

❌ ERRADO: Não importar useColorScheme
✅ CERTO: import { useColorScheme } from 'react-native'
```

