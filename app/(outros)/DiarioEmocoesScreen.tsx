import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from "expo-router";
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { supabase } from '@/lib/supabase';

interface Emocao {
  id: number | string;
  nome: string;
  peso: number;
  icone: string;
}

const DiarioEmocoesScreen = () => {
  const [emocoes, setEmocoes] = useState<Emocao[]>([]);
  const [loadingEmocoes, setLoadingEmocoes] = useState(true);
  const [loadingMensagem, setLoadingMensagem] = useState(false);
  const [emocaoSelecionada, setEmocaoSelecionada] = useState<Emocao | null>(null);
  const [intensidadeSelecionada, setIntensidadeSelecionada] = useState<number | null>(null);
  const [mensagem, setMensagem] = useState('');
  const [showIntensidade, setShowIntensidade] = useState(false);
  const [showMensagem, setShowMensagem] = useState(false);
  const [showNovaEmocao, setShowNovaEmocao] = useState(false);
  const [novaEmocao, setNovaEmocao] = useState('');

  const carregarEmocoes = async () => {
    setLoadingEmocoes(true);

    const { data, error } = await supabase
      .from('emocao')
      .select('id, nome, peso, icone')
      .order('nome', { ascending: true });

    if (error) {
      console.error('Erro ao buscar emoções:', error.message);
      setEmocoes([]);
      setLoadingEmocoes(false);
      return;
    }

    setEmocoes((data ?? []) as Emocao[]);
    setLoadingEmocoes(false);
  };

  useEffect(() => {
    carregarEmocoes();
  }, []);

  const extrairDetalhesErroEdgeFunction = async (error: any) => {
    const detalhes: Record<string, unknown> = {
      name: error?.name,
      message: error?.message,
    };

    const context = error?.context;

    if (context instanceof Response) {
      detalhes.status = context.status;
      detalhes.statusText = context.statusText;

      try {
        detalhes.responseBody = await context.clone().text();
      } catch (responseError) {
        detalhes.responseBodyError = String(responseError);
      }
    } else if (context) {
      detalhes.context = context;
    }

    return detalhes;
  };

  const buscarMensagemExistente = async (emocaoId: number, intensidade: number) => {
    const { data, error } = await supabase
      .from('emocao_mensagem')
      .select('mensagem')
      .eq('emocao_id', emocaoId)
      .eq('intensidade', intensidade)
      .limit(1);

    if (error) {
      console.error('Erro ao buscar mensagem da emoção em cache:', {
        emocao_id: emocaoId,
        intensidade,
        error: error.message,
      });
      return null;
    }

    return data?.[0]?.mensagem ?? null;
  };

  const salvarMensagemEmocao = async (
    emocaoId: number,
    intensidade: number,
    mensagemGerada: string,
  ) => {
    const { error } = await supabase
      .from('emocao_mensagem')
      .insert({
        emocao_id: emocaoId,
        intensidade,
        mensagem: mensagemGerada,
      });

    if (error) {
      console.error('Erro ao salvar mensagem da emoção em cache:', {
        emocao_id: emocaoId,
        intensidade,
        error: error.message,
      });
    }
  };

  const selecionarEmocao = (emocao: Emocao) => {
    setEmocaoSelecionada(emocao);
    setIntensidadeSelecionada(null);
    setMensagem('');
    setLoadingMensagem(false);
    setShowMensagem(false);
    setShowIntensidade(true);
  };

  const salvarDiarioEmocao = async (
    emocao: Emocao,
    intensidade: number,
    mensagemRetornada: string,
  ) => {
    const emocaoId =
      typeof emocao.id === 'string' && emocao.id.startsWith('temp-')
        ? null
        : emocao.id;

    const { error } = await supabase
      .from('diario_de_emocoes')
      .insert({
        emocao_id: emocaoId,
        emocao: emocao.nome,
        mensagem: mensagemRetornada,
        intensidade,
      });

    if (error) {
      console.error('Erro ao salvar diário de emoções:', {
        emocao_id: emocaoId,
        emocao: emocao.nome,
        intensidade,
        error: error.message,
      });
    }
  };

  const selecionarIntensidade = async (intensidade: number) => {
    setIntensidadeSelecionada(intensidade);

    if (!emocaoSelecionada) {
      return;
    }

    setLoadingMensagem(true);

    const payload = {
      emocao: emocaoSelecionada.nome,
      peso: emocaoSelecionada.peso,
      intensidade,
    };

    const emocaoIdValido = typeof emocaoSelecionada.id === 'number' ? emocaoSelecionada.id : null;

    try {
      if (emocaoIdValido !== null) {
        const mensagemExistente = await buscarMensagemExistente(emocaoIdValido, intensidade);

        if (mensagemExistente) {
          console.log('Mensagem encontrada na tabela emocao_mensagem:', {
            emocao_id: emocaoIdValido,
            intensidade,
          });
          await salvarDiarioEmocao(emocaoSelecionada, intensidade, mensagemExistente);
          setMensagem(mensagemExistente);
          return;
        }
      }

      console.log('Chamando edge function n8n-msg-emocoes com payload:', payload);

      const { data, error } = await supabase.functions.invoke('n8n-msg-emocoes', {
        body: payload,
      });

      if (error) {
        const detalhesErro = await extrairDetalhesErroEdgeFunction(error);
        console.error('Erro ao gerar mensagem da emoção via edge function:', {
          payload,
          detalhesErro,
          data,
        });
        setMensagem('Estou aqui com você. Vamos acolher essa emoção com gentileza.');
      } else {
        console.log('Resposta recebida da edge function n8n-msg-emocoes:', data);
        const mensagemGerada =
          (typeof data === 'string' ? data : null) ||
          data?.mensagem ||
          data?.message ||
          data?.output ||
          'Estou aqui com você. Vamos acolher essa emoção com gentileza.';

        if (emocaoIdValido !== null) {
          await salvarMensagemEmocao(emocaoIdValido, intensidade, mensagemGerada);
        }

        await salvarDiarioEmocao(emocaoSelecionada, intensidade, mensagemGerada);
        setMensagem(mensagemGerada);
      }
    } catch (error) {
      const detalhesErro = await extrairDetalhesErroEdgeFunction(error);
      console.error('Erro inesperado ao chamar edge function n8n-msg-emocoes:', {
        payload,
        detalhesErro,
      });
      setMensagem('Estou aqui com você. Vamos acolher essa emoção com gentileza.');
    } finally {
      setLoadingMensagem(false);
      setShowIntensidade(false);
      setShowMensagem(true);
    }
  };

  const adicionarNovaEmocao = () => {
    const nomeEmocao = novaEmocao.trim();

    if (!nomeEmocao) {
      return;
    }

    const novaEmocaoTemporaria: Emocao = {
      id: `temp-${Date.now()}`,
      nome: nomeEmocao,
      peso: 0,
      icone: 'circle',
    };

    selecionarEmocao(novaEmocaoTemporaria);

    setNovaEmocao('');
    setShowNovaEmocao(false);
  };

  const getCorIcone = (emocao: Emocao | null) => {
    if (!emocao || emocaoSelecionada?.id !== emocao.id) {
      return (emocao?.peso ?? 0) >= 0 ? '#10b981' : '#ef4444';
    }
    return '#fff';
  };

  const getEstiloMensagem = () => {
    if (!emocaoSelecionada) return styles.mensagemPositiva;
    return emocaoSelecionada.peso > 0 ? styles.mensagemPositiva : styles.mensagemNegativa;
  };

  const getCorIconeMensagem = () => {
    if (!emocaoSelecionada) return '#10b981';
    return emocaoSelecionada.peso > 0 ? '#10b981' : '#ef4444';
  };

  const finalizarFluxo = () => {
    setShowMensagem(false);
    router.push('/(outros)/GamificacaoScreen');
  };

  return (
    <View style={styles.containerRoot}>
      {/* TOPO COM GRADIENTE */}
      <LinearGradient colors={['#9333ea', '#d763f8']} style={styles.headerGradient}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Diário de Emoções</Text>
      </LinearGradient>

      {/* CONTEÚDO */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Introdução */}
        <View style={styles.introducao}>
          <Text style={styles.tituloDestaque}>🌿 DIÁRIO DE EMOÇÕES</Text>
          <Text style={styles.subtituloDestaque}>Seu momento de cuidado começa aqui! 💜</Text>
          <Text style={styles.descricaoPrincipal}>
            Registre no seu Diário de Emoções a emoção que você sentiu no dia e adicione a que não estiver na lista. Observe e acolha o que você sente.
          </Text>
        </View>

        {/* Grade de Emoções */}
        <View style={styles.gridEmocoes}>
          {loadingEmocoes ? (
            <Text style={styles.estadoListaTexto}>Carregando emoções...</Text>
          ) : null}

          {!loadingEmocoes && emocoes.length === 0 ? (
            <Text style={styles.estadoListaTexto}>Nenhuma emoção cadastrada no momento.</Text>
          ) : null}

          {emocoes.map((emocao) => (
            <TouchableOpacity
              key={emocao.id}
              style={[
                styles.cartaoEmocao,
                emocaoSelecionada?.id === emocao.id && styles.cartaoEmocaoSelecionado,
                emocao.peso > 0 ? styles.emocaoPositiva : styles.emocaoNegativa,
                emocaoSelecionada?.id === emocao.id && emocao.peso > 0 && styles.emocaoPositivaAtiva,
                emocaoSelecionada?.id === emocao.id && emocao.peso < 0 && styles.emocaoNegativaAtiva,
              ]}
              onPress={() => selecionarEmocao(emocao)}
            >
              <MaterialCommunityIcons
                name={emocao.icone as any}
                size={28}
                color={getCorIcone(emocao)}
              />
              <Text
                style={[
                  styles.nomeEmocao,
                  emocaoSelecionada?.id === emocao.id && styles.nomeEmocaoAtivo,
                ]}
              >
                {emocao.nome}
              </Text>
            </TouchableOpacity>
          ))}

          {/* Botão Adicionar Emoção */}
          <TouchableOpacity
            style={[styles.cartaoEmocao, styles.botaoAdicionarEmocao]}
            onPress={() => setShowNovaEmocao(true)}
          >
            <MaterialCommunityIcons name="plus" size={32} color="#9333ea" />
            <Text style={styles.nomeEmocaoAdicionar}>Adicionar</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      <Modal visible={showIntensidade && !!emocaoSelecionada} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setShowIntensidade(false)}
          />
          <View style={styles.modalContent}>
            <Text style={styles.modalTitulo}>Qual a intensidade dessa emoção?</Text>
            <Text style={styles.modalSubtitulo}>Quero entender melhor como você está se sentindo agora. Escolha a intensidade dessa emoção de 0 a 5.</Text>
            <View style={styles.intensidadeGrid}>
              {[0, 1, 2, 3, 4, 5].map((valor) => (
                <TouchableOpacity
                  key={valor}
                  style={[styles.botaoIntensidade, loadingMensagem && styles.botaoIntensidadeDesabilitado]}
                  disabled={loadingMensagem}
                  onPress={() => selecionarIntensidade(valor)}
                >
                  <Text style={styles.textoBotaoIntensidade}>{valor}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {loadingMensagem && (
              <View style={styles.loadingMensagemContainer}>
                <ActivityIndicator size="small" color="#9333ea" />
                <Text style={styles.loadingMensagemTexto}>Preparando uma mensagem para você...</Text>
              </View>
            )}
          </View>
        </View>
      </Modal>

      <Modal visible={showMensagem && !!emocaoSelecionada && !!mensagem} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={finalizarFluxo}
          />
          <View
            style={[
              styles.modalMensagem,
              getEstiloMensagem(),
            ]}
          >
            <View style={styles.modalMensagemHeader}>
              <View />
              <TouchableOpacity onPress={finalizarFluxo} style={styles.botaoFecharMensagem}>
                <Feather name="x" size={20} color="#666" />
              </TouchableOpacity>
            </View>
            <View style={styles.conteudoMensagemModal}>
              <View style={styles.iconeMensagemModal}>
                <MaterialCommunityIcons
                  name={emocaoSelecionada?.icone as any}
                  size={40}
                  color={getCorIconeMensagem()}
                />
              </View>
              {intensidadeSelecionada !== null && (
                <View style={styles.badgeIntensidade}>
                  <Text style={styles.textoBadgeIntensidade}>Intensidade {intensidadeSelecionada}/5</Text>
                </View>
              )}
              <Text style={styles.textoMensagemModal}>{mensagem}</Text>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Adicionar Emoção */}
      <Modal visible={showNovaEmocao} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitulo}>Adicionar Nova Emoção</Text>
            <TextInput
              style={styles.inputNovaEmocao}
              placeholder="Digite a emoção que você sente..."
              value={novaEmocao}
              onChangeText={setNovaEmocao}
              placeholderTextColor="#999"
            />
            <View style={styles.botoesModal}>
              <TouchableOpacity
                style={[styles.botaoModal, styles.botaoCancelar]}
                onPress={() => setShowNovaEmocao(false)}
              >
                <Text style={styles.textoBotaoCancelar}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.botaoModal, styles.botaoConfirmar]}
                onPress={adicionarNovaEmocao}
              >
                <Text style={styles.textoBotaoConfirmar}>Adicionar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  containerRoot: { flex: 1, backgroundColor: '#fdfcff' },
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: { marginRight: 10 },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  scrollContent: { paddingBottom: 40 },
  
  /* Introdução */
  introducao: { padding: 20, alignItems: 'center' },
  tituloDestaque: { fontSize: 24, fontWeight: '700', color: '#333', marginBottom: 8 },
  subtituloDestaque: { fontSize: 16, color: '#9333ea', fontWeight: '600', marginBottom: 12 },
  descricaoPrincipal: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  estadoListaTexto: {
    width: '100%',
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    marginBottom: 12,
  },

  /* Grade de Emoções */
  gridEmocoes: {
    paddingHorizontal: 15,
    marginBottom: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cartaoEmocao: {
    width: (width - 50) / 3,
    aspectRatio: 1,
    backgroundColor: '#fff',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  emocaoPositiva: { borderColor: '#d1fae5' },
  emocaoNegativa: { borderColor: '#fee2e2' },
  cartaoEmocaoSelecionado: { borderWidth: 3 },
  emocaoPositivaAtiva: { borderColor: '#10b981', backgroundColor: '#10b981' },
  emocaoNegativaAtiva: { borderColor: '#ef4444', backgroundColor: '#ef4444' },
  nomeEmocao: { marginTop: 8, fontSize: 12, fontWeight: '600', color: '#333', textAlign: 'center' },
  nomeEmocaoAtivo: { color: '#fff' },
  nomeEmocaoAdicionar: { marginTop: 8, fontSize: 12, fontWeight: '600', color: '#9333ea' },

  botaoAdicionarEmocao: { borderStyle: 'dashed', borderColor: '#9333ea' },

  /* Mensagem */
  containerMensagem: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  mensagemPositiva: { backgroundColor: '#d1fae5', borderLeftWidth: 5, borderLeftColor: '#10b981' },
  mensagemNegativa: { backgroundColor: '#fee2e2', borderLeftWidth: 5, borderLeftColor: '#ef4444' },
  iconeContainer: { marginRight: 15 },
  textoMensagem: { fontSize: 14, fontWeight: '600', color: '#333', flex: 1, lineHeight: 20 },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalMensagem: {
    width: width * 0.85,
    borderRadius: 20,
    padding: 20,
    flexDirection: 'column',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  modalMensagemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  conteudoMensagemModal: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  iconeMensagemModal: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoFecharMensagem: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.65)',
  },
  textoMensagemModal: {
    width: '100%',
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    lineHeight: 24,
    textAlign: 'center',
  },
  badgeIntensidade: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.65)',
  },
  textoBadgeIntensidade: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4b5563',
  },

  /* Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: width * 0.85,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  modalTitulo: { fontSize: 18, fontWeight: '700', color: '#333', marginBottom: 15 },
  modalSubtitulo: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  intensidadeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  botaoIntensidade: {
    width: '30%',
    minWidth: 72,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3e8ff',
    borderWidth: 1,
    borderColor: '#d8b4fe',
  },
  botaoIntensidadeDesabilitado: {
    opacity: 0.6,
  },
  textoBotaoIntensidade: {
    fontSize: 18,
    fontWeight: '700',
    color: '#7e22ce',
  },
  loadingMensagemContainer: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  loadingMensagemTexto: {
    color: '#666',
    fontSize: 13,
  },
  inputNovaEmocao: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: '#333',
    marginBottom: 15,
  },
  botoesModal: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  botaoModal: { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  botaoCancelar: { backgroundColor: '#f3f4f6' },
  botaoConfirmar: { backgroundColor: '#9333ea' },
  textoBotaoCancelar: { color: '#666', fontWeight: '600' },
  textoBotaoConfirmar: { color: '#fff', fontWeight: '600' },
});

export default DiarioEmocoesScreen;
