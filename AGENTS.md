# AGENTS.md — Instruções para o Agente de IA

## Contexto do Produto

Saquetti é uma plataforma de controle de ponto eletrônico B2B SaaS, com três ambientes principais: **App Mobile** (registro de ponto pelo colaborador), **Portal Empresa** (gestão de marcações, escalas e fechamento mensal pelo RH) e **Ambiente Admin** (gestão de clientes e monitoramento pela equipe interna). O produto substitui sistemas legados, priorizando conformidade trabalhista (Portaria 671/2021), rastreabilidade total de ajustes, simplicidade operacional para pequenas/médias empresas e redução de custos. O sistema gerencia escalas, horas extras, banco de horas, solicitações de ajuste e geração de cartão ponto com validade jurídica. A arquitetura deve suportar multiempresa, integrações com equipamentos de ponto físico (futuro) e exportação para folha de pagamento.

---

## Convenções de Código e Estrutura de Pastas

### Stack Proposta (conforme arquitetura)

- **Mobile**: React Native (iOS/Android), TypeScript, Expo SDK
- **Web (Portal Empresa + Admin)**: React 18+, TypeScript, Next.js 14+ (App Router), Tailwind CSS, shadcn/ui
- **Backend**: Node.js 20+, Express ou Fastify, TypeScript, Prisma ORM
- **Banco de Dados**: PostgreSQL 16+ (principal), Redis (cache/sessões)
- **Infra**: AWS (EC2/ECS, RDS, S3, CloudFront), Docker, GitHub Actions (CI/CD)
- **Autenticação**: JWT (access + refresh tokens), bcrypt, validação de CPF

### Estrutura de Pastas Sugerida

```
/apps
  /mobile               # React Native (Trabalhador)
    /src
      /screens          # Telas por módulo (ex: /auth, /home, /ponto)
      /components       # Componentes reutilizáveis
      /services         # Chamadas à API, auth, storage local
      /hooks            # Custom hooks (useAuth, usePonto)
      /navigation       # React Navigation stacks/tabs
      /utils            # Formatters, validators (CPF, data)
  /web-portal           # Next.js (Portal Empresa)
    /app                # App Router (páginas por módulo)
      /dashboard
      /colaboradores
      /marcacoes
      /relatorios
    /components/ui      # shadcn/ui components
    /lib                # Utils, API client, validations
  /web-admin            # Next.js (Ambiente Admin)
    /app
      /clientes
      /monitoramento
      /suporte
    /components/ui
    /lib
/packages
  /shared               # Código compartilhado (types, validators, constants)
    /types              # Types TS (User, Marcacao, Escala, etc)
    /validators         # Zod schemas para validação
    /constants          # Status, roles, enums
/server
  /src
    /api
      /routes           # Rotas REST por domínio (auth, colaboradores, marcacoes)
      /controllers      # Lógica de negócio
      /middlewares      # Auth, validação, logging, error handling
    /services           # Serviços (cálculo de HE, banco de horas, notificações)
    /db
      /prisma           # Schema Prisma, migrations
    /jobs               # Cron jobs (fechamento automático, lembretes)
    /utils              # Helpers (date, crypto, formatters)
/docs                   # PRD, ARCHITECTURE, CHANGELOG, AGENTS
```

### Convenções de Código

- **Nomenclatura**: camelCase (variáveis/funções), PascalCase (componentes/tipos), UPPER_CASE (constantes/enums)
- **Arquivos**: kebab-case (nomes de arquivo), PascalCase para componentes React
- **Commits**: Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`)
- **Idioma**: código em inglês, comentários e docs em português
- **Validação**: usar Zod para validação de entrada (frontend e backend)
- **Erros**: sempre retornar códigos HTTP semânticos; backend lança exceções tipadas; frontend exibe mensagens amigáveis
- **Logs**: estruturados (JSON) com nível (info, warn, error), timestamp, userId, módulo
- **Testes**: arquivos `.test.ts` ou `.spec.ts` ao lado do código testado

---

## Como Rodar, Testar e Buildar

### Pré-requisitos

- Node.js 20+ e npm/yarn
- Docker e Docker Compose
- PostgreSQL 16+ (local ou via Docker)
- Expo CLI (para mobile)
- Variáveis de ambiente configuradas (`.env` conforme `.env.example`)

### Setup Inicial

```bash
# Clone o repositório
git clone [repo-url]
cd saquetti

# Instale dependências (root)
npm install

# Configure o banco de dados local (Docker)
docker-compose up -d postgres redis

# Execute as migrations
cd server
npx prisma migrate dev

# Seed (dados iniciais opcionais)
npx prisma db seed
```

### Rodar em Desenvolvimento

```bash
# Backend (server)
cd server
npm run dev          # Roda em http://localhost:3000

# Web Portal Empresa
cd apps/web-portal
npm run dev          # Roda em http://localhost:3001

# Web Admin
cd apps/web-admin
npm run dev          # Roda em http://localhost:3002

# Mobile (Expo)
cd apps/mobile
npm start            # Abre Expo DevTools
# Pressione 'i' (iOS) ou 'a' (Android) ou escaneie QR no Expo Go
```

### Testar

```bash
# Testes unitários (todos os workspaces)
npm run test

# Testes por workspace
cd apps/mobile && npm run test
cd server && npm run test:unit

# Testes de integração (backend)
cd server && npm run test:integration

# Cobertura
npm run test:coverage
```

### Buildar

```bash
# Backend (build TypeScript)
cd server
npm run build        # Output em /dist

# Web Portal/Admin (build Next.js)
cd apps/web-portal
npm run build        # Output em /.next

# Mobile (build APK/IPA)
cd apps/mobile
eas build --platform android
eas build --platform ios
```

---

## Gates de Qualidade (Obrigatórios Antes de Concluir Tarefa)

### 1. Testes

- **Cobertura mínima**: 70% de cobertura de linhas (medido por `jest --coverage`)
- **Testes obrigatórios**:
  - **Unitários**: toda função pura, serviço de cálculo (HE, banco de horas, DSR), validator, formatter
  - **Integração**: endpoints críticos (auth, registro de ponto, fechamento mensal, geração de cartão ponto)
  - **E2E (quando aplicável)**: fluxos principais (login → registro de ponto → visualização de espelho)
- **Comando de verificação**: `npm run test` (deve passar sem falhas)

### 2. Lint e Formatação

- **ESLint**: sem erros (warnings aceitáveis apenas se justificados)
- **Prettier**: código formatado automaticamente
- **Comandos**:
  ```bash
  npm run lint        # Verifica erros
  npm run lint:fix    # Corrige automaticamente
  npm run format      # Prettier
  ```
- **Pré-commit hook**: Husky + lint-staged rodam automaticamente (não commitar se falhar)

### 3. Type Check

- **TypeScript**: compilação sem erros (`tsc --noEmit`)
- **Comando**: `npm run typecheck`
- **Obrigatório** antes de merge em `main`

### 4. Build Sem Erros

- **Backend**: `npm run build` (server) deve gerar `/dist` sem erros
- **Web**: `npm run build` (portal/admin) deve gerar bundle otimizado
- **Mobile**: `npm run build` (Expo) deve compilar sem warnings críticos

### 5. Validação de PRD e Critérios de Aceite

- Antes de marcar tarefa como concluída, **verificar critérios de aceite** no PRD.md
- Se o critério contiver `[A DEFINIR]`, **não implementar** — abrir issue para esclarecer com o time
- Todos os campos obrigatórios validados conforme Zod schemas
- Fluxos de erro testados (ex: token expirado, GPS negado, servidor offline)

---

## Regras de Ouro

### 1. Nunca Invente Requisitos

- Se o PRD, ARCHITECTURE ou Discovery não especificam um comportamento, **não assuma**.
- Exemplos de situações que exigem consulta:
  - Formato de exportação de relatório não especificado → marcar `[A DEFINIR — depende de formato acordado com cliente]`
  - Regra de cálculo de interjornada menciona "mínimo legal" sem valor → `[A DEFINIR — depende de validação CLT/cliente]`
  - Tipo de notificação (push vs in-app) não definido → `[A DEFINIR