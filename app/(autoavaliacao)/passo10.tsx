import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const mirrors = [
  { id: 'happy', label: 'Feliz', image: require('../../assets/images/react-logo.png') },
  { id: 'empty', label: 'Vazio', image: require('../../assets/images/react-logo.png') },
  { id: 'broken', label: 'Quebrado', image: require('../../assets/images/react-logo.png') },
  { id: 'growth', label: 'Crescimento', image: require('../../assets/images/react-logo.png') },
  { id: 'calm', label: 'Calmo', image: require('../../assets/images/react-logo.png') },
];

export default function MirrorSelectionScreen() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <LinearGradient colors={['#9333ea', '#d763f8']} style={styles.containerRoot}>
      <View style={styles.container}>
        {mirrors.map((mirror) => (
          <TouchableOpacity
            key={mirror.id}
            style={[
              styles.button,
              selected === mirror.id && styles.selectedButton,
            ]}
            onPress={() => setSelected(mirror.id)}
          >
            <Image source={mirror.image} style={styles.image} resizeMode="contain" />
            <Text style={styles.label}>{mirror.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  containerRoot: {
    flex: 1,
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  button: {
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: 16,
    padding: 10,
  },
  selectedButton: {
    borderColor: '#4CAF50',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  image: {
    width: 80,
    height: 100,
  },
  label: {
    marginTop: 8,
    fontSize: 14,
    color: '#333',
  },
});
