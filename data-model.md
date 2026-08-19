# Modelo de dados

## Visão geral

Este documento descreve as principais entidades de dados do sistema de controle de ponto eletrônico Saquetti, seus atributos, relacionamentos e regras de integridade. O modelo está dividido em cinco domínios: **Estrutura Organizacional**, **Controle de Jornada**, **Gestão de Marcações**, **Gestão Administrativa** e **Suporte e Monitoramento**.

---

## Domínio: Estrutura Organizacional

### Entidade: `Empresa`

Representa as empresas clientes da plataforma Saquetti.

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | Sim | Identificador único da empresa |
| `razaoSocial` | String(255) | Sim | Razão social da empresa |
| `cnpj` | String(18) | Sim | CNPJ da empresa (formato: 00.000.000/0000-00) |
| `logotipo` | String(500) | Não | URL do logotipo (mínimo 300x100px, PNG/JPG) |
| `endereco` | String(500) | Não | Endereço completo da empresa |
| `telefone` | String(20) | Não | Telefone de contato |
| `emailPrincipal` | String(255) | Não | E-mail de contato principal |
| `status` | Enum | Sim | `Ativa`, `Inativa`, `PendenteDeImplantacao`, `Suspensa`, `Cancelada` |
| `dataUltimaAtividade` | Timestamp | Não | Data/hora da última atividade registrada na empresa |
| `dataContratacao` | Date | Não | Data de contratação/início de uso do sistema |
| `criadoEm` | Timestamp | Sim | Data/hora de criação do registro |
| `atualizadoEm` | Timestamp | Sim | Data/hora da última atualização |

**Chaves:**
- PK: `id`
- UK: `cnpj`

---

### Entidade: `Departamento`

Representa os departamentos de uma empresa.

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | Sim | Identificador único do departamento |
| `empresaId` | UUID | Sim | FK para `Empresa.id` |
| `nome` | String(255) | Sim | Nome do departamento |
| `status` | Enum | Sim | `Ativo`, `Inativo` |
| `criadoEm` | Timestamp | Sim | Data/hora de criação |
| `atualizadoEm` | Timestamp | Sim | Data/hora da última atualização |

**Chaves:**
- PK: `id`
- FK: `empresaId` → `Empresa.id`

**Regras:**
- Departamento inativo não pode receber novos colaboradores, mas os já vinculados permanecem até serem remanejados.

---

### Entidade: `Funcao`

Representa as funções (cargos genéricos) disponíveis na plataforma.

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | Sim | Identificador único da função |
| `nome` | String(255) | Sim | Nome da função |
| `status` | Enum | Sim | `Ativa`, `Inativa` |
| `criadoEm` | Timestamp | Sim | Data/hora de criação |
| `atualizadoEm` | Timestamp | Sim | Data/hora da última atualização |

**Chaves:**
- PK: `id`

---

### Entidade: `Cargo`

Representa os cargos específicos de uma empresa.

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | Sim | Identificador único do cargo |
| `nome` | String(255) | Sim | Nome do cargo |
| `status` | Enum | Sim | `Ativo`, `Inativo` |
| `criadoEm` | Timestamp | Sim | Data/hora de criação |
| `atualizadoEm` | Timestamp | Sim | Data/hora da última atualização |

**Chaves:**
- PK: `id`

---

### Entidade: `Colaborador`

Representa os colaboradores/funcionários cadastrados no sistema. Cada colaborador cadastrado aqui é um usuário do app mobile.

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | Sim | Identificador único do colaborador |
| `empresaId` | UUID | Sim | FK para `Empresa.id` |
| `departamentoId` | UUID | Não | FK para `Departamento.id` |
| `funcaoId` | UUID | Não | FK para `Funcao.id` |
| `cargoId` | UUID | Não | FK para `Cargo.id` |
| `escalaId` | UUID | Não | FK para `Escala.id` (escala atribuída) |
| `politicaBancoHorasId` | UUID | Não | FK para `PoliticaBancoHoras.id` |
| `fotoPerfil` | String(500) | Não | URL da foto do colaborador |
| `nomeCompleto` | String(255) | Sim | Nome completo do colaborador |
| `cpf` | String(14) | Sim | CPF do colaborador (formato: 000.000.000-00), usado como login no app mobile |
| `dataNascimento` | Date | Não | Data de nascimento |
| `sexo` | Enum | Não | `Masculino`, `Feminino`, `Outro`, `NaoInformado` |
| `escolaridade` | String(100) | Não | [A DEFINIR — depende de lista de valores padrão ou texto livre] |
| `estadoCivil` | String(50) | Não | [A DEFINIR — depende de lista de valores padrão] |
| `telefone` | String(20) | Não | Telefone do colaborador |
| `email` | String(255) | Não | E-mail do colaborador |
| `cep` | String(10) | Não | CEP do endereço |
| `endereco` | String(500) | Não | Endereço completo (preenchimento automático via ViaCEP) |
| `cidade` | String(100) | Não | Cidade |
| `uf` | String(2) | Não | Unidade federativa |
| `matricula` | String(50) | Não | Matrícula do colaborador na empresa |
| `numeroIdentificadorRelogio` | String(50) | Não | Número identificador no equipamento físico de ponto (módulo 16) |
| `dataAdmissao` | Date | Não | Data de admissão do colaborador |
| `dataDemissao` | Date | Não | Data de demissão (preenchido ao demitir) |
| `motivoDemissao` | Text | Não | Motivo da demissão (preenchido ao demitir) |
| `statusAcesso` | Enum | Sim | `Ativo`, `Inativo` (revogação de acesso ao app mobile) |
| `senhaHash` | String(255) | Não | Hash da senha do colaborador (após primeiro acesso) |
| `ultimoAcesso` | Timestamp | Não | Data/hora do último acesso ao app mobile |
| `registraPontoVia` | Enum | Sim | `AppMobile`, `EquipamentoFisico`, `Ambos` |
| `capturarFotoNoRegistro` | Boolean | Sim | Se verdadeiro, câmera é acionada no M3 antes do registro |
| `capturarGpsNoRegistro` | Boolean | Sim | Se verdadeiro, GPS é solicitado no M3 |
| `permitirRegistroSemGps` | Boolean | Sim | [A DEFINIR — depende de decisão se bloqueia ou apenas alerta quando GPS indisponível] |
| `habilitaBancoHoras` | Boolean | Sim | Se verdadeiro, colaborador participa do regime de banco de horas |
| `criadoEm` | Timestamp | Sim | Data/hora de criação |
| `atualizadoEm` | Timestamp | Sim | Data/hora da última atualização |

**Chaves:**
- PK: `id`
- UK: `cpf` + `empresaId` (CPF é único por empresa)
- FK: `empresaId` → `Empresa.id`
- FK: `departamentoId` → `Departamento.id`
- FK: `funcaoId` → `Funcao.id`
- FK: `cargoId` → `Cargo.id`
- FK: `escalaId` → `Escala.id`
- FK: `politicaBancoHorasId` → `PoliticaBancoHoras.id`

**Regras:**
- CPF não pode ser alterado após o primeiro acesso.
- Desativar um colaborador revoga automaticamente o acesso ao app mobile.
- Colaborador com status `Inativo` ou com `dataDemissao` preenchida não aparece na listagem ativa e vai para tela 12.8 Demissões.

---

### Entidade: `Afastamento`

Representa os períodos de afastamento de colaboradores (atestado médico, INSS, licenças, etc.).

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | Sim | Identificador único do afastamento |
| `empresaId` | UUID | Sim | FK para `Empresa.id` |
| `colaboradorId` | UUID | Sim | [A DEFINIR — depende de definição de como afastamento é vinculado ao colaborador] |
| `tipo` | Enum | Sim | `AtestadoMedico`, `INSS`, `LicencaMaternidade`, `LicencaPaternidade`, `LicencaSemVencimento`, `AcidenteDeTrabalho`, `Outros` |
| `dataInicio` | Date | Sim | Data de início do afastamento |
| `dataFim` | Date | Não | Data de fim do afastamento (em branco se ainda em andamento) |
| `status` | Enum | Sim | `EmAndamento`, `Encerrado` (calculado: se `dataFim` está vazia ou data atual <= `dataFim`) |
| `observacao` | Text | Não | Observação do RH sobre o afastamento |
| `criadoEm` | Timestamp | Sim | Data/hora de criação |
| `atualizadoEm` | Timestamp | Sim | Data/hora da última atualização |

**Chaves:**
- PK: `id`
- FK: `empresaId` → `Empresa.id`
- FK: `colaboradorId` → `Colaborador.id` [A DEFINIR — depende de fluxo de vinculação ao colaborador]

**Regras:**
- Afastamento em andamento deve ter destaque visual (badge amarelo).
- Afastamento sem data de fim gera automaticamente badge `Afastado` na listagem de colaboradores.
- Colaborador afastado não gera alerta de ausência no dashboard durante o período registrado.

---

### Entidade: `Ferias`

Representa os períodos de férias dos colaboradores.

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | Sim | Identificador único do período de férias |
| `empresaId` | UUID | Sim | FK para `Empresa.id` |
| `colaboradorId` | UUID | Sim | [A DEFINIR — depende de definição de como férias são vinculadas ao colaborador] |
| `dataInicio` | Date | Sim | Data de início das férias |
| `dataFim` | Date | Sim | Data de fim das férias |
| `quantidadeDias` | Integer | Sim | Quantidade de dias de férias (calculado automaticamente: `dataFim - dataInicio + 1`) |
| `tipo` | Enum | Sim | `Ferias`, `VendaDeFerias` |
| `status` | Enum | Sim | `EmAndamento`, `Concluido` (calculado: data atual > `dataFim` = Concluido) |
| `observacao` | Text | Não | Observação do RH |
| `criadoEm` | Timestamp | Sim | Data/hora de criação |
| `atualizadoEm` | Timestamp | Sim | Data/hora da última atualização |

**Chaves:**
- PK: `id`
- FK: `empresaId` → `Empresa.id`
- FK: `colaboradorId` → `Colaborador.id` [A DEFINIR — depende de fluxo de vinculação ao colaborador]

**Regras:**
- Colaborador em férias não gera alerta de ausência no dashboard durante o período.
- Ao salvar, o sistema valida se os dias cabem no saldo [A DEFINIR — depende de onde o saldo de férias é definido e calculado]; se exceder, exibe aviso antes de confirmar.
- Venda de férias desconta do saldo [A DEFINIR — onde está o saldo?] sem criar um período de ausência no calendário.

---

### Entidade: `Feriado`

Representa os feriados (nacionais, estaduais, municipais) considerados no sistema.

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | Sim | Identificador único do feriado |
| `empresaId` | UUID | Sim | FK para `Empresa.id` (feriados são configurados por empresa) |
| `data` | Date | Sim | Data