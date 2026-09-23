import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';

interface CycleSwitcherProps {
  selectedCycle: 'MENSAL' | 'ANUAL';
  onCycleChange: (cycle: 'MENSAL' | 'ANUAL') => void;
  containerStyle?: ViewStyle;
  activeColor?: string;
  inactiveColor?: string;
  textColor?: string;
}

export const CycleSwitcher: React.FC<CycleSwitcherProps> = ({
  selectedCycle,
  onCycleChange,
  containerStyle,
  activeColor = '#3399ff',
  inactiveColor = '#e0e0e0',
  textColor = '#000',
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <TouchableOpacity
        style={[
          styles.cycleButton,
          {
            backgroundColor: selectedCycle === 'MENSAL' ? activeColor : inactiveColor,
          },
        ]}
        onPress={() => onCycleChange('MENSAL')}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.cycleText,
            {
              color: selectedCycle === 'MENSAL' ? '#fff' : textColor,
              fontWeight: selectedCycle === 'MENSAL' ? '700' : '600',
            },
          ]}
        >
          MENSAL
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.cycleButton,
          {
            backgroundColor: selectedCycle === 'ANUAL' ? activeColor : inactiveColor,
          },
        ]}
        onPress={() => onCycleChange('ANUAL')}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.cycleText,
            {
              color: selectedCycle === 'ANUAL' ? '#fff' : textColor,
              fontWeight: selectedCycle === 'ANUAL' ? '700' : '600',
            },
          ]}
        >
          ANUAL
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 4,
    marginBottom: 20,
    marginHorizontal: 16,
  },
  cycleButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
  },
  cycleText: {
    fontSize: 14,
    letterSpacing: 0.5,
  },
});
