# Saquetti — App do Trabalhador (mobile)

App React Native (Expo + TypeScript) do **Ambiente Trabalhador**. Esta entrega cobre as
telas de autenticação e a Home.

## Stack

- **Expo SDK 57** / React Native 0.86 / React 19, TypeScript
- **React Navigation v7** (native-stack + bottom-tabs)
- **Supabase** (auth real — o trabalhador loga com CPF)
- **Inter** (`@expo-google-fonts/inter`), ícones `@expo/vector-icons` (Ionicons)

## Telas implementadas

| Tela | Arquivo | Requisito |
|------|---------|-----------|
| 1.1 Splash | `src/screens/SplashScreen.tsx` | — |
| 1.2 Login | `src/screens/auth/LoginScreen.tsx` | RF-001 |
| 1.3 Recuperar senha | `src/screens/auth/RecuperarSenhaScreen.tsx` | RF-002 |
| 1.4 Nova senha | `src/screens/auth/NovaSenhaScreen.tsx` | RF-003 |
| 2.1 Home | `src/screens/home/HomeScreen.tsx` | RF-004/005/006 |
| 2.2 Alertas de Pendências | `src/screens/home/AlertasScreen.tsx` | RF-006 |
| 3.1 Registrar Ponto (GPS) | `src/screens/ponto/RegistrarPontoScreen.tsx` | RF-007 |
| 3.2/3.3 Foto de verificação | `src/screens/ponto/FotoVerificacaoScreen.tsx` | RF-008 |
| 3.4 Confirmar registro | `src/screens/ponto/ConfirmarRegistroScreen.tsx` | — |
| 3.5 Comprovante | `src/screens/ponto/ComprovanteScreen.tsx` | — |
| 4 Cartão Ponto (Espelho/Banco/Assinatura) | `src/screens/cartao/CartaoPontoScreen.tsx` | — |
| 4.1 Detalhes do dia | `src/screens/cartao/DetalhesDiaScreen.tsx` | — |
| 4.3 Cartão – detalhamento do mês | `src/screens/cartao/CartaoDetalheScreen.tsx` | — |
| 7.1 Assinar cartão (confirmação) | `src/screens/assinatura/AssinarCartaoScreen.tsx` | — |
| 7.2 Captura de assinatura | `src/screens/assinatura/CapturaAssinaturaScreen.tsx` | — |
| 7.3 Assinatura confirmada | `src/screens/assinatura/AssinaturaConfirmadaScreen.tsx` | — |
| 7.1b Visualizar PDF | `src/screens/assinatura/VisualizarPdfScreen.tsx` | — |
| 5 Solicitações (lista) | `src/screens/solicitacoes/SolicitacoesScreen.tsx` | — |
| 5.1 Nova solicitação (ajuste) | `src/screens/solicitacoes/NovaSolicitacaoScreen.tsx` | — |
| 5.2 Detalhe da solicitação | `src/screens/solicitacoes/SolicitacaoDetalheScreen.tsx` | — |
| 4.4 Justificar Ausência | `src/screens/solicitacoes/JustificarAusenciaScreen.tsx` | — |
| 8 Perfil (hub) | `src/screens/perfil/PerfilScreen.tsx` | — |
| 8.1 Meus dados | `src/screens/perfil/MeusDadosScreen.tsx` | — |
| 8.2 Alterar senha | `src/screens/perfil/AlterarSenhaScreen.tsx` | RF-003 |
| 9.1 Notificações | `src/screens/notificacoes/NotificacoesScreen.tsx` | — |
| 9.2 Detalhe da notificação | `src/screens/notificacoes/NotificacaoDetalheScreen.tsx` | — |

Perfil é a aba real (hub) → Meus dados, Alterar senha (Supabase `updateUser`, validação de
complexidade), Minhas solicitações, Sair. Notificações abrem pelo **sino** da Home. Datas usam o
componente `DatePicker` (calendário em modal, sem dep. nativa). Notificações mock em
`notificacoesService.ts`.

Solicitações: mock em `solicitacoesService.ts` (com adição em memória). Entradas: "Solicitar Ajuste"
e "Justificar Ausência" (do Espelho e do Detalhe do dia, pré-preenchendo a data), o FAB da lista e
"Minhas solicitações" no Perfil. Componentes de form: `FormField`, `Select` (modal). Anexo de
arquivo é simulado (picker real depende de expo-document-picker — `[A DEFINIR]`).

A assinatura eletrônica parte do botão "Assinar cartão ponto" (cartão pendente): Assinar →
captura (pad próprio em `SignaturePad`, react-native-svg + PanResponder) → confirmada (carimbo/QR).
`espelhoService.assinarMes()` marca o mês como assinado (mock em memória).

A aba **Cartão Ponto** (bottom nav) abre a tela 4.x com 3 sub-abas (Cartão Ponto / Banco /
Assinatura Eletrônica). Dados mockados em `src/services/espelhoService.ts` (sem backend de
Jornada/Banco ainda). Ações de fluxos futuros (Solicitar Ajuste, Justificar Ausência, Assinar,
Visualizar PDF) exibem um aviso "Em breve" — pertencem aos módulos 5.x/7.x.

O fluxo de Registro de Ponto usa **expo-location** (GPS real, com bloqueio quando permissão
negada/GPS off — RF-007) e **expo-camera** (foto condicional — RF-008). As telas ficam acima
das Tabs (`src/navigation/AppNavigator.tsx`), cobrindo a bottom nav, como no design.

A foto (RF-008) só é acionada se `colaboradores.capturar_foto = true`; o GPS (RF-007) só é
exigido se `capturar_gps = true` (data-model.md: `capturarFotoNoRegistro`/`capturarGpsNoRegistro`).

## Backend (Supabase) — fase 1

Além da autenticação, os dados de **ponto, solicitações e notificações** são reais (Postgres + RLS):

| Tabela | Uso | RLS |
|--------|-----|-----|
| `colaboradores` | perfil (id = auth.uid), `jornada_diaria_min`, flags `capturar_gps/foto` | dono |
| `marcacoes` | Registro de Ponto; base do Espelho/Home/Banco | dono (select/insert) |
| `solicitacoes` | Ajustes/Justificativas (5.x/4.4) | dono (select/insert) |
| `notificacoes` | Notificações (9.x) e Alertas (2.2) | dono (select/update) |
| `cartoes` | Assinatura eletrônica do cartão mensal (7.x) — status/carimbo, durável | dono (select/insert/update) |
| `unidades` | local exibido na marcação | select autenticado |

Serviços agora consomem o Supabase: `pontoService` (insert real + tipo alternado por contagem
do dia + upload da foto ao Storage), `homeService`, `espelhoService`, `solicitacoesService`,
`notificacoesService`, `alertsService`.

**Realtime**: Home, Alertas e Notificações assinam mudanças (`src/hooks/useRealtime.ts`) em
`notificacoes`/`marcacoes` e atualizam ao vivo, respeitando RLS.

**Storage**: bucket privado `ponto-fotos` (RLS por `{uid}/...`) guarda a foto de verificação; o
caminho vai em `marcacoes.foto_url`. A captura real da foto exige device (câmera).

**Cálculo de jornada** em `src/lib/jornada.ts` (defaults CLT documentados, ajustáveis quando a
Escala existir): jornada 8h/dia em dias úteis; trabalhado = soma dos pares Entrada→Saída; saldo =
trabalhado − esperado; banco do mês = soma dos saldos. **`[A DEFINIR]`**: escala/interjornada/DSR,
feriados, upload de foto para Storage, verificação da senha atual, captura real de IP/geo no carimbo.

Fusos: horários de marcação em `America/Sao_Paulo` (offset fixo −03, `src/utils/datetime.ts`).

## Design (fonte de verdade)

Tokens e assets vêm do projeto claude.ai/design **"Protótipo Saquetti"**
(`Ambiente Trabalhador Mobile Rhexa.dc.html`). Logo e avatar oficiais em `src/assets/svg.ts`
(renderizados via `react-native-svg`). Primária **#3D71B8**; dark **#010A28**.

## Como rodar

```bash
cd apps/mobile
npm install            # se ainda não instalou
npx expo start         # e pressione i (iOS), a (Android) ou w (web)
```

Variáveis em `.env` (já preenchidas para o projeto Supabase de dev):

```
EXPO_PUBLIC_SUPABASE_URL=...
EXPO_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
```

## Credenciais de teste

- **CPF:** `529.982.247-25`  ·  **Senha:** `Senha@123`  ·  Nome: Laura Gomes

> O login valida os dígitos verificadores do CPF. O placeholder `123.456.789-00` do
> protótipo **não** é um CPF válido — por isso o usuário de teste usa um CPF real válido.

## Autenticação com CPF (decisão de arquitetura)

O Supabase Auth é baseado em e-mail. O trabalhador loga com CPF; internamente
mapeamos `CPF -> {dígitos}@saquetti.app` (`src/utils/cpf.ts`). A tabela
`public.colaboradores` (RLS: cada um vê só o próprio registro) liga `auth.users.id`
ao CPF/nome. Trocável por outro backend mantendo a interface em `src/services/authService.ts`.

## Pendências / [A DEFINIR] (não inventar — alinhar com o time)

- **Recuperação de senha:** canal do código (SMS/e-mail) e a etapa de verificação por
  código de 6 dígitos não estão definidos no discovery. Hoje usamos o reset por e-mail
  do Supabase como mecanismo real e seguimos direto para "Nova senha" (como no protótipo).
- **Bloqueio após 5 tentativas (RF-001):** hoje é client-side; reforçar no backend.
- **Dados da Home/Alertas:** mock em `src/services/homeService.ts` e `alertsService.ts`
  (regras de cálculo de jornada e detecção de pendências ainda `[A DEFINIR]`). Trocar por
  chamadas reais mantendo as assinaturas (`ResumoHome`, `Alerta[]`).
- **Abas Cartão Ponto / Horários / Perfil:** placeholders (fora do escopo desta entrega).

## Estrutura

```
src/
  components/   # Button, TextField, PasswordField, Logo, BackButton
  context/      # AuthContext (sessão Supabase)
  lib/          # supabase.ts
  navigation/   # RootNavigator, AuthStack, AppTabs (+ HomeStack), types
  screens/      # auth/, home/, Splash, Placeholder
  services/     # authService, homeService, alertsService
  theme/        # colors, typography, spacing/radius
  types/        # tipos de domínio
  utils/        # cpf (máscara/validação), password (requisitos)
```
