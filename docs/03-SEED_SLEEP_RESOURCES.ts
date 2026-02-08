// Exemplo de dados para test da SonoRelaxamentoScreen
// Execute isso no console do Supabase ou via API

// 1. Criar categoria "Sono" (execute uma vez)
export const createSleepCategory = async (supabase: any) => {
    const { data, error } = await supabase
        .from('categories')
        .insert({ name: 'Sono', description: 'Recursos para melhor sono e relaxamento' })
        .select()
        .single();

    if (error) throw error;
    return data?.id;
};

// 2. Criar recursos de exemplo
export const createSampleResources = async (supabase: any, categoryId: string) => {
    const resources = [
        {
            title: 'Respiração Profunda - 5 min',
            description: 'Exercício simples de respiração diafragmática para acalmar a mente',
            type: 'audio',
            url: 'respiracao-profunda.mp3', // Nome do arquivo no bucket psios_midias
            duration: 5,
            tags: ['respiração', 'relaxamento', 'iniciante'],
        },
        {
            title: 'Meditação Guiada para Dormir',
            description: 'Meditação especial de 10 minutos para preparar o corpo e mente para o sono',
            type: 'audio',
            url: 'meditacao-sono.mp3', // Nome do arquivo no bucket psios_midias
            duration: 10,
            tags: ['meditação', 'sono', 'guidado'],
        },
        {
            title: 'Técnica de Relaxamento Progressivo',
            description: 'Método comprovado para relaxar músculos e reduzir ansiedade. Recomenda-se 15-20 min antes de dormir.',
            type: 'text',
            url: null, // Tipo text não usa arquivo
            tags: ['relaxamento', 'técnica', 'científico'],
        },
        {
            title: 'Sons da Natureza - Chuva',
            description: 'Sons relaxantes de chuva para criar ambiente propício ao sono',
            type: 'audio',
            url: 'chuva-sons-natureza.mp3', // Nome do arquivo no bucket psios_midias
            duration: 60,
            tags: ['sons natureza', 'ambiente', 'longa duração'],
        },
        {
            title: 'Yoga para o Sono',
            description: 'Sequência de yoga restorador para relaxar antes de dormir',
            type: 'video',
            url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // URLs completas (youtube, vimeo) são mantidas como estão
            duration: 20,
            tags: ['yoga', 'flexibilidade', 'estiramento'],
        },
    ];

    const { data: createdResources, error: resourceError } = await supabase
        .from('resources')
        .insert(resources)
        .select();

    if (resourceError) throw resourceError;

    // 3. Associar recursos à categoria
    const associations = createdResources.map((resource: any) => ({
        resource_id: resource.id,
        category_id: categoryId,
    }));

    const { error: associationError } = await supabase
        .from('resource_categories')
        .insert(associations);

    if (associationError) throw associationError;

    return createdResources;
};

// Uso:
/*
import { supabase } from '@/lib/supabase';

try {
    const categoryId = await createSleepCategory(supabase);
    console.log('✅ Categoria criada:', categoryId);

    const resources = await createSampleResources(supabase, categoryId);
    console.log('✅ Recursos criados:', resources.length);
} catch (error) {
    console.error('❌ Erro:', error);
}
*/

// ============================================
// DADOS DE TESTE (SQL format para Supabase)
// ============================================

// Categories
/*
INSERT INTO categories (name, description) VALUES
('Sono', 'Recursos para melhor sono e relaxamento'),
('Meditação', 'Práticas de meditação e atenção plena'),
('Exercício', 'Atividades físicas e alongamento'),
('Nutrição', 'Dicas de alimentação saudável');
*/

// Resources (exemplo)
// NOTE: O campo 'url' deve conter:
//   - Nome do arquivo para tipos audio/video/image (será convertido para URL do storage psios_midias)
//   - URL completa para tipos video com YouTube/Vimeo/etc
//   - NULL para tipos text
/*
INSERT INTO resources (title, description, type, url, duration, tags) VALUES
(
    'Respiração Profunda - 5 min',
    'Exercício simples de respiração diafragmática para acalmar a mente',
    'audio',
    'respiracao-profunda.mp3',
    5,
    '{respiração,relaxamento,iniciante}'
),
(
    'Meditação Guiada para Dormir',
    'Meditação especial de 10 minutos para preparar o corpo e mente para o sono',
    'audio',
    'meditacao-sono.mp3',
    10,
    '{meditação,sono,guidado}'
),
(
    'Técnica de Relaxamento Progressivo',
    'Método comprovado para relaxar músculos e reduzir ansiedade',
    'text',
    NULL,
    NULL,
    '{relaxamento,técnica,científico}'
);
*/

// Resource Categories (associação)
/*
INSERT INTO resource_categories (resource_id, category_id) SELECT 
r.id,
c.id
FROM resources r
CROSS JOIN categories c
WHERE r.title = 'Respiração Profunda - 5 min' AND c.name = 'Sono';
*/
