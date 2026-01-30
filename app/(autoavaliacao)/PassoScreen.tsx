import { useForm } from '@/context/FormContext2';
import { transformarRespostas } from '@/lib/transformRespostas';
import { etapaService } from '@/services/etapa.service';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
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
    const { dadosForm, registrarPerguntas, perguntasMap } = useForm();

    useEffect(() => {
        console.log('📦 Estado global:', dadosForm);
    }, [dadosForm]);

    useEffect(() => {
        if (!etapaId) return;
        const getCurrentEtapa = async () => {
            setLoading(true);
            try {
                console.log('fetchGrupo >>', etapaId);
                // const response = await fetch(`https://suaapi.com/grupos/${groupId}`);
                //   const json = await response.json();
                const etapa = await etapaService.getEtapaById(
                    etapaId
                );
                console.log('etapa >>', etapa);

                /*const json = {
                    "etapaUuid": "c3b2f2c1-8e9a-4c1b-9f2e-123456789abc",
                    "descricao": "Teste",
                    "titulo": "📝 Seu bem-estar é importante! O que você sente agora pode revelar muito sobre o que se passa na sua mente. Vamos juntos observar os sentimentos e pensamentos que influenciam esse momento? Esse é um passo significativo para o seu autocuidado.",
                    "subtitulo": "Preencha abaixo de forma breve e sincera.",
                    "ordem": 1,
                    "perguntas": [
                        {
                            "questionUuid": "c3b2f2c1-8e9a-4c1b-9f2e-123456789abe",
                            "tipo": "SELECT",
                            "titulo": "",
                            "descricao": "💓 Como você se sente hoje?",
                            "nota": "Sua saúde emocional é prioridade?\nCompartilhe como se sente e avance rumo ao seu bem-estar!",
                            "ordem": 1,
                            "analisavel": true,
                            "opcoes": [
                                "Me expresso com facilidade (converso, escrevo, crio).",
                                "Levo um tempo, mas acabo organizando dentro de mim."
                            ]
                        },
                        {
                            "questionUuid": "c3b2f2c1-8e9a-4c1b-9f2e-123456789abh",
                            "tipo": "SELECT_EMOJI",
                            "titulo": "",
                            "descricao": "💓 Como você se sente hoje?",
                            "nota": "Sua saúde emocional é prioridade?\nCompartilhe como se sente e avance rumo ao seu bem-estar!",
                            "ordem": 2,
                            "analisavel": true,
                            "opcoes": [{
                                "emoji": "👍",
                                "label": "Muito Okay",
                                "color": "#ef4444"
                            },
                            {
                                "emoji": "👎",
                                "label": "Nada Okay",
                                "color": "#facc15"
                            },
                            {
                                "emoji": "👎",
                                "label": "Médio",
                                "color": "#facc15"
                            }
                            ]
                        },
                        {
                            "questionUuid": "c3b2f2c1-8e9a-4c1b-9f2e-123456789abf",
                            "tipo": "MULTISELECT",
                            "titulo": "",
                            "descricao": "💓 Como você se sente hoje?",
                            "nota": "Sua saúde emocional é prioridade?\nCompartilhe como se sente e avance rumo ao seu bem-estar!",
                            "ordem": 3,
                            "analisavel": true,
                            "opcoes": [
                                "Me expresso com facilidade (converso, escrevo, crio).",
                                "Levo um tempo, mas acabo organizando dentro de mim."
                            ]
                        },
                        {
                            "questionUuid": "c3b2f2c1-8e9a-4c1b-9f2e-123456789abg",
                            "tipo": "ESCALA",
                            "titulo": "",
                            "descricao": "💓 Como você se sente hoje?",
                            "nota": "Sua saúde emocional é prioridade?\nCompartilhe como se sente e avance rumo ao seu bem-estar!",
                            "ordem": 4,
                            "analisavel": true,
                            "faixas": [
                                0,
                                50,
                                100
                            ],
                            "labels": [
                                "0",
                                "50",
                                "100"
                            ]
                        }
                    ]
                }*/

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
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#9333ea" />
            </View>
        );
    }


    if (!data) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Não foi possível carregar os dados.</Text>
            </View>
        );
    }

    const handleNext = async () => {
        if (!data || !avaliacaoId) return;

        // Busca a próxima etapa (ordem + 1)
        const proxima = await etapaService.getProximaEtapa(data.ordem + 1, avaliacaoId);

        if (proxima?.etapaUuid) {
            router.push(
                `/(autoavaliacao)/PassoScreen?etapaId=${proxima.etapaUuid}&avaliacaoId=${avaliacaoId}`
            );
        } else {
            // ✅ Transformar respostas para formato final
            const respostasTransformadas = transformarRespostas(dadosForm, perguntasMap);
            
            console.log('Payload final original:', dadosForm);
            console.log('Mapa de perguntas:', perguntasMap);
            console.log('Payload final transformado:', respostasTransformadas);

            /* await fetch('https://sua-api.com/autoavaliacao', {
                 method: 'POST',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify(respostasTransformadas),
             });*/

            //router.replace('/(autoavaliacao)/PassoFinaliza');
        }
    };

    return <PassoDinamico data={data} onNext={handleNext} />;
};

export default PassoScreen;
