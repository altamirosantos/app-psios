import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { supabase } from '@/lib/supabase';

type DiarioRegistro = {
  emocao_id: number | null;
  intensidade: number;
  created_at: string;
};

type DiaCalculado = {
  dateKey: string;
  label: string;
  dateLabel: string;
  temRegistro: boolean;
  scoreDia: number;
  scoreNormalizado: number;
  pontosDia: number;
  bonusDia: number;
  pontuacaoDia: number;
};

type ResumoSemanal = {
  dias: DiaCalculado[];
  pontuacaoSemana: number;
  diasComRegistro: number;
  mediaEmocionalSemana: number;
  progressoSemana: number;
  nivel: number;
  nivelLabel: string;
  feedback: string;
};

const SCORE_REGISTRO_MIN = -15;
const SCORE_REGISTRO_MAX = 15;
const PONTUACAO_SEMANA_MAX = 105;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

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

const getLast7Days = () => {
  const days: Array<{ dateKey: string; label: string; dateLabel: string }> = [];

  for (let offset = 6; offset >= 0; offset -= 1) {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - offset);

    days.push({
      dateKey: formatDateKey(date),
      label: formatDayLabel(date),
      dateLabel: formatShortDateLabel(date),
    });
  }

  return days;
};

export const calcularScoreRegistro = (peso: number, intensidade: number) =>
  peso * intensidade;

export const calcularScoreDia = (scores: number[]) => {
  if (scores.length === 0) {
    return {
      temRegistro: false,
      scoreDia: 0,
      scoreNormalizado: 0,
      pontosDia: 0,
      bonusDia: 0,
      pontuacaoDia: 0,
    };
  }

  const scoreDia = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  const scoreNormalizado = clamp(
    (scoreDia - SCORE_REGISTRO_MIN) / (SCORE_REGISTRO_MAX - SCORE_REGISTRO_MIN),
    0,
    1,
  );
  const pontosDia = scoreNormalizado * 10;
  const bonusDia = 5;

  return {
    temRegistro: true,
    scoreDia,
    scoreNormalizado,
    pontosDia,
    bonusDia,
    pontuacaoDia: pontosDia + bonusDia,
  };
};

const getNivelInfo = (pontuacaoSemana: number) => {
  if (pontuacaoSemana >= 90) {
    return { nivel: 5, nivelLabel: 'Ritmo Inspirador' };
  }
  if (pontuacaoSemana >= 75) {
    return { nivel: 4, nivelLabel: 'Jornada Consistente' };
  }
  if (pontuacaoSemana >= 60) {
    return { nivel: 3, nivelLabel: 'Cuidado em Movimento' };
  }
  if (pontuacaoSemana >= 45) {
    return { nivel: 2, nivelLabel: 'Passos de Presença' };
  }

  return { nivel: 1, nivelLabel: 'Começo Acolhedor' };
};

const getFeedback = (diasComRegistro: number, pontuacaoSemana: number) => {
  if (diasComRegistro >= 6) {
    return 'Sua constancia nesta semana mostra um cuidado bonito com voce mesma.';
  }
  if (diasComRegistro >= 4) {
    return 'Voce manteve uma boa conexao com suas emocões. Cada registro fortalece sua jornada.';
  }
  if (pontuacaoSemana > 0) {
    return 'Cada anotacao conta. Seu progresso emocional cresce a cada novo registro.';
  }

  return 'Seu diario esta pronto para acolher o que voce sentir. Um pequeno passo ja faz diferenca.';
};

export const calcularPontuacaoSemana = (
  registros: DiarioRegistro[],
  pesosPorEmocaoId: Map<number, number>,
): ResumoSemanal => {
  const last7Days = getLast7Days();
  const scoresPorDia = new Map<string, number[]>();

  registros.forEach((registro) => {
    const dateKey = formatDateKey(new Date(registro.created_at));
    const peso = registro.emocao_id === null ? 0 : pesosPorEmocaoId.get(registro.emocao_id) ?? 0;
    const scoreRegistro = calcularScoreRegistro(peso, registro.intensidade);
    const scoresDoDia = scoresPorDia.get(dateKey) ?? [];

    scoresDoDia.push(scoreRegistro);
    scoresPorDia.set(dateKey, scoresDoDia);
  });

  const dias = last7Days.map(({ dateKey, label, dateLabel }) => {
    const calculoDia = calcularScoreDia(scoresPorDia.get(dateKey) ?? []);

    return {
      dateKey,
      label,
      dateLabel,
      ...calculoDia,
    };
  });

  const diasComRegistro = dias.filter((dia) => dia.temRegistro).length;
  const pontuacaoSemana = dias.reduce((sum, dia) => sum + dia.pontuacaoDia, 0);
  const mediaEmocionalSemana = diasComRegistro > 0
    ? dias.filter((dia) => dia.temRegistro).reduce((sum, dia) => sum + dia.scoreDia, 0) / diasComRegistro
    : 0;
  const progressoSemana = clamp(pontuacaoSemana / PONTUACAO_SEMANA_MAX, 0, 1);
  const { nivel, nivelLabel } = getNivelInfo(pontuacaoSemana);

  return {
    dias,
    pontuacaoSemana,
    diasComRegistro,
    mediaEmocionalSemana,
    progressoSemana,
    nivel,
    nivelLabel,
    feedback: getFeedback(diasComRegistro, pontuacaoSemana),
  };
};

const GamificacaoScreen = () => {
  const [registros, setRegistros] = useState<DiarioRegistro[]>([]);
  const [pesosPorEmocaoId, setPesosPorEmocaoId] = useState<Map<number, number>>(new Map());
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const carregarResumo = async () => {
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
        startDate.setDate(startDate.getDate() - 6);

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
        console.error('Erro ao carregar dados de gamificacao:', error);
        setErrorMessage('Nao foi possivel carregar sua evolucao emocional agora. Tente novamente em instantes.');
      } finally {
        setLoading(false);
      }
    };

    void carregarResumo();
  }, []);

  const resumoSemanal = useMemo(
    () => calcularPontuacaoSemana(registros, pesosPorEmocaoId),
    [registros, pesosPorEmocaoId],
  );
  const diasExibidos = useMemo(
    () => [...resumoSemanal.dias].reverse(),
    [resumoSemanal.dias],
  );

  const progressoPercentual = Math.round(resumoSemanal.progressoSemana * 100);
  const mediaSemanalTexto = resumoSemanal.mediaEmocionalSemana.toFixed(1);

  return (
    <View style={styles.containerRoot}>
      {/* TOPO COM GRADIENTE */}
      <LinearGradient colors={['#9333ea', '#d763f8']} style={styles.headerGradient}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sua Jornada de Autocuidado</Text>
      </LinearGradient>

      {/* CONTEÚDO COM FUNDO CLARO */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {loading ? (
          <View style={styles.stateCard}>
            <ActivityIndicator size="large" color="#9333ea" />
            <Text style={styles.stateText}>Calculando sua evolucao emocional...</Text>
          </View>
        ) : null}

        {!loading && errorMessage ? (
          <View style={styles.stateCard}>
            <Text style={styles.stateText}>{errorMessage}</Text>
          </View>
        ) : null}

        {!loading && !errorMessage ? (
          <>
        <View style={styles.cardNivel}>
          <Text style={styles.cardEyebrow}>ULTIMOS 7 DIAS</Text>
          <Text style={styles.nivelTexto}>{resumoSemanal.nivelLabel}</Text>
          <Text style={styles.xpTexto}>{resumoSemanal.pontuacaoSemana.toFixed(1)} pontos na semana</Text>
          <View style={styles.barraXp}>
            <View style={[styles.barraXpProgresso, { width: `${progressoPercentual}%` }]} />
          </View>
          <Text style={styles.progressoTexto}>Nivel {resumoSemanal.nivel} · {progressoPercentual}% da meta semanal</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{resumoSemanal.diasComRegistro}</Text>
            <Text style={styles.statLabel}>dias com registro</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{mediaSemanalTexto}</Text>
            <Text style={styles.statLabel}>media emocional</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{resumoSemanal.pontuacaoSemana.toFixed(0)}</Text>
            <Text style={styles.statLabel}>pontos totais</Text>
          </View>
        </View>

        <View style={styles.feedbackCard}>
          <Text style={styles.feedbackTitle}>Seu ritmo nesta semana</Text>
          <Text style={styles.feedbackText}>{resumoSemanal.feedback}</Text>
          <Text style={styles.feedbackFootnote}>Voce registrou emocões em {resumoSemanal.diasComRegistro} de 7 dias.</Text>
        </View>

        <Text style={styles.subtitulo}>Progresso diario</Text>
        {diasExibidos.map((dia) => (
          <View key={dia.dateKey} style={styles.cardDesafio}>
            <View style={styles.dayHeader}>
              <Text style={styles.desafioTitulo}>{dia.label} · {dia.dateLabel}</Text>
              <Text style={styles.dayPoints}>{dia.pontuacaoDia.toFixed(1)} pts</Text>
            </View>
            <View style={styles.barraDesafio}>
              <View style={[styles.barraDesafioProgresso, { width: `${(dia.pontuacaoDia / 15) * 100}%` }]} />
            </View>
            <Text style={styles.desafioProgresso}>
              {dia.temRegistro
                ? `Score medio do dia: ${dia.scoreDia.toFixed(1)} · Bonus de consistencia aplicado`
                : 'Sem registro neste dia, mas sua semana continua em construcao.'}
            </Text>
          </View>
        ))}
          </>
        ) : null}
      </ScrollView>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  containerRoot: { flex: 1, backgroundColor: '#f8f8f8' },
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
  stateCard: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 20,
    width: width * 0.9,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
  },
  stateText: {
    marginTop: 12,
    color: '#555',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  cardNivel: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    width: width * 0.9,
    alignItems: 'center',
    marginBottom: 25,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardEyebrow: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9333ea',
    letterSpacing: 1,
    marginBottom: 8,
  },
  nivelTexto: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  xpTexto: { color: '#555', fontSize: 18, marginTop: 5 },
  barraXp: {
    backgroundColor: '#e0e0e0',
    height: 10,
    width: '100%',
    borderRadius: 10,
    marginTop: 10,
    overflow: 'hidden',
  },
  barraXpProgresso: {
    backgroundColor: '#9333ea',
    height: '100%',
  },
  progressoTexto: { color: '#555', fontSize: 14, marginTop: 8 },
  statsRow: {
    width: width * 0.9,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#222',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  subtitulo: { color: '#333', fontSize: 20, fontWeight: '600', marginTop: 10, marginBottom: 10 },
  feedbackCard: {
    width: width * 0.9,
    backgroundColor: '#f5edff',
    borderRadius: 20,
    padding: 18,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: '#e9d5ff',
  },
  feedbackTitle: {
    color: '#5b21b6',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 8,
  },
  feedbackText: {
    color: '#4b5563',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 8,
  },
  feedbackFootnote: {
    color: '#6b7280',
    fontSize: 13,
  },
  cardDesafio: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    width: width * 0.9,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  desafioTitulo: { color: '#333', fontWeight: 'bold', fontSize: 16 },
  dayPoints: {
    color: '#7e22ce',
    fontSize: 13,
    fontWeight: '700',
  },
  barraDesafio: {
    backgroundColor: '#e0e0e0',
    height: 8,
    borderRadius: 8,
    marginTop: 10,
    overflow: 'hidden',
  },
  barraDesafioProgresso: {
    backgroundColor: '#9333ea',
    height: '100%',
  },
  desafioProgresso: { color: '#555', fontSize: 12, marginTop: 5 },
});

export default GamificacaoScreen;
