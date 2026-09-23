# ⚡ Guia Rápido - Seletor de Ciclo (MENSAL/ANUAL)

## 🎯 Em 3 Passos

### 1️⃣ Aplicar Migração SQL
```
Supabase Dashboard → SQL Editor
↓
Cole: supabase-schema/sql/migration_add_planos_fields.sql
↓
Clique: Execute
✓ Pronto!
```

### 2️⃣ Inserir Dados de Teste (Opcional)
```
SQL Editor → Nova Query
↓
Cole: supabase-schema/sql/test_data_planos.sql
↓
Descomente INSERT statements
↓
Clique: Execute
✓ Dados Inseridos!
```

### 3️⃣ Testar no App
```
Abra app-psios em React Native
↓
Navegue para: (tabs)/assinatura
↓
Veja: Toggle [MENSAL] [ANUAL]
↓
Teste: Clique para alternar ciclos
✓ Pronto!
```

---

## 🔍 Verificação Rápida

Após aplicar a migração, execute no Supabase SQL Editor:

```sql
-- Verify: Verificar campos foram adicionados
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name='planos' 
ORDER BY ordinal_position;

-- Esperado:
-- ciclo, tipo_acesso, codigo_identificador, updated_at (novos)
```

---

## 📊 Estrutura de Dados

```
planos
├─ id (UUID)
├─ nome (TEXT)
├─ descricao (TEXT)
├─ valor (DECIMAL)
├─ beneficios (JSON)
├─ ciclo ⭐ NOVO (MENSAL|ANUAL)
├─ tipo_acesso ⭐ NOVO (FREE|BASIC|FULL)
├─ codigo_identificador ⭐ NOVO (checkout ID)
├─ created_at (TIMESTAMP)
└─ updated_at ⭐ NOVO (TIMESTAMP)
```

---

## 💻 Componentes Adicionados

### CycleSwitcher.tsx
Toggle visual para MENSAL/ANUAL
```tsx
<CycleSwitcher
  selectedCycle="MENSAL"
  onCycleChange={(cycle) => console.log(cycle)}
/>
```

### Atualizado: assinatura.tsx
- Hook `useMemo` para filtro reativo
- Estado `cicloSelecionado`
- Lógica de filtro de planos
- Exibição de `codigo_identificador`

---

## 📝 Exemplos de Dados

### Plano Gratuito (sempre visível)
```json
{
  "id": "uuid-1",
  "nome": "Plano Gratuito",
  "valor": 0.00,
  "ciclo": "MENSAL",
  "tipo_acesso": "FREE",
  "codigo_identificador": "plan_free"
}
```

### Plano Básico Mensal
```json
{
  "id": "uuid-2",
  "nome": "Plano Básico",
  "valor": 29.90,
  "ciclo": "MENSAL",
  "tipo_acesso": "BASIC",
  "codigo_identificador": "plan_basic_monthly"
}
```

### Plano Básico Anual
```json
{
  "id": "uuid-3",
  "nome": "Plano Básico",
  "valor": 299.00,
  "ciclo": "ANUAL",
  "tipo_acesso": "BASIC",
  "codigo_identificador": "plan_basic_annual"
}
```

---

## ✅ Checklist de Implementação

- [ ] Executar migração SQL no Supabase
- [ ] Inserir dados de teste (opcional)
- [ ] Abrir app em React Native
- [ ] Ir para tela de Assinaturas
- [ ] Ver toggle MENSAL/ANUAL
- [ ] Testar: clicar em MENSAL
- [ ] Testar: clicar em ANUAL
- [ ] Verificar: Plano Gratuito sempre visível
- [ ] Verificar: Preços atualizam corretamente
- [ ] Verificar: codigo_identificador é exibido

---

## 🐛 Troubleshooting Rápido

| Erro | Solução |
|------|---------|
| "Cannot find CycleSwitcher" | Verifique import path: `@/components/CycleSwitcher` |
| Planos não aparecem | Verifique migração SQL executada no Supabase |
| Preços iguais MENSAL/ANUAL | Verifique dados: valores diferentes para cada ciclo |
| Dark mode quebrado | Verifique `useThemeColor` hook está funcionando |

---

## 📚 Documentos Disponíveis

```
📂 c:\desenvolvimento\React\app-psios\
├─ README_CYCLE_SELECTOR.md ⭐ LEIA PRIMEIRO
├─ IMPLEMENTATION_CYCLE_SELECTOR.md (detalhado)
├─ VISUAL_GUIDE_CYCLE_SELECTOR.md (diagramas)
├─ CHECKLIST_IMPLEMENTATION.md (testes)
└─ components/
   └─ CycleSwitcher.tsx
```

---

## 🚀 Deploy para Produção

```bash
1. git add .
2. git commit -m "feat: add cycle selector (MENSAL/ANUAL) to plans"
3. git push origin main
4. Executar migração em produção (Supabase)
5. Deploy do app
6. Monitor logs para erros
```

---

## 💡 Próximas Integrações

- [ ] Integrar com Stripe/PagSeguro usando `codigo_identificador`
- [ ] Adicionar badge "Economize X%"
- [ ] Animar transição entre ciclos
- [ ] Comparador de planos lado a lado

---

**Status:** ✅ Pronto para Uso
**Última Atualização:** 2026-09-23
**Versão:** 1.0

Comece pelo Passo 1️⃣ acima! 🚀
