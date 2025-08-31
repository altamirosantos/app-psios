import { supabase } from '@/lib/supabase';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

type Agenda = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  scheduled_at: string;
  status: string;
  created_at: string;
  updated_at: string;
};

export default function AgendaScreen() {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [agendas, setAgendas] = useState<Agenda[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | undefined>(undefined);
  const [markedDates, setMarkedDates] = useState<{ [key: string]: any }>({});

  useEffect(() => {
    const getAgendas = async () => {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      console.log('session >>>>>>  ', sessionData.session);
      const { data, error } = await supabase
        .from('agenda')
        .select('*')
        .eq('user_id', sessionData.session?.user.id);

      if (error) {
        console.error(error);
      } else {
        setAgendas(data);
        const marked:any = {};
        data.forEach((agenda) => {
          const date = agenda.scheduled_at.split('T')[0];
          if (!marked[date]) {
            marked[date] = { marked: true };
          }
        });
        setMarkedDates(marked);
      }
      setLoading(false);
    };

    getAgendas();
  }, []);

  const handleDayPress = (day: { dateString: string }) => {
    setSelectedDate(day.dateString);
  };

  const renderAgendaItem = ({ item }: { item: Agenda }) => (
    <View style={styles.card}>
      <Text style={styles.agendaTitle}>{item.title}</Text>
      <Text style={styles.agendaDescription}>{item.description}</Text>
      <Text style={styles.agendaStatus}>{item.status}</Text>
      <Text style={styles.agendaDate}>{new Date(item.scheduled_at).toLocaleString()}</Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <LinearGradient colors={['#9333ea', '#d763f8']} style={styles.header}>
          <Text style={styles.headerTitle}>Agendamentos</Text>
        </LinearGradient>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#9333ea" />
          <Text>Carregando agendamentos...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>

      <LinearGradient
        colors={['#9333ea', '#d763f8']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          {/* Botão voltar */}
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="arrow-left" size={26} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            Agendamentos
          </Text>
          {/* Placeholder p/ alinhar o título no centro */}
          <View style={{ width: 26 }} />
        </View>
      </LinearGradient>
      <Calendar
        onDayPress={handleDayPress}
        markedDates={markedDates}
        style={styles.calendar}
      />
      <FlatList
        data={agendas.filter(agenda => agenda.scheduled_at.split('T')[0] === selectedDate)}
        renderItem={renderAgendaItem}
        keyExtractor={(item) => item.id}
        style={styles.agendaList}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F7F7FA' },
  header: { padding: 16, alignItems: 'center' },
  headerTitle: { fontSize: 24, color: '#FFF', fontWeight: 'bold' },
  calendar: { marginBottom: 20 },
  agendaList: { paddingHorizontal: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  agendaTitle: { fontSize: 18, fontWeight: '600' },
  agendaDescription: { fontSize: 14, color: '#666' },
  agendaStatus: { fontSize: 12, color: '#999' },
  agendaDate: { fontSize: 12, color: '#999' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  headerContent: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
});