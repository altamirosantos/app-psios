interface Resposta {
  id: string;
  descricao: string;
  emoji: string | null;
  color: string | null;
  ordem: number | null;
}

interface Pergunta {
  id: string;
  tipo: string;
  titulo: string | null;
  descricao: string | null;
  nota: number | null;
  faixas: any;
  legendas: any;
  respostas: Resposta[];
}

interface EtapaPergunta {
  ordem: number | null;
  perguntas: Pergunta;
}

export interface Etapa {
  id: string;
  titulo: string;
  subtitulo: string;
  ordem: number | null;
  contexto_id: string;
  etapa_pergunta: EtapaPergunta[];
}
