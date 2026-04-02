import { useAuth } from '@/context/AuthContext';
import { useForm } from '@/context/FormContext2';
import { useThemeColor } from '@/hooks/useThemeColor';
import { supabase } from '@/lib/supabase';
import { transformarRespostas } from '@/lib/transformRespostas';
import { etapaService } from '@/services/etapa.service';
import { getThemeColors } from '@/theme/theme';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Text, View, useColorScheme } from 'react-native';
import PassoDinamico from '../../components/passoDinamico';

type EtapaData = {
    etapaUuid: string;
    contextoId: string;
    descricaoContexto: string;
    contextoOrdem: number;
    titulo: string;
    subtitulo: string;
    ordem: number;
    perguntas: any[];
};

const PassoScreen = () => {
    const params = useLocalSearchParams();
    const etapaId = params.etapaId as string | undefined; // Pode ser undefined no primeiro render
    const avaliacaoId = params.avaliacaoId as string | undefined;
    const [data, setData] = useState<EtapaData | null>(null);
    const [loading, setLoading] = useState(true);
    const { dadosForm, registrarPerguntas, perguntasMap, setRespostasTransformadas } = useForm();
    const { user } = useAuth();
    
    // 🎨 Dark Mode
    const colorScheme = useColorScheme();
    const colors = getThemeColors(colorScheme);
    const textColor = useThemeColor('text');

    useEffect(() => {
        console.log('📦 Estado global:', dadosForm);
    }, [dadosForm]);

    useEffect(() => {
        if (!etapaId) return;
        const getCurrentEtapa = async () => {
            setLoading(true);
            try {
                console.log('fetchGrupo >>', etapaId);

                const etapa = await etapaService.getEtapaById(
                    etapaId
                );
                console.log('etapa >>', etapa);

                setData(etapa);
                // 🔥 Registrar as perguntas no contexto para transformação posterior
                if (etapa) {
                    registrarPerguntas(
                        etapa.etapaUuid,
                        etapa.ordem,
                        etapa.contextoId,
                        etapa.descricaoContexto,
                        etapa.perguntas.map((p: any) => ({
                            questionUuid: p.questionUuid,
                            descricao: p.descricao,
                            ordem: p.ordem,
                        }))
                    );
                }
            } catch (err) {
                console.error(err);
                setLoading(false);
            } finally {
                setLoading(false);
            }
        };

        getCurrentEtapa();
    }, [etapaId]);

    if (loading) {
        return (
            <View style={[{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color="#9333ea" />
            </View>
        );
    }


    if (!data) {
        return (
            <View style={[{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }]}>
                <Text style={{ color: textColor }}>Não foi possível carregar os dados.</Text>
            </View>
        );
    }

    const handleNext = async () => {
        if (!data || !avaliacaoId) return;

        try {
            // Busca a próxima etapa (ordem + 1)
            const proxima = await etapaService.getProximaEtapa(data.ordem + 1, avaliacaoId);

            if (proxima?.etapaUuid) {
                router.push(
                    `/(autoavaliacao)/PassoScreen?etapaId=${proxima.etapaUuid}&avaliacaoId=${avaliacaoId}`
                );
            } else {
                // ✅ Transformar respostas para formato final
                const respostasBase = transformarRespostas(dadosForm, perguntasMap);

                // Obter dados do usuário
                const { data: sessionData } = await supabase.auth.getSession();
                const userSession = sessionData?.session?.user;
                if (!userSession) return;

                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', userSession.id)
                    .single();

                const dadosUser = {
                    idUsuario: userSession.id ?? '',
                    email: userSession.email ?? '',
                    nome: profile?.nome ?? '',
                    apelido: profile?.apelido ?? '',
                    nascimento: profile?.nascimento ?? '',
                    genero: profile?.genero ?? '',
                };

                const respostasTransformadas = {
                    ...respostasBase,
                    dadosUser,
                };

                console.log('Respostas transformadas preparadas:', respostasTransformadas);

                // 🔥 Armazenar no contexto para PassoFinaliza
                setRespostasTransformadas(respostasTransformadas);

                // Navegar para PassoFinaliza (novo passo antes de DiagnosticoScreen)
                router.push('/(autoavaliacao)/passoFinaliza');
            }
        } catch (error) {
            console.error('Erro no handleNext:', error);
            Alert.alert('Erro', 'Ocorreu um erro ao processar a próxima etapa. Tente novamente.');
        }
    };

    return <PassoDinamico data={data} onNext={handleNext} />;
};

export default PassoScreen;
