# Modelo de Negócio

## 1. Problema e Proposta de Valor

### 1.1. Problema Identificado

O principal problema que o sistema Saquetti resolve é a **falta de segurança, confiabilidade e clareza no controle da jornada de trabalho**, que impacta diretamente:

- **Fechamento da folha de pagamento**: retrabalho, uso de controles paralelos (planilhas, WhatsApp), dificuldade na conferência das informações
- **Segurança jurídica**: falta de rastreabilidade de alterações, risco de passivos trabalhistas, ausência de conformidade legal em sistemas atuais
- **Dependência de fornecedor**: custo mensal de aproximadamente R$ 60 mil no modelo de representação, falta de flexibilidade para atender demandas de personalização dentro de prazos e custos viáveis
- **Experiência do colaborador**: falta de transparência no acompanhamento de horas, dificuldade de acesso às informações, processos burocráticos para ajustes e justificativas

### 1.2. Proposta de Valor

A plataforma Saquetti oferece:

- **Controle de ponto totalmente aderente à legislação trabalhista** (Portaria 671/2021 do Ministério do Trabalho)
- **Robustez nas regras internas**, com gestão precisa de escalas, banco de horas, horas extras e cálculo automático de jornada
- **Integração via API e rastreabilidade completa** de ajustes, garantindo controle e transparência para auditoria
- **Plataforma própria e evolutiva**, com autonomia para melhorias contínuas e atendimento de demandas específicas
- **Segurança jurídica no fechamento da folha**, reduzindo riscos e passivos trabalhistas
- **Simplicidade operacional** para uso rápido e intuitivo no dia a dia, tanto para colaboradores (app mobile) quanto para RH/gestores (portal web)

---

## 2. Público-Alvo e Segmentos de Clientes

### 2.1. Segmentos Principais (MVP)

1. **Pequenas empresas com baixa maturidade tecnológica**
   - Necessidade de solução simples, acessível e fácil de usar
   - Baixa proficiência tecnológica (2-3/5)
   - Buscam conformidade legal sem complexidade operacional

2. **Empresas já clientes da Saquetti**
   - Maior facilidade de adoção pela confiança e relacionamento já estabelecidos
   - Potencial de expansão e cross-selling

3. **Médias empresas com RH estruturado**
   - Demandam controle, relatórios gerenciais e segurança jurídica
   - Proficiência tecnológica média a alta (4-5/5)
   - Necessidade de rastreabilidade e auditoria

4. **Escritórios contábeis**
   - Gerenciam múltiplos CNPJs
   - Buscam centralização e eficiência operacional no fechamento da folha de pagamento

### 2.2. Segmentos Futuros (Fase 2+)

- **Revendas**: focadas na comercialização e escala da plataforma
- **Empresas de médio-grande porte**: expansão gradual conforme validação do produto e maturidade da solução

### 2.3. Personas Primárias

**Persona 1: Mariana Alves, 38 anos — Responsável pelo Ponto (RH/DP)**

- **Perfil**: Acumula funções de Departamento Pessoal, RH e gestão operacional do ponto
- **Proficiência tecnológica**: varia conforme porte (pequenas: 2/5, médias: 4/5)
- **Objetivos**:
  - Fechar o ponto do mês com segurança jurídica
  - Ter rastreabilidade total de alterações
  - Resolver inconsistências rapidamente
  - Gerar cartão/espelho de ponto aceito pela contabilidade
  - Reduzir retrabalho e controles paralelos
- **Dores**:
  - Falta de clareza dos cálculos (extras, faltas, banco)
  - Inconsistências recorrentes
  - Dificuldade de provar rastreabilidade em auditoria
  - Relatórios pouco amigáveis
  - Trabalho duplicado entre sistema e planilhas/WhatsApp
  - Pressão do fechamento mensal

**Persona 2: João Pedro Santos, 29 anos — Trabalhador (Colaborador)**

- **Perfil**: Registrante de ponto pelo app mobile
- **Proficiência tecnológica**: [A DEFINIR — depende de levantamento demográfico da base]
- **Objetivos**:
  - Registrar ponto rápido, sem travar e sem dúvida
  - Acompanhar horas, banco e saldo com transparência
  - Corrigir marcações facilmente quando necessário
  - Fechar o mês com "ponto ok" sem conflito com chefia/RH
- **Dores**:
  - Esquecimento de marcação e dificuldade para corrigir
  - Medo de "bater e não registrar"
  - Interface confusa (não sabe qual botão usar)
  - Constrangimento ao pedir ajuste ao gestor
  - Problemas de internet/bateria/telefone antigo
  - Dúvida sobre privacidade (foto/local)
  - Falta de transparência do saldo

---

## 3. Principais Funcionalidades e Seu Valor

### 3.1. Ambiente Trabalhador (Mobile)

**Funcionalidades Core:**

- **Registro de ponto eletrônico** via app, com captura de GPS e foto (configurável)
  - **Valor**: praticidade, eliminação de equipamentos físicos, registro instantâneo
- **Espelho do ponto e banco de horas**
  - **Valor**: transparência, acesso em tempo real ao saldo e histórico de jornada
- **Solicitações de ajuste e justificativas**
  - **Valor**: autonomia, redução de burocracia, rastreabilidade de correções
- **Visualização e assinatura do cartão ponto**
  - **Valor**: conformidade legal, eliminação de papel, redução de deslocamentos
- **Notificações de pendências**
  - **Valor**: redução de inconsistências, lembretes proativos

**Total estimado (Discovery + UI)**: 29 horas

### 3.2. Ambiente Gestor/RH (Web)

**Funcionalidades Core:**

- **Dashboard operacional** com visão geral do dia, alertas e inconsistências
  - **Valor**: visibilidade em tempo real, tomada de decisão rápida
- **Estrutura organizacional**: cadastro de empresas, departamentos, colaboradores, férias, afastamentos, feriados
  - **Valor**: centralização de dados, organização, base de cálculo confiável
- **Regras de jornada**: configuração de escalas (semanal, cíclica, mensal, diária), horas extras (faixas, percentuais, separação noturna), DSR, banco de horas
  - **Valor**: flexibilidade, atendimento de regras específicas por empresa, cálculo automático preciso
- **Gestão de marcações**: visualização, ajuste manual, solicitações pendentes, justificativas
  - **Valor**: controle total, rastreabilidade, redução de retrabalho
- **Cartão ponto**: consolidação, exportação, encerramento de período, assinatura via app
  - **Valor**: segurança jurídica, conformidade legal (Portaria 671/2021), integração com folha
- **Equipamentos**: integração com relógios físicos (Henry, Dimep, Secullum, [A DEFINIR — depende de fabricantes usados pelo cliente]), importação AFD
  - **Valor**: coexistência com equipamentos existentes, migração gradual
- **Relatórios**: horas extras, banco de horas, inconsistências, solicitações, geolocalização, arquivos fiscais (AEJ, AFD/REP-P)
  - **Valor**: análise gerencial, conformidade fiscal, auditoria
- **Gestão de conta**: usuários, permissões, logs do sistema
  - **Valor**: controle de acesso, auditoria, rastreabilidade de ações

**Total estimado (Discovery + UI)**: 38 horas

### 3.3. Ambiente Admin (Saquetti — Sistema Interno)

**Funcionalidades Core:**

- **Dashboard administrativo**: visão da plataforma, status de clientes, alertas
- **Gestão de clientes**: cadastro de empresas, configuração de planos
- **Monitoramento de uso**: consumo por empresa, cobrança de excedentes
- **Suporte operacional**: chamados, intervenções