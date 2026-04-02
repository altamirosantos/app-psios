import React from 'react';
import { OpaqueColorValue, StyleProp, ViewStyle } from 'react-native';

import { Entypo, Feather, MaterialIcons } from '@expo/vector-icons';
// Adicione aqui outras fontes que quiser usar

// Defina os ícones disponíveis com suas respectivas bibliotecas
const MAPPING = {
  'house.fill': { name: 'home', library: MaterialIcons },
  'paperplane.fill': { name: 'send', library: MaterialIcons },
  'chevron.left.forwardslash.chevron.right': { name: 'code', library: MaterialIcons },
  'chevron.right': { name: 'chevron-right', library: MaterialIcons },
  'rectangle.portrait.and.arrow.right.fill': { name: 'logout', library: MaterialIcons },
  'creditcard': { name: 'credit', library: Entypo },

  // Exemplo usando Entypo:
  'credit': { name: 'credit', library: Entypo },

  // Exemplo usando Feather:
  'settings': { name: 'settings', library: Feather },
} as const;

export type IconSymbolName = keyof typeof MAPPING;

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<ViewStyle>;
}) {
  const icon = MAPPING[name];

  if (!icon) {
    console.warn(`Ícone "${name}" não encontrado no mapeamento.`);
    return null;
  }

  const IconComponent = icon.library;
  return (
    <IconComponent
      name={icon.name as any}
      size={size}
      color={color}
      style={style}
    />
  );
}
