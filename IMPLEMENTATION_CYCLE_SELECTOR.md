# 🎯 Implementação: Seletor de Ciclo (MENSAL/ANUAL) para Planos

## 📋 Resumo das Alterações

Este documento descreve as alterações implementadas para adicionar suporte a um seletor de ciclo (MENSAL/ANUAL) no componente de planos da aplicação.

### ✅ Arquivos Criados

1. **`components/CycleSwitcher.tsx`** - Componente React Native para seleção entre MENSAL e ANUAL
   - Toggle visual com cores adaptáveis ao tema
   - Suporta light mode e dark mode
   - Interface responsiva

### ✅ Arquivos Modificados

1. **`app/(tabs)/assinatura.tsx`** - Componente principal de planos
   - Integrado CycleSwitcher
   - Implementado filtro de planos com base em `tipo_acesso` e `ciclo`
   - Adicionada exibição de `codigo_identificador` para checkout
   - Melhorado layout com informações de ciclo nos preços
   - Adicionado estado vazio quando não há planos disponíveis

2. **`supabase-schema/prisma/schema.prisma`** - Schema Prisma principal
   - Adicionados campos: `ciclo`, `tipo_acesso`, `codigo_identificador`, `updated_at`
   - Criado índice para melhor performance

3. **`docs/schema.prisma`** - Schema Prisma documentado
   - Atualizados campos de modelo Plano
   - Adicionado índice de performance

### ✅ Arquivos de Migração

1. **`supabase-schema/sql/migration_add_planos_fields.sql`** - Script SQL
   - Adiciona colunas na tabela planos
   - Contém dados de exemplo comentados para testes

## 🔧 Instruções de Implementação

### Passo 1: Aplicar Migração no Supabase

1. Abra o Supabase Dashboard: https://supabase.com/
2. Navegue até seu projeto
3. Vá para **SQL Editor**
4. Crie uma nova query
5. Cole o conteúdo do arquivo `migration_add_planos_fields.sql`
6. Execute a query

Alternativamente, você pode executar via CLI:
```bash
cd supabase-schema
psql postgresql://<user>:<password>@<host>:5432/<database> < sql/migration_add_planos_fields.sql
```

### Passo 2: Inserir Dados de Teste (Opcional)

Descomente a seção de exemplos no arquivo SQL e execute para popular a tabela com dados de teste:

```sql
-- Plano Gratuito
INSERT INTO public.planos (id, nome, descricao, valor, beneficios, ciclo, tipo_acesso, codigo_identificador)
VALUES (
  gen_random_uuid(),
  'Plano Gratuito',
  'Acesso básico à plataforma',
  0.00,
  '["Acesso básico", "Suporte por email"]'::jsonb,
  'MENSAL',
  'FREE',
  'plan_free'
);
-- ... (veja arquivo SQL completo)
```

### Passo 3: Regenerar Cliente Prisma (opcional)

Se você usar Prisma para generated types:
```bash
cd supabase-schema
npx prisma generate
```

## 📋 Regras de Filtro Implementadas

### 1. Planos Gratuitos (FREE)
- Sempre visíveis independentemente do ciclo selecionado
- Campo: `tipo_acesso = 'FREE'`

### 2. Planos Mensais (MENSAL)
- Visíveis quando aba MENSAL está ativa
- Campo: `tipo_acesso IN ('BASIC', 'FULL')` AND `ciclo = 'MENSAL'`

### 3. Planos Anuais (ANUAL)
- Visíveis quando aba ANUAL está ativa
- Campo: `tipo_acesso IN ('BASIC', 'FULL')` AND `ciclo = 'ANUAL'`

## 🎨 Estrutura de Dados

### Campo: `ciclo`
- Tipo: VARCHAR(10)
- Valores: `'MENSAL'` ou `'ANUAL'`
- Padrão: `'MENSAL'`

### Campo: `tipo_acesso`
- Tipo: VARCHAR(10)
- Valores: `'FREE'`, `'BASIC'`, `'FULL'`
- Padrão: `'FREE'`

### Campo: `codigo_identificador`
- Tipo: VARCHAR(255)
- Unique: SIM
- Uso: Identificação para checkout (ex: `plan_basic_monthly`)

### Campo: `updated_at`
- Tipo: TIMESTAMP WITH TIME ZONE
- Padrão: Atual
- Uso: Rastreamento de atualizações

## 🧪 Testando a Implementação

### Teste 1: Verificar Filtro de Planos

1. Abra a tela de Assinaturas
2. Verifique que o Plano Gratuito está sempre visível
3. Clique em **MENSAL** - devem aparecer planos com `ciclo = 'MENSAL'`
4. Clique em **ANUAL** - devem aparecer planos com `ciclo = 'ANUAL'`
5. Planos pagos não devem aparecer quando não correspondem ao ciclo

### Teste 2: Preços e Descrições

1. Trocar entre MENSAL e ANUAL
2. Verificar que preços se atualizam corretamente
3. Verificar que descrições se atualizam (se diferentes por ciclo)
4. Verificar que `codigo_identificador` está correto

### Teste 3: Dark Mode / Light Mode

1. Ativar/desativar Dark Mode
2. Verificar que CycleSwitcher se adapta ao tema
3. Verificar cores de texto e fundo

### Teste 4: Estado Vazio

1. Deletar ou desabilitar planos de um ciclo
2. Selecionar esse ciclo
3. Deve aparecer mensagem: "Nenhum plano disponível para este período"

## 🔌 Integração com Checkout

O campo `codigo_identificador` pode ser usado para integrar com sistemas de checkout:

```typescript
const iniciarCheckout = (plano: any) => {
  // Usar plano.codigo_identificador para checkout
  console.log('Iniciar checkout para:', plano.codigo_identificador);
  // Ex: redirecionar para Stripe, PagSeguro, etc.
};
```

## 📱 Componente CycleSwitcher

### Props

```typescript
interface CycleSwitcherProps {
  selectedCycle: 'MENSAL' | 'ANUAL';        // Ciclo selecionado
  onCycleChange: (cycle: 'MENSAL' | 'ANUAL') => void;  // Callback
  containerStyle?: ViewStyle;               // Estilos customizados
  activeColor?: string;                     // Cor ativa (padrão: #3399ff)
  inactiveColor?: string;                   // Cor inativa (padrão: #e0e0e0)
  textColor?: string;                       // Cor do texto (padrão: #000)
}
```

### Exemplo de Uso

```typescript
import { CycleSwitcher } from '@/components/CycleSwitcher';

<CycleSwitcher
  selectedCycle={cicloSelecionado}
  onCycleChange={setCicloSelecionado}
  activeColor="#3399ff"
  inactiveColor={colors.inputBackground}
  textColor={colors.text}
/>
```

## 🐛 Troubleshooting

### Problema: Planos não aparecem depois de migração

**Solução:**
1. Verifique se a migração SQL foi executada com sucesso
2. Verifique se os dados têm valores corretos nos campos `ciclo` e `tipo_acesso`
3. Verifique o console do navegador para mensagens de erro

### Problema: Dark mode não funciona

**Solução:**
1. Verifique se `useThemeColor` está funcionando
2. Verifique se `getThemeColors` retorna as cores corretas
3. Teste com valores de cor hardcoded

### Problema: CycleSwitcher não renderiza

**Solução:**
1. Verifique se a importação está correta
2. Verifique se o caminho é relativo correto (`@/components/CycleSwitcher`)
3. Verifique se não há erros de compilação TypeScript

## 📚 Referências

- [React Native - useMemo Hook](https://react.dev/reference/react/useMemo)
- [Supabase - PostgreSQL Documentation](https://supabase.com/docs)
- [Expo - Documentation](https://docs.expo.dev/)

## 🎯 Próximos Passos (Sugeridos)

1. ✅ Integrar com sistema de pagamento (Stripe, PagSeguro)
2. ✅ Adicionar animação ao trocar ciclo
3. ✅ Adicionar badge "ECONOMIZE X%" para planos anuais
4. ✅ Implementar botão "Assinar" com validação
5. ✅ Adicionar histórico de ciclo de cobrança para usuários

---

**Última atualização:** 2026-09-23
