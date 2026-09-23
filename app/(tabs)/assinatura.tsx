import { CycleSwitcher } from '@/components/CycleSwitcher';
import { useThemeColor } from '@/hooks/useThemeColor';
import { getPlanoAtivo, getPlanosDisponiveis, supabase } from '@/lib/supabase';
import { getThemeColors } from '@/theme/theme';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useMemo, useState } from 'react';
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
  const [cicloSelecionado, setCicloSelecionado] = useState<'MENSAL' | 'ANUAL'>('MENSAL');

  // Filtra planos conforme o ciclo selecionado e o tipo de acesso
  const planosFiltrados = useMemo(() => {
    if (!planos || planos.length === 0) return [];

    return planos.filter((plano) => {
      // Plano Gratuito (FREE) sempre visível
      if (plano.tipo_acesso === 'FREE') {
        return true;
      }

      // Planos pagos (BASIC/FULL) filtrados pelo ciclo
      if (plano.tipo_acesso === 'BASIC' || plano.tipo_acesso === 'FULL') {
        return plano.ciclo === cicloSelecionado;
      }

      return false;
    });
  }, [planos, cicloSelecionado]);

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
        
        {/* Seletor de Ciclo (MENSAL/ANUAL) */}
        <CycleSwitcher
          selectedCycle={cicloSelecionado}
          onCycleChange={setCicloSelecionado}
          activeColor="#3399ff"
          inactiveColor={colors.inputBackground}
          textColor={colors.text}
        />

        {/* Planos Filtrados */}
        {planosFiltrados.length > 0 ? (
          planosFiltrados.map((plano) => (
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
              
              {/* Exibição de Preço com Ciclo e Desconto */}
              <View style={styles.precoContainer}>
                {plano.desconto_aplicado && plano.desconto_aplicado > 0 ? (
                  <>
                    <Text style={[styles.valorOriginal, { color: colors.textSecondary }]}>
                      R$ {Number(plano.valor).toFixed(2)}
                    </Text>
                    <Text style={[styles.descontoPercentual, { color: '#ff6b6b' }]}>
                      {plano.desconto_aplicado}% OFF
                    </Text>
                  </>
                ) : null}
                <Text style={[styles.valor, plano.desconto_aplicado && plano.desconto_aplicado > 0 ? styles.valorDestaque : null]}>
                  R$ {(Number(plano.valor) * (1 - (plano.desconto_aplicado || 0) / 100)).toFixed(2)}
                </Text>
                {plano.tipo_acesso !== 'FREE' && (
                  <Text style={[styles.cicloLabel, { color: colors.textSecondary }]}>
                    / {cicloSelecionado.toLowerCase()}
                  </Text>
                )}
              </View>

              {/* Benefícios */}
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

              {/* Código Identificador para Checkout */}
              {plano.codigo_identificador && (
                <Text style={[styles.codigoIdentificador, { color: colors.textSecondary }]}>
                  ID: {plano.codigo_identificador}
                </Text>
              )}

              {/* Badge Plano Ativo */}
              {plano.id === planoAtivo && (
                <Text style={styles.ativo}>✅ Seu plano atual</Text>
              )}
            </View>
          ))
        ) : (
          <View style={[styles.emptyState, { backgroundColor: colors.inputBackground }]}>
            <Text style={[styles.emptyStateText, { color: colors.text }]}>
              Nenhum plano disponível para este período
            </Text>
          </View>
        )}
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
  valorDestaque: {
    color: '#ff6b6b',
    fontSize: 18,
    fontWeight: 'bold',
  },
  valorOriginal: {
    fontSize: 13,
    marginRight: 8,
    textDecorationLine: 'line-through',
    fontWeight: '400',
  },
  descontoPercentual: {
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 8,
    backgroundColor: '#ffe5e5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  precoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  cicloLabel: {
    fontSize: 13,
    marginLeft: 4,
    fontStyle: 'italic',
  },
  codigoIdentificador: {
    fontSize: 11,
    marginTop: 8,
    fontFamily: 'monospace',
  },
  emptyState: {
    marginVertical: 20,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
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
