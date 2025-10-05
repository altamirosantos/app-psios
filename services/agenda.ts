import { supabase } from '@/lib/supabase';

type Agenda = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  scheduled_at: string;
  status: string;
  created_at: string;
  updated_at: string;
};

type Resource = {
  id: string;
  title: string;
  description: string;
  type: string;
  url: string;
  duration: number;
  tags: string[];
};

export const fetchAgendas = async () => {
  const { data, error } = await supabase
    .from('agenda')
    .select('*')
    .order('scheduled_at', { ascending: true });

  if (error) throw new Error(error.message);
  return data;
};

export const createAgenda = async (agenda: Agenda) => {
  const { data, error } = await supabase
    .from('agenda')
    .insert([agenda]);

  if (error) throw new Error(error.message);
  return data;
};

export const updateAgenda = async (id: string, agenda: Agenda) => {
  const { data, error } = await supabase
    .from('agenda')
    .update(agenda)
    .eq('id', id);

  if (error) throw new Error(error.message);
  return data;
};

export const deleteAgenda = async (id: string) => {
  const { error } = await supabase
    .from('agenda')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
};
