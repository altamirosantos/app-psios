import { supabase } from '@/lib/supabase';
import { Feather } from '@expo/vector-icons';
import { Audio, Video } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Tipagem básica esperada
// resource: { id, title, description, type, url, thumbnail, created_at }

export default function ResourcesScreen() {
  const insets = useSafeAreaInsets();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState<'all'|'text'|'video'|'audio'>('all');

  // modal / detalhe
  const [selected, setSelected] = useState(null);
  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    fetchResources();

    // opcional: real-time subscription (descomente se quiser usar)
    // const subscription = supabase
    //   .from('resources')
    //   .on('*', payload => fetchResources())
    //   .subscribe();
    // return () => supabase.removeSubscription(subscription);
  }, []);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const { any:data, error } = await supabase
        .from('resources')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setResources(data || []);
      setError(null);
    } catch (err:any) {
      console.warn('Erro ao buscar resources', err);
      setError(err.message || 'Erro ao buscar dados');
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    if (filter === 'all') return resources;
    return resources.filter(r => (r.type || '').toLowerCase() === filter);
  }, [resources, filter]);

  const openDetail = async (item:any) => {
    setSelected(item);
    // pré-carregar áudio se necessário
    if (item?.type === 'audio') {
      try {
        if (soundRef.current) {
          await soundRef.current.unloadAsync();
          soundRef.current = null;
        }
        const { sound } = await Audio.Sound.createAsync({ uri: item.url }, { shouldPlay: false });
        soundRef.current = sound;
      } catch (e) {
        console.warn('Erro carregando áudio', e);
      }
    }
  };

  const closeDetail = async () => {
    if (soundRef.current) {
      try {
        await soundRef.current.unloadAsync();
      } catch (e) { /* ignore */ }
      soundRef.current = null;
    }
    setSelected(null);
  };

  const togglePlayAudio = async () => {
    if (!soundRef.current) return;
    const status = await soundRef.current.getStatusAsync();
    if (status.isPlaying) {
      await soundRef.current.pauseAsync();
    } else {
      await soundRef.current.playAsync();
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => openDetail(item)}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {item.thumbnail ? (
          <Image source={{ uri: item.thumbnail }} style={styles.thumb} />
        ) : (
          <View style={[styles.thumb, styles.thumbPlaceholder]}>
            <Feather name={item.type === 'video' ? 'video' : item.type === 'audio' ? 'music' : 'file-text'} size={22} color="#fff" />
          </View>
        )}
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.title}>{item.title}</Text>
          {item.description ? <Text style={styles.desc} numberOfLines={2}>{item.description}</Text> : null}
          <View style={{ flexDirection: 'row', marginTop: 8, alignItems: 'center' }}>
            <View style={styles.badge}><Text style={styles.badgeText}>{(item.type || 'text').toUpperCase()}</Text></View>
            <Text style={styles.date}>{formatDate(item.created_at)}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientEnd]}
        style={[styles.header, { paddingTop: insets.top + 18 }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerInner}>
          <Text style={styles.headerTitle}>Resources</Text>
          <TouchableOpacity onPress={fetchResources} style={{ padding: 6 }}>
            <Feather name="refresh-ccw" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.container}>
        <View style={{ flexDirection: 'row', marginBottom: 12, gap: 8 }}>
          {['all','text','video','audio'].map(t => (
            <TouchableOpacity
              key={t}
              onPress={() => setFilter(t === 'all' ? 'all' : t)}
              style={[
                styles.filterBtn,
                filter === (t === 'all' ? 'all' : t) ? styles.filterActive : styles.filterInactive,
              ]}
            >
              <Text style={[styles.filterText, filter === (t === 'all' ? 'all' : t) ? { color: '#fff' } : { color: '#333' }]}>
                {t.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {loading ? (
          <View style={styles.center}><ActivityIndicator size="large" color={colors.gradientStart} /><Text style={{ marginTop: 10, color: '#666' }}>Carregando...</Text></View>
        ) : error ? (
          <View style={styles.center}><Text style={{ color: 'red' }}>{error}</Text></View>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(i) => String(i.id)}
            renderItem={renderItem}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            contentContainerStyle={{ paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      <Modal visible={!!selected} animationType="slide" onRequestClose={closeDetail}>
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
          <LinearGradient
            colors={[colors.gradientStart, colors.gradientEnd]}
            style={[styles.header, { paddingTop: insets.top + 18 }]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.headerInner}>
              <TouchableOpacity onPress={closeDetail}><Feather name="arrow-left" size={26} color="#fff" /></TouchableOpacity>
              <Text style={styles.headerTitle}>{selected?.title ?? 'Detalhe'}</Text>
              <View style={{ width: 26 }} />
            </View>
          </LinearGradient>

          <View style={{ padding: 16 }}>
            {selected?.thumbnail ? <Image source={{ uri: selected.thumbnail }} style={styles.detailThumb} /> : null}

            <Text style={[styles.title, { marginTop: 12 }]}>{selected?.title}</Text>
            {selected?.description ? <Text style={styles.desc}>{selected.description}</Text> : null}

            {/* Viewer por tipo */}
            {selected?.type === 'video' && selected?.url ? (
              <View style={{ marginTop: 16 }}>
                <Video
                  source={{ uri: selected.url }}
                  style={{ width: '100%', height: 220, borderRadius: 12, backgroundColor: '#000' }}
                  useNativeControls
                  resizeMode="contain"
                />
              </View>
            ) : selected?.type === 'audio' && selected?.url ? (
              <View style={{ marginTop: 16, alignItems: 'center' }}>
                <TouchableOpacity onPress={togglePlayAudio} style={styles.playBtn}>
                  <Feather name="play" size={20} color="#fff" />
                </TouchableOpacity>
                <Text style={{ marginTop: 8, color: '#666' }}>Toque para reproduzir / pausar</Text>
              </View>
            ) : selected?.type === 'text' ? (
              <View style={{ marginTop: 16 }}>
                <Text style={{ color: '#444', lineHeight: 20 }}>{selected?.description ?? 'Sem conteúdo de texto.'}</Text>
              </View>
            ) : null}
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

function formatDate(raw) {
  if (!raw) return '';
  try {
    const d = new Date(raw);
    return d.toLocaleDateString();
  } catch (e) { return '' }
}

const colors = {
  gradientStart: '#9333ea',
  gradientEnd: '#d763f8',
  background: '#F7F7FA',
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { paddingBottom: 18, alignItems: 'center' },
  headerInner: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '700' },
  container: { paddingHorizontal: 16, paddingTop: 18, paddingBottom: 30 },

  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 3,
  },
  thumb: { width: 86, height: 68, borderRadius: 10, backgroundColor: '#eee' },
  thumbPlaceholder: { alignItems: 'center', justifyContent: 'center', backgroundColor: '#8b5cf6' },
  title: { fontSize: 16, fontWeight: '700', color: '#111' },
  desc: { fontSize: 13, color: '#666', marginTop: 6 },
  badge: { backgroundColor: '#f3f4f6', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  badgeText: { fontSize: 11, color: '#333', fontWeight: '700' },
  date: { fontSize: 12, color: '#9ca3af', marginLeft: 10 },

  filterBtn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 12 },
  filterActive: { backgroundColor: colors.gradientStart },
  filterInactive: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#eee' },
  filterText: { fontWeight: '700' },

  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  detailThumb: { width: '100%', height: 200, borderRadius: 12 },
  playBtn: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.gradientStart, alignItems: 'center', justifyContent: 'center' },
});
