import { FontAwesome } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const moods = [
  { label: 'Muito triste', icon: 'frown-o', color: '#d9534f' },
  { label: 'Triste', icon: 'meh-o', color: '#f0ad4e' },
  { label: 'Neutro', icon: 'meh', color: '#5bc0de' },
  { label: 'Feliz', icon: 'smile-o', color: '#5cb85c' },
  { label: 'Muito feliz', icon: 'smile', color: '#4cae4c' },
];

export default function MoodSelector() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Como você está se sentindo hoje?</Text>

      <View style={styles.moodContainer}>
        {moods.map((mood, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.moodItem,
              selectedMood === index && { backgroundColor: '#e6f2ff' },
            ]}
            onPress={() => setSelectedMood(index)}
          >
            <FontAwesome
              name={mood.icon as any}
              size={40}
              color={selectedMood === index ? mood.color : '#777'}
            />
            <Text style={styles.label}>{mood.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    paddingHorizontal: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 30,
  },
  moodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  moodItem: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 12,
  },
  label: {
    marginTop: 5,
    fontSize: 12,
    color: '#444',
    textAlign: 'center',
  },
});
