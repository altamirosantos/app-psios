import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

import { supabase } from '@/lib/supabase';

type Periodo = 7 | 30 | 90;

type DiarioRegistro = {
  emocao_id: number | null;
  intensidade: number;
  created_at: string;
};

type DiaAgrupado = {
  dateKey: string;
  label: string;
  fullLabel: string;
  scoreDia: number;
  intensidadeMedia: number;
  temRegistro: boolean;
  registrosNoDia: number;
};

type ResumoPeriodo = {
  mediaPeriodo: number;
  melhorDia: DiaAgrupado | null;
  piorDia: DiaAgrupado | null;
  diasComRegistro: number;
  mediaIntensidade: number;
  variacaoScore: number;
};

const SCORE_MIN = -15;
const SCORE_MAX = 15;
const PERIODOS: Periodo[] = [7, 30, 90];

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export const calcularScoreRegistro = (peso: number, intensidade: number) => peso * intensidade;

const formatDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatDayLabel = (date: Date) =>
  date.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');

const formatShortDateLabel = (date: Date) =>
  date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });

const gerarDiasDoPeriodo = (dias: number) => {
  const resultado: Array<{ dateKey: string; label: string; fullLabel: string }> = [];

  for (let offset = dias - 1; offset >= 0; offset -= 1) {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - offset);

    resultado.push({
      dateKey: formatDateKey(date),
      label: formatDayLabel(date),
      fullLabel: `${formatDayLabel(date)} ${formatShortDateLabel(date)}`,
    });
  }

  return resultado;
};

export const agruparPorDia = (
  registros: DiarioRegistro[],
  pesosPorEmocaoId: Map<number, number>,
  periodo: Periodo,
) => {
  const diasBase = gerarDiasDoPeriodo(periodo);
  const acumulado = new Map<string, { scores: number[]; intensidades: number[] }>();

  registros.forEach((registro) => {
    const dateKey = formatDateKey(new Date(registro.created_at));
    const peso = registro.emocao_id === null ? 0 : pesosPorEmocaoId.get(registro.emocao_id) ?? 0;
    const scoreRegistro = calcularScoreRegistro(peso, registro.intensidade);
    const atual = acumulado.get(dateKey) ?? { scores: [], intensidades: [] };

    atual.scores.push(scoreRegistro);
    atual.intensidades.push(registro.intensidade);
    acumulado.set(dateKey, atual);
  });

  return diasBase.map(({ dateKey, label, fullLabel }) => {
    const atual = acumulado.get(dateKey);

    if (!atual || atual.scores.length === 0) {
      return {
        dateKey,
        label,
        fullLabel,
        scoreDia: 0,
        intensidadeMedia: 0,
        temRegistro: false,
        registrosNoDia: 0,
      };
    }

    const scoreDia = atual.scores.reduce((sum, score) => sum + score, 0) / atual.scores.length;
    const intensidadeMedia = atual.intensidades.reduce((sum, item) => sum + item, 0) / atual.intensidades.length;

    return {
      dateKey,
      label,
      fullLabel,
      scoreDia,
      intensidadeMedia,
      temRegistro: true,
      registrosNoDia: atual.scores.length,
    };
  });
};

export const calcularMediaPeriodo = (dias: DiaAgrupado[]) => {
  const diasComRegistro = dias.filter((dia) => dia.temRegistro);

  if (diasComRegistro.length === 0) {
    return 0;
  }

  return diasComRegistro.reduce((sum, dia) => sum + dia.scoreDia, 0) / diasComRegistro.length;
};

const calcularResumoPeriodo = (dias: DiaAgrupado[]): ResumoPeriodo => {
  const diasComRegistro = dias.filter((dia) => dia.temRegistro);

  if (diasComRegistro.length === 0) {
    return {
      mediaPeriodo: 0,
      melhorDia: null,
      piorDia: null,
      diasComRegistro: 0,
      mediaIntensidade: 0,
      variacaoScore: 0,
    };
  }

  const mediaPeriodo = calcularMediaPeriodo(dias);
  const melhorDia = diasComRegistro.reduce((melhor, atual) =>
    atual.scoreDia > melhor.scoreDia ? atual : melhor,
  );
  const piorDia = diasComRegistro.reduce((pior, atual) =>
    atual.scoreDia < pior.scoreDia ? atual : pior,
  );
  const mediaIntensidade =
    diasComRegistro.reduce((sum, dia) => sum + dia.intensidadeMedia, 0) / diasComRegistro.length;
  const variacaoScore =
    Math.max(...diasComRegistro.map((dia) => dia.scoreDia)) -
    Math.min(...diasComRegistro.map((dia) => dia.scoreDia));

  return {
    mediaPeriodo,
    melhorDia,
    piorDia,
    diasComRegistro: diasComRegistro.length,
    mediaIntensidade,
    variacaoScore,
  };
};

const criarLabelsGrafico = (dias: DiaAgrupado[], periodo: Periodo) => {
  const intervalo = periodo === 90 ? 14 : periodo === 30 ? 5 : 1;

  return dias.map((dia, index) => {
    if (index === 0 || index === dias.length - 1 || index % intervalo === 0) {
      return formatShortDateLabel(new Date(`${dia.dateKey}T00:00:00`));
    }

    return '';
  });
};

const gerarInsight = (
  diasPeriodo: DiaAgrupado[],
  resumoPeriodo: ResumoPeriodo,
  mediaGeral: number,
  periodo: Periodo,
) => {
  const diasComRegistro = diasPeriodo.filter((dia) => dia.temRegistro);

  if (diasComRegistro.length === 0) {
    return 'Seu relatório vai ganhar vida assim que você registrar suas emoções. Cada anotação ajuda a enxergar seu caminho com mais clareza.';
  }

  const janelaRecente = diasComRegistro.slice(-Math.min(7, diasComRegistro.length));
  const mediaRecente = janelaRecente.reduce((sum, dia) => sum + dia.scoreDia, 0) / janelaRecente.length;

  if (mediaRecente > mediaGeral + 0.5) {
    return 'Seu bem-estar tem melhorado recentemente. Continue acolhendo seus avanços com carinho.';
  }

  if (mediaRecente < mediaGeral - 0.5) {
    return 'Você teve dias mais difíceis recentemente. Talvez seja um bom momento para desacelerar e se acolher um pouco mais.';
  }

  if (resumoPeriodo.variacaoScore >= 8) {
    return 'Seu humor tem variado bastante nos últimos dias. Perceber essas mudanças já é um passo importante de autoconsciência.';
  }

  return `Nos últimos ${periodo} dias, seus registros mostram uma jornada de atenção constante com o seu bem-estar.`;
};

export default function RelatoriosBemEstarScreen() {
  const screenWidth = Dimensions.get('window').width - 40;
  const [periodoSelecionado, setPeriodoSelecionado] = useState<Periodo>(7);
  const [registros, setRegistros] = useState<DiarioRegistro[]>([]);
  const [pesosPorEmocaoId, setPesosPorEmocaoId] = useState<Map<number, number>>(new Map());
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const carregarRelatorio = async () => {
      setLoading(true);
      setErrorMessage(null);

      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          throw sessionError;
        }

        const userId = sessionData.session?.user.id;
        const startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
        startDate.setDate(startDate.getDate() - 89);

        let diarioQuery = supabase
          .from('diario_de_emocoes')
          .select('emocao_id, intensidade, created_at')
          .gte('created_at', startDate.toISOString())
          .order('created_at', { ascending: true });

        if (userId) {
          diarioQuery = diarioQuery.eq('user_id', userId);
        }

        const { data: diarioData, error: diarioError } = await diarioQuery;

        if (diarioError) {
          throw diarioError;
        }

        const emotionIds = Array.from(
          new Set((diarioData ?? []).map((registro) => registro.emocao_id).filter((id) => id !== null)),
        ) as number[];

        let emotionWeights = new Map<number, number>();

        if (emotionIds.length > 0) {
          const { data: emocaoData, error: emocaoError } = await supabase
            .from('emocao')
            .select('id, peso')
            .in('id', emotionIds);

          if (emocaoError) {
            throw emocaoError;
          }

          emotionWeights = new Map((emocaoData ?? []).map((emocao) => [emocao.id, emocao.peso]));
        }

        setRegistros((diarioData ?? []) as DiarioRegistro[]);
        setPesosPorEmocaoId(emotionWeights);
      } catch (error: any) {
        console.error('Erro ao carregar relatórios de bem-estar:', error);
        setErrorMessage('Não foi possível carregar seus relatórios agora. Tente novamente em instantes.');
      } finally {
        setLoading(false);
      }
    };

    void carregarRelatorio();
  }, []);

  const diasPeriodo = useMemo(
    () => agruparPorDia(registros, pesosPorEmocaoId, periodoSelecionado),
    [registros, pesosPorEmocaoId, periodoSelecionado],
  );

  const resumoPeriodo = useMemo(
    () => calcularResumoPeriodo(diasPeriodo),
    [diasPeriodo],
  );

  const diasNoventa = useMemo(
    () => agruparPorDia(registros, pesosPorEmocaoId, 90),
    [registros, pesosPorEmocaoId],
  );

  const mediaGeral = useMemo(
    () => calcularMediaPeriodo(diasNoventa),
    [diasNoventa],
  );

  const labelsGrafico = useMemo(
    () => criarLabelsGrafico(diasPeriodo, periodoSelecionado),
    [diasPeriodo, periodoSelecionado],
  );

  const dadosGraficoScore = useMemo(
    () => ({
      labels: labelsGrafico,
      datasets: [
        {
          data: diasPeriodo.map((dia) => Number(dia.scoreDia.toFixed(2))),
          strokeWidth: 2,
        },
      ],
      legend: ['Score diário'],
    }),
    [diasPeriodo, labelsGrafico],
  );

  const dadosGraficoIntensidade = useMemo(
    () => ({
      labels: labelsGrafico,
      datasets: [
        {
          data: diasPeriodo.map((dia) => Number(dia.intensidadeMedia.toFixed(2))),
          strokeWidth: 2,
        },
      ],
      legend: ['Intensidade média'],
    }),
    [diasPeriodo, labelsGrafico],
  );

  const insight = useMemo(
    () => gerarInsight(diasPeriodo, resumoPeriodo, mediaGeral, periodoSelecionado),
    [diasPeriodo, mediaGeral, periodoSelecionado, resumoPeriodo],
  );

  const chartConfig = useMemo(
    () => ({
      backgroundColor: '#ffffff',
      backgroundGradientFrom: '#eff6ff',
      backgroundGradientTo: '#fff7ed',
      decimalPlaces: 1,
      color: (opacity = 1) => `rgba(79, 70, 229, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(71, 85, 105, ${opacity})`,
      propsForDots: {
        r: '4',
        strokeWidth: '2',
        stroke: '#ffffff',
      },
      propsForBackgroundLines: {
        stroke: '#e5e7eb',
      },
      style: { borderRadius: 18 },
    }),
    [],
  );

  const melhorDiaTexto = resumoPeriodo.melhorDia
    ? `${resumoPeriodo.melhorDia.fullLabel} · ${resumoPeriodo.melhorDia.scoreDia.toFixed(1)}`
    : 'Ainda sem registros';
  const piorDiaTexto = resumoPeriodo.piorDia
    ? `${resumoPeriodo.piorDia.fullLabel} · ${resumoPeriodo.piorDia.scoreDia.toFixed(1)}`
    : 'Ainda sem registros';

  return (
    <View style={styles.containerRoot}>
      <LinearGradient colors={['#9333ea', '#d763f8']} style={styles.headerGradient}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Relatórios de Bem-Estar</Text>
      </LinearGradient>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.heroCard}>
          <Text style={styles.heroEyebrow}>BEM-ESTAR EM FOCO</Text>
          <Text style={styles.heroTitle}>Entenda a sua evolução emocional ao longo do tempo</Text>
          <Text style={styles.heroText}>Escolha um período para observar tendências, intensidade e movimentos do seu bem-estar com mais clareza.</Text>
        </View>

        <View style={styles.periodTabs}>
          {PERIODOS.map((periodo) => (
            <TouchableOpacity
              key={periodo}
              style={[
                styles.periodTab,
                periodoSelecionado === periodo && styles.periodTabActive,
              ]}
              onPress={() => setPeriodoSelecionado(periodo)}
            >
              <Text
                style={[
                  styles.periodTabText,
                  periodoSelecionado === periodo && styles.periodTabTextActive,
                ]}
              >
                {periodo} dias
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {loading ? (
          <View style={styles.stateCard}>
            <ActivityIndicator size="large" color="#9333ea" />
            <Text style={styles.stateText}>Preparando seus relatórios de bem-estar...</Text>
          </View>
        ) : null}

        {!loading && errorMessage ? (
          <View style={styles.stateCard}>
            <Text style={styles.stateText}>{errorMessage}</Text>
          </View>
        ) : null}

        {!loading && !errorMessage ? (
          <>
            <View style={styles.chartCard}>
              <Text style={styles.cardTitle}>Gráfico principal</Text>
              <Text style={styles.cardSubtitle}>Tendência emocional por dia, com base na média dos registros diários.</Text>
              <LineChart
                data={dadosGraficoScore}
                width={screenWidth}
                height={240}
                yAxisInterval={1}
                segments={4}
                bezier
                withInnerLines
                withOuterLines={false}
                fromZero={false}
                chartConfig={chartConfig}
                style={styles.chart}
              />
            </View>

            <View style={styles.metricsRow}>
              <View style={styles.metricCard}>
                <Text style={styles.metricValue}>{resumoPeriodo.mediaPeriodo.toFixed(1)}</Text>
                <Text style={styles.metricLabel}>média do período</Text>
              </View>
              <View style={styles.metricCard}>
                <Text style={styles.metricValue}>{resumoPeriodo.diasComRegistro}</Text>
                <Text style={styles.metricLabel}>dias com registro</Text>
              </View>
            </View>

            <View style={styles.metricsRow}>
              <View style={styles.metricCardLarge}>
                <Text style={styles.metricTitle}>Melhor dia</Text>
                <Text style={styles.metricDetail}>{melhorDiaTexto}</Text>
              </View>
              <View style={styles.metricCardLarge}>
                <Text style={styles.metricTitle}>Dia mais sensível</Text>
                <Text style={styles.metricDetail}>{piorDiaTexto}</Text>
              </View>
            </View>

            <View style={styles.chartCard}>
              <Text style={styles.cardTitle}>Intensidade diária</Text>
              <Text style={styles.cardSubtitle}>Média de intensidade registrada por dia ao longo do período.</Text>
              <LineChart
                data={dadosGraficoIntensidade}
                width={screenWidth}
                height={220}
                yAxisInterval={1}
                segments={5}
                bezier
                withInnerLines
                withOuterLines={false}
                fromZero
                chartConfig={{
                  ...chartConfig,
                  color: (opacity = 1) => `rgba(14, 165, 233, ${opacity})`,
                }}
                style={styles.chart}
              />
            </View>

            <View style={styles.insightCard}>
              <Text style={styles.insightTitle}>Insight automático</Text>
              <Text style={styles.insightText}>{insight}</Text>
              <Text style={styles.insightFootnote}>Sua intensidade média ficou em {resumoPeriodo.mediaIntensidade.toFixed(1)} e seus registros preencheram {resumoPeriodo.diasComRegistro} dias deste período.</Text>
            </View>

            <View style={styles.legendCard}>
              <Text style={styles.legendTitle}>Como interpretar</Text>
              <Text style={styles.legendText}>Scores mais altos indicam dias emocionalmente mais leves ou positivos. Scores mais baixos apontam dias mais difíceis. O objetivo aqui é observar padrões com carinho, nunca julgar o que você sentiu.</Text>
            </View>
          </>
        ) : null}
      </ScrollView>
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  containerRoot: { flex: 1, backgroundColor: '#f6f7fb' },
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: { marginRight: 10 },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  scrollView: { flex: 1 },
  scrollContent: { padding: 20, alignItems: 'center' },
  heroCard: {
    width: width * 0.9,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  heroEyebrow: {
    color: '#9333ea',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 8,
  },
  heroTitle: {
    color: '#1f2937',
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 30,
    marginBottom: 8,
  },
  heroText: {
    color: '#6b7280',
    fontSize: 15,
    lineHeight: 22,
  },
  periodTabs: {
    width: width * 0.9,
    flexDirection: 'row',
    backgroundColor: '#ede9fe',
    borderRadius: 18,
    padding: 6,
    gap: 8,
    marginBottom: 18,
  },
  periodTab: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: 'center',
  },
  periodTabActive: {
    backgroundColor: '#ffffff',
  },
  periodTabText: {
    color: '#6b7280',
    fontSize: 14,
    fontWeight: '600',
  },
  periodTabTextActive: {
    color: '#6d28d9',
  },
  stateCard: {
    width: width * 0.9,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 3,
  },
  stateText: {
    color: '#6b7280',
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginTop: 12,
  },
  chartCard: {
    width: width * 0.9,
    backgroundColor: '#ffffff',
    borderRadius: 22,
    padding: 18,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 3,
  },
  cardTitle: {
    color: '#1f2937',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  cardSubtitle: {
    color: '#6b7280',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 12,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 18,
  },
  metricsRow: {
    width: width * 0.9,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 18,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  metricCardLarge: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  metricValue: {
    color: '#111827',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  metricLabel: {
    color: '#6b7280',
    fontSize: 12,
    textAlign: 'center',
  },
  metricTitle: {
    color: '#374151',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
  },
  metricDetail: {
    color: '#111827',
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '600',
  },
  insightCard: {
    width: width * 0.9,
    backgroundColor: '#eff6ff',
    borderRadius: 22,
    padding: 18,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  insightTitle: {
    color: '#1d4ed8',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 8,
  },
  insightText: {
    color: '#374151',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 8,
  },
  insightFootnote: {
    color: '#64748b',
    fontSize: 13,
    lineHeight: 20,
  },
  legendCard: {
    width: width * 0.9,
    backgroundColor: '#fff7ed',
    borderRadius: 22,
    padding: 18,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#fed7aa',
  },
  legendTitle: {
    color: '#c2410c',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  legendText: {
    color: '#7c2d12',
    fontSize: 14,
    lineHeight: 22,
  },
});
