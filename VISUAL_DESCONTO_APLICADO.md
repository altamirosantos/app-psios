# 🎨 Visual: Exibição de Descontos em Planos

## 📺 Mock da Tela

```
╔════════════════════════════════════════════════════════════════╗
║                    ESCOLHA SEUS PLANOS                        ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║  [MENSAL ●]  [ANUAL]                                          ║
║                                                                ║
║  ┌────────────────────────────────────────────────────────┐   ║
║  │ Plano Gratuito                                         │   ║
║  │ Acesso básico ao aplicativo                           │   ║
║  │                                                        │   ║
║  │ R$ 0.00 / mensal                                      │   ║
║  │                                                        │   ║
║  │ • Função 1                                            │   ║
║  │ • Função 2                                            │   ║
║  │ ID: plan_free                                         │   ║
║  └────────────────────────────────────────────────────────┘   ║
║                                                                ║
║  ┌────────────────────────────────────────────────────────┐   ║
║  │ Plano Básico                                           │   ║
║  │ Para pequenos times                                   │   ║
║  │                                                        │   ║
║  │ R$ 29.90 / mensal                                    │   ║
║  │ (sem desconto)                                        │   ║
║  │                                                        │   ║
║  │ • Recurso 1                                           │   ║
║  │ • Recurso 2                                           │   ║
║  │ ID: plan_basic_monthly                               │   ║
║  └────────────────────────────────────────────────────────┘   ║
║                                                                ║
║  ┌────────────────────────────────────────────────────────┐   ║
║  │ Plano Premium                                          │   ║
║  │ Para equipes maiores                                 │   ║
║  │                                                        │   ║
║  │ R$ 79.90 / mensal                                    │   ║
║  │ (sem desconto)                                        │   ║
║  │                                                        │   ║
║  │ • Recurso 1                                           │   ║
║  │ • Recurso 2                                           │   ║
║  │ ID: plan_premium_monthly                             │   ║
║  └────────────────────────────────────────────────────────┘   ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
```

### Ao Clicar em ANUAL (Com Descontos)

```
╔════════════════════════════════════════════════════════════════╗
║                    ESCOLHA SEUS PLANOS                        ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║  [MENSAL]  [ANUAL ●]                                          ║
║                                                                ║
║  ┌────────────────────────────────────────────────────────┐   ║
║  │ Plano Gratuito                                         │   ║
║  │ Acesso básico ao aplicativo                           │   ║
║  │                                                        │   ║
║  │ R$ 0.00 / anual                                       │   ║
║  │                                                        │   ║
║  │ • Função 1                                            │   ║
║  │ • Função 2                                            │   ║
║  │ ID: plan_free                                         │   ║
║  └────────────────────────────────────────────────────────┘   ║
║                                                                ║
║  ┌────────────────────────────────────────────────────────┐   ║
║  │ Plano Básico                                           │   ║
║  │ Para pequenos times                                   │   ║
║  │                                                        │   ║
║  │ R$ 299.00  ┌──────────┐                              │   ║
║  │            │ 20% OFF  │                              │   ║
║  │            └──────────┘                              │   ║
║  │ R$ 239.20 / anual                                    │   ║
║  │                                                        │   ║
║  │ • Recurso 1                                           │   ║
║  │ • Recurso 2                                           │   ║
║  │ ID: plan_basic_annual                                │   ║
║  └────────────────────────────────────────────────────────┘   ║
║                                                                ║
║  ┌────────────────────────────────────────────────────────┐   ║
║  │ Plano Premium                                          │   ║
║  │ Para equipes maiores                                 │   ║
║  │                                                        │   ║
║  │ R$ 799.00  ┌──────────┐                              │   ║
║  │            │ 25% OFF  │                              │   ║
║  │            └──────────┘                              │   ║
║  │ R$ 599.25 / anual                                    │   ║
║  │                                                        │   ║
║  │ • Recurso 1                                           │   ║
║  │ • Recurso 2                                           │   ║
║  │ ID: plan_premium_annual                              │   ║
║  └────────────────────────────────────────────────────────┘   ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
```

---

## 🎯 Detalhes do Preço com Desconto

### Sem Desconto
```
Preço exibido:
┌──────────────┐
│ R$ 29.90     │
│ / mensal     │
└──────────────┘

Estrutura:
- R$ 29.90 (azul, 16px)
- / mensal (cinza, 13px, itálico)
```

### Com Desconto
```
Preço exibido:
┌─────────────────────────┐
│ R$ 299.00  ┌─────────┐ │
│ (riscado)  │20% OFF  │ │
│            └─────────┘ │
│ R$ 239.20 / anual     │
│ (vermelho, bold)      │
└─────────────────────────┘

Estrutura:
- R$ 299.00 (13px, riscado, cinza)
- "20% OFF" (badge rosa, 12px bold)
- R$ 239.20 (18px bold, vermelho #ff6b6b)
- / anual (cinza, 13px, itálico)
```

---

## 🔢 Exemplos de Cálculo

### Exemplo 1: Plano Básico Anual com 20% de Desconto
```
Valor Original: R$ 299.00
Desconto:       20%
Fórmula:        299.00 × (1 - 20/100)
                = 299.00 × 0.80
                = 239.20
Exibição:       R$ 299.00  [20% OFF]
                R$ 239.20 / anual
Economia:       R$ 59.80 por ano
```

### Exemplo 2: Plano Premium Anual com 25% de Desconto
```
Valor Original: R$ 799.00
Desconto:       25%
Fórmula:        799.00 × (1 - 25/100)
                = 799.00 × 0.75
                = 599.25
Exibição:       R$ 799.00  [25% OFF]
                R$ 599.25 / anual
Economia:       R$ 199.75 por ano
```

### Exemplo 3: Sem Desconto
```
Valor Original: R$ 29.90
Desconto:       0%
Fórmula:        29.90 × (1 - 0/100)
                = 29.90 × 1.00
                = 29.90
Exibição:       R$ 29.90 / mensal
Economia:       Nenhuma
```

---

## 🎨 Paleta de Cores

### Desconto
```
Texto do Badge:      #ff6b6b (vermelho)
Fundo do Badge:      #ffe5e5 (rosa suave)
Preço com Desconto:  #ff6b6b (vermelho bold)
```

### Preço Original
```
Preço Normal:        #007aff (azul)
Preço Riscado:       #999999 (cinza)
Ciclo (Label):       #666666 (cinza secundário)
```

### Dark Mode
```
Preço com Desconto:  #ff6b6b (mesmo)
Badge:               #ffe5e5 (mesmo, ajusta com tema)
Texto Riscado:       #888888 (mais claro)
```

---

## 📱 Layout Responsivo

### Mobile (320px+)
```
┌──────────────────────┐
│ Plano Básico         │
│ Descrição...         │
│                      │
│ R$ 299.00            │
│ ┌──────────┐         │
│ │20% OFF   │         │
│ └──────────┘         │
│ R$ 239.20            │
│ / anual              │
└──────────────────────┘
```

### Tablet (768px+)
```
┌────────────────────────────┐
│ Plano Básico               │
│ Descrição...               │
│                            │
│ R$ 299.00  ┌──────────┐   │
│            │ 20% OFF  │   │
│            └──────────┘   │
│ R$ 239.20 / anual         │
└────────────────────────────┘
```

---

## 🔄 Transição entre Ciclos

### Estado: MENSAL (sem desconto)
```
Preço Básico:   R$ 29.90 / mensal
Preço Premium:  R$ 79.90 / mensal
```

### Usuário clica: ANUAL
```
Animação: fade out (50ms)
Atualização: useMemo triggered
Animação: fade in (100ms)
```

### Estado: ANUAL (com desconto)
```
Preço Básico:   R$ 299.00 [20% OFF]
                R$ 239.20 / anual
                
Preço Premium:  R$ 799.00 [25% OFF]
                R$ 599.25 / anual
```

---

## 🧮 Fórmula de Cálculo no Código

```typescript
// Cálculo do valor com desconto
const valorComDesconto = Number(plano.valor) * (1 - (plano.desconto_aplicado || 0) / 100);

// Formatação para exibição
const precoFormatado = valorComDesconto.toFixed(2);

// Exemplo numérico:
// plano.valor = 299.00
// plano.desconto_aplicado = 20
// valorComDesconto = 299.00 * (1 - 20/100) = 299.00 * 0.8 = 239.20
// precoFormatado = "239.20"
// Exibição: "R$ 239.20"
```

---

## ✅ Checklist Visual

- [x] Preço original riscado quando há desconto
- [x] Badge desconto com % destacado
- [x] Novo preço em vermelho bold
- [x] Ciclo exibido corretamente
- [x] Sem desconto = exibição normal
- [x] Dark mode suportado
- [x] Layout responsivo
- [x] Transição suave entre ciclos
- [x] Cores em paleta consistente
- [x] Espaçamento adequado

---

## 🚀 Próximas Melhorias (Opcional)

- [ ] Animação ao aparecer desconto
- [ ] Tooltip: "Economize R$ X por ano"
- [ ] Gráfico: comparação mensal vs anual
- [ ] Countdown timer para desconto temporário
- [ ] Destacar melhor economia
- [ ] Badge "Mais popular" + desconto

---

**Data:** 2026-09-23
**Status:** ✅ Visual Complete
**Versão:** 1.0
