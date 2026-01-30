import { supabase } from '@/lib/supabase';
import { Etapa } from './interfaces';

class EtapaService {
  async getEtapaById(etapaId: string) {
    const { data, error } = await supabase
      .from('etapa')
      .select(`
        id,
        titulo,
        subtitulo,
        ordem,
        contexto_id,
        contexto (
          id,
          descricao,
          ordem
        ),
        etapa_pergunta (
          ordem,
          perguntas (
            id,
            tipo,
            titulo,
            descricao,
            nota,
            faixas,
            legendas,
            respostas (
              id,
              descricao,
              emoji,
              color,
              ordem 
            )
          )
        )
      `)
      .eq('id', etapaId)
      .maybeSingle<Etapa>();

    if (error) {
      console.error('[EtapaService] getEtapaById', error);
      throw new Error('Erro ao buscar etapa');
    }

    if (!data) return null;

    const etapaOrdenada = {
      ...data,
      etapa_pergunta: data.etapa_pergunta.map(ep => ({
        ...ep,
        perguntas: {
          ...ep.perguntas,
          respostas: [...ep.perguntas.respostas].sort(
            (a, b) => (a.ordem ?? 0) - (b.ordem ?? 0)
          )
        }
      }))
    };




    return this.mapToJson(etapaOrdenada);
  }



  // ======================
  // 🔁 Mapeamento da etapa
  // ======================
  private mapToJson(data: any) {
    return {
      etapaUuid: data.id,
      contextoId: data.contexto_id ?? '',
      descricaoContexto: data.contexto?.descricao ?? '',
      contextoOrdem: data.contexto?.ordem ?? 0,
      titulo: data.titulo,
      subtitulo: data.subtitulo,
      ordem: data.ordem,
      perguntas: data.etapa_pergunta
        .sort((a: any, b: any) => a.ordem - b.ordem)
        .map((item: any) => this.mapPergunta(item)),
    };
  }

  // =========================
  // 🔁 Mapeamento da pergunta
  // =========================
  private mapPergunta(item: any) {
    const pergunta = item.perguntas;

    const base = {
      questionUuid: pergunta.id,
      tipo: pergunta.tipo,
      titulo: pergunta.titulo ?? '',
      descricao: pergunta.descricao,
      nota: pergunta.nota,
      ordem: item.ordem,
      analisavel: item.eletiva_ia ?? false,
    };

    // 🎯 ESCALA
    if (pergunta.tipo === 'ESCALA') {
      return {
        ...base,
        faixas: this.parseJson(pergunta.faixas),
        labels: this.parseJson(pergunta.legendas),
      };
    }

    // 🎯 SELECT | MULTISELECT | SELECT_EMOJI
    return {
      ...base,
      opcoes: (pergunta.respostas ?? []).map((r: any) =>
        pergunta.tipo === 'SELECT_EMOJI'
          ? {
            emoji: r.emoji,
            label: r.descricao,
            color: r.color,
          }
          : r.descricao
      ),
    };
  }

  // ======================
  // 🧠 Parse seguro de JSON
  // ======================
  private parseJson(value: any) {
    if (!value) return [];
    if (Array.isArray(value)) return value;

    try {
      return JSON.parse(value);
    } catch {
      return [];
    }
  }

  // 🔥 Retorna TODAS as etapas de uma avaliação (ordenadas por contexto.ordem e etapa.ordem)
  async getEtapasByAvaliacao(avaliacaoId: string) {
    const { data: avaliacao, error: avaliacaoError } = await supabase
      .from('avaliacao')
      .select(`
        id,
        contexto (
          id,
          descricao,
          ordem,
          etapa (
            id,
            titulo,
            subtitulo,
            ordem,
            contexto_id
          )
        )
      `)
      .eq('id', avaliacaoId)
      .maybeSingle();

    if (avaliacaoError) {
      console.error('[EtapaService] getEtapasByAvaliacao', avaliacaoError);
      throw new Error('Erro ao buscar etapas da avaliação');
    }

    if (!avaliacao) return [];

    // Flatten e ordena etapas por contexto.ordem e etapa.ordem
    const etapas: any[] = [];
    (avaliacao.contexto ?? [])
      .sort((a: any, b: any) => (a.ordem ?? 0) - (b.ordem ?? 0))
      .forEach((ctx: any) => {
        (ctx.etapa ?? [])
          .sort((a: any, b: any) => (a.ordem ?? 0) - (b.ordem ?? 0))
          .forEach((etapa: any) => {
            etapas.push({
              id: etapa.id,
              titulo: etapa.titulo,
              subtitulo: etapa.subtitulo,
              ordem: etapa.ordem,
              contexto_id: etapa.contexto_id,
            });
          });
      });

    return etapas;
  }

  // 🔥 Retorna a próxima etapa baseado na posição (ordem) atual
  async getProximaEtapa(proximaOrdem: number, avaliacaoId: string) {
    if (proximaOrdem === undefined || !avaliacaoId) return null;

    // Busca todas as etapas da avaliação
    const etapas = await this.getEtapasByAvaliacao(avaliacaoId);

    // Encontra a etapa na posição especificada (ordem começa em 1)
    const proximaEtapa = etapas.find(e => e.ordem === proximaOrdem);
    
    if (!proximaEtapa) return null;

    // Busca os dados completos da etapa
    return this.getEtapaById(proximaEtapa.id);
  }

  // Transforma um registro de `etapa_pergunta` em uma `pergunta` limpa para retorno
  private mapPerguntaFromEtapaPergunta(item: any, etapaId: string | null) {
    const pergunta = item.perguntas ?? {};

    const respostas = (pergunta.respostas ?? []).map((r: any) => ({
      descricao: r.descricao,
    }));

    const perguntaObj: any = {
      pergunta_id: pergunta.id,
      nome: pergunta.titulo ?? pergunta.nome ?? '',
      descricao: pergunta.descricao ?? '',
      tipo: pergunta.tipo ?? null,
      nota: pergunta.nota ?? null,
      ordem: item.ordem ?? 0,
      analisavel: item.analisavel ?? item.eletiva_ia ?? false,
      respostas,
    };

    if (pergunta.tipo === 'ESCALA') {
      perguntaObj.faixas = this.parseJson(pergunta.faixas);
      perguntaObj.labels = this.parseJson(pergunta.legendas);
    }

    return perguntaObj;
  }

}

// 🔥 Singleton
export const etapaService = new EtapaService();
