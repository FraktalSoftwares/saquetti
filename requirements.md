# Requisitos

**Produto:** Saquetti — Sistema de Controle de Ponto Eletrônico  
**Versão:** 1.0  
**Data:** 2026-01-20

---

## 1. Visão Geral

Este documento especifica os requisitos funcionais e não-funcionais do sistema Saquetti, um controle de ponto eletrônico que opera em três ambientes:

- **Ambiente Trabalhador (Mobile):** aplicativo nativo iOS/Android para registro de ponto pelos colaboradores.
- **Ambiente Gestor (Portal RH/Empresa):** sistema web para gestão de marcações, escalas, fechamento mensal e relatórios.
- **Ambiente Admin (Saquetti):** sistema web para gerenciamento de clientes, planos, monitoramento de uso e suporte operacional.

Cada requisito é identificado, descrito e acompanhado de critérios de aceite testáveis no formato Dado/Quando/Então, rastreáveis às funcionalidades e telas detalhadas no Discovery e Protótipo.

---

## 2. Requisitos Funcionais

### 2.1. Ambiente Trabalhador (Mobile)

#### 2.1.1. Autenticação

**RF-001: Login com CPF e Senha**

- **Descrição:** O trabalhador deve conseguir acessar o aplicativo informando CPF e senha.
- **Rastreabilidade:** Discovery > Ambiente trabalhador > Autenticação > 1.2 Login; Protótipo > 1.2 Login.
- **Critérios de Aceite:**
  - **Dado** que o trabalhador acessa a tela de login  
    **Quando** preenche CPF válido (formato `000.000.000-00`) e senha correta  
    **Então** o sistema autentica e redireciona para a home (2.1).
  - **Dado** que o trabalhador preenche CPF ou senha incorretos  
    **Quando** tenta entrar  
    **Então** o sistema exibe "CPF ou senha inválidos".
  - **Dado** que o trabalhador erra a senha 5 vezes consecutivas  
    **Quando** tenta a sexta tentativa  
    **Então** o sistema bloqueia a conta por 15 minutos e exibe mensagem de bloqueio temporário.

---

**RF-002: Recuperação de Senha via CPF**

- **Descrição:** O trabalhador deve conseguir solicitar redefinição de senha informando seu CPF.
- **Rastreabilidade:** Discovery > Ambiente trabalhador > Autenticação > 1.3 Recuperação de Senha; Protótipo > 1.3 Recuperar Senha.
- **Critérios de Aceite:**
  - **Dado** que o trabalhador acessa a tela de recuperação  
    **Quando** informa CPF válido cadastrado  
    **Então** o sistema envia código de verificação [A DEFINIR — depende de definição do canal: SMS, e-mail ou ambos conforme gap sobre canal de envio do código].
  - **Dado** que o código de verificação foi enviado  
    **Quando** o trabalhador insere o código correto em até 10 minutos  
    **Então** o sistema permite criar nova senha.
  - **Dado** que o trabalhador erra o código 3 vezes  
    **Quando** tenta a quarta vez  
    **Então** o sistema invalida o código e exige nova solicitação.
  - **Dado** que o código expira (após 10 minutos)  
    **Quando** o trabalhador tenta validar  
    **Então** [A DEFINIR — depende de definição do comportamento pós-expiração: usuário pode solicitar novo código imediatamente? Há limite de solicitações? As 3 tentativas resetam com novo código?].

---

**RF-003: Redefinição de Senha com Requisitos de Segurança**

- **Descrição:** O trabalhador deve conseguir criar nova senha atendendo requisitos de complexidade.
- **Rastreabilidade:** Discovery > Ambiente trabalhador > Autenticação > 1.4 Redefinição de senha; Protótipo > 1.4 Nova senha.
- **Critérios de Aceite:**
  - **Dado** que o trabalhador acessa a tela de nova senha  
    **Quando** digita senha com mínimo 8 caracteres, 1 maiúscula, 1 minúscula, 1 número e 1 caractere especial  
    **Então** o sistema valida a senha.
  - **Dado** que a senha não atende aos requisitos  
    **Quando** o trabalhador tenta salvar  
    **Então** o sistema exibe mensagem de erro indicando qual critério falta.
  - **Dado** que os campos "Nova senha" e "Confirmar senha" diferem  
    **Quando** o trabalhador tenta salvar  
    **Então** o sistema exibe "As senhas não coincidem".

---

#### 2.1.2. Home Page

**RF-004: Visualização do Status do Dia em Tempo Real**

- **Descrição:** O trabalhador deve visualizar o status da jornada atual (última marcação, horário previsto, saldo parcial) na tela inicial.
- **Rastreabilidade:** Discovery > Ambiente trabalhador > Home > 2.1 Home Page; Protótipo > 2.1 Home / Status do Dia.
- **Critérios de Aceite:**
  - **Dado** que o trabalhador abre a home  
    **Quando** existe marcação de entrada registrada no dia  
    **Então** o sistema exibe "Última marcação: Entrada • [horário]" e "Saída prevista: [horário calculado]".
  - **Dado** que não há marcação no dia  
    **Quando** o trabalhador visualiza a home  
    **Então** o sistema exibe "Jornada não iniciada" e horário de entrada previsto [A DEFINIR — depende de regra de cálculo do horário previsto: vem da escala do trabalhador? Considera banco de horas? Ajusta por feriados? O que mostra se não houver escala definida?].
  - **Dado** que existe inconsistência ou pendência (ex: marcação faltante, ajuste aguardando aprovação)  
    **Quando** o trabalhador visualiza a home  
    **Então** o sistema exibe alertas resumidos na seção "Pendências" com contador.

---

**RF-005: Acesso Rápido ao Registro de Ponto**

- **Descrição:** O trabalhador deve conseguir acessar a tela de registro de ponto diretamente pela home.
- **Rastreabilidade:** Discovery > Ambiente trabalhador > Home > 2.1 Home Page; Protótipo > Background+Border+Shadow (Home com botão "Registrar Ponto").
- **Critérios de Aceite:**
  - **Dado** que o trabalhador está na home  
    **Quando** toca no botão "Registrar Ponto"  
    **Então** o sistema redireciona para a tela 3.1 Registro de Ponto.

---

**RF-006: Visualização de Pendências e Alertas**

- **Descrição:** O trabalhador deve visualizar notificações de pendências (cartão ponto pendente, solicitação de ajuste, etc.) diretamente na home, com acesso a detalhamento.
- **Rastreabilidade:** Discovery > Ambiente trabalhador > Home > 2.1 Home Page + 2.2 Alertas de Pendências; Protótipo > 2.2 Alertas / Pendências.
- **Critérios de Aceite:**
  - **Dado** que existem alertas não resolvidos  
    **Quando** o trabalhador visualiza a home  
    **Então** o sistema exibe resumo dos últimos alertas com contagem (ex: "2 pendências").
  - **Dado** que o trabalhador toca em "Ver todas"  
    **Quando** acessa a tela de alertas (2.2)  
    **Então** o sistema exibe lista completa de alertas com tipo, descrição, data e ação associada [A DEFINIR — depende de tipos completos de pendências/inconsistências listados sem regras de detecção: quanto de atraso gera alerta? Marcação faltante após quanto tempo? Quais são os limites configuráveis?].

---

#### 2.1.3. Registro de Ponto

**RF-007: Captura de Localização Automática no Registro de Ponto**

- **Descrição:** O sistema deve capturar automaticamente a localização GPS do trabalhador ao abrir a tela de registro de ponto.
- **Rastreabilidade:** Discovery > Ambiente trabalhador > Registro de ponto > 3.1 Registro de Ponto; Protótipo > 3.1 Registrar ponto.
- **Critérios de Aceite:**
  - **Dado** que o trabalhador abre a tela de registro e concedeu permissão de localização  
    **Quando** o GPS está ativo e sinal disponível  
    **Então** o sistema captura e exibe coordenadas, endereço detectado e precisão (ex: "±8 metros").
  - **Dado** que a permissão de localização foi negada  
    **Quando** o trabalhador tenta registrar ponto  
    **Então** o sistema exibe mensagem orientando a ativar a permissão nas configurações do dispositivo e **bloqueia** o registro.
  - **Dado** que o GPS está desligado  
    **Quando** o trabalhador tenta registrar ponto  
    **Então** o sistema exibe mensagem orientando a ativar o GPS e **bloqueia** o registro.
  - **Dado** que a localização não é capturada por falha de sinal  
    **Quando** o sistema tenta obter GPS  
    **Então** o sistema retenta automaticamente até 3 vezes; se falhar, exibe erro e **mantém o registro bloqueado**.

---

**RF-008: Captura de Foto no Registro de Ponto (Condicional)**

- **Descrição:** O sistema deve acionar a câmera automaticamente antes de confirmar o registro, caso a captura de foto esteja habilitada pelo gestor.
- **Rastreabilidade:** Discovery > Ambiente trabalhador > Registro de ponto > 3.1 Registro de Ponto (nota ²); Protótipo > 3.2 Foto de verificação.
- **Critérios de Aceite:**
  - **Dado** que a captura de foto está habilitada na configuração do colaborador (módulo 12.6 Aba 3)  
    **Quando** o trabalhador toca em "Registrar Ponto"  
    **Então** o sistema aciona a câmera antes de prosseguir para confirmação.
  - **Dado** que a captura de foto **não** está habilitada  
    **Quando** o trabalhador toca em "Registrar Ponto"  
    **Então** o sistema segue direto para a tela de confirmação (3.4) sem acionar câmera.
  - **Dado** que o trabalhador captura a foto  
    **Quando** toca em "Usar Foto"  
    **Então** o sistema armazena temporariamente e exibe pré-visualização na confirmação.
  - **Dado** que o trabalhador toca em "Refa