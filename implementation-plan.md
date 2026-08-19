# Plano de Implementação — Saquetti (Sistema de Controle de Ponto Eletrônico)

---

## Visão Geral

Este plano de implementação estrutura o desenvolvimento do sistema Saquetti em **fases incrementais**, priorizando a entrega de valor cedo e a validação contínua com o cliente. Cada fase agrupa tarefas pequenas e independentes no formato de checklist, com dependências mapeadas, arquivos afetados e critérios de pronto (gates).

**Princípios:**
- Começar pela fundação (setup, modelo de dados, autenticação)
- Validar com cliente após cada fase
- Entregar fluxos completos (ponta a ponta) antes de adicionar features secundárias
- Priorizar conformidade legal e segurança jurídica desde o início

---

## Fase 0 — Setup e Fundação Técnica

**Objetivo:** Preparar ambiente de desenvolvimento, definir stack, configurar CI/CD e estabelecer modelo de dados base.

### Tasks

- [ ] **TASK-001:** Configurar repositório principal (monorepo ou multi-repo)
  - **Arquivos:** `README.md`, `.gitignore`, `package.json` (raiz)
  - **Dependências:** Nenhuma
  - **Gates:** Lint, estrutura de pastas validada, CI configurado

- [ ] **TASK-002:** Escolher e documentar stack técnica (backend, frontend web, mobile)
  - **Arquivos:** `docs/architecture/tech-stack.md`
  - **Dependências:** TASK-001
  - **Gates:** Documento aprovado pelo time, decisões registradas

- [ ] **TASK-003:** Configurar backend base (Node.js/Python/etc.) com estrutura de pastas
  - **Arquivos:** `/backend/src/`, `/backend/config/`, `/backend/tests/`
  - **Dependências:** TASK-002
  - **Gates:** Servidor rodando localmente, healthcheck respondendo

- [ ] **TASK-004:** Configurar frontend web base (React/Vue/etc.) com estrutura de pastas
  - **Arquivos:** `/frontend-web/src/`, `/frontend-web/public/`
  - **Dependências:** TASK-002
  - **Gates:** Aplicação rodando localmente, página inicial renderizando

- [ ] **TASK-005:** Configurar aplicativo mobile base (React Native/Flutter/etc.)
  - **Arquivos:** `/mobile/src/`, `/mobile/android/`, `/mobile/ios/`
  - **Dependências:** TASK-002
  - **Gates:** App rodando no emulador, splash screen exibida

- [ ] **TASK-006:** Configurar banco de dados PostgreSQL (ou equivalente)
  - **Arquivos:** `docker-compose.yml`, `/backend/config/database.js`
  - **Dependências:** TASK-003
  - **Gates:** Banco criado, migrações rodando, conexão testada

- [ ] **TASK-007:** Modelar entidades principais (Empresa, Colaborador, Usuário, Marcação)
  - **Arquivos:** `/backend/src/models/`, `docs/architecture/data-model.md`
  - **Dependências:** TASK-006
  - **Gates:** Diagrama ER validado, migrations criadas, testes de schema passando

- [ ] **TASK-008:** Configurar ambiente de testes automatizados (unit, integration, e2e)
  - **Arquivos:** `/backend/tests/`, `/frontend-web/tests/`, `jest.config.js`
  - **Dependências:** TASK-003, TASK-004
  - **Gates:** Testes exemplo rodando, coverage report gerado

- [ ] **TASK-009:** Configurar CI/CD básico (GitHub Actions/GitLab CI)
  - **Arquivos:** `.github/workflows/ci.yml`
  - **Dependências:** TASK-008
  - **Gates:** Pipeline rodando em push, lint/test/build executados

- [ ] **TASK-010:** Configurar ambiente de staging (AWS/GCP/Azure)
  - **Arquivos:** `/infra/`, `terraform/` ou equivalente
  - **Dependências:** TASK-009
  - **Gates:** Deploy manual funcionando, healthcheck em staging respondendo

---

## Fase 1 — Autenticação e Cadastro Base (Todos os Ambientes)

**Objetivo:** Implementar login, recuperação de senha e cadastro de usuários para os três ambientes (Mobile Trabalhador, Portal Empresa, Admin Saquetti).

### Tasks

- [ ] **TASK-101:** Implementar modelo de dados de Usuário com campos obrigatórios (CPF, e-mail, senha hash, perfil)
  - **Arquivos:** `/backend/src/models/Usuario.js`, migration `001_create_usuarios.sql`
  - **Dependências:** TASK-007
  - **Gates:** Migration aplicada, testes de modelo passando, validação de CPF/e-mail funcionando

- [ ] **TASK-102:** Implementar API de registro de usuário (POST /api/v1/usuarios)
  - **Arquivos:** `/backend/src/controllers/UsuarioController.js`, `/backend/src/routes/usuarios.js`
  - **Dependências:** TASK-101
  - **Gates:** Endpoint retorna 201 com usuário criado, valida CPF duplicado (409), testes passando

- [ ] **TASK-103:** Implementar hash de senha com bcrypt/argon2
  - **Arquivos:** `/backend/src/services/AuthService.js`
  - **Dependências:** TASK-102
  - **Gates:** Senha nunca armazenada em plain text, testes de hash/verify passando

- [ ] **TASK-104:** Implementar API de login (POST /api/v1/auth/login) com JWT
  - **Arquivos:** `/backend/src/controllers/AuthController.js`, `/backend/src/middlewares/auth.js`
  - **Dependências:** TASK-103
  - **Gates:** Retorna token JWT válido, valida credenciais incorretas (401), testes passando

- [ ] **TASK-105:** Implementar bloqueio de conta após 5 tentativas incorretas (15 min)
  - **Arquivos:** `/backend/src/services/AuthService.js`, migration `002_add_login_attempts.sql`
  - **Dependências:** TASK-104
  - **Gates:** Conta bloqueia após 5 tentativas, desbloqueia após 15 min, testes passando

- [ ] **TASK-106:** Implementar API de recuperação de senha (POST /api/v1/auth/recover) com código de verificação
  - **Arquivos:** `/backend/src/controllers/AuthController.js`, `/backend/src/services/EmailService.js`
  - **Dependências:** TASK-104
  - **Gates:** [A DEFINIR — depende de definir canal de envio: SMS, e-mail ou ambos (gap 61)], código expira em 10 min, testes passando

- [ ] **TASK-107:** Implementar API de redefinição de senha (POST /api/v1/auth/reset-password)
  - **Arquivos:** `/backend/src/controllers/AuthController.js`
  - **Dependências:** TASK-106
  - **Gates:** Valida código de verificação, exige senha forte (8+ caracteres, maiúscula, minúscula, número, especial), testes passando

- [ ] **TASK-108:** Implementar tela de Login no Mobile (1.2)
  - **Arquivos:** `/mobile/src/screens/LoginScreen.js`, `/mobile/src/components/InputCPF.js`
  - **Dependências:** TASK-104
  - **Gates:** Tela renderiza, valida CPF, chama API de login, armazena token localmente, exibe erros

- [ ] **TASK-109:** Implementar tela de Recuperação de Senha no Mobile (1.3)
  - **Arquivos:** `/mobile/src/screens/RecoverPasswordScreen.js`
  - **Dependências:** TASK-106
  - **Gates:** Envia CPF, exibe feedback de sucesso/erro, direciona para redefinição

- [ ] **TASK-110:** Implementar tela de Redefinição de Senha no Mobile (1.4)
  - **Arquivos:** `/mobile/src/screens/ResetPasswordScreen.js`
  - **Dependências:** TASK-107
  - **Gates:** Valida senha forte, confirma senha, exibe feedback, redireciona para login

- [ ] **TASK-111:** Implementar tela de Login no Portal Empresa (10.1)
  - **Arquivos:** `/frontend-web/src/pages/LoginPage.jsx`, `/frontend-web/src/components/InputEmail.jsx`
  - **Dependências:** TASK-104
  - **Gates:** Tela renderiza, valida e-mail, chama API de login, armazena token, exibe erros

- [ ] **TASK-112:** Implementar tela de Recuperação de Senha no Portal Empresa (10.2)
  - **Arquivos:** `/frontend-web/src/pages/RecoverPasswordPage.jsx`
  - **Dependências:** TASK-106
  - **Gates:** Envia e-mail, exibe feedback, direciona para redefinição

- [ ] **TASK-113:** Implementar tela de Redefinição de Senha no Portal Empresa (10.3)
  - **Arquivos:** `/frontend-web/src/pages/ResetPasswordPage.jsx`
  - **Dependências:** TASK-107
  - **Gates:** Valida senha forte, confirma senha, exibe feedback, redireciona para login

- [ ] **TASK-114:** Implementar tela de Login no Admin Saquetti (21.1)
  - **Arquivos:** `/frontend-web/src/pages/AdminLoginPage.jsx`
  - **Dependências:** TASK-104
  - **Gates:** Tela renderiza, valida CNPJ, chama API de login, armazena token, exibe erros

- [ ] **TASK-115:** Implementar tela de Recuperação de Senha no Admin Saquetti (21.2)
  - **Arquivos:** `/frontend-web/src/pages/AdminRecoverPasswordPage.jsx`
  - **Dependências:** TASK-106
  - **Gates:** Envia CPF do admin, exibe feedback, direciona para redefinição

- [ ] **TASK-116:** Implementar Splash Screen no Mobile (1.1)
  - **Arquivos:** `/mobile/src/screens/SplashScreen.js`
  - **Dependências:** TASK-005
  - **Gates:** Exibe logo por 2-3 segundos, carrega dados essenciais, redireciona para login ou home

- [ ] **TASK-117:** Configurar armazenamento seguro de token JWT no mobile (Keychain/Keystore)
  - **Arquivos:** `/mobile/src/services/SecureStorage.js`
  - **Dependências:** TASK-108
  - **Gates:** Token armazenado com segurança, recuperado corretamente, testes passando

- [ ] **TASK-118:** Configurar armazenamento de token JWT no web (localStorage ou httpOnly cookie)
  - **Arquivos:** `/frontend-web/src/services/AuthService.js`
  - **Dependências:** TASK-111
  - **Gates:** Token armazenado, recuperado, renovação automática configurada

---

## Fase 2 — Estrutura Organizacional e Cadastro de Colaboradores (Portal Empresa)

**Objetivo:** Permitir que o RH cadastre empresas, departamentos, funções, cargos e colaboradores, base essencial para marcações de ponto.

### Tasks

- [ ] **TASK-201:** Implementar modelo de dados de Empresa (Razão Social, CNPJ, Status, Logotipo)
  - **Arquivos:** `/backend/src/models/Empresa.js`, migration `003_create_empresas.sql`
  - **Dependências:** TASK-007
  - **Gates:** Migration aplicada, validação de CNPJ funcionando, testes de modelo passando

- [ ] **TASK-202:** Implementar API de listagem de empresas (GET /api/v1/empresas)
  - **Arquivos:** `/backend/src/controllers/EmpresaController.js`, `/backend/src/routes/empresas.js`
  - **Dependências:** TASK-201
  - **Gates:** Retorna lista de empresas, filtra por status, testes passando

- [ ] **TASK-203:** Implementar tela de Listagem de Empresas no Portal (12.1)
  - **Arquivos:** `/frontend-web/src/pages/EmpresasPage.jsx`, `/frontend-web/src/components/EmpresaTable.jsx`
  - **Dependências:** TASK-202, TASK-111
  - **Gates:** Tela renderiza, exibe empresas, filtra por status, busca por razão social/CNPJ

- [ ] **TASK-204:** [A DEFINIR — depende de definir fluxo de cadastro de empresa: tela/formulário/campos (gap 53)]

- [ ] **TASK-205:** Implementar modelo de dados de Departamento (Nome, Empresa)
  - **Arquivos:** `/backend/src/models/Departamento.js`, migration `004_create_departamentos.sql`
  - **Dependências:** TASK-201
  - **Gates:** Migration aplicada, relação com Empresa funcion