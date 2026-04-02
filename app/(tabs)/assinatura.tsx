import { useThemeColor } from '@/hooks/useThemeColor';
import { getPlanoAtivo, getPlanosDisponiveis, supabase } from '@/lib/supabase';
import { getThemeColors } from '@/theme/theme';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme
} from 'react-native';

export default function PlanosScreen() {
  const colorScheme = useColorScheme();
  const colors = getThemeColors(colorScheme);
  const dynamicStyles = createDynamicStyles(colors);
  
  const textColor = useThemeColor('text');
  const cardColor = useThemeColor('cardBackground');
  const placeholder = useThemeColor('placeholder');
  const inputBg = useThemeColor('inputBackground');

  const [planoAtivo, setPlanoAtivo] = useState<string | null>(null);
  const [planos, setPlanos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function carregar() {
      setLoading(true);
      setErro(null);

      try {
        const { data, error } = await supabase.auth.getSession();
        if (!data.session?.user?.id) {
          setErro('Usuário não autenticado.');
          return;
        }

        const planosDisponiveis = await getPlanosDisponiveis();
        const planoUser = await getPlanoAtivo(data.session.user.id);

        setPlanos(planosDisponiveis || []);
        setPlanoAtivo(planoUser);
      } catch (err) {
        console.error('Erro ao carregar planos:', err);
        setErro('Ocorreu um erro ao carregar os planos.');
      } finally {
        setLoading(false);
      }
    }

    carregar();
  }, []);

  if (loading) {
    return (
      <View style={[styles.loading, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color="#3399ff" />
        <Text style={{ marginTop: 12, color: colors.text }}>Carregando planos...</Text>
      </View>
    );
  }

  if (erro) {
    return (
      <View style={[styles.loading, { backgroundColor: colors.background }]}>
        <Text style={{ color: 'red' }}>{erro}</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={['#9333ea', '#d763f8']} style={styles.containerRoot}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Logo */}
        <View style={styles.containerLogo}>
          <Image
            source={require('@/assets/images/logo.png')} // Substitua por sua logo
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <Text style={[styles.titulo, { color: '#fff' }]}>Escolha o plano ideal para suas necessidades</Text>
        {planos.map((plano) => (
          <View
            key={plano.id}
            style={[
              styles.planoCard,
              dynamicStyles.planoCard,
              plano.id === planoAtivo ? [styles.planoAtivo, dynamicStyles.planoAtivo] : null,
            ]}
          >
            <Text style={[styles.nome, { color: colors.text }]}>{plano.nome}</Text>
            <Text style={[styles.descricao, { color: colors.textSecondary }]}>{plano.descricao}</Text>
            <Text style={styles.valor}>R$ {Number(plano.valor).toFixed(2)}</Text>
            {Array.isArray(plano.beneficios) ? (
              plano.beneficios.map((b: string, index: number) => (
                <Text key={index} style={[styles.beneficio, { color: colors.text }]}>
                  • {b}
                </Text>
              ))
            ) : (
              <>
                {JSON.parse(plano.beneficios || '[]').map((b: string, index: number) => (
                  <Text key={index} style={[styles.beneficio, { color: colors.text }]}>
                    • {b}
                  </Text>
                ))}
              </>
            )}
            {plano.id === planoAtivo && (
              <Text style={styles.ativo}>✅ Seu plano atual</Text>
            )}
          </View>
        ))}
      </ScrollView>
    </LinearGradient>
  );
}

// 🎨 Factory function para criar estilos dinâmicos baseados no tema
const createDynamicStyles = (colors: ReturnType<typeof getThemeColors>) => ({
  planoCard: {
    backgroundColor: colors.cardBackground,
    borderColor: colors.borderLight,
    shadowColor: colors.text,
    shadowOpacity: 0.05,
  },
  planoAtivo: {
    backgroundColor: colors.cardBackground,
    borderColor: '#3399ff',
    borderWidth: 2,
  },
});

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  container: {
    padding: 16,
    paddingBottom: 32,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#fff'
  },
  planoCard: {
    marginBottom: 16,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  planoAtivo: {
    borderWidth: 2,
  },
  nome: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  descricao: {
    fontSize: 14,
    marginVertical: 4,
  },
  valor: {
    fontSize: 16,
    marginTop: 8,
    color: '#007aff',
    fontWeight: '500',
  },
  ativo: {
    marginTop: 10,
    color: '#2e7d32',
    fontWeight: 'bold',
  },
  beneficio: {
    fontSize: 13,
    marginTop: 4,
    marginLeft: 8,
  },
  containerRoot: {
    flex: 1,
    paddingBottom: 50,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 10,
    alignItems: 'center'
  },
  containerLogo: {
    alignItems: 'center',
    width: '100%'
  },
});
