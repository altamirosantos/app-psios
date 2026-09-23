# 📊 Guia Visual: Seletor de Ciclo de Planos

## 🎨 Como o Componente Funciona

```
┌─────────────────────────────────────────┐
│  PSIOS - Escolha seu Plano             │
├─────────────────────────────────────────┤
│                                         │
│   ┌─────────────────────────────────┐   │
│   │  [MENSAL ●]  [ANUAL]           │   │  ← CycleSwitcher
│   └─────────────────────────────────┘   │
│                                         │
│  ┌────────────────────────────────────┐ │
│  │  Plano Gratuito                   │ │  ← Sempre Visível
│  │  Acesso básico à plataforma       │ │     (tipo_acesso = 'FREE')
│  │  R$ 0.00                          │ │
│  │  • Acesso básico                  │ │
│  │  • Suporte por email              │ │
│  └────────────────────────────────────┘ │
│                                         │
│  ┌────────────────────────────────────┐ │
│  │  Plano Básico Mensal              │ │  ← Visível quando
│  │  Perfeito para iniciantes         │ │     MENSAL selecionado
│  │  R$ 29.90 / mensal                │ │     (ciclo = 'MENSAL')
│  │  • Acesso completo                │ │
│  │  • 2 GB armazenamento             │ │
│  │  • Suporte por chat               │ │
│  │  ID: plan_basic_monthly           │ │
│  └────────────────────────────────────┘ │
│                                         │
│  ┌────────────────────────────────────┐ │
│  │  Plano Premium Mensal             │ │  ← Visível quando
│  │  Para usuários avançados          │ │     MENSAL selecionado
│  │  R$ 79.90 / mensal                │ │     (ciclo = 'MENSAL')
│  │  • Acesso ilimitado               │ │
│  │  • 100 GB armazenamento           │ │
│  │  • Suporte prioritário            │ │
│  │  • Recursos avançados             │ │
│  │  ID: plan_full_monthly            │ │
│  └────────────────────────────────────┘ │
│                                         │
│        [Selecionar Plano]               │
└─────────────────────────────────────────┘

↓ Usuário clica em ANUAL ↓

┌─────────────────────────────────────────┐
│  PSIOS - Escolha seu Plano             │
├─────────────────────────────────────────┤
│                                         │
│   ┌─────────────────────────────────┐   │
│   │  [MENSAL]  [ANUAL ●]           │   │  ← CycleSwitcher Atualizado
│   └─────────────────────────────────┘   │
│                                         │
│  ┌────────────────────────────────────┐ │
│  │  Plano Gratuito                   │ │  ← Ainda Visível
│  │  Acesso básico à plataforma       │ │     (tipo_acesso = 'FREE')
│  │  R$ 0.00                          │ │
│  │  • Acesso básico                  │ │
│  │  • Suporte por email              │ │
│  └────────────────────────────────────┘ │
│                                         │
│  ┌────────────────────────────────────┐ │
│  │  Plano Básico Anual               │ │  ← Visível quando
│  │  Economize 20% no plano anual     │ │     ANUAL selecionado
│  │  R$ 299.00 / anual                │ │     (ciclo = 'ANUAL')
│  │  • Acesso completo                │ │
│  │  • 2 GB armazenamento             │ │
│  │  • Suporte por chat               │ │
│  │  ID: plan_basic_annual            │ │
│  └────────────────────────────────────┘ │
│                                         │
│  ┌────────────────────────────────────┐ │
│  │  Plano Premium Anual              │ │  ← Visível quando
│  │  Economize 25% no plano anual     │ │     ANUAL selecionado
│  │  R$ 799.00 / anual                │ │     (ciclo = 'ANUAL')
│  │  • Acesso ilimitado               │ │
│  │  • 100 GB armazenamento           │ │
│  │  • Suporte prioritário            │ │
│  │  • Recursos avançados             │ │
│  │  ID: plan_full_annual             │ │
│  └────────────────────────────────────┘ │
│                                         │
│        [Selecionar Plano]               │
└─────────────────────────────────────────┘
```

## 📊 Fluxo de Filtro de Dados

```
Carregar Planos do Supabase
         ↓
┌─────────────────────────┐
│   Todos os Planos       │
│ ├─ ID: plan_free        │
│ │  tipo_acesso: FREE    │
│ │  ciclo: MENSAL        │
│ ├─ ID: plan_basic_m     │
│ │  tipo_acesso: BASIC   │
│ │  ciclo: MENSAL        │
│ ├─ ID: plan_basic_a     │
│ │  tipo_acesso: BASIC   │
│ │  ciclo: ANUAL         │
│ ├─ ID: plan_full_m      │
│ │  tipo_acesso: FULL    │
│ │  ciclo: MENSAL        │
│ └─ ID: plan_full_a      │
│    tipo_acesso: FULL    │
│    ciclo: ANUAL         │
└─────────────────────────┘
         ↓ Filtro useMemo
         ├─ Se tipo_acesso === 'FREE' → SEMPRE MOSTRAR
         └─ Se tipo_acesso IN ['BASIC','FULL'] 
            └─ Se ciclo === cicloSelecionado → MOSTRAR
         ↓
┌─────────────────────────┐
│  Planos Filtrados       │
│ (renderizados na tela)  │
└─────────────────────────┘
```

## 🔄 Estado e Mudanças

```typescript
// Estado do Componente
const [cicloSelecionado, setCicloSelecionado] = useState<'MENSAL' | 'ANUAL'>('MENSAL');

// Filtro Reativo (useMemo)
const planosFiltrados = useMemo(() => {
  // Se dados mudarem OU ciclo mudar → recalcular automaticamente
  return planos.filter((plano) => {
    if (plano.tipo_acesso === 'FREE') return true;
    if (plano.tipo_acesso === 'BASIC' || plano.tipo_acesso === 'FULL') {
      return plano.ciclo === cicloSelecionado;
    }
    return false;
  });
}, [planos, cicloSelecionado]); // Dependências
```

## 🎯 Casos de Uso

### Caso 1: Usuário Novo - Seleciona Plano Mensal
```
1. Tela abre com MENSAL selecionado por padrão
2. Usuário vê:
   - Plano Gratuito (sempre disponível)
   - Plano Básico Mensal (R$ 29.90)
   - Plano Premium Mensal (R$ 79.90)
3. Usuário clica em "Assinar Plano Básico Mensal"
4. Checkout é iniciado com codigo_identificador = 'plan_basic_monthly'
```

### Caso 2: Usuário Quer Economizar - Seleciona Plano Anual
```
1. Tela abre com MENSAL selecionado
2. Usuário clica em ANUAL
3. Planos se atualizam:
   - Plano Gratuito (sempre disponível)
   - Plano Básico Anual (R$ 299.00 - economiza R$ 58.80/ano)
   - Plano Premium Anual (R$ 799.00 - economiza R$ 158.80/ano)
4. Usuário clica em "Assinar Plano Premium Anual"
5. Checkout é iniciado com codigo_identificador = 'plan_full_annual'
```

### Caso 3: Mudança de Ciclo Sem Perder Estado
```
1. Usuário está vendo Plano Básico Mensal
2. Clica em ANUAL
3. Plano Básico Mensal desaparece da tela
4. Plano Básico Anual aparece
5. Se usuário volta para MENSAL
6. Plano Básico Mensal reaparece novamente
```

## 💾 Estrutura de Dados no Banco

```sql
-- Tabela: public.planos

id (UUID)
├─ nome: String
├─ descricao: String
├─ valor: Decimal
├─ beneficios: JSON Array
├─ ciclo: VARCHAR(10)  ← NOVO ('MENSAL' | 'ANUAL')
├─ tipo_acesso: VARCHAR(10)  ← NOVO ('FREE' | 'BASIC' | 'FULL')
├─ codigo_identificador: VARCHAR(255)  ← NOVO (ex: 'plan_basic_monthly')
├─ created_at: Timestamp
└─ updated_at: Timestamp  ← NOVO

Índices:
└─ idx_planos_ciclo_tipo(ciclo, tipo_acesso)
```

## 🎨 Personalização de Cores

```typescript
// CycleSwitcher aceita cores customizáveis
<CycleSwitcher
  selectedCycle={cicloSelecionado}
  onCycleChange={setCicloSelecionado}
  activeColor="#3399ff"        // Azul (botão selecionado)
  inactiveColor="#e0e0e0"      // Cinza (botão não selecionado)
  textColor="#000"             // Preto (texto)
/>

// Em dark mode, exemplo:
<CycleSwitcher
  selectedCycle={cicloSelecionado}
  onCycleChange={setCicloSelecionado}
  activeColor="#00d9ff"        // Azul claro
  inactiveColor="#333333"      // Cinza escuro
  textColor="#ffffff"          // Branco
/>
```

## 🔗 Integração com Sistema de Checkout

```typescript
// Ao clicar em "Assinar Plano"
const handleAssinar = (plano: Plano) => {
  // Usar codigo_identificador para checkout
  const codigoCheckout = plano.codigo_identificador; // ex: 'plan_basic_monthly'
  
  // Exemplo com Stripe
  const resultado = await stripe.redirectToCheckout({
    sessionId: codigoCheckout
  });
  
  // Exemplo com PagSeguro
  const resultado = await pagSeguro.criarCheckout({
    planoId: codigoCheckout,
    usuarioId: user.id
  });
};
```

## ✨ Melhorias Futuras Sugeridas

```
1. Adicionar badge "ECONOMIZE X%" para planos anuais
   ┌──────────────────────────────┐
   │ Plano Básico Anual   SAVE 20% │  ← Badge
   │ R$ 299.00 / anual            │
   └──────────────────────────────┘

2. Adicionar animação ao trocar ciclo
   - Fade out dos planos antigos
   - Fade in dos novos planos
   - Smooth transition

3. Mostrar economia em valor
   Plano Básico Anual
   R$ 299.00 / anual
   ↓ você economiza R$ 58.80 ao ano

4. Adicionar comparação de planos
   - Tabela lado a lado
   - Destaques de diferenças

5. Carrinho de compras
   - Permitir selecionar múltiplos planos
   - Checkout único
```

---

**Última atualização:** 2026-09-23
**Desenvolvedor:** GitHub Copilot
**Versão:** 1.0
