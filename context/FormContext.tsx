// src/context/FormContext.tsx
import React, { createContext, useContext, useState } from 'react';

type FormData = {
  passo01Pergunta1?: string;
  passo02Pergunta1?: string[];
  passo03Pergunta1?: string;
  passo04Pergunta1?: string[];
  passo05Pergunta1?: string;
  passo05Pergunta2?: string;
  passo05Pergunta3?: string;
  passo05Pergunta4?: string[];
  passo05Pergunta5?: string;
  passo06Pergunta1?: string;
  passo07Pergunta1?: string[];
  passo08Pergunta1?: string;
  passo08Pergunta2?: string;
  passo08Pergunta3?: string;
  passo08Pergunta4?: string;
  passo09Pergunta1?: string;
  passo09Pergunta2?: string; 
  passo09Pergunta3?: string;
  passo09Pergunta4?: (string | null[]);
  passo09Pergunta5?:string
  passo09Pergunta6?:string
  passo10Pergunta1?: string;
  passo11Pergunta1?: string;
  passo11Pergunta2?: string;
};

type FormContextType = {
  dadosForm: FormData;
  updateForm: (fields: Partial<FormData>) => void;
  resetForm: () => void;
};

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider = ({ children }: { children: React.ReactNode }) => {
  const [dadosForm, setDadosForm] = useState<FormData>({});

  const updateForm = (fields: Partial<FormData>) => {
    setDadosForm((prev) => ({ ...prev, ...fields }));
  };

  const resetForm = () => {
    setDadosForm({});
  };

  return (
    <FormContext.Provider value={{ dadosForm, updateForm, resetForm }}>
      {children}
    </FormContext.Provider>
  );
};

export const useForm = () => {
  const context = useContext(FormContext);
  if (!context) throw new Error('useForm must be used within a FormProvider');
  return context;
};
