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

// Componente separado para o Slider de Escala
const SliderEscala = ({
    pergunta,
    etapaUuid,
    respostaAtual,
    setResposta,
    textColor,
    setScrollEnabled,
}: {
    pergunta: any;
    etapaUuid: string;
    respostaAtual: any;
    setResposta: (etapaUuid: string, questionUuid: string, valor: any) => void;
    textColor: string;
    setScrollEnabled: (enabled: boolean) => void;
}) => {
    const min = pergunta.faixas[0];
    const max = pergunta.faixas[pergunta.faixas.length - 1];

    // Debug: Verificar valores
    console.log('🎚️ Slider Debug:', {
        min,
        max,
        respostaAtual,
        questionUuid: pergunta.questionUuid
    });

    // Inicializa com o valor do contexto ou com o mínimo
    const savedValue = typeof respostaAtual === 'number' ? respostaAtual : null;
    const initialValue = savedValue !== null ? savedValue : min;

    // Usa estado local para melhor responsividade no Android
    const [localValue, setLocalValue] = React.useState(initialValue);

    console.log('🎚️ Valor local:', localValue);

    // Sincroniza o estado local quando a resposta salva mudar
    React.useEffect(() => {
        if (typeof savedValue === 'number') {
            console.log('🔄 Sincronizando valor:', savedValue);
            setLocalValue(savedValue);
        }
    }, [savedValue]);

    // Inicializa a resposta com o valor mínimo se estiver vazia
    React.useEffect(() => {
        if (savedValue === null) {
            console.log('🆕 Inicializando com valor mínimo:', min);
            setResposta(etapaUuid, pergunta.questionUuid, min);
            setLocalValue(min);
        }
    }, [min, savedValue, etapaUuid, pergunta.questionUuid]);

    const handleValueChange = (v: number) => {
        console.log('📊 Valor mudando:', v);
        setLocalValue(v);
    };

    const handleSlidingComplete = (v: number) => {
        console.log('✅ Deslize completo:', v);
        setScrollEnabled(true);
        setResposta(etapaUuid, pergunta.questionUuid, v);
    };

    return (
        <>
            <View style={styles.sliderValueContainer}>
                <Text style={[styles.sliderValueText, { color: textColor }]}>
                    {localValue}
                </Text>
            </View>

            {Platform.OS === 'web' ? (
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={1}
                    value={localValue}
                    onChange={(e) => {
                        const newValue = Number(e.target.value);
                        setLocalValue(newValue);
                        setResposta(etapaUuid, pergunta.questionUuid, newValue);
                    }}
                    style={{ width: '100%' }}
                />
            ) : (
                <Slider
                    minimumValue={min}
                    maximumValue={max}
                    step={1}
                    value={localValue}
                    disabled={false}
                    onValueChange={handleValueChange}
                    onSlidingStart={() => {
                        console.log('👆 Iniciou deslize');
                        setScrollEnabled(false);
                    }}
                    onSlidingComplete={handleSlidingComplete}
                    minimumTrackTintColor="#4CAF50"
                    maximumTrackTintColor="#ddd"
                    thumbTintColor="#4CAF50"
                    style={{ width: '100%', height: 40 }}
                />
            )}

            <View style={styles.sliderLabels}>
                {pergunta.labels.map((label: string, i: number) => (
                    <View key={i} style={styles.labelContainer}>
                        <Text style={[styles.labelText, { color: textColor }]}>
                            {label}
                        </Text>
                    </View>
                ))}
            </View>
        </>
    );
};

const PassoDinamico = ({ data, onNext }: { data: any; onNext: () => void }) => {

    const textColor = useThemeColor('text');
    const cardColor = useThemeColor('cardBackground');
    const inputBg = useThemeColor('inputBackground');

    const [respostas, setRespostas] = useState<Respostas>({
        etapas: [],
    });

    const [selecionado, setSelecionado] = useState<any | null>(null);
    const [scrollEnabled, setScrollEnabled] = useState(true);

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
                    <Text style={[styles.enunciado, { color: textColor }]}>
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
                                                (respostaAtual === item.descricao || (item.descricao === 'Outro' && outroSelecionado)) && {
                                                    backgroundColor: inputBg,
                                                },
                                            ]}
                                            onPress={() => {
                                                if (item.descricao === 'Outro') {
                                                    if (outroSelecionado) {
                                                        setResposta(
                                                            etapaUuid,
                                                            pergunta.questionUuid,
                                                            null
                                                        );
                                                    } else {
                                                        setResposta(
                                                            etapaUuid,
                                                            pergunta.questionUuid,
                                                            'Outro:'
                                                        );
                                                    }
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
                                                    <Text style={[styles.opcaoSubTexto, { color: textColor, opacity: 0.6 }]}>
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
                            const nenhumSelecionado = resposta.some(v => v.startsWith('Nenhum dos anteriores'));
                            const nenhumSimplesSelecionado = resposta.includes('Nenhum');
                            const textoNenhum = resposta.find(v => v.startsWith('Nenhum dos anteriores:'))?.replace('Nenhum dos anteriores:', '').trim() || '';

                            return (
                                <>
                                    {pergunta.opcoes.map((item: any) => (
                                        <TouchableOpacity
                                            key={item.descricao}
                                            style={[
                                                styles.opcao,
                                                (resposta.includes(item.descricao) || (item.descricao === 'Nenhum dos anteriores (outro)' && nenhumSelecionado)) && {
                                                    backgroundColor: inputBg,
                                                },
                                            ]}
                                            onPress={() => {
                                                if (item.descricao === 'Nenhum') {
                                                    // Se marcar "Nenhum", desmarcar todas as outras opções
                                                    if (nenhumSimplesSelecionado) {
                                                        setResposta(
                                                            etapaUuid,
                                                            pergunta.questionUuid,
                                                            resposta.filter(v => v !== 'Nenhum')
                                                        );
                                                    } else {
                                                        setResposta(
                                                            etapaUuid,
                                                            pergunta.questionUuid,
                                                            ['Nenhum']
                                                        );
                                                    }
                                                } else if (item.descricao === 'Nenhum dos anteriores (outro)') {
                                                    // Se marcar "Nenhum dos anteriores", desmarcar todos os outros
                                                    if (nenhumSelecionado) {
                                                        setResposta(
                                                            etapaUuid,
                                                            pergunta.questionUuid,
                                                            resposta.filter(v => !v.startsWith('Nenhum dos anteriores'))
                                                        );
                                                    } else {
                                                        setResposta(
                                                            etapaUuid,
                                                            pergunta.questionUuid,
                                                            ['Nenhum dos anteriores:']
                                                        );
                                                    }
                                                } else {
                                                    // Se marcar qualquer outra opção, desmarcar "Nenhum" e "Nenhum dos anteriores"
                                                    const novaResposta = resposta.filter(v => v !== 'Nenhum' && !v.startsWith('Nenhum dos anteriores'));
                                                    
                                                    if (novaResposta.includes(item.descricao)) {
                                                        setResposta(
                                                            etapaUuid,
                                                            pergunta.questionUuid,
                                                            novaResposta.filter(v => v !== item.descricao)
                                                        );
                                                    } else {
                                                        setResposta(
                                                            etapaUuid,
                                                            pergunta.questionUuid,
                                                            [...novaResposta, item.descricao]
                                                        );
                                                    }
                                                }
                                            }}
                                        >
                                            <View style={styles.checkbox}>
                                                {(resposta.includes(item.descricao) || (item.descricao === 'Nenhum dos anteriores (outro)' && nenhumSelecionado)) && (
                                                    <View style={styles.checkboxChecked} />
                                                )}
                                            </View>
                                            <View style={styles.opcaoTextContainer}>
                                                <Text style={[styles.opcaoTexto, { color: textColor }]}>
                                                    {item.descricao}
                                                </Text>
                                                {item.subdescricao && (
                                                    <Text style={[styles.opcaoSubTexto, { color: textColor, opacity: 0.6 }]}>
                                                        {item.subdescricao}
                                                    </Text>
                                                )}
                                            </View>
                                        </TouchableOpacity>
                                    ))}

                                    {/* INPUT PARA "NENHUM DOS ANTERIORES (OUTRO)" */}
                                    {nenhumSelecionado && (
                                        <TextInput
                                            style={[
                                                styles.inputOutro,
                                                { backgroundColor: inputBg, color: textColor },
                                            ]}
                                            placeholder="Digite aqui..."
                                            placeholderTextColor="#999"
                                            value={textoNenhum}
                                            onChangeText={(texto: any) => {
                                                if (texto.trim()) {
                                                    setResposta(
                                                        etapaUuid,
                                                        pergunta.questionUuid,
                                                        [`Nenhum dos anteriores: ${texto}`]
                                                    );
                                                } else {
                                                    setResposta(
                                                        etapaUuid,
                                                        pergunta.questionUuid,
                                                        ['Nenhum dos anteriores:']
                                                    );
                                                }
                                            }}
                                        />
                                    )}
                                </>
                            );
                        }


                        case 'ESCALA':
                            return (
                                <SliderEscala
                                    pergunta={pergunta}
                                    etapaUuid={etapaUuid}
                                    respostaAtual={respostaAtual}
                                    setResposta={setResposta}
                                    textColor={textColor}
                                    setScrollEnabled={setScrollEnabled}
                                />
                            );

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
                                                    style={[
                                                        styles.emojiLabel,
                                                        { color: textColor }
                                                    ]}
                                                >
                                                    {item.label}
                                                </Text>
                                                {item.subdescricao && (
                                                    <Text style={[styles.emojiSubLabel, { color: textColor, opacity: 0.6 }]}>
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
            <ScrollView scrollEnabled={scrollEnabled}>
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
    },
    inputOutro: {
        borderRadius: 8,
        padding: 10,
        marginTop: 8,
        fontSize: 14,
    }
});

