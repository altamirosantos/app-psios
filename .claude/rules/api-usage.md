# API Usage - Rule

## 📋 Visão Geral

Regras obrigatórias para integração com a API Supabase do projeto PSIOS. Todos os services devem seguir estes padrões para consistência, segurança e manutenibilidade.

**Estrutura:**
- **Cliente Supabase**: Centralizado em `lib/supabase.ts`
- **Database**: PostgreSQL com schema Prisma (20+ modelos)
- **Authentication**: OAuth (Google, Facebook) + Email
- **Storage**: Bucket `psios_midias` para arquivos

---

## 🎯 Localização do Cliente

### Importação Obrigatória

```typescript
import { supabase } from '@/lib/supabase';
```

**NUNCA criar novo cliente Supabase.** Use sempre o cliente centralizado.

### Cliente Supabase (`lib/supabase.ts`)

```typescript
// ✅ Cliente já configurado com:
// - AsyncStorage para mobile (persistência de sessão)
// - localStorage para web
// - Auto-refresh de token
// - Detecção automática de plataforma

export const supabase = isWeb
    ? createClient(supabaseUrl, supabaseAnonKey)
    : createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
            storage: AsyncStorage,
            autoRefreshToken: true,
            persistSession: true,
        },
    });
```

---

## 📊 Schema Prisma - Estrutura de Dados

### Tabelas Principais

```
Profiles (usuários)
├── id (UUID)
├── nome, email, foto
└── relations: autoavaliacao, chat, plano_usuario, resources

Avaliacao (formulários de autoavaliação)
├── id (UUID)
├── nome, descricao
└── relations: autoavaliacao, contexto

Autoavaliacao (respostas do usuário)
├── id (UUID)
├── user_id, avaliacao_id
├── dados_entrada (JSON), diagnostico, sugestao
└── relations: user, avaliacao, conteudo

Contexto → Etapa → EtapaPergunta → Pergunta → Resposta
(Estrutura hierárquica de questionários)

Chat (histórico de conversa)
├── id, user_id, session_id
├── mensagens (JSON array)
└── favorito (boolean)

Resources (conteúdos: vídeos, áudios, textos)
├── id, title, type, url, duration
└── relations: categories, user_history, agenda

Planos (assinaturas)
├── id, nome, valor, beneficios
└── relation: plano_usuario
```

**Schema completo**: `prisma/schema.prisma`

---

## 🚀 Como Começar

### Passo 1: Importações Base

```typescript
import { supabase } from '@/lib/supabase';
```

### Passo 2: Definir Tipos

**Opção A: Dentro do service (recomendado)**
```typescript
type Agenda = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  scheduled_at: string;
  status: string;
  created_at: string;
  updated_at: string;
};
```

**Opção B: Tipos globais (para reutilização)**
- Arquivo: `services/interfaces.ts`
- Use para tipos compartilhados entre vários services

### Passo 3: Implementar Operações

Seguir um dos 5 padrões abaixo dependendo da complexidade.

---

## 📚 5 Padrões de Implementação

### Padrão 1: Query Simples (CRUD Básico)

**Quando usar**: Operações simples sem joins
**Exemplo real**: `services/agenda.ts`

```typescript
import { supabase } from '@/lib/supabase';

type Agenda = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  scheduled_at: string;
  status: string;
  created_at: string;
  updated_at: string;
};

// ✅ READ - Buscar todos
export const fetchAgendas = async () => {
  const { data, error } = await supabase
    .from('agenda')
    .select('*')
    .order('scheduled_at', { ascending: true });

  if (error) throw new Error(error.message);
  return data;
};

// ✅ READ - Buscar um
export const fetchAgendaById = async (id: string) => {
  const { data, error } = await supabase
    .from('agenda')
    .select('*')
    .eq('id', id)
    .single(); // Retorna um objeto (erro se não encontrar)

  if (error) throw new Error(error.message);
  return data;
};

// ✅ CREATE
export const createAgenda = async (agenda: Omit<Agenda, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('agenda')
    .insert([agenda])
    .select(); // Retorna os dados inseridos

  if (error) throw new Error(error.message);
  return data[0];
};

// ✅ UPDATE
export const updateAgenda = async (id: string, updates: Partial<Agenda>) => {
  const { data, error } = await supabase
    .from('agenda')
    .update(updates)
    .eq('id', id)
    .select();

  if (error) throw new Error(error.message);
  return data[0];
};

// ✅ DELETE
export const deleteAgenda = async (id: string) => {
  const { error } = await supabase
    .from('agenda')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
};

// ✅ BUSCAR COM FILTRO
export const fetchAgendasByStatus = async (status: string) => {
  const { data, error } = await supabase
    .from('agenda')
    .select('*')
    .eq('status', status)
    .order('scheduled_at', { ascending: true });

  if (error) throw new Error(error.message);
  return data;
};
```

### Padrão 2: Query com Relações (Joins)

**Quando usar**: Dados de múltiplas tabelas relacionadas
**Exemplo real**: `services/etapa.service.ts`

```typescript
import { supabase } from '@/lib/supabase';
import { Etapa } from './interfaces';

class EtapaService {
  // ✅ Query com relações aninhadas
  async getEtapaById(etapaId: string) {
    const { data, error } = await supabase
      .from('etapa')
      .select(`
        id,
        titulo,
        subtitulo,
        ordem,
        contexto_id,
        contexto (
          id,
          descricao,
          ordem
        ),
        etapa_pergunta (
          ordem,
          perguntas (
            id,
            tipo,
            titulo,
            descricao,
            nota,
            faixas,
            legendas,
            image,
            respostas (
              id,
              descricao,
              subdescricao,
              emoji,
              color,
              ordem 
            )
          )
        )
      `)
      .eq('id', etapaId)
      .maybeSingle<Etapa>(); // Retorna null se não encontrar (sem erro)

    if (error) {
      console.error('[EtapaService] getEtapaById', error);
      throw new Error('Erro ao buscar etapa');
    }

    if (!data) return null;

    // ✅ Mapear dados (transformar em formato esperado)
    return this.mapToJson(data);
  }

  // ✅ Query com múltiplos filtros
  async getEtapasByContexto(contextoId: string) {
    const { data, error } = await supabase
      .from('etapa')
      .select(`
        id,
        titulo,
        ordem,
        contexto: contexto_id (
          descricao
        )
      `)
      .eq('contexto_id', contextoId)
      .order('ordem', { ascending: true });

    if (error) throw new Error(error.message);
    return data;
  }

  // ✅ Mapeamento de dados (formatação)
  private mapToJson(data: any) {
    return {
      etapaUuid: data.id,
      contextoId: data.contexto_id,
      descricaoContexto: data.contexto?.descricao ?? '',
      titulo: data.titulo,
      subtitulo: data.subtitulo,
      ordem: data.ordem,
      perguntas: data.etapa_pergunta
        .sort((a: any, b: any) => (a.ordem ?? 0) - (b.ordem ?? 0))
        .map((item: any) => ({
          questionUuid: item.perguntas.id,
          tipo: item.perguntas.tipo,
          titulo: item.perguntas.titulo ?? '',
          // ... mais campos mapeados
        })),
    };
  }
}

export const etapaService = new EtapaService();
```

### Padrão 3: Autenticação e Autorização

**Quando usar**: Login, logout, validação de sessão
**Exemplo real**: `services/auth.service.ts`

```typescript
import { supabase } from '@/lib/supabase';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

export async function signInWithGoogle() {
  try {
    const userInfo = await GoogleSignin.signIn();
    const { idToken } = await GoogleSignin.getTokens();

    if (!idToken) throw new Error('ID Token ausente');

    // ✅ Login com Supabase usando OAuth
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: idToken,
    });

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Erro login Google:', err);
    throw err;
  }
}

// ✅ Login com Email/Senha
export async function loginWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Erro ao logar:', error.message);
    throw new Error(error.message);
  }

  return data;
}

// ✅ Logout
export const logout = async () => {
  try {
    await supabase.auth.signOut();
  } catch (e) {
    console.error('Erro ao fazer logout:', e);
    throw e;
  }
};

// ✅ Obter usuário atual
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error) throw error;
  return user;
};

// ✅ Verificar se está autenticado
export const isAuthenticated = async () => {
  const user = await getCurrentUser();
  return !!user;
};
```

### Padrão 4: Storage (Arquivos)

**Quando usar**: Upload/download de imagens, áudios, vídeos
**Exemplo real**: `lib/supabase.ts` - getStorageUrl()

```typescript
import { supabase } from '@/lib/supabase';

// ✅ Obter URL pública de arquivo no Storage
export function getStorageUrl(fileName: string | null, bucket: string = 'psios_midias'): string | null {
  if (!fileName) return null;
  
  // Se for URL completa já, retorna como está
  if (fileName.startsWith('http://') || fileName.startsWith('https://')) {
    return fileName;
  }
  
  // Constrói URL do storage Supabase
  const supabaseUrl = 'https://lhrdphbgmsxijzuyrtwc.supabase.co';
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${fileName}`;
}

// ✅ Fazer upload de arquivo
export async function uploadFile(file: File, bucket: string = 'psios_midias') {
  const fileName = `${Date.now()}_${file.name}`;
  
  const { data, error } = await supabase
    .storage
    .from(bucket)
    .upload(fileName, file);

  if (error) throw new Error(error.message);
  return fileName; // Salve isto no banco de dados
}

// ✅ Deletar arquivo
export async function deleteFile(fileName: string, bucket: string = 'psios_midias') {
  const { error } = await supabase
    .storage
    .from(bucket)
    .remove([fileName]);

  if (error) throw new Error(error.message);
}

// ✅ Usar no componente
export function ResourceImage({ fileName }: { fileName: string }) {
  const url = getStorageUrl(fileName);
  return <Image source={{ uri: url }} />;
}
```

### Padrão 5: Service com Classe

**Quando usar**: Múltiplos métodos relacionados + lógica complexa
**Exemplo real**: `services/etapa.service.ts` - EtapaService

```typescript
import { supabase } from '@/lib/supabase';

class AuthService {
  // ✅ Métodos privados para lógica reutilizável
  private async validateUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) throw new Error('Usuário não autenticado');
    return user;
  }

  // ✅ Método público
  async getUserProfile() {
    const user = await this.validateUser();
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  // ✅ Método com cache (opcional)
  private cache = new Map();

  async getPlanoAtivo() {
    const user = await this.validateUser();
    
    // Verificar cache
    if (this.cache.has(user.id)) {
      return this.cache.get(user.id);
    }

    const { data, error } = await supabase
      .from('plano_usuario')
      .select('plano_id')
      .eq('user_id', user.id)
      .eq('status', 'ativo')
      .single();

    if (error) return null;

    // Armazenar em cache
    this.cache.set(user.id, data.plano_id);
    return data.plano_id;
  }

  // ✅ Limpar cache
  clearCache() {
    this.cache.clear();
  }
}

export const authService = new AuthService();
```

---

## ✅ Checklist para Novo Service

Use este checklist ao criar um novo service:

- [ ] **Imports**: `import { supabase } from '@/lib/supabase';`
- [ ] **Tipos**: Definir tipos TypeScript (tipos.ts ou inline)
- [ ] **Função de Read**: Buscar dados com `.select()`
- [ ] **Função de Create**: Inserir com `.insert().select()`
- [ ] **Função de Update**: Atualizar com `.update().select()`
- [ ] **Função de Delete**: Deletar com `.delete()`
- [ ] **Erro Handling**: Sempre `if (error) throw new Error(error.message)`
- [ ] **Validação**: Verificar dados de entrada (não nulos, tipos corretos)
- [ ] **Relações**: Se usar joins, documentar com comentários
- [ ] **Testes**: Testar em Light Mode e Dark Mode
- [ ] **TypeScript**: Sem `any`, use tipos explícitos
- [ ] **Comments**: Documentar operações complexas

---

## ⚠️ Anti-Patterns (O que NÃO fazer)

| ❌ ERRADO | ✅ CERTO | Explicação |
|---|---|---|
| `const sb = new createClient(...)` | `import { supabase }` | Nunca crie novo cliente |
| `.single()` sem catch | `.maybeSingle()` ou try/catch | single() lança erro se não encontrar |
| Sem validação de `error` | `if (error) throw` | Sempre checar erro |
| `select('*')` demais | `select('id, nome, email')` | Otimizar campos solicitados |
| Queries sem `order()` | `.order('campo', { ascending: true })` | Sempre ordenar resultados |
| Sem tipos | `data as any` | Use tipos explícitos TypeScript |
| Autenticação em componente | `import { authService }` | Autenticação sempre em service |
| Storage sem validação | Validar tipo, tamanho, extensão | Segurança do upload |
| Sem comentários em joins | Documentar relações | Facilita manutenção |
| Commit sem testar | Testar em ambos temas | Sempre validar visualmente |

---

## 📞 Funções Globais em `lib/supabase.ts`

### Autenticação

```typescript
// Obter plano ativo do usuário
export async function getPlanoAtivo(userId: string)

// Listar planos disponíveis
export async function getPlanosDisponiveis()
```

### Storage

```typescript
// Obter URL pública de arquivo
export function getStorageUrl(fileName: string, bucket?: string): string | null
```

### Cliente

```typescript
// Cliente principal
export const supabase = createClient(...)
```

---

## 📦 Arquivos de Referência

| Arquivo | Propósito | Padrão |
|---|---|---|
| `lib/supabase.ts` | Cliente centralizado + helpers globais | Padrão 1, 4 |
| `services/agenda.ts` | CRUD simples | Padrão 1 |
| `services/etapa.service.ts` | Queries com relações complexas | Padrão 2 |
| `services/auth.service.ts` | Autenticação OAuth + Email | Padrão 3 |
| `services/resources.service.ts` | Conteúdos e histórico | Padrão 1, 2 |
| `services/interfaces.ts` | Tipos globais reutilizáveis | - |
| `prisma/schema.prisma` | Schema de banco de dados | Referência |

---

## 🔐 Segurança

### Row Level Security (RLS)

Supabase usa RLS via policies. **NUNCA**:
- Expor informações sensíveis na query
- Confiar apenas em frontend para validação
- Selecionar dados de outros usuários

### Boas Práticas

```typescript
// ✅ CORRETO - Filtrar por user_id
export async function getUserChats(userId: string) {
  const { data, error } = await supabase
    .from('chat')
    .select('*')
    .eq('user_id', userId); // RLS valida automaticamente

  if (error) throw new Error(error.message);
  return data;
}

// ❌ ERRADO - Não filtrar por usuário
export async function getAllChats() {
  const { data } = await supabase
    .from('chat')
    .select('*'); // RLS vai bloquear isso!
  return data;
}
```

---

## 📊 Schema Visual Simplificado

```
PROFILES
├── id (UUID)
├── nome, email
└── ↓ foreign keys ↓

AUTOAVALIACAO
├── id, user_id, avaliacao_id
├── dados_entrada (JSON)
└── diagnostico, sugestao
    └── ↓ ↓

AVALIACAO ────────────────→ CONTEXTO
    └─────────────────────────────┘
                                  │
                                  ↓
                                ETAPA
                                  │
                                  ↓
                            ETAPA_PERGUNTA
                                  │
                                  ↓
                                PERGUNTA
                                  │
                                  ↓
                              RESPOSTAS

CHAT
├── id, user_id, session_id
├── mensagens (JSON array)
└── favorito

RESOURCES ←── RESOURCE_CATEGORIES ──→ CATEGORIES
    ├── titulo, type, url
    └── duration, tags, interactive_data
        └── USER_RESOURCE_HISTORY
            └── user_id, resource_id, completed

PLANOS ────→ PLANO_USUARIO ←── PROFILES
    ├── nome, valor
    └── beneficios (JSON)
```

---

## 💡 Pro Tips

1. **Sempre use `select()`**: Especifique colunas para otimizar
2. **Teste suas queries**: No Supabase Studio antes de usar
3. **Use `maybeSingle()` vs `single()`**: Depende se quer erro ou null
4. **Mapeie dados**: Use funções privadas para formatar respostas
5. **Cache quando possível**: Para dados que mudam pouco
6. **Documente relações**: Especialmente em queries complexas
7. **Validação de entrada**: Nunca confie em dados do cliente
8. **Error messages**: Úteis para debug, omita em produção
9. **TypeScript strict**: Sempre use tipos explícitos
10. **RLS policies**: Confie delas, não em filtros manuais

---

## 📞 Referências

- **Schema Prisma**: `prisma/schema.prisma` - Estrutura completa
- **Cliente Supabase**: `lib/supabase.ts` - Configuração
- **Exemplo CRUD**: `services/agenda.ts` - Padrão simples
- **Exemplo Relações**: `services/etapa.service.ts` - Query complexa
- **Exemplo Auth**: `services/auth.service.ts` - Autenticação
- **Documentação**: https://supabase.com/docs
