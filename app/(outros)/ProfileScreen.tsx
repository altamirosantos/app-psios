import { Feather, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
// import { supabase } from '@/lib/supabase'; // descomente e ajuste caso use Supabase

const SESSION_KEY = 'app_user_session_id';

type Profile = {
  id: string;
  username?: string | null;
  fullName?: string | null;
  avatarUrl?: string | null;
  bio?: string | null;
  posts?: number;
  followers?: number;
  following?: number;
};

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      // Garante uma sessão local (exemplo do modelo). Substitua por autenticação real.
      let stored = await AsyncStorage.getItem(SESSION_KEY);
      if (!stored) {
        stored = Date.now().toString();
        await AsyncStorage.setItem(SESSION_KEY, stored);
      }

      // TODO: Substituir por chamada real ao backend (Supabase / sua API)
      // Exemplo fictício de fetch/espera
      await new Promise(res => setTimeout(res, 700));

      // Simula perfil retornado do backend
      const fakeProfile: Profile = {
        id: stored,
        username: 'dev_exemplo',
        fullName: 'João Silva',
        avatarUrl: null, // coloque uma URL real para testar imagem
        bio: 'Desenvolvedor mobile • Apaixonado por UX e interfaces clean',
        posts: 28,
        followers: 1240,
        following: 305,
      };

      setProfile(fakeProfile);
      setLoading(false);
    };

    bootstrap();
  }, []);

  const initials = useMemo(() => {
    const source = profile?.username || profile?.fullName || 'U';
    return source
      .split(' ')
      .map(s => s[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }, [profile]);

  const handleLogout = async () => {
    // Exemplo de limpeza de sessão local. Adapte para sua estratégia de logout.
    await AsyncStorage.removeItem(SESSION_KEY);
    // se usar Supabase: await supabase.auth.signOut();
    Alert.alert('Logout', 'Sessão encerrada. Implemente navegação para tela pública.');
  };

  const handleEdit = () => {
    Alert.alert('Editar perfil', 'Abra sua tela de edição aqui.');
  };

  const handleToggleFavorite = () => setIsFavorited(v => !v);

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <LinearGradient
          colors={[colors.gradientStart, colors.gradientEnd]}
          style={[styles.header, { paddingTop: insets.top + 18 }]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerInner}>
            <Text style={styles.headerTitle}>Perfil</Text>
          </View>
        </LinearGradient>

        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.gradientStart} />
          <Text style={styles.loadingText}>Carregando perfil...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientEnd]}
        style={[styles.header, { paddingTop: insets.top + 18 }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerInner}>
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="arrow-left" size={26} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Perfil</Text>
          <View style={{ width: 26 }} />
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.topRow}>
            {profile?.avatarUrl ? (
              <Image source={{ uri: profile.avatarUrl }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Text style={styles.avatarInitials}>{initials}</Text>
              </View>
            )}

            <View style={styles.info}>
              <Text style={styles.username}>{profile?.username ?? 'Usuário'}</Text>
              {profile?.fullName ? <Text style={styles.fullName}>{profile.fullName}</Text> : null}
              <Text style={styles.bio} numberOfLines={2}>{profile?.bio}</Text>
            </View>

            <TouchableOpacity style={styles.edit} onPress={handleEdit}>
              <Feather name="edit-2" size={16} color={colors.gradientStart} />
            </TouchableOpacity>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{profile?.posts ?? 0}</Text>
              <Text style={styles.statLabel}>Publicações</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{profile?.followers ?? 0}</Text>
              <Text style={styles.statLabel}>Seguidores</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{profile?.following ?? 0}</Text>
              <Text style={styles.statLabel}>Seguindo</Text>
            </View>
          </View>

          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Seguir</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Mensagem</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.menuSection}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => Alert.alert('Configurações', 'Abrir configurações.')}
          >
            <View style={styles.menuLeft}>
              <Feather name="settings" size={18} color="#6b6b6b" />
              <Text style={styles.menuText}>Configurações</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#cfcfcf" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => Alert.alert('Privacidade', 'Abrir privacidade.')}
          >
            <View style={styles.menuLeft}>
              <Feather name="shield" size={18} color="#6b6b6b" />
              <Text style={styles.menuText}>Privacidade</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#cfcfcf" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => Alert.alert('Ajuda', 'Abrir ajuda e suporte.')}
          >
            <View style={styles.menuLeft}>
              <Feather name="help-circle" size={18} color="#6b6b6b" />
              <Text style={styles.menuText}>Ajuda & Suporte</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#cfcfcf" />
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
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
    width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
  },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '700' },
  iconBtn: { padding: 8, marginLeft: 8 },

  container: { paddingHorizontal: 16, paddingTop: 18, paddingBottom: 30 },

  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 3,
  },

  topRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 86, height: 86, borderRadius: 18, backgroundColor: '#eee' },
  avatarPlaceholder: { alignItems: 'center', justifyContent: 'center' },
  avatarInitials: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 22,
    backgroundColor: colors.gradientStart,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },

  info: { flex: 1, marginLeft: 14 },
  username: { fontSize: 18, fontWeight: '700', color: '#111' },
  fullName: { fontSize: 13, color: '#666', marginTop: 4 },
  bio: { fontSize: 13, color: '#666', marginTop: 8 },

  edit: {
    marginLeft: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },

  statsRow: { flexDirection: 'row', marginTop: 18, justifyContent: 'space-between' },
  stat: { alignItems: 'center', flex: 1 },
  statNumber: { fontWeight: '700', fontSize: 16, color: '#111' },
  statLabel: { fontSize: 12, color: '#8b8b8b', marginTop: 4 },

  actionsRow: { flexDirection: 'row', marginTop: 16, gap: 12 },
  primaryButton: {
    flex: 1,
    backgroundColor: colors.gradientStart,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: { color: '#fff', fontWeight: '700' },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButtonText: { color: '#333', fontWeight: '600' },

  menuSection: { marginTop: 18 },
  menuItem: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  menuText: { fontSize: 15, color: '#333' },

  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { marginTop: 12, color: '#666' },
});