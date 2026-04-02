// src/context/FormContext.tsx
import React, { createContext, useContext, useState } from 'react';

/**
 * Tipos de resposta possíveis conforme o backend
 */
export type RespostaValor =
  | string              // SELECT
  | string[]            // MULTISELECT
  | number              // ESCALA
  | null;

/**
 * groupUuid -> questionUuid -> resposta
 */
export type FormData = {
  [etapaUuid: string]: {
    [questionUuid: string]: RespostaValor;
  };
};

/**
 * Metadados de uma pergunta (para transformação final)
 */
export type PerguntaMetadata = {
  questionUuid: string;
  etapaUuid: string;
  contextoId: string;
  descricao: string;
  ordem: number;
  etapaOrdem: number;
  descricaoContexto: string; // Descrição do contexto (não da etapa)
};

/**
 * Mapa de perguntas: questionUuid -> metadados
 */
export type PerguntasMap = {
  [questionUuid: string]: PerguntaMetadata;
};

type FormContextType = {
  dadosForm: FormData;
  perguntasMap: PerguntasMap;
  respostasTransformadas: any;

  setResposta: (
    etapaUuid: string,
    questionUuid: string,
    valor: RespostaValor
  ) => void;

  getResposta: (
    etapaUuid: string,
    questionUuid: string
  ) => RespostaValor | undefined;

  // 🔥 Novo: Registrar metadados de perguntas
  registrarPerguntas: (
    etapaUuid: string,
    etapaOrdem: number,
    contextoId: string,
    descricaoContexto: string,
    perguntas: Array<{ questionUuid: string; descricao: string; ordem: number }>
  ) => void;

  // 🔥 Novo: Armazenar respostas transformadas para envio em PassoFinaliza
  setRespostasTransformadas: (respostas: any) => void;

  resetForm: () => void;
};

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider = ({ children }: { children: React.ReactNode }) => {
  const [dadosForm, setDadosForm] = useState<FormData>({});
  const [perguntasMap, setPerguntasMap] = useState<PerguntasMap>({});
  const [respostasTransformadas, setRespostasTransformadas] = useState<any>(null);

  const setResposta = (
    etapaUuid: string,
    questionUuid: string,
    valor: RespostaValor
  ) => {
    setDadosForm((prev) => ({
      ...prev,
      [etapaUuid]: {
        ...(prev[etapaUuid] || {}),
        [questionUuid]: valor,
      },
    }));
  };

  const getResposta = (
    etapaUuid: string,
    questionUuid: string
  ) => {
    return dadosForm?.[etapaUuid]?.[questionUuid];
  };

  const registrarPerguntas = (
    etapaUuid: string,
    etapaOrdem: number,
    contextoId: string,
    descricaoContexto: string,
    perguntas: Array<{ questionUuid: string; descricao: string; ordem: number }>
  ) => {
    setPerguntasMap((prev) => {
      const novo = { ...prev };
      perguntas.forEach(p => {
        novo[p.questionUuid] = {
          questionUuid: p.questionUuid,
          etapaUuid,
          contextoId,
          descricao: p.descricao,
          ordem: p.ordem,
          etapaOrdem,
          descricaoContexto,
        };
      });
      return novo;
    });
  };

  const resetForm = () => {
    setDadosForm({});
    setPerguntasMap({});
  };

  return (
    <FormContext.Provider
      value={{
        dadosForm,
        perguntasMap,
        respostasTransformadas,
        setResposta,
        getResposta,
        registrarPerguntas,
        setRespostasTransformadas,
        resetForm,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

export const useForm = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useForm must be used within a FormProvider');
  }
  return context;
};
