# Arquitetura Técnica — Saquetti

## 1. Visão Geral da Solução

O **Saquetti** é um sistema de controle de ponto eletrônico multiplataforma composto por três ambientes principais:

1. **Ambiente Trabalhador (Mobile nativo)** — aplicativo iOS/Android para registro de ponto, consulta de jornada, solicitações de ajuste e assinatura de cartão ponto
2. **Ambiente Gestor/RH (Web)** — portal web para gestão operacional: configuração de escalas, ajuste de marcações, fechamento mensal, relatórios e administração de colaboradores
3. **Ambiente Admin Saquetti (Web)** — painel administrativo interno para gestão de clientes, monitoramento de uso, suporte operacional e controle de perfis de acesso

A arquitetura foi projetada para atender aos requisitos da **Portaria 671/2021 do Ministério do Trabalho**, garantindo rastreabilidade, integridade e validade jurídica dos registros de ponto, com foco em segurança, escalabilidade e conformidade legal.

---

## 2. Stack Tecnológica Sugerida

### 2.1. Frontend

#### Mobile (Ambiente Trabalhador)
- **Framework**: React Native
  - **Justificativa**: desenvolvimento unificado iOS/Android, maturidade do ecossistema, time-to-market reduzido, reutilização de componentes web quando aplicável
- **Navegação**: React Navigation 6+
- **State management**: Redux Toolkit + RTK Query (cache local e sincronização)
- **Geolocalização**: `react-native-geolocation-service` (alta precisão)
- **Captura de foto**: `react-native-vision-camera` (performance e controle fino)
- **Assinatura digital**: `react-native-signature-canvas`
- **Armazenamento local**: AsyncStorage + WatermelonDB (sincronização offline-first)

#### Web (Ambientes Gestor e Admin)
- **Framework**: React 18+ com TypeScript
  - **Justificativa**: componentização, ecossistema maduro, tipagem estática reduz bugs, facilita manutenção e onboarding de desenvolvedores
- **UI Components**: shadcn/ui + Radix UI (acessibilidade WCAG 2.1 AA embutida)
- **State management**: Zustand (simplicidade) + React Query (cache server-state)
- **Tabelas complexas**: TanStack Table v8 (performance em listas grandes, filtros, paginação)
- **Gráficos**: Recharts ou Apache ECharts (caso necessário em dashboards futuros)
- **Formulários**: React Hook Form + Zod (validação em runtime e build)

### 2.2. Backend

- **Linguagem**: Node.js 20 LTS com TypeScript
  - **Justificativa**: unificação de linguagem com frontend (reduz context switching), ecossistema rico, performance adequada, facilita contratação
- **Framework**: NestJS
  - **Justificativa**: arquitetura modular (escalabilidade vertical), injeção de dependências nativa, suporte a microservices quando necessário, validação de DTOs embutida, documentação automática via Swagger
- **ORM**: Prisma
  - **Justificativa**: type-safety end-to-end, migrações versionadas, suporte nativo a PostgreSQL features (JSONB, full-text search), geração automática de tipos TypeScript

### 2.3. Banco de Dados

- **Principal**: PostgreSQL 15+
  - **Justificativa**: conformidade ACID (criticidade de integridade de ponto), suporte robusto a JSON (campos dinâmicos de configuração), particionamento de tabelas (escalabilidade temporal), triggers e stored procedures para lógica de auditoria, licença open-source
- **Cache**: Redis 7+
  - **Justificativa**: cache de sessões, filas de processamento (cálculo de cartão ponto, geração de PDFs), rate limiting, cache de consultas pesadas (dashboard)

### 2.4. Infraestrutura

- **Cloud Provider**: AWS
  - **Justificativa**: conformidade com LGPD via data residency (região São Paulo), SLA enterprise, serviços gerenciados maduros
- **Serviços principais**:
  - **Compute**: ECS Fargate (containers serverless, auto-scaling) ou EKS (se necessário orquestração Kubernetes futura)
  - **Database**: RDS PostgreSQL (backups automáticos, multi-AZ para alta disponibilidade)
  - **Cache**: ElastiCache Redis
  - **Storage**: S3 (fotos de ponto, PDFs de cartão ponto, comprovantes de solicitações) com lifecycle policies para arquivamento
  - **CDN**: CloudFront (assets estáticos, distribuição de PDFs assinados)
  - **Secrets**: AWS Secrets Manager (chaves de API, credenciais de banco)
  - **Logs/Monitoramento**: CloudWatch + X-Ray (tracing distribuído)

### 2.5. Segurança e Autenticação

- **Autenticação**: JWT (access token curto + refresh token longo)
  - **Algoritmo**: RS256 (assinatura assimétrica, rotação de chaves)
  - **Tempo de expiração**: Access token 15min, Refresh token 7 dias (renovação automática)
- **Autorização**: RBAC (Role-Based Access Control) baseado em perfis (Admin, RH, Gestor, Trabalhador)
- **Criptografia em trânsito**: TLS 1.3
- **Criptografia em repouso**: AWS KMS (chaves gerenciadas) para dados sensíveis (CPF, localização, fotos)
- **Conformidade LGPD**: 
  - Anonimização de dados após demissão (prazo: [A DEFINIR — depende de requisitos legais e retenção contábil])
  - Audit trail completo (quem acessou o quê, quando)
  - Endpoint de portabilidade de dados (exportação JSON completa do colaborador)

### 2.6. Geração de PDFs e Assinatura Digital

- **Geração de PDF**: Puppeteer (renderização de templates HTML para PDF, controle fino de layout)
- **Assinatura digital**: [A DEFINIR — depende do nível de assinatura exigido para validade jurídica trabalhista]
  - **Opção 1 (assinatura simples)**: Armazenamento de imagem da assinatura capturada + hash SHA-256 do documento + timestamp
  - **Opção 2 (assinatura avançada)**: Integração com provedor ICP-Brasil (ex: Soluti, Certisign) para assinatura qualificada A1/A3
  - **Trade-off**: Assinatura simples é mais rápida e barata mas pode ter menor validade jurídica em contestações; assinatura ICP-Brasil adiciona custo mensal por certificado e latência na geração do cartão ponto

---

## 3. Divisão em Módulos e Camadas

### 3.1. Arquitetura de Alto Nível

```
┌─────────────────────────────────────────────────────────────┐
│                     Aplicações Cliente                       │
├──────────────────────┬──────────────────────────────────────┤
│  Mobile (React Native) │  Web Portal RH + Admin (React)     │
└──────────────────────┴──────────────────────────────────────┘
                            ▼ HTTPS/TLS
┌─────────────────────────────────────────────────────────────┐
│                     API Gateway (ALB/NGINX)                  │
│              Rate Limiting • CORS • Compressão               │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend NestJS (ECS/EKS)                  │
├─────────────────────────────────────────────────────────────┤
│  Módulo Auth  │  Módulo Jornada  │  Módulo RH  │  Módulo Admin │
│  Módulo Marcações  │  Módulo Relatórios  │  Módulo Notificações │
└─────────────────────────────────────────────────────────────┘
         ▼                       ▼                      ▼
┌──────────────┐    ┌──────────────────┐    ┌──────────────────┐
│ PostgreSQL   │    │ Redis (Cache     │    │  S3 (Storage)    │
│ (RDS)        │    │  + Filas)        │    │  Fotos, PDFs     │
└──────────────┘    └──────────────────┘    └──────────────────┘
```

### 3.2. Camadas da Aplicação Backend

#### Camada de Apresentação (Controllers)
- Rotas HTTP REST (versionadas: `/api/v1/...`)
- Validação de entrada (class-validator + DTOs)
- Tratamento de exceções HTTP (filtros globais)
- Documentação Swagger automática

#### Camada de Aplicação (Services)
- Lógica de negócio: cálculo de jornada, validação de regras de escala, geração de inconsistências
- Orquestração de fluxos complexos (ex: fechamento mensal → consolidação → geração PDF → envio para assinatura)
- Transações de banco (garantia de atomicidade em operações críticas: ajuste de marcação + registro de auditoria)

#### Camada