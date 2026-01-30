import { FormData, PerguntasMap } from '@/context/FormContext2';

/**
 * Tipo para resposta individual
 */
export type RespostaTransformada = {
    nome_pergunta: string;
    descricao_pergunta: string;
    resposta: string | string[];
};

/**
 * Tipo para contexto com perguntas
 */
export type ContextoTransformado = {
    descricao_contetxo: string;
    perguntas: RespostaTransformada[];
};

/**
 * Tipo para resposta final formatada
 */
export type RespostaFinal = {
    contextos: ContextoTransformado[];
};

/**
 * Transforma o objeto de respostas do contexto em um JSON formatado 
 * com agrupamento por contextos conforme exemplo-respostaFinal.json
 * 
 * Agora usa o mapa de perguntas armazenado no contexto para não perder
 * informações quando navegando entre etapas
 * 
 * @param dadosForm - Objeto de respostas do FormContext2
 * @param perguntasMap - Mapa de metadados das perguntas do FormContext2
 * @returns Objeto com contextos agrupados
 */
export function transformarRespostas(
    dadosForm: FormData,
    perguntasMap: PerguntasMap
): RespostaFinal {
    const respostasTransformadas: RespostaTransformada[] = [];
    const contextoMap = new Map<string, string>(); // contextoId -> descricaoContexto

    // Iterar sobre as respostas
    Object.entries(dadosForm).forEach(([etapaUuid, perguntas]) => {
        Object.entries(perguntas).forEach(([questionUuid, resposta]) => {
            const metadados = perguntasMap[questionUuid];

            // Se não encontrar metadados, pular (pergunta não registrada)
            if (!metadados) return;

            // Armazenar descrição do contexto (por contextoId)
            contextoMap.set(metadados.contextoId, metadados.descricaoContexto);

            // Gerar nome da pergunta baseado na ordem
            const nomePergunta = `passo${String(metadados.etapaOrdem).padStart(2, '0')}Pergunta${String(metadados.ordem).padStart(1, '0')}`;

            // Formatar resposta
            let respostaFormatada: string | string[];

            if (Array.isArray(resposta)) {
                // MULTISELECT - remover prefixo "Outro:" se existir
                respostaFormatada = resposta.map(r => {
                    if (typeof r === 'string' && r.startsWith('Outro:')) {
                        return r.replace('Outro:', '').trim();
                    }
                    return r;
                });
            } else if (typeof resposta === 'string') {
                // SELECT ou texto - remover prefixo "Outro:" se existir
                if (resposta.startsWith('Outro:')) {
                    respostaFormatada = resposta.replace('Outro:', '').trim();
                } else {
                    respostaFormatada = resposta;
                }
            } else if (typeof resposta === 'number') {
                // ESCALA
                respostaFormatada = String(resposta);
            } else {
                respostaFormatada = '';
            }

            respostasTransformadas.push({
                nome_pergunta: nomePergunta,
                descricao_pergunta: metadados.descricao,
                resposta: respostaFormatada,
            });
        });
    });

    // Ordenar por etapa e pergunta
    respostasTransformadas.sort((a, b) => {
        const aMatch = a.nome_pergunta.match(/passo(\d+)Pergunta(\d+)/);
        const bMatch = b.nome_pergunta.match(/passo(\d+)Pergunta(\d+)/);

        if (!aMatch || !bMatch) return 0;

        const [, aEtapa, aPergunta] = aMatch;
        const [, bEtapa, bPergunta] = bMatch;

        const etapaCompare = parseInt(aEtapa) - parseInt(bEtapa);
        if (etapaCompare !== 0) return etapaCompare;

        return parseInt(aPergunta) - parseInt(bPergunta);
    });

    // Agrupar por contexto
    const contextos: ContextoTransformado[] = [];
    const respostasPorContexto = new Map<string, RespostaTransformada[]>();
    const contextoIdPorEtapa = new Map<number, string>(); // etapaOrdem -> contextoId

    // Primeiro, mapear cada etapa ao seu contexto
    Object.values(perguntasMap).forEach(metadados => {
        contextoIdPorEtapa.set(metadados.etapaOrdem, metadados.contextoId);
    });

    // Agrupar respostas por contexto
    respostasTransformadas.forEach(resposta => {
        const match = resposta.nome_pergunta.match(/passo(\d+)/);
        if (match) {
            const etapaOrdem = parseInt(match[1]);
            const contextoId = contextoIdPorEtapa.get(etapaOrdem);
            
            if (contextoId) {
                if (!respostasPorContexto.has(contextoId)) {
                    respostasPorContexto.set(contextoId, []);
                }
                respostasPorContexto.get(contextoId)!.push(resposta);
            }
        }
    });

    // Construir array de contextos ordenado (pela ordem de aparição das etapas)
    const contextosOrdenados = new Set<string>();
    Array.from(contextoIdPorEtapa.keys())
        .sort((a, b) => a - b)
        .forEach(etapaOrdem => {
            const contextoId = contextoIdPorEtapa.get(etapaOrdem);
            if (contextoId) {
                contextosOrdenados.add(contextoId);
            }
        });
    
    contextosOrdenados.forEach(contextoId => {
        const perguntas = respostasPorContexto.get(contextoId) || [];
        const descricao_contetxo = contextoMap.get(contextoId) || '';
        
        contextos.push({
            descricao_contetxo,
            perguntas,
        });
    });

    return {
        contextos,
    };
}
