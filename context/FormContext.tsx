// src/context/FormContext.tsx
import React, { createContext, useContext, useState } from 'react';

type FormData = {
  sentimentoSelecionado?: string;
  selectedEmotions?: string[];
  ocupacoes?: string;
  selecionadoComoCostumaLidar?: string;
  selecionadoPensarFuturo?: string;
  sliderValuePreparado?: number;
  passo5Card1?: string;
  passo5Card2?: string;
  passo5Card3?: string;
  passo5Card4?: string;
  passo5Card5?: string;
  passo5Card6?: string;
  selectedItemsPasso6?: string[];
  passo7Card1?: number;
  passo8Oque?: string; 
  passo8Quando?: string;
  passo8ComoSeComportou?: string;
  passo8AlguemEnvolvido?: string;
  passo8Gatilho?: string;
  passo8Pensamento?: string;
  distorcoesPensamento?: string[];
  enxergarMundo?: string;
  espelho?: string;
};

type FormContextType = {
  data: FormData;
  updateForm: (fields: Partial<FormData>) => void;
  resetForm: () => void;
};

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider = ({ children }: { children: React.ReactNode }) => {
  const [data, setData] = useState<FormData>({});

  const updateForm = (fields: Partial<FormData>) => {
    setData((prev) => ({ ...prev, ...fields }));
  };

  const resetForm = () => {
    setData({});
  };

  return (
    <FormContext.Provider value={{ data, updateForm, resetForm }}>
      {children}
    </FormContext.Provider>
  );
};

export const useForm = () => {
  const context = useContext(FormContext);
  if (!context) throw new Error('useForm must be used within a FormProvider');
  return context;
};
