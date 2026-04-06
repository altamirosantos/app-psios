// 🧩 Componentes Customizados com Dark Mode
// Arquivo: components/ThemedComponents.ts
// Reutilize esses componentes em suas telas

import { useAppTheme } from '@/theme/themeUtils';
import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

/**
 * ✅ Componente: Card Temático
 * Uso: <ThemedCard>Conteúdo</ThemedCard>
 */
export const ThemedCard = ({ children, style }: any) => {
  const { colors } = useAppTheme();
  return (
    <View
      style={[
        {
          backgroundColor: colors.cardBackground,
          borderColor: colors.border,
          borderWidth: 1,
          borderRadius: 12,
          padding: 16,
          marginVertical: 8,
          shadowColor: colors.text,
          shadowOpacity: 0.05,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 2 },
          elevation: 3,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

/**
 * ✅ Componente: Botão Temático
 * Uso: <ThemedButton title="Clique" onPress={...} />
 */
export const ThemedButton = ({ title, onPress, style, variant = 'primary' }: { title: string; onPress: () => void; style?: any; variant?: 'primary' | 'secondary' | 'danger' }) => {
  const { colors } = useAppTheme();
  
  const variants = {
    primary: {
      backgroundColor: '#9333ea',
      color: '#fff',
    },
    secondary: {
      backgroundColor: colors.cardBackground,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
    },
    danger: {
      backgroundColor: '#ef4444',
      color: '#fff',
    },
  };

  const variantStyle = variants[variant as 'primary' | 'secondary' | 'danger'];

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        {
          paddingVertical: 12,
          paddingHorizontal: 24,
          borderRadius: 20,
          justifyContent: 'center',
          alignItems: 'center',
          ...variantStyle,
        },
        style,
      ]}
    >
      <Text style={{ color: variantStyle.color, fontWeight: '600', fontSize: 16 }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

/**
 * ✅ Componente: Input Temático
 * Uso: <ThemedInput placeholder="Email" value={...} onChangeText={...} />
 */
export const ThemedInput = ({ placeholder, value, onChangeText, style, ...props }: any) => {
  const { colors } = useAppTheme();
  
  return (
    <TextInput
      style={[
        {
          backgroundColor: colors.inputBackground,
          color: colors.text,
          borderColor: colors.border,
          borderWidth: 1,
          borderRadius: 8,
          padding: 12,
          fontSize: 14,
          placeholderTextColor: colors.placeholder,
        },
        style,
      ]}
      placeholder={placeholder}
      placeholderTextColor={colors.placeholder}
      value={value}
      onChangeText={onChangeText}
      {...props}
    />
  );
};

/**
 * ✅ Componente: Texto com Estilos
 * Uso: <ThemedText variant="title">Título</ThemedText>
 */
export const ThemedText = ({ variant = 'body', style, children }: { variant?: 'h1' | 'h2' | 'h3' | 'title' | 'subtitle' | 'body' | 'caption' | 'link'; style?: any; children: React.ReactNode }) => {
  const { colors } = useAppTheme();

  const variants = {
    h1: { fontSize: 32, fontWeight: 'bold', color: colors.text },
    h2: { fontSize: 26, fontWeight: 'bold', color: colors.text },
    h3: { fontSize: 22, fontWeight: 'bold', color: colors.text },
    title: { fontSize: 20, fontWeight: 'bold', color: colors.text },
    subtitle: { fontSize: 16, fontWeight: '600', color: colors.textSecondary },
    body: { fontSize: 14, color: colors.text },
    caption: { fontSize: 12, color: colors.textTertiary },
    link: { fontSize: 14, color: colors.link, textDecorationLine: 'underline' },
  };

  return (
    <Text style={[variants[variant as 'h1' | 'h2' | 'h3' | 'title' | 'subtitle' | 'body' | 'caption' | 'link'], style]}>
      {children}
    </Text>
  );
};

/**
 * ✅ Componente: Divider Temático
 * Uso: <ThemedDivider />
 */
export const ThemedDivider = ({ style }: any) => {
  const { colors } = useAppTheme();
  return (
    <View
      style={[
        {
          height: 1,
          backgroundColor: colors.borderLight,
          marginVertical: 16,
        },
        style,
      ]}
    />
  );
};

/**
 * ✅ Componente: Status Badge
 * Uso: <ThemedBadge status="success">Ativo</ThemedBadge>
 */
export const ThemedBadge = ({ status = 'info', children, style }: { status?: 'success' | 'error' | 'warning' | 'info'; children: React.ReactNode; style?: any }) => {
  const { colors } = useAppTheme();

  const statusColors = {
    success: { bg: '#10b981', text: '#059669' },
    error: { bg: '#ef4444', text: '#991b1b' },
    warning: { bg: '#f59e0b', text: '#92400e' },
    info: { bg: '#3b82f6', text: '#1e40af' },
  };

  const { bg, text } = statusColors[status as 'success' | 'error' | 'warning' | 'info'];

  return (
    <View
      style={[
        {
          backgroundColor: bg + '20',
          borderColor: bg,
          borderWidth: 1,
          borderRadius: 8,
          paddingVertical: 6,
          paddingHorizontal: 12,
        },
        style,
      ]}
    >
      <Text style={{ color: text, fontSize: 12, fontWeight: '600' }}>
        {children}
      </Text>
    </View>
  );
};

/**
 * ✅ Componente: Container Temático
 * Uso: <ThemedContainer>Conteúdo</ThemedContainer>
 */
export const ThemedContainer = ({ children, style }: any) => {
  const { colors } = useAppTheme();
  
  return (
    <View
      style={[
        {
          flex: 1,
          backgroundColor: colors.background,
          padding: 16,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

/**
 * ✅ Componente: Section com Título
 * Uso: <ThemedSection title="Configurações">Conteúdo</ThemedSection>
 */
export const ThemedSection = ({ title, children, style }: any) => {
  const { colors } = useAppTheme();

  return (
    <View style={[{ marginVertical: 16 }, style]}>
      {title && (
        <Text
          style={{
            fontSize: 16,
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: 12,
            marginHorizontal: 4,
          }}
        >
          {title}
        </Text>
      )}
      {children}
    </View>
  );
};

/**
 * ✅ Componente: Modal Header Temático
 * Uso: <ThemedModalHeader title="Título" onClose={...} />
 */
export const ThemedModalHeader = ({ title, onClose }: any) => {
  const { colors } = useAppTheme();

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 16,
        borderBottomColor: colors.borderLight,
        borderBottomWidth: 1,
      }}
    >
      <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.text }}>
        {title}
      </Text>
      <TouchableOpacity onPress={onClose}>
        <Text style={{ fontSize: 24, color: colors.text }}>✕</Text>
      </TouchableOpacity>
    </View>
  );
};

/* 
📋 RESUMO DOS COMPONENTES

Disponíveis:
✅ ThemedCard - Card com fundo temático
✅ ThemedButton - Botão com variantes (primary, secondary, danger)
✅ ThemedInput - Campo de input temático
✅ ThemedText - Texto com variantes de estilo
✅ ThemedDivider - Linha divisória
✅ ThemedBadge - Badge de status
✅ ThemedContainer - Container raiz temático
✅ ThemedSection - Seção com título
✅ ThemedModalHeader - Header de modal

Uso Rápido:

import {
  ThemedCard,
  ThemedButton,
  ThemedInput,
  ThemedText,
} from '@/components/ThemedComponents';

export default function MyScreen() {
  return (
    <ThemedContainer>
      <ThemedText variant="title">Meu Título</ThemedText>
      <ThemedCard>
        <ThemedInput placeholder="Digite algo..." />
        <ThemedButton title="Enviar" onPress={() => {}} />
      </ThemedCard>
    </ThemedContainer>
  );
}
*/
