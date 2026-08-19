# Design System — [Saquetti] Discovery

## 1. Fundamentos e tokens

# Tokens e estilos extraídos do Figma

Resumo: 7 cor(es), 1 estilo(s) tipográfico(s), 0 efeito(s), 0 variável(is), 77 componente(s) publicado(s), 0 frame(s) em páginas de Design System.

## Cores (estilos FILL)
- **Base/White:** `#FFFFFF`
- **Carbon / Darkest:** `#24262B`
- **Carbon Neutral/300:** `#D6D9DD`
- **Foundation /Neutra/Darker:** `#0A0A0A`
- **Primary/0:** `#FFFFFF`
- **Secondary/500:** `#1A1C1E`
- **Success/500:** `#12B76A`

## Tipografia (estilos TEXT)
- Text xl/Semibold (fonte Inter, 20px, peso 600, line-height 30px, letter-spacing 0)

## Componentes publicados no arquivo
- **arrow-narrow-left**: arrow
narrow
left
back
previous
pointer
point
icon
stroke
outline
- **attachment-icon=google drive**
- **Descrição do Projeto**
- **Divider Type=Half Width**
- **Eye / show**
- **Eye / show**
- **Icon=chevron-left**
- **Icon=chevron-right**
- **Image=Company logo**
- **Image=Image-02**
- **Image=Image-03**
- **Image=Image-05**
- **Input**
- **li:clock**
- **li:home**
- **li:user**
- **light-mode/Action buttons**
- **Propriedade 1=Padrão**
- **Tab=Tabs as filters**
- **Thumbnail=Image-01**
- **Type=Icon**
- **Type=Settings**
- **Type=Slightly rounded, Hierarchy=Primary, State=Default**
- **Type=Slightly rounded, Hierarchy=Secondary, State=Default**
- **Type=timestamp**
- **variant=1**
- **variant=1**
- **variant=1**
- **variant=1**
- **variant=10**
- **variant=11**
- **variant=12**
- **variant=13**
- **variant=13**
- **variant=14**
- **variant=14**
- **variant=14**
- **variant=15**
- **variant=15**
- **variant=16**
- **variant=16**
- **variant=16**
- **variant=17**
- **variant=17**
- **variant=17**
- **variant=18**
- **variant=18**
- **variant=19**
- **variant=19**
- **variant=2**
- **variant=2**
- **variant=2**
- **variant=20**
- **variant=20**
- **variant=21**
- **variant=22**
- **variant=23**
- **variant=24**
- **variant=25**
- **variant=26**
- **variant=27**
- **variant=28**
- **variant=29**
- **variant=3**
- **variant=3**
- **variant=30**
- **variant=4**
- **variant=4**
- **variant=5**
- **variant=5**
- **variant=6**
- **variant=7**
- **variant=8**
- **variant=8**
- **variant=9**
- **variant=9**
- **vuesax/linear/home-2**

---

## 2. Inventário de componentes

# 2. Inventário de componentes de UI

Esta seção cataloga todos os componentes visuais e interativos do sistema Saquetti, organizados por categoria funcional. Cada componente lista suas variantes, estados, tokens associados e contextos de uso identificados nos wireframes.

---

## 2.1 Navegação

### Sidebar (Navegação principal — Web)

**Descrição:**  
Menu lateral vertical fixo presente em todas as telas do ambiente gestor/admin web. Agrupa os módulos principais do sistema e exibe informações da empresa logada.

**Variantes/Estados:**
- Item ativo (rota atual)
- Item inativo
- Item com badge de notificação (ex.: "7" em Notificações)
- Estado colapsado (apenas ícones) — [A DEFINIR — depende de especificação de responsividade]

**Tokens de cor associados:**
- Fundo: `#FFFFFF` (Base/White) ou `#1A1C1E` (Secondary/500) — [A DEFINIR — depende de tema claro/escuro]
- Item ativo: `#12B76A` (Success/500) para destaque ou `#0A0A0A` (Foundation/Neutra/Darker)
- Ícones: `#24262B` (Carbon/Darkest) ou `#D6D9DD` (Carbon Neutral/300)
- Badge de notificação: `#12B76A` (Success/500) ou [A DEFINIR — cor de alerta]

**Tokens de tipografia:**
- Text xl/Semibold (Inter, 20px, 600, line-height 30px) para títulos/seções
- [A DEFINIR — estilo para labels de menu; sugestão: 14–16px, peso 400–500]

**Componentes Figma relacionados:**
- `li:home`, `li:clock`, `li:user` (ícones de menu)
- `Icon=chevron-left`, `Icon=chevron-right` (controles de navegação)
- `Image=Company logo` (logo da empresa no topo)

**Telas onde aparece:**
- 11.1 Dashboard - Atalhos Rápidos
- 12.2 Estrutura Organizacional - Colaboradores
- Todas as telas do ambiente gestor/admin

---

### Bottom Navigation (Navegação principal — Mobile)

**Descrição:**  
Barra de navegação inferior com 4 itens fixos (Home, Espelho, Horários, Perfil), presente em todas as telas principais do app trabalhador.

**Variantes/Estados:**
- Item ativo (tela atual, ícone destacado)
- Item inativo
- [A DEFINIR — animação de transição entre telas]

**Tokens de cor associados:**
- Fundo da barra: `#FFFFFF` (Base/White)
- Ícone ativo: `#12B76A` (Success/500) ou `#0A0A0A` (Foundation/Neutra/Darker)
- Ícone inativo: `#D6D9DD` (Carbon Neutral/300)
- Divisor superior: `#D6D9DD` (Carbon Neutral/300) — 1px

**Tokens de tipografia:**
- [A DEFINIR — label de navegação; sugestão: 10–12px, Inter, peso 500]

**Componentes Figma relacionados:**
- `li:home`, `li:clock`, `li:user` (ícones de navegação)

**Telas onde aparece:**
- 2.1 Home / Status do Dia
- 2.2 Alertas / Pendências
- 3.3 Comprovante
- 4.2 Cartão poto (Espelho)
- Todas as telas principais do app trabalhador

---

### Tabs (Navegação secundária)

**Descrição:**  
Abas horizontais para alternar entre visualizações de conteúdo relacionado (ex.: Espelho / Banco / Cartão ponto).

**Variantes/Estados:**
- Tab ativa (sublinhado ou fundo destacado)
- Tab inativa
- Com indicador de quantidade/pendência — [A DEFINIR]

**Tokens de cor associados:**
- Tab ativa: `#0A0A0A` (Foundation/Neutra/Darker) ou `#12B76A` (Success/500) para underline
- Tab inativa: `#D6D9DD` (Carbon Neutral/300)
- Fundo: `#FFFFFF` (Base/White)

**Tokens de tipografia:**
- [A DEFINIR — sugestão: 14–16px, Inter, peso 600 para ativa, 400 para inativa]

**Componentes Figma relacionados:**
- `Tab=Tabs as filters`

**Telas onde aparece:**
- 4.2 Cartão poto ("Espelho | Banco | Cartão ponto")
- 12.2 Estrutura Organizacional ("Colaboradores | Empresas | Departamentos...")

---

### Breadcrumb

**Descrição:**  
Caminho hierárquico de navegação, típico de interfaces web administrativas.

**Variantes/Estados:**
- Nível atual (não clicável, em negrito)
- Níveis anteriores (links clicáveis)
- Separador (">", "/", ou ícone chevron)

**Tokens de cor associados:**
- Link: `#0A0A0A` (Foundation/Neutra/Darker) ou `#12B76A` (Success/500)
- Nível atual: `#24262B` (Carbon/Darkest)
- Separador: `#D6D9DD` (Carbon Neutral/300)

**Tokens de tipografia:**
- [A DEFINIR — sugestão: 14px, Inter, peso 400 para links, 600 para nível atual]

**Componentes Figma relacionados:**
- `Icon=chevron-right` (separador)

**Telas onde aparece:**
- [A DEFINIR — não explicitamente visível nos wireframes, mas comum em dashboards web]

---

## 2.2 Formulários

### Input (Campo de texto)

**Descrição:**  
Campo de entrada de texto padrão, usado para CPF, senha, e-mail, descrições etc.

**Variantes/Estados:**
- Normal (vazio)
- Preenchido
- Foco (bordas destacadas)
- Erro (borda vermelha, mensagem de erro abaixo)
- Desabilitado
- Com ícone à direita (ex.: olho para toggle de senha)
- Com máscara (ex.: CPF "000.000.000-00")

**Tokens de cor associados:**
- Fundo: `#FFFFFF` (Base/White)
- Borda normal: `#D6D9DD` (Carbon Neutral/300)
- Borda foco: `#12B76A` (Success/500) ou `#0A0A0A` (Foundation/Neutra/Darker)
- Borda erro: [A DEFINIR — cor de erro; sugestão: vermelho #E53E3E]
- Texto: `#0A0A0A` (Foundation/Neutra/Darker)
- Placeholder: `#D6D9DD` (Carbon Neutral/300)
- Label: `#24262B` (Carbon/Darkest)

**Tokens de tipografia:**
- Label: [A DEFINIR — sugestão: 14px, Inter, peso 500]
- Input: [A DEFINIR — sugestão: 16px, Inter, peso 400]
- Placeholder: [A DEFINIR — sugestão: 16px, Inter, peso 400, itálico]
- Mensagem de erro: [A DEFINIR — sugestão: 12px, Inter, peso 400]

**Componentes Figma relacionados:**
- `Input`
- `Eye / show` (ícone de toggle de senha)

**Telas onde aparece:**
- 1.2 Login ("CPF", "Senha")
- 1.3 Recuperar Senha ("CPF")
- 1.4 Nova senha ("Nova senha", "Confirmar Nova senha")
- Container (RH): "E-mail", "Senha", "CNPJ da Empresa"
- Container (Admin): "CNPJ", "CPF do Administrador", "Nova Senha"
- Todas as telas com formulários

---

### Button (Botão)

**Descrição:**  
Botão de ação primário ou secundário, usado para submeter formulários, confirmar ações, navegar.

**Variantes/Estados:**
- Primário (ação principal, fundo destacado)
- Secundário (ação secundária, fundo claro ou outline)
- Desabilitado (opacidade reduzida, não clicável)
- Loading (spinner interno, desabilitado temporariamente)
- Ícone + texto
- Apenas ícone

**Tokens de cor associados:**
- Primário fundo: `#12B76A` (Success/500) ou `#0A0A0A` (Foundation/Neutra/Darker)
- Primário texto: `#FFFFFF` (Base/White)
- Secundário fundo: `#FFFFFF` (Base/White)
- Secundário borda: `#D6D9DD` (Carbon Neutral/300) ou `#0A0A0A` (Foundation/Neutra/Darker)
- Secundário texto: `#0A0A0A` (Foundation/Neutra/Darker)
- Desabilitado fundo: `#D6D9DD` (Carbon Neutral/300)
- Desabilitado texto: `#FFFFFF` (Base/White) com opacidade 0.5

**Tokens de tipografia:**
- [A DEFINIR — sugestão: 14–16px, Inter, peso 600]

**Componentes Figma relacionados:**
- `Type=Slightly rounded, Hierarchy=Primary, State=Default`
- `Type=Slightly rounded, Hierarchy=Secondary, State=Default`
- `light-mode/Action buttons`
- `Button` (genérico)

**Telas onde aparece:**
- 1.2 Login ("Entrar")
- 1.3 Recuperar Senha ("Enviar Código" / "Enviar código")
- 1.4 Nova senha ("Criar nova senha")
- 3.3 Comprovante ("Voltar para Home", "Ver espelho do ponto")
- 11.1 Dashboard ("Visualizar e editar registros de ponto", etc.)
- Praticamente todas as telas

---

### Checkbox / Radio

**Descrição:**  
Seleção de opções únicas (radio) ou múltiplas (checkbox).

**Variantes/Estados:**
- Selecionado
- Não selecionado
- Desabilitado
- Foco (outline ao redor)

**Tokens de cor associados:**
- Borda não selecionado: `#D6D9DD` (Carbon Neutral/300)
- Preenchimento selecionado: `#12B76A` (Success/500) ou `#0A0A0A` (Foundation/Neutra/Darker)
- Checkmark: `#FFFFFF` (Base/White)

**Tokens de tipografia:**
- Label: [A DEFINIR — sugestão: 14px, Inter, peso 400]

**Componentes Figma relacionados:**
- [A DEFINIR — não explicitamente listado, mas presente em formulários de filtro]

**Telas onde aparece:**
- [A DEFINIR — filtros de tabelas, configurações de conta]

---

### Select / Dropdown

**Descrição:**  
Menu suspenso para seleção de uma opção entre várias.

**Variantes/Estados:**
- Fechado (exibe opção selecionada + ícone chevron)
- Aberto (lista de opções)
- Foco
- Desabilitado

**Tokens de cor associados:**
- Fundo: `#FFFFFF` (Base/White)
- Borda: `#D6D9DD` (Carbon Neutral/300)
- Fundo hover: [A DEFINIR — cor de hover; sugestão: cinza claro]
- Texto: `#0A0A0A` (Foundation/Neutra/Darker)
- Ícone chevron: `#24262B` (Carbon/Darkest)

**Tokens de tipografia:**
- [A DEFINIR — sugestão: 14–16px, Inter, peso 400]

**Componentes Figma relacionados:**
- `Icon=chevron-left`, `Icon=chevron-right` (ícones de navegação reutilizáveis)

**Telas onde aparece:**
- 1.3 Recuperar Senha (tipo de justificativa)
- [A DEFINIR — filtros de data, seletores de período]

---

### Date Picker

**Descrição:**  
Seletor de data com calendário visual.

**Variantes/Estados:**
- Campo fechado (exibe data selecionada + ícone calendário)
- Calendário aberto (grade de dias, navegação mês/ano)
- Seleção de range (data início + data fim)

**Tokens de cor associados:**
- Fundo campo: `#FFFFFF` (Base

---

## 3. Layout e navegação

# 2. Layout e padrões de navegação

## 2.1 Grid e viewports

### Desktop (Portal Gestor e Admin)

**Viewport base**  
- **Largura mínima:** 1280px  
- **Largura recomendada:** 1440px  
- **Altura mínima:** 800px

**Grid**  
- **Colunas:** 12 colunas  
- **Gutter:** 24px  
- **Margin lateral:** 48px (desktop ≥1440px) / 32px (desktop 1280px)  
- **Container máximo:** 1344px (1440px - 96px de margin)

**Breakpoints**  
- **XL:** ≥1440px — layout completo com sidebar expandida  
- **L:** 1280px–1439px — sidebar colapsada por padrão  
- **Tablet:** <1280px — [A DEFINIR — depende de priorização de responsividade]

---

### Mobile (App Trabalhador)

**Viewport base**  
- **Largura:** 390px (referência iPhone 12/13/14)  
- **Altura:** 844px (safe area considerada)

**Grid**  
- **Margin lateral:** 16px  
- **Gutter entre cards/componentes:** 12px  
- **Padding interno de containers:** 16px

**Safe areas**  
- **Topo (status bar):** ~44px  
- **Bottom (navigation bar iOS):** ~34px  
- **Gesture area Android:** ~24px

---

## 2.2 Estrutura shell (Desktop)

### Layout principal

```
┌─────────────────────────────────────────────────────┐
│  [Sidebar]  │  [Header]                             │
│             ├───────────────────────────────────────┤
│             │                                       │
│             │  [Área de conteúdo principal]         │
│             │                                       │
│             │                                       │
└─────────────────────────────────────────────────────┘
```

**Sidebar**  
- **Largura expandida:** 280px  
- **Largura colapsada:** 72px  
- **Posição:** fixa à esquerda  
- **Background:** `#FFFFFF` (Base/White)  
- **Borda direita:** 1px solid `#D6D9DD` (Carbon Neutral/300)

**Conteúdo da Sidebar:**  
- Logo da empresa (topo, 48px altura)  
- Menu de navegação principal (itens com ícone + label)  
- Indicador de módulo ativo  
- Rodapé com nome do usuário/empresa

**Header**  
- **Altura:** 64px  
- **Background:** `#FFFFFF` (Base/White)  
- **Borda inferior:** 1px solid `#D6D9DD` (Carbon Neutral/300)  
- **Posição:** fixa ao topo (após sidebar)

**Conteúdo do Header:**  
- Breadcrumb ou título da página (esquerda)  
- Campo de busca (centro, quando aplicável)  
- Avatar do usuário + notificações (direita)

**Área de conteúdo**  
- **Padding:** 32px (topo/laterais/fundo)  
- **Background:** [A DEFINIR — depende de token de surface/background no DS]  
- **Scroll:** vertical, independente da sidebar/header fixos

---

## 2.3 Estrutura shell (Mobile)

```
┌─────────────────────┐
│  [Status bar]       │
├─────────────────────┤
│  [Header fixo]      │
├─────────────────────┤
│                     │
│  [Conteúdo scroll]  │
│                     │
│                     │
├─────────────────────┤
│  [Tab bar fixo]     │
└─────────────────────┘
```

**Header mobile**  
- **Altura:** 56px (+ safe area superior)  
- **Background:** `#FFFFFF` (Base/White)  
- **Conteúdo:** título centralizado + ícone de voltar (esquerda) ou ações (direita)

**Tab bar (navegação principal)**  
- **Altura:** 64px (+ safe area inferior)  
- **Background:** `#FFFFFF` (Base/White)  
- **Borda superior:** 1px solid `#D6D9DD` (Carbon Neutral/300)  
- **Itens:** Home · Espelho · Horários · Perfil  
- **Ícones + labels**

**Área de conteúdo**  
- **Padding lateral:** 16px  
- **Padding vertical:** 16px (topo) / 24px (fundo, antes do tab bar)  
- **Scroll:** vertical

---

## 2.4 Padrões de página (Desktop)

### Listagem (ex.: Dashboard Operacional, Gestão de Marcações)

**Estrutura:**  
1. **Header da página** (breadcrumb + título + ações primárias — 64px altura)  
2. **Filtros/Tabs** (quando aplicável — 48px altura, margin-bottom 24px)  
3. **Cards de resumo/KPIs** (grid 4 colunas, altura ~120px, gap 24px)  
4. **Tabela ou lista de itens** (margin-top 32px)  
   - Cabeçalho fixo ao scroll  
   - Ações por linha (botões secundários à direita)  
   - Paginação no rodapé (centralizada, 56px altura)

**Exemplo de hierarquia:**  
```
Título da página (Text xl/Semibold, 20px)
  ↓ 24px
Cards de KPI (4 colunas)
  ↓ 32px
Tabela com header fixo
```

---

### Detalhe (ex.: Detalhe de Colaborador, Visualização de Solicitação)

**Estrutura:**  
1. **Header da página** (breadcrumb + título + ações — 64px)  
2. **Resumo/Card principal** (largura ~66%, alinhado à esquerda, margin-bottom 24px)  
3. **Seções em accordion ou tabs** (margin-top 24px)  
4. **Sidebar lateral** (33% largura) com ações secundárias/histórico [quando aplicável]

**Hierarquia:**  
- Título da seção (Text lg/Semibold — [A DEFINIR tamanho exato])  
- Labels de campo (Text sm/Regular — [A DEFINIR tamanho exato])  
- Valores de campo (Text md/Medium — [A DEFINIR tamanho exato])

---

### Formulário (ex.: Criar Ajuste, Cadastro de Colaborador)

**Estrutura:**  
1. **Header da página** (breadcrumb + título — 64px)  
2. **Card de formulário** (largura máxima 720px, centralizado, padding 32px)  
3. **Campos agrupados por seção** (margin-bottom 24px entre seções)  
4. **Ações fixas no footer** (botões Cancelar + Salvar — altura 64px, border-top 1px)

**Layout de campos:**  
- **Label acima do input** (margin-bottom 8px)  
- **Helper text abaixo do input** (margin-top 4px, Text xs — [A DEFINIR tamanho exato])  
- **Inputs de linha única:** altura 48px  
- **Textarea:** altura mínima 96px  
- **Gap vertical entre campos:** 20px

**Validação:**  
- Erro exibido abaixo do campo, cor `#[A DEFINIR — depende de token de erro]`  
- Borda do campo muda para cor de erro quando inválido

---

### Modal/Backdrop (confirmações, formulários rápidos)

**Estrutura:**  
- **Backdrop:** `rgba(0, 0, 0, 0.5)` [verificar opacidade no DS]  
- **Card modal:**  
  - Largura máxima: 560px (pequeno) / 720px (médio) / 960px (grande)  
  - Padding: 32px  
  - Border-radius: [A DEFINIR — depende de token de radius]  
  - Shadow: [A DEFINIR — depende de token de elevation]

**Conteúdo:**  
1. Ícone + título (opcional, centralizado ou alinhado à esquerda)  
2. Corpo do texto/formulário (margin-top 16px)  
3. Ações (footer, botões alinhados à direita, gap 12px)

---

## 2.5 Padrões de página (Mobile)

### Listagem (ex.: Espelho do Ponto, Solicitações)

**Estrutura:**  
1. **Header fixo** (56px + safe area)  
2. **Filtros/Tabs** (sticky abaixo do header, 48px)  
3. **Cards de item** (stack vertical, gap 12px, padding lateral 16px)  
   - Cada card: padding 16px, border-radius [A DEFINIR],

---

## 4. Acessibilidade

# 6. Diretrizes de acessibilidade

## 6.1 Contraste de cores

Todas as combinações de texto e componentes interativos devem atender às diretrizes WCAG 2.1 AA no mínimo.

### Texto sobre fundos

| Combinação | Ratio | Status | Contexto de uso |
|------------|-------|--------|-----------------|
| `#0A0A0A` (Foundation/Neutra/Darker) sobre `#FFFFFF` (Base/White) | 20.43:1 | ✅ AAA | Texto de corpo, labels, títulos principais |
| `#1A1C1E` (Secondary/500) sobre `#FFFFFF` | 15.98:1 | ✅ AAA | Texto de corpo secundário, placeholders |
| `#24262B` (Carbon/Darkest) sobre `#FFFFFF` | 14.65:1 | ✅ AAA | Ícones, texto de suporte |
| `#FFFFFF` sobre `#0A0A0A` | 20.43:1 | ✅ AAA | Texto em fundos escuros (modais, telas de login) |
| `#FFFFFF` sobre `#1A1C1E` | 15.98:1 | ✅ AAA | Botões primários, badges de status |
| `#FFFFFF` sobre `#12B76A` (Success/500) | 3.64:1 | ✅ AA (texto grande) | Badges de sucesso, botões de confirmação — **usar apenas com texto ≥18px ou ≥14px bold** |

### Componentes interativos

Todos os estados interativos (botões, links, inputs) devem manter **ratio mínimo de 3:1** entre o componente e o fundo adjacente.

| Componente | Estado | Cor de fundo | Cor de borda/texto | Ratio | Status |
|------------|--------|--------------|-------------------|-------|--------|
| Botão primário | Default | `#1A1C1E` | `#FFFFFF` | 15.98:1 | ✅ AAA |
| Botão primário | Hover | [A DEFINIR — depende da especificação de hover no design system] | `#FFFFFF` | [A DEFINIR] | — |
| Botão primário | Focus | `#1A1C1E` com outline | [A DEFINIR — cor do outline] | [A DEFINIR] | — |
| Botão secundário | Default | `#FFFFFF` | `#1A1C1E` (borda) | 15.98:1 | ✅ AAA |
| Input text | Default | `#FFFFFF` | `#D6D9DD` (borda) | [A DEFINIR — depende do ratio entre borda e fundo da página] | — |
| Input text | Focus | `#FFFFFF` | [A DEFINIR — cor da borda no estado focus] | [A DEFINIR] | — |
| Input text | Error | `#FFFFFF` | [A DEFINIR — cor de erro não extraída dos tokens] | [A DEFINIR] | — |
| Badge Success | Default | `#12B76A` | `#FFFFFF` | 3.64:1 | ✅ AA (≥18px) |
| Badge Pendente | Default | [A DEFINIR — cor de warning não extraída] | [A DEFINIR] | [A DEFINIR] | — |
| Badge Error/Falta | Default | [A DEFINIR — cor de erro não extraída] | [A DEFINIR] | [A DEFINIR] | — |

### Ícones e elementos gráficos

Ícones informativos (não decorativos) devem atender **ratio mínimo de 3:1** em relação ao fundo.

- **Ícones funcionais (ex.: botão "Voltar", "Visualizar senha", navegação):** usar `#0A0A0A` ou `#1A1C1E` sobre `#FFFFFF` — garantido contraste AAA.
- **Ícones de status (ex.: check, alerta, erro):** [A DEFINIR — cores de ícones de status não extraídas; verificar no Figma e validar ratios].
- **Ícones decorativos:** não exigem contraste mínimo, mas devem ser marcados como `aria-hidden="true"`.

---

## 6.2 Navegação por teclado e foco visível

Todos os componentes interativos devem ser **acessíveis via teclado** e exibir **indicador de foco visível** com contraste mínimo de 3:1.

### Ordem de foco

A ordem de foco deve seguir a **ordem visual de leitura** (topo → baixo, esquerda → direita) sem pulos ou armadilhas.

**Validar em cada tela:**
- Login: CPF → Senha → "Entrar" → "Esqueceu sua senha?"
- Home (mobile): "Registrar Ponto" → cards de pendências → atalhos → navegação bottom
- Espelho do Ponto: seletor de mês → lista de dias (expandir/colapsar) → botão "Ver detalhes do dia"
- Formulários de ajuste: data → tipo → justificativa → anexar arquivo → "Enviar solicitação" → "Cancelar"

### Indicador de foco

**Especificação de foco:**
- **Cor do outline:** [A DEFINIR — cor não extraída; sugestão: `#1A1C1E` ou acento de 2px]
- **Espessura:** mínimo 2px
- **Offset:** 2px de distância do componente (evitar sobreposição)
- **Estilo:** sólido (evitar tracejado, que reduz visibilidade)

**Componentes prioritários para validação:**
- Inputs de formulário (CPF, senha, campos de texto)
- Botões primários e secundários
- Links ("Esqueceu sua senha?", "Ver detalhes", "Ver todos")
- Cards clicáveis (pendências, alertas)
- Itens de lista expandíveis (dias no espelho de ponto)
- Badges/status clicáveis (quando houver ação associada)

**Estados que NUNCA devem perder foco:**
- Modal aberto → foco deve ficar preso dentro do modal até fechar
- Acordeão expandido → foco deve alternar entre cabeçalho e conteúdo ao navegar
- Dropdown aberto → foco deve navegar entre as opções, não escapar para fora

### Atalhos de teclado

**Ações principais devem suportar:**
- **Enter:** confirmar ação em botões e links (default do navegador)
- **Espaço:** ativar botões, checkboxes, toggles
- **Esc:** fechar modais, dropdowns, mensagens de erro
- **Tab:** navegar entre componentes interativos
- **Shift + Tab:** navegação reversa

[A DEFINIR — atalhos customizados (ex.: Ctrl+S para salvar) dependem de requisitos do PRD; não identificados no protótipo.]

---

## 6.3 Labels e instruções em formulários

Todos os campos de formulário devem ter **labels visíveis e programáticos** (`<label for="id">` ou `aria-label`).

### Estrutura de formulários acessíveis

#### Campos obrigatórios

- **Indicador visual:** asterisco (`*`) após o label (ex.: "CPF *")
- **Indicador programático:** `aria-required="true"` no `<input>`
- **Cor do asterisco:** `#0A0A0A` (mesmo contraste do label)

**Exemplo de implementação:**
```html
<label for="cpf">CPF *</label>
<input 
  type="text" 
  id="cpf" 
  name="cpf" 
  aria-required="true" 
  aria-describedby="cpf-format"
/>
<span id="cpf-format" class="field-hint">000.000.000-00</span>
```

#### Placeholders

- **Placeholders NÃO substituem labels** (WCAG 3.3.2).
- Usar placeholders apenas como **exemplo de formato** (ex.: "000.000.000-00" no campo CPF).
- Contraste mínimo do placeholder: [A DEFINIR — cor não extraída; validar se é `#D6D9DD` ou mais clara].

#### Instruções e hints

- **Texto de ajuda (hints):** posicionar abaixo do campo, vinculado via `aria-describedby`.
- **Instruções de segurança (senha):** exibir **antes** do campo, não apenas no erro.
  - Exemplo (tela 1.5 Nova Senha): "Mínimo de 8 caracteres", "Letra maiúscula", "Número", "Caractere especial (!@#$...)" → cada item deve ter checklist visual (✓/✗) conforme usuário digita.

**Exemplo de requisitos de senha:**
```html
<label for="nova-senha">Nova senha *</label>
<input 
  type="password" 
  id="nova-senha" 
  aria-required="true" 
  aria-describedby="senha-requisitos"
/>
<ul id="senha-requisitos" class="password-requirements" aria-live="polite">
  <li aria-label="Mínimo de 8 caracteres: não atendido">Mínimo de 8 caracteres</li>
  <li aria-label="Letra maiúscula: não atendido">Letra maiúscula</li>
  <li aria-label="Número: não atendido">Número</li>
  <li aria-label="Caractere especial: não atendido">Caractere especial (!@#$...)</li>
</ul>
```

[A DEFINIR — comportamento de validação em tempo real (live region) depende de especificação no PRD; não detalhado no protótipo.]

---

## 6.4 Mensagens de erro e feedback

### Mensagens de erro em formulários

**Critérios obrigatórios (WCAG 3.3.1, 3.3.3):**
- Erro deve ser **anunciado por leitores de tela** (`aria-live="assertive"` ou `role="alert"`).
- Mensagem deve ser **específica**, não genérica (❌ "Erro no formulário" → ✅ "CPF inválido. Formato esperado: 000.000.000-00").
- Erro deve ser **visível próximo ao campo** com cor diferenciada e ícone.

**Estrutura de erro:**
```html
<label for="cpf">CPF *</label>
<input 
  type="text" 
  id="cpf" 
  aria-required="true" 
  aria-invalid="true" 
  aria-describedby="cpf-error"
/>
<span id="cpf-error" class="error-message" role
