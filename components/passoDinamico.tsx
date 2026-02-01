import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { CustomButton } from '@/components/CustomButton';
import { RespostaValor, useForm } from '@/context/FormContext2';
import { useThemeColor } from '@/hooks/useThemeColor';
import { supabase } from '@/lib/supabase';

const { width } = Dimensions.get('window');

/**
 * respostas[groupUuid][questionUuid] = valor
 */
type PerguntaResposta = {
    id: string; // questionUuid
    value: string | string[] | number;
    analisavel: boolean;
};

type EtapaResposta = {
    id: string; // etapaUuid
    perguntas: PerguntaResposta[];
};

type Respostas = {
    etapas: EtapaResposta[];
};


const PassoDinamico = ({ data, onNext }: { data: any; onNext: () => void }) => {

    const textColor = useThemeColor('text');
    const cardColor = useThemeColor('cardBackground');
    const inputBg = useThemeColor('inputBackground');

    const [respostas, setRespostas] = useState<Respostas>({
        etapas: [],
    });

    const [selecionado, setSelecionado] = useState<any | null>(null);


    const etapaUuid = data.etapaUuid;

    const { setResposta, getResposta } = useForm();  // <- pegou o context

    const [nome, setNome] = useState<string | null>(null);

    const getImageUrl = (imagePath: string) => {
        const { data } = supabase
            .storage
            .from("psios_public")
            .getPublicUrl(imagePath);
        return data.publicUrl;
    };

    useEffect(() => {
        const buscarUsuario = async () => {
            const { data, error } = await supabase.auth.getSession();

            if (error) {
                console.error('Erro ao buscar sessão:', error);
                return;
            }

            const user = data?.session?.user;
            console.log('session >>>>>>  ', data.session);

            if (user) {
                // const nomeUsuario = user.user_metadata?.full_name || user.email || 'Usuário';

                const { data: profile, error: profileError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                if (profileError) {
                    console.error('Erro ao buscar perfil do usuário:', profileError.message);
                    return;
                }
                setNome(profile.apelido + ',' || profile.nome + ',' || '');
            }
        };

        buscarUsuario();
    }, []);


    const toggleMulti = (questionUuid: string, value: string) => {
        const atual = (getResposta(etapaUuid, questionUuid) as string[]) || [];

        setResposta(
            etapaUuid,
            questionUuid,
            atual.includes(value)
                ? atual.filter((v) => v !== value)
                : [...atual, value]
        );
    };

    const handleNext = () => {
        console.log('Payload para backend:', respostas);
        onNext();
        // router.push('/passo9');
    };

    const PerguntaHeader = ({ pergunta }: { pergunta: any }) => {
        const nomeSeguro = nome ?? '';
        const descricaoInterpolada = interpolarTexto(
            pergunta.descricao,
            { nome: nomeSeguro }
        );

        return (
            <>
                {pergunta.descricao && (
                    <Text style={[styles.title, { color: textColor }]}>
                        {descricaoInterpolada}
                    </Text>
                )}

                {pergunta.nota && (
                    <Text style={[styles.subtitle, { color: textColor }]}>
                        {pergunta.nota}
                    </Text>
                )}
            </>
        );
    };


    const interpolarTexto = (
        texto: string,
        variaveis: Record<string, string | number>
    ): string => {
        return texto.replace(/\{(\w+)\}/g, (_, key) =>
            variaveis[key] !== undefined ? String(variaveis[key]) : ''
        );
    };

    const todasRespondidas = () => {
        return data.perguntas.every((pergunta: any) => {
            const resposta = getResposta(etapaUuid, pergunta.questionUuid);

            if (resposta === null || resposta === undefined) {
                return false;
            }

            if (Array.isArray(resposta)) {
                return resposta.length > 0;
            }

            if (typeof resposta === 'string') {
                return resposta.trim().length > 0;
            }

            if (typeof resposta === 'number') {
                return true; // ESCALA
            }

            return false;
        });
    };

    const isOutroSelecionado = (resposta: RespostaValor) => {
        if (!resposta) return false;

        if (typeof resposta === 'string') {
            return resposta.startsWith('Outro');
        }

        if (Array.isArray(resposta)) {
            return resposta.some(v => v.startsWith('Outro'));
        }

        return false;
    };

    const getTextoOutro = (resposta: RespostaValor) => {
        if (!resposta) return '';

        if (typeof resposta === 'string') {
            return resposta.replace('Outro:', '').trim();
        }

        if (Array.isArray(resposta)) {
            const outro = resposta.find(v => v.startsWith('Outro:'));
            return outro ? outro.replace('Outro:', '').trim() : '';
        }

        return '';
    };


    const renderPergunta = (pergunta: any) => {
        const respostaAtual = getResposta(etapaUuid, pergunta.questionUuid);

        return (
            <>
                {/* CABEÇALHO PADRÃO */}
                <PerguntaHeader pergunta={pergunta} />

                {/* CONTEÚDO ESPECÍFICO */}
                {(() => {
                    switch (pergunta.tipo) {
                        case 'SELECT': {
                            const outroSelecionado =
                                typeof respostaAtual === 'string' &&
                                respostaAtual.startsWith('Outro');

                            const textoOutro = outroSelecionado
                                ? respostaAtual.replace('Outro:', '').trim()
                                : '';

                            return (
                                <>
                                    {pergunta.opcoes.map((item: any) => (
                                        <TouchableOpacity
                                            key={item.descricao}
                                            style={[
                                                styles.opcao,
                                                respostaAtual === item.descricao && {
                                                    backgroundColor: inputBg,
                                                },
                                            ]}
                                            onPress={() => {
                                                if (item.descricao === 'Outro') {
                                                    setResposta(
                                                        etapaUuid,
                                                        pergunta.questionUuid,
                                                        'Outro:'
                                                    );
                                                } else {
                                                    setResposta(
                                                        etapaUuid,
                                                        pergunta.questionUuid,
                                                        item.descricao
                                                    );
                                                }
                                            }}
                                        >
                                            <View style={styles.radioCirculo}>
                                                {(respostaAtual === item.descricao ||
                                                    (item.descricao === 'Outro' && outroSelecionado)) && (
                                                        <View style={styles.radioSelecionado} />
                                                    )}
                                            </View>
                                            <View style={styles.opcaoTextContainer}>
                                                <Text style={[styles.opcaoTexto, { color: textColor }]}>
                                                    {item.descricao}
                                                </Text>
                                                {item.subdescricao && (
                                                    <Text style={styles.opcaoSubTexto}>
                                                        {item.subdescricao}
                                                    </Text>
                                                )}
                                            </View>
                                        </TouchableOpacity>
                                    ))}

                                    {outroSelecionado && (
                                        <TextInput
                                            style={[
                                                styles.inputOutro,
                                                { backgroundColor: inputBg, color: textColor },
                                            ]}
                                            placeholder="Digite aqui..."
                                            placeholderTextColor="#999"
                                            value={textoOutro}
                                            onChangeText={(texto) =>
                                                setResposta(
                                                    etapaUuid,
                                                    pergunta.questionUuid,
                                                    texto.trim()
                                                        ? `Outro: ${texto}`
                                                        : 'Outro:'
                                                )
                                            }
                                        />
                                    )}
                                </>
                            );
                        }


                        case 'MULTISELECT': {
                            const resposta = (respostaAtual as string[]) || [];
                            const outroSelecionado = isOutroSelecionado(resposta);
                            const textoOutro = getTextoOutro(resposta);

                            return (
                                <>
                                    {pergunta.opcoes.map((item: any) => (
                                        <TouchableOpacity
                                            key={item.descricao}
                                            style={[
                                                styles.opcao,
                                                resposta.includes(item.descricao) && {
                                                    backgroundColor: inputBg,
                                                },
                                            ]}
                                            onPress={() => {
                                                if (item.descricao === 'Outro') {
                                                    if (!outroSelecionado) {
                                                        setResposta(
                                                            etapaUuid,
                                                            pergunta.questionUuid,
                                                            [...resposta, 'Outro:']
                                                        );
                                                    }
                                                } else {
                                                    setResposta(
                                                        etapaUuid,
                                                        pergunta.questionUuid,
                                                        resposta.includes(item.descricao)
                                                            ? resposta.filter(v => v !== item.descricao)
                                                            : [...resposta, item.descricao]
                                                    );
                                                }
                                            }}
                                        >
                                            <View style={styles.checkbox}>
                                                {resposta.includes(item.descricao) && (
                                                    <View style={styles.checkboxChecked} />
                                                )}
                                            </View>
                                            <View style={styles.opcaoTextContainer}>
                                                <Text style={[styles.opcaoTexto, { color: textColor }]}>
                                                    {item.descricao}
                                                </Text>
                                                {item.subdescricao && (
                                                    <Text style={styles.opcaoSubTexto}>
                                                        {item.subdescricao}
                                                    </Text>
                                                )}
                                            </View>
                                        </TouchableOpacity>
                                    ))}

                                    {/* INPUT DO OUTRO */}
                                    {outroSelecionado && (
                                        <TextInput
                                            style={[
                                                styles.inputOutro,
                                                { backgroundColor: inputBg, color: textColor },
                                            ]}
                                            placeholder="Digite aqui..."
                                            placeholderTextColor="#999"
                                            value={textoOutro}
                                            onChangeText={(texto: any) => {
                                                const semOutro = resposta.filter(
                                                    v => !v.startsWith('Outro')
                                                );

                                                if (texto.trim()) {
                                                    setResposta(
                                                        etapaUuid,
                                                        pergunta.questionUuid,
                                                        [...semOutro, `Outro: ${texto}`]
                                                    );
                                                } else {
                                                    setResposta(
                                                        etapaUuid,
                                                        pergunta.questionUuid,
                                                        semOutro
                                                    );
                                                }
                                            }}
                                        />
                                    )}
                                </>
                            );
                        }


                        case 'ESCALA': {
                            const min = pergunta.faixas[0];
                            const max =
                                pergunta.faixas[
                                pergunta.faixas.length - 1
                                ];
                            const value =
                                (respostaAtual as number) ?? min;

                            return (
                                <>
                                    <View style={styles.sliderValueContainer}>
                                        <Text
                                            style={styles.sliderValueText}
                                        >
                                            {value}
                                        </Text>
                                    </View>

                                    {Platform.OS === 'web' ? (
                                        <input
                                            type="range"
                                            min={min}
                                            max={max}
                                            step={1}
                                            value={value}
                                            onChange={(e) =>
                                                setResposta(etapaUuid, pergunta.questionUuid, e.target.value)
                                            }
                                            style={{ width: '100%' }}
                                        />
                                    ) : (
                                        <Slider
                                            minimumValue={min}
                                            maximumValue={max}
                                            step={1}
                                            value={value}
                                            onValueChange={(v) =>
                                                setResposta(etapaUuid, pergunta.questionUuid, v)
                                            }
                                            minimumTrackTintColor="#4CAF50"
                                            maximumTrackTintColor="#ddd"
                                            thumbTintColor="#4CAF50"
                                        />
                                    )}

                                    <View style={styles.sliderLabels}>
                                        {pergunta.labels.map(
                                            (label: string, i: number) => (
                                                <View
                                                    key={i}
                                                    style={
                                                        styles.labelContainer
                                                    }
                                                >
                                                    <Text
                                                        style={[
                                                            styles.labelText,
                                                            {
                                                                color: textColor,
                                                            },
                                                        ]}
                                                    >
                                                        {label}
                                                    </Text>
                                                </View>
                                            )
                                        )}
                                    </View>
                                </>
                            );
                        }

                        case 'SELECT_EMOJI':
                            return (
                                <View style={styles.emojis}>
                                    {pergunta.opcoes.map((item: any) => {
                                        const sel =
                                            selecionado?.label === item.label;

                                        return (
                                            <TouchableOpacity
                                                key={item.label}
                                                style={styles.emojiItem}
                                                onPress={() => {
                                                    setSelecionado(item);
                                                    setResposta(etapaUuid, pergunta.questionUuid, item.label);
                                                }}
                                            >
                                                <Text
                                                    style={[
                                                        styles.emoji,
                                                        {
                                                            borderColor:
                                                                item.color,
                                                            backgroundColor: sel
                                                                ? item.color +
                                                                '33'
                                                                : 'transparent',
                                                            transform: [
                                                                {
                                                                    scale: sel
                                                                        ? 1.2
                                                                        : 1,
                                                                },
                                                            ],
                                                        },
                                                    ]}
                                                >
                                                    {item.emoji}
                                                </Text>
                                                <Text
                                                    style={
                                                        styles.emojiLabel
                                                    }
                                                >
                                                    {item.label}
                                                </Text>
                                                {item.subdescricao && (
                                                    <Text style={styles.emojiSubLabel}>
                                                        {item.subdescricao}
                                                    </Text>
                                                )}
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            );

                        default:
                            return null;
                    }
                })()}
            </>
        );
    };


    return (
        <LinearGradient colors={['#9333ea', '#d763f8']} style={styles.containerRoot}>
            <ScrollView>
                <View style={styles.container}>
                    <Image
                        source={require('@/assets/images/logo.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />

                    {data.titulo && (
                        <View style={[styles.card, { backgroundColor: cardColor }]}>
                            <Text style={[styles.enunciado, { color: textColor }]}>
                                {data.titulo}
                            </Text>
                            <Text style={[styles.nota, { color: textColor }]}>
                                {data.subtitulo}
                            </Text>
                        </View>
                    )}

                    {data.perguntas.map((pergunta: any) => (
                        <>
                            {/* CARD COM IMAGEM (RENDERIZADO APENAS NA PRIMEIRA PERGUNTA) */}
                            {pergunta.image && data.perguntas.indexOf(pergunta) === 0 && (
                                <View style={[styles.card, styles.cardImagem, { backgroundColor: cardColor }]}>
                                    <Image
                                        source={{ uri: getImageUrl(pergunta.image) }}
                                        style={styles.imagemCard}
                                        resizeMode="contain"
                                    />
                                </View>
                            )}

                            {/* CARD COM PERGUNTAS */}
                            <View
                                key={pergunta.questionUuid}
                                style={[styles.card, { backgroundColor: cardColor }]}
                            >
                                {renderPergunta(pergunta)}
                            </View>
                        </>
                    ))}

                    <CustomButton title="Próximo..." onPress={handleNext} disabled={!todasRespondidas()} />
                </View>
            </ScrollView>
        </LinearGradient>
    );
};

export default PassoDinamico;

const styles = StyleSheet.create({
    logo: {
        width: 80,
        height: 80,
        marginBottom: 30,
    },

    containerRoot: {
        flex: 1,
        paddingBottom: 50,
    },

    container: {
        flex: 1,
        padding: 10,
        alignItems: 'center',
    },

    card: {
        borderRadius: 12,
        padding: 16,
        marginVertical: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        width: '100%',
        maxWidth: 400,
        overflow: 'hidden',
    },

    cardImagem: {
        padding: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },

    imagemCard: {
        width: '100%',
        height: Math.min(width - 20, 400) * 0.75,
        borderRadius: 12,
    },

    title: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 12,
    },

    subtitle: {
        fontSize: 12,
        textAlign: 'center',
        marginVertical: 4,
    },
    subsubtitle: {
        fontSize: 14,
        textAlign: 'left',
        marginVertical: 8,
    },

    enunciado: {
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 12,
    },

    nota: {
        fontSize: 12,
        textAlign: 'center',
        marginBottom: 12,
    },

    opcao: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 6,
        borderRadius: 8,
        marginBottom: 10,
    },

    opcaoTexto: {
        fontSize: 16,
        marginEnd: 20,
        flex: 1,
    },

    opcaoTextContainer: {
        flex: 1,
        flexDirection: 'column',
    },

    opcaoSubTexto: {
        fontSize: 12,
        marginEnd: 20,
        flex: 1,
        color: '#666',
        marginTop: 2,
    },

    /* ---------- RADIO (SELECT) ---------- */

    radioCirculo: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#999',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },

    radioSelecionado: {
        height: 10,
        width: 10,
        borderRadius: 5,
        backgroundColor: '#9C27B0',
    },

    /* ---------- CHECKBOX (MULTISELECT) ---------- */

    checkbox: {
        height: 20,
        width: 20,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#999',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },

    checkboxChecked: {
        height: 12,
        width: 12,
        borderRadius: 2,
        backgroundColor: '#9C27B0',
    },

    /* ---------- SLIDER ---------- */

    sliderValueContainer: {
        alignItems: 'center',
        marginTop: 16,
        marginBottom: 4,
    },

    sliderValueText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4CAF50',
    },

    sliderLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },

    labelContainer: {
        flex: 1,
        alignItems: 'center',
    },

    labelText: {
        fontSize: 12,
        textAlign: 'center',
    },

    /* ---------- BOTÃO ---------- */

    button: {
        backgroundColor: '#FFA45E',
        paddingVertical: 16,
        paddingHorizontal: 40,
        borderRadius: 50,
        marginTop: 40,
        width: width - 80,
    },

    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    emojis: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    emojiItem: {
        alignItems: 'center',
        flex: 1,
    },
    emoji: {
        fontSize: 28,
        borderWidth: 2,
        borderRadius: 30,
        padding: 6,
        textAlign: 'center',
        overflow: 'hidden',
    },
    emojiLabel: {
        marginTop: 4,
        fontSize: 12,
        textAlign: 'center',
    },
    emojiSubLabel: {
        marginTop: 2,
        fontSize: 10,
        textAlign: 'center',
        color: '#666',
    },
    inputOutro: {
        borderRadius: 8,
        padding: 10,
        marginTop: 8,
        fontSize: 14,
    }
});

