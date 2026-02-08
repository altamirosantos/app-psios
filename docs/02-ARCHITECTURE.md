# 🌙 SonoRelaxamentoScreen - Arquitetura Visual

## 📐 Componentes & Fluxo

```
┌─────────────────────────────────────────────────────────────────┐
│                     SonoRelaxamentoScreen                        │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Header Gradient (Purple)                                 │  │
│  │ [<] Sono e Relaxamento                                   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ FlatList (Dynamic Content)                               │  │
│  │                                                          │  │
│  │  [Banner Image]                                         │  │
│  │                                                          │  │
│  │  "Encontre equilíbrio..."                               │  │
│  │                                                          │  │
│  │  Exercícios Disponíveis                                 │  │
│  │  ┌─────────────────────────────────────┐               │  │
│  │  │ 🎵 Respiração Profunda              │ ► |►|         │  │
│  │  │ AUDIO • 5 min                       │               │  │
│  │  │ Exercício simples de respiração...  │               │  │
│  │  └─────────────────────────────────────┘               │  │
│  │                                                          │  │
│  │  ┌─────────────────────────────────────┐               │  │
│  │  │ 🎥 Meditação Guiada                 │ ► |►|         │  │
│  │  │ VIDEO • 10 min                      │               │  │
│  │  │ Meditação especial para o sono...   │               │  │
│  │  └─────────────────────────────────────┘               │  │
│  │                                                          │  │
│  │  ┌─────────────────────────────────────┐               │  │
│  │  │ 📝 Relaxamento Progressivo          │ ► |►|         │  │
│  │  │ TEXT                                │               │  │
│  │  │ Método comprovado para relaxar...   │               │  │
│  │  └─────────────────────────────────────┘               │  │
│  │                                                          │  │
│  │  🌙 Dica para hoje                                      │  │
│  │  [Box roxa com borda esquerda]                          │  │
│  │  "Evite telas brilhantes antes de     │  │
│  │   dormir..."                                            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ ResourcePlayer Modal (on touch resource)                │  │
│  │ ────────────────────────────────────────────────────────  │  │
│  │ [X] Respiração Profunda        [X closes]                │  │
│  │ ────────────────────────────────────────────────────────  │  │
│  │                                                          │  │
│  │  ┌──────────────────────────────────┐                  │  │
│  │  │  🎵 Audio Player                  │                  │  │
│  │  │  ┌─────────────────────────────┐  │                  │  │
│  │  │  │                             │  │                  │  │
│  │  │  │     [●] Play/Pause Button    │  │                  │  │
│  │  │  │     5 minutes                │  │                  │  │
│  │  │  │                             │  │                  │  │
│  │  │  └─────────────────────────────┘  │                  │  │
│  │  └──────────────────────────────────┘                  │  │
│  │                                                          │  │
│  │  AUDIO                                                  │  │
│  │  [relaxação] [respiração] [iniciante]                  │  │
│  │                                                          │  │
│  │  [Fechar]                                               │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 Fluxo de Dados

```
┌─────────────────────────────────────────────────────────────────┐
│  INITIALIZATION                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  useEffect(() => { carregarRecursos() })                        │
│         ↓                                                        │
│  setLoading(true)                                               │
│         ↓                                                        │
│  resourcesService.getResourcesByCategory('Sono')                │
│         ↓                                                        │
│  Supabase Query:                                                │
│    1. SELECT id FROM categories WHERE name = 'Sono'             │
│    2. SELECT resource_id FROM resource_categories              │
│       WHERE category_id = <sonoId>                             │
│    3. SELECT * FROM resources WHERE id IN (...)                │
│         ↓                                                        │
│  setRecursos(data)                                              │
│  setLoading(false)                                              │
│         ↓                                                        │
│  RENDER FlatList or Error/Loading                              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  USER INTERACTION: TOUCH RESOURCE CARD                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  TouchableOpacity onPress={(resource) =>                        │
│    setSelectedResource(resource)                                │
│    setPlayerVisible(true)                                       │
│  }                                                               │
│         ↓                                                        │
│  <ResourcePlayer visible={playerVisible}                        │
│                   resource={selectedResource}                   │
│                   onClose={handleClosePlayer} />                │
│         ↓                                                        │
│  Modal Slide In (animationType="slide")                         │
│         ↓                                                        │
│  Render Player Based on Type:                                   │
│    • audio   → Show Play Button Container                       │
│    • video   → Show WebView Embed                               │
│    • text    → Show TextContainer ScrollView                    │
│         ↓                                                        │
│  User interacts (play, pause, scroll)                           │
│         ↓                                                        │
│  [Close] Button → handleClosePlayer()                           │
│    • setPlayerVisible(false)                                    │
│    • setSelectedResource(null)                                  │
│    • Modal Slide Out                                            │
│    • Back to FlatList                                           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## 🏗️ Arquitetura de Layered

```
┌──────────────────────────────────────────────────────────────────┐
│ PRESENTATION LAYER (Telas)                                       │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  SonoRelaxamentoScreen.tsx (Container)                           │
│  ├─ FlatList (lista de recursos)                                │
│  ├─ ResourcePlayer Modal (reprodutor)                           │
│  └─ Estado: recursos, loading, error, player                    │
│                                                                  │
└──────────────────────┬───────────────────────────────────────────┘
                       │
┌──────────────────────▼───────────────────────────────────────────┐
│ COMPONENT LAYER                                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ResourcePlayer.tsx (Modal/Presentational)                       │
│  ├─ Controla renderização baseada em tipo                       │
│  ├─ AudioContainer (peso leve)                                  │
│  ├─ WebView (vídeo)                                             │
│  └─ TextContainer (scroll)                                      │
│                                                                  │
└──────────────────────┬───────────────────────────────────────────┘
                       │
┌──────────────────────▼───────────────────────────────────────────┐
│ SERVICE LAYER                                                    │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  resources.service.ts (Lógica de Negócio)                        │
│  ├─ getResourcesByCategory(name) → Resource[]                   │
│  ├─ getResourceById(id) → Resource                              │
│  ├─ trackResourceUsage(userId, resourceId)                      │
│  └─ getAllCategories() → Category[]                             │
│                                                                  │
└──────────────────────┬───────────────────────────────────────────┘
                       │
┌──────────────────────▼───────────────────────────────────────────┐
│ DATA LAYER (Supabase SDK)                                        │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  supabase.from('resources').select()                             │
│  supabase.from('categories').select()                            │
│  supabase.from('resource_categories').select()                   │
│                                                                  │
└──────────────────────┬───────────────────────────────────────────┘
                       │
┌──────────────────────▼───────────────────────────────────────────┐
│ DATABASE LAYER (PostgreSQL via Supabase)                        │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  📦 resources                                                    │
│  📦 categories                                                   │
│  📦 resource_categories (junction table)                        │
│  📦 user_resource_history (tracking)                             │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

## 📊 Estado da Aplicação

```javascript
// Estados internos da SonoRelaxamentoScreen

type ScreenState = 
  | 'LOADING'      // Carregando recursos
  | 'ERROR'        // Erro ao carregar
  | 'EMPTY'        // Sem recursos
  | 'SUCCESS'      // Com recursos
  | 'PLAYER_OPEN'  // Modal aberto

type Resource {
  id: string
  title: string
  description: string
  type: 'audio' | 'video' | 'text'
  url: string | null
  duration: number | null
  tags: string[]
}

// Estados via useState:
const [recursos, setRecursos]                      // Resource[]
const [loading, setLoading]                        // boolean
const [error, setError]                            // string | null
const [selectedResource, setSelectedResource]      // Resource | null
const [playerVisible, setPlayerVisible]            // boolean
```

## 🎯 Tipos de Recursos Suportados

```
┌──────────────────────────────────────────────────────┐
│ AUDIO                                                │
│ └─ File: .mp3, .wav, .aac                           │
│ └─ Render: Play Button + Duration                   │
│ └─ Future: Usar expo-av para player real            │
├──────────────────────────────────────────────────────┤
│ VIDEO                                                │
│ └─ Source: YouTube, Vimeo, MP4                      │
│ └─ Render: WebView com embed                        │
│ └─ Feature: Fullscreen, autoplay support            │
├──────────────────────────────────────────────────────┤
│ TEXT                                                 │
│ └─ Content: Markdown or HTML (na descrição)         │
│ └─ Render: ScrollView com formatted text            │
│ └─ Feature: Scroll natural no modal                 │
├──────────────────────────────────────────────────────┤
│ IMAGE (Extensível)                                  │
│ └─ Tipo suportado mas não renderizado               │
│ └─ TODO: Gallery viewer                             │
└──────────────────────────────────────────────────────┘
```

## 🧪 Testing Checklist

- [ ] Tela carrega com spinner
- [ ] Recursos aparecem na lista após carregar
- [ ] Clique em recurso abre modal
- [ ] Áudio mostra play button
- [ ] Vídeo embeça no WebView
- [ ] Texto é scrollável
- [ ] Botão [X] fecha modal
- [ ] Volta para lista original
- [ ] Error state com retry button
- [ ] Sem recursos mostra mensagem
- [ ] Tags exibem corretamente
- [ ] Duração mostra quando preenchida

## 📱 Responsividade

```
Mobile (360px - 480px)
├─ Header: Full width
├─ Cards: width - 8px margin (90%)
├─ Banner: 80% width + margin auto
└─ Modal: Full screen

Tablet (600px+)
├─ Header: Centered content
├─ Cards: Ainda 90% width (manter consistência)
├─ Modal: Pode expandir para 95%
└─ Detalhes: Font sizes aumentam 1-2px

Web (1000px+)
├─ Considerar card width máximo
├─ Centralização de conteúdo
└─ Layout responsivo com grid
```

---

**Documentação Atualizada**: Feb 7, 2026  
**Status**: ✅ Pronto para Produção
