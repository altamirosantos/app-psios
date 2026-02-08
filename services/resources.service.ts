import { getStorageUrl, supabase } from '@/lib/supabase';

export interface Resource {
    id: string;
    title: string;
    description: string;
    type: 'audio' | 'video' | 'text' | 'image';
    url: string | null;
    duration: number | null;
    tags: string[];
    interactive_data: any;
    created_at: string;
}

/**
 * Transforma um resource com URL de fileName para URL completa do storage
 */
function enrichResourceUrl(resource: any): Resource {
    return {
        ...resource,
        url: getStorageUrl(resource.url),
    };
}

class ResourcesService {
    async getResourcesByCategory(categoryName: string): Promise<Resource[]> {
        try {
            // Primeiro, buscar a categoria
            const { data: categoryData, error: categoryError } = await supabase
                .from('categories')
                .select('id')
                .eq('name', categoryName)
                .single();

            if (categoryError || !categoryData) {
                console.error('[ResourcesService] Category not found:', categoryName);
                return [];
            }

            // Depois buscar recursos por essa categoria
            const { data, error } = await supabase
                .from('resource_categories')
                .select(`
                    resources (
                        id,
                        title,
                        description,
                        type,
                        url,
                        duration,
                        tags,
                        interactive_data,
                        created_at
                    )
                `)
                .eq('category_id', categoryData.id);

            if (error) {
                console.error('[ResourcesService] getResourcesByCategory error:', error);
                throw error;
            }

            // Extrair os recursos da resposta e enriquecer URLs
            const resources = data?.map(item => item.resources).flat().filter(Boolean) || [];
            return resources.map(enrichResourceUrl);
        } catch (error) {
            console.error('[ResourcesService] Error fetching resources:', error);
            throw error;
        }
    }

    async getResourceById(resourceId: string): Promise<Resource | null> {
        try {
            const { data, error } = await supabase
                .from('resources')
                .select('*')
                .eq('id', resourceId)
                .single();

            if (error && error.code !== 'PGRST116') {
                console.error('[ResourcesService] getResourceById error:', error);
                throw error;
            }

            return data ? enrichResourceUrl(data) : null;
        } catch (error) {
            console.error('[ResourcesService] Error fetching resource:', error);
            throw error;
        }
    }

    async trackResourceUsage(userId: string, resourceId: string, completed: boolean = false) {
        try {
            const { data, error } = await supabase
                .from('user_resource_history')
                .insert([
                    {
                        user_id: userId,
                        resource_id: resourceId,
                        completed,
                    },
                ]);

            if (error) {
                console.error('[ResourcesService] trackResourceUsage error:', error);
                throw error;
            }

            return data;
        } catch (error) {
            console.error('[ResourcesService] Error tracking resource:', error);
            throw error;
        }
    }

    async getAllCategories() {
        try {
            const { data, error } = await supabase
                .from('categories')
                .select('id, name');

            if (error) {
                console.error('[ResourcesService] getAllCategories error:', error);
                throw error;
            }

            return data || [];
        } catch (error) {
            console.error('[ResourcesService] Error fetching categories:', error);
            throw error;
        }
    }
}

export const resourcesService = new ResourcesService();
