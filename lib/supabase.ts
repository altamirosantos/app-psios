import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import 'react-native-url-polyfill/auto';

const supabaseUrl = 'https://lhrdphbgmsxijzuyrtwc.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxocmRwaGJnbXN4aWp6dXlydHdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1MzgxNzYsImV4cCI6MjA2ODExNDE3Nn0._EcZS3Amlw5Msvv2qpx1qTptUTVTUPm34OqK7g-ZAGM'

//const isWeb = typeof window !== 'undefined' && typeof window.document !== 'undefined';
const isWeb = Platform.OS === 'web';

console.log('isWeb', isWeb);

export const supabase = isWeb
    ? createClient(supabaseUrl, supabaseAnonKey) // config padrão para web, usa localStorage
    : createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
            storage: AsyncStorage,
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: false,
        },
    });

export async function getPlanoAtivo(userId: string) {
    const { data, error } = await supabase
        .from('plano_usuario')
        .select('plano_id')
        .eq('user_id', userId)
        .eq('status', 'ativo')
        .single();

    if (error || !data) {
        return null; // Nenhum plano ativo
    }

    return data.plano_id; // Ex: 'gratis', 'basico', 'premium'
}

/**
 * Constrói URL completa do arquivo no storage Supabase
 * @param fileName - Nome do arquivo (ex: 'respiracao.mp3')
 * @param bucket - Nome do bucket (padrão: 'psios_midias')
 * @returns URL pública completa do arquivo
 */
export function getStorageUrl(fileName: string | null, bucket: string = 'psios_midias'): string | null {
    if (!fileName) return null;
    // Se for URL completa já, retorna como está
    if (fileName.startsWith('http://') || fileName.startsWith('https://')) {
        return fileName;
    }
    // Constrói URL do storage Supabase
    return `${supabaseUrl}/storage/v1/object/public/${bucket}/${fileName}`;
}

export async function getPlanosDisponiveis() {
    const { data, error } = await supabase
        .from('planos')
        .select('*')
        .order('valor', { ascending: true });

    if (error) {
        console.error('Erro ao buscar planos:', error);
        return [];
    }

    return data;
}