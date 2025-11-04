import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from "expo-router";
import React from "react";
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { LineChart, ProgressChart } from "react-native-chart-kit";

export default function RelatoriosBemEstarScreen() {
  const screenWidth = Dimensions.get("window").width - 40;

  return (
    <View style={styles.containerRoot}>
      {/* TOPO COM GRADIENTE */}
      <LinearGradient colors={['#9333ea', '#d763f8']} style={styles.headerGradient}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sono e Relaxamento</Text>
      </LinearGradient>

    <ScrollView
      style={{ flex: 1, backgroundColor: "#f5f7fa" }}
      contentContainerStyle={{ padding: 20, alignItems: "center" }}
    >

      {/* Evolução do Humor */}
      <View
        style={{
          backgroundColor: "#fff",
          borderRadius: 16,
          padding: 16,
          marginBottom: 20,
          width: "100%",
          elevation: 3,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 10 }}>
          Evolução do Humor
        </Text>
        <LineChart
          data={{
            labels: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
            datasets: [{ data: [3, 4, 3, 5, 4, 4, 5] }],
          }}
          width={screenWidth}
          height={220}
          yAxisSuffix=""
          yAxisInterval={1}
          chartConfig={{
            backgroundColor: "#6a82fb",
            backgroundGradientFrom: "#6a82fb",
            backgroundGradientTo: "#fc5c7d",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: { borderRadius: 16 },
            propsForDots: {
              r: "5",
              strokeWidth: "2",
              stroke: "#fff",
            },
          }}
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
      </View>

      {/* Nível de Ansiedade */}
      <View
        style={{
          backgroundColor: "#fff",
          borderRadius: 16,
          padding: 16,
          marginBottom: 20,
          width: "100%",
          elevation: 3,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 10 }}>
          Nível de Ansiedade
        </Text>
        <ProgressChart
          data={{
            labels: ["Baixo", "Médio", "Alto"],
            data: [0.7, 0.4, 0.2],
          }}
          width={screenWidth}
          height={200}
          strokeWidth={16}
          radius={32}
          chartConfig={{
            backgroundGradientFrom: "#43cea2",
            backgroundGradientTo: "#185a9d",
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          }}
          hideLegend={false}
          style={{
            borderRadius: 16,
          }}
        />
      </View>

      {/* Autoavaliação Geral */}
      <View
        style={{
          backgroundColor: "#fff",
          borderRadius: 16,
          padding: 16,
          width: "100%",
          elevation: 3,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 10 }}>
          Autoavaliação Geral
        </Text>
        <LineChart
          data={{
            labels: ["Semana 1", "Semana 2", "Semana 3", "Semana 4"],
            datasets: [{ data: [4, 3, 5, 4] }],
          }}
          width={screenWidth}
          height={220}
          chartConfig={{
            backgroundColor: "#11998e",
            backgroundGradientFrom: "#11998e",
            backgroundGradientTo: "#38ef7d",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            propsForDots: {
              r: "5",
              strokeWidth: "2",
              stroke: "#fff",
            },
          }}
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
      </View>
    </ScrollView>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  containerRoot: { flex: 1, backgroundColor: '#f9f9ff' },
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: { marginRight: 10 },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  scrollContent: { padding: 20, alignItems: 'center' },
  banner: { width: width * 0.8, height: 180, marginBottom: 20 },
  descricao: {
    color: '#444',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  subtitulo: {
    color: '#333',
    fontSize: 20,
    fontWeight: '600',
    alignSelf: 'flex-start',
    marginVertical: 10,
  },
  cardExercicio: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    width: width * 0.9,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  exercicioIcone: { width: 50, height: 50, marginRight: 15 },
  exercicioTitulo: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  exercicioInfo: { fontSize: 13, color: '#666', marginTop: 3 },
  dicaContainer: {
    backgroundColor: '#e0e7ff',
    borderLeftWidth: 4,
    borderLeftColor: '#5e60ce',
    padding: 15,
    borderRadius: 10,
    width: width * 0.9,
    marginTop: 20,
  },
  dicaTitulo: { color: '#5e60ce', fontWeight: '700', marginBottom: 5 },
  dicaTexto: { color: '#333', lineHeight: 20 },
});
