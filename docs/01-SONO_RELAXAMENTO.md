# SonoRelaxamentoScreen - Documentação de Implementação

## 📋 Resumo da Solução

A `SonoRelaxamentoScreen` agora exibe uma **lista dinâmica de mídias** da tabela `resources` filtradas pela categoria **"Sono"**, com um **modal interativo** para reproduzir os recursos.

## 🎯 Componentes Criados/Modificados

### 1. **services/resources.service.ts** (NOVO)
Service centralizado para gerenciar recursos do banco de dados.

**Funcionalidades:**
- `getResourcesByCategory(categoryName)` - Busca recursos por categoria
- `getResourceById(resourceId)` - Busca recurso específico
- `trackResourceUsage(userId, resourceId)` - Registra uso do recurso
- `getAllCategories()` - Lista todas as categorias

**Estrutura de Interface:**
```typescript
interface Resource {
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
```

### 2. **components/ResourcePlayer.tsx** (NOVO)
Modal interativo para reproduzir/visualizar recursos.

**Características:**
- 🎥 **Vídeos**: Embed via WebView (YouTube, Vimeo, etc.)
- 🔊 **Áudios**: Player com botão Play/Pause
- 📝 **Textos**: Visualização scrollável do conteúdo
- 📂 **Metadados**: Exibe tipo, duração, tags
- ✨ **UX**: Animação slide, layout cleano

### 3. **app/(outros)/SonoRelaxamentoScreen.tsx** (ATUALIZADO)
Tela principal com lista de recursos e integração com o modal.

**Estados & Hooks:**
- `recursos` - Lista de recursos carregados
- `loading` - Indica carregamento
- `error` - Mensagens de erro
- `selectedResource` - Recurso selecionado para reprodução
- `playerVisible` - Controla visibilidade do modal

**Fluxo:**
1. Ao montar, busca recursos da categoria "Sono"
2. Exibe loading/error/lista conforme estado
3. Ao clicar em um recurso, abre o modal player
4. Modal permite visualizar/reproduzir e fecha ao retornar

## 🎨 Design Escolhido: Modal Interativo

### Por quê?
- ✅ **Sem navegação extra** - Mantém usuário no contexto
- ✅ **Fácil voltar** - Retorna à lista de recursos
- ✅ **Reprodução imediata** - UX fluida
- ✅ **Detalhes visíveis** - Mostra metadados no modal
- ✅ **Consistente com design** - Segue padrão da app

### Alternativas consideradas (rejeitadas):
- ❌ Navegação para tela separada - Quebraria fluxo
- ❌ Expandir in-place - Limitado para vídeos
- ❌ Drawer/Bottom Sheet - Menos suporte para mídias

## 📊 Fluxo de Dados

```
┌─────────────────────────────────┐
│  SonoRelaxamentoScreen          │
│  (useState, useEffect)          │
└────────────┬────────────────────┘
             │
             ├─→ resourcesService.getResourcesByCategory('Sono')
             │   └─→ Supabase Query (categories → resources)
             │
             ├─→ recursos[] (loading/error/dados)
             │
             ├─→ FlatList renderResourceCard
             │   └─→ TouchableOpacity → handleOpenPlayer(resource)
             │
             └─→ ResourcePlayer Modal
                 ├─→ Áudio: Player com Play/Pause
                 ├─→ Vídeo: WebView embed
                 └─→ Texto: ScrollView do conteúdo
```

## 🔧 Instalação & Configuração

### Dependências Já Instaladas ✅
- `react-native-webview` (13.13.5)
- `@supabase/supabase-js`
- `expo-linear-gradient`
- `@expo/vector-icons`

### Sem ações adicionais necessárias!

## 💡 Como Usar

### 1. Criar categoria "Sono" no Supabase
```sql
INSERT INTO categories (name, description) 
VALUES ('Sono', 'Recursos para melhor sono e relaxamento');
```

### 2. Adicionar recursos com categoria
```javascript
// Adicionar recurso
const { data } = await supabase.from('resources').insert({
    title: 'Meditação Guiada',
    description: 'Meditação de 10 min para relaxamento',
    type: 'audio',
    url: 'https://example.com/audio.mp3',
    duration: 10,
    tags: ['meditação', 'relaxamento']
});

// Associar à categoria
await supabase.from('resource_categories').insert({
    resource_id: data[0].id,
    category_id: categoryId // ID da categoria "Sono"
});
```

### 3. A tela carregará automaticamente!
Ao abrir `SonoRelaxamentoScreen`, exibirá todos os recursos da categoria "Sono".

## 🎮 Simulação de Recursos para Teste

Se não houver recursos no banco, a tela exibirá "Nenhum recurso disponível".

Para testar rapidamente, adicione dados com este script:

```javascript
// scripts/seed-sleep-resources.ts
const sampleResources = [
    {
        title: 'Respiração Guiada',
        description: 'Exercício simples de respiração para acalmar a mente',
        type: 'audio',
        duration: 5,
        tags: ['respiração', 'relaxamento']
    },
    {
        title: 'Meditação Noturna',
        description: 'Meditação de 10 minutos especial para dormir',
        type: 'video',
        duration: 10,
        tags: ['meditação', 'sono']
    },
    {
        title: 'Relaxamento Progressivo',
        description: 'Técnica de relaxamento muscular passo a passo',
        type: 'text',
        tags: ['relaxamento', 'técnica']
    }
];
```

## 📱 Estados da Tela

### 1. **Loading**
Spinner + mensagem "Carregando recursos..."

### 2. **Error**
Ícone de alerta + mensagem de erro + botão "Tentar Novamente"

### 3. **Sucesso (com recursos)**
- Banner introdutório
- Descrição
- FlatList com cards dos recursos
- Dica de hoje (rodapé)

### 4. **Sucesso (sem recursos)**
- Banner introdutório
- Mensagem "Nenhum recurso disponível"

## 🔍 Tipos Suportados no ResourcePlayer

| Tipo | Renderização | Comportamento |
|------|-------------|---------------|
| `video` | WebView | Embed YouTube/Vimeo, fullscreen support |
| `audio` | Container customizado | Play/Pause button, mostra duração |
| `text` | ScrollView | Texto formatado, scrollável |
| `image` | (extensível) | Pode ser expandido para galeria |

## 🚀 Melhorias Futuras

1. **Player de Áudio Real**
   - Integrar `expo-av` para áudio nativo (não apenas botão)
   - Progress bar, time display

2. **Favoritos**
   - Salvar recursos favoritos em `user_resource_history` com flag

3. **Histórico**
   - Rastrear recursos já visualizados

4. **Busca & Filtro**
   - Campo de busca na tela
   - Filtro por tipo (áudio, vídeo, etc)

5. **Ratings**
   - Sistema de avaliação de recursos

6. **Tracking Analytics**
   - Registrar tempo de visualização
   - Completude da reprodução

## 📝 Documentação do Schema Supabase

Veja `schema-context.md` na raiz do projeto para:
- Estrutura completa das tabelas
- Relações entre modelos
- RLS Policies ativas

## 🐛 Troubleshooting

### Recursos não aparecem?
1. Verifique se categoria "Sono" existe no BD
2. Confirme se há recursos associados à categoria
3. Verifique logs: `[ResourcesService]` no console

### WebView não funciona em vídeos?
1. Confirme que URL é válida (YouTube, Vimeo, etc)
2. Se for MP4 puro, adicione no URL field
3. Teste no Expo Go ou build nativo

### Áudio não toca?
1. Verificar se URL é acessível
2. Formato suportado? (MP3, WAV, etc)
3. Para reprodução real, usar `expo-av` (prox. release)

---

**Status**: ✅ Implementado e pronto para uso
**Última atualização**: Feb 7, 2026
