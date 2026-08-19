# Perguntas em Aberto

Este documento consolida as lacunas identificadas no Discovery, organizadas por severidade e localização. Cada item indica o impacto no desenvolvimento e a pergunta objetiva que precisa ser respondida.

---

## 🔴 Bloqueadores / Alta Severidade

### Módulo 13 — Regras de Jornada

**Gap:** Critérios de aceite completamente ausentes  
**Impacto:** Impossível validar objetivamente quando o módulo estará operante ou se as funcionalidades descritas estão completas.  
**Pergunta:** Quais são os critérios mínimos verificáveis para considerar o módulo 13 operacional? (Responsável: PO/Cliente)

---

**Gap:** Período de reset do banco de horas não definido  
**Impacto:** Impossível implementar a lógica de cálculo de saldo, compensação e auditoria de períodos fechados.  
**Pergunta:** O banco de horas tem reset anual ou funciona de forma contínua? Existe algum período de validade ou renovação? (Responsável: Cliente/Departamento Pessoal)

---

**Gap:** Limites máximo/mínimo do Banco de Horas não definidos  
**Impacto:** Não é possível implementar alertas de saldo nem direcionar horas excedentes às colunas convencionais.  
**Pergunta:** Quais são os valores padrão de limite máximo e mínimo do banco de horas? São configuráveis por empresa? (Responsável: Cliente/Jurídico Trabalhista)

---

**Gap:** Tipos de ajuste não especificados (Módulo 5/14)  
**Impacto:** Impossível construir o seletor de tipo de justificativa, validar campos obrigatórios ou processar solicitações.  
**Pergunta:** Quais são todos os tipos de justificativa/ajuste que o sistema deve permitir (Atestado médico, INSS, Licenças, etc.)? (Responsável: Cliente/RH)

---

**Gap:** Fluxos de autenticação sem regras de negócio (Módulos 1, 10, 21)  
**Impacto:** Impossível implementar login, recuperação de senha, controle de sessão e política de senhas sem especificações mínimas.  
**Pergunta:** Quais são as regras de autenticação (tempo de sessão, tentativas máximas, política de senhas, primeiro acesso, autenticação multifator)? (Responsável: PO/Segurança da Informação)

---

**Gap:** Processo de fechamento mensal sem detalhamento (Módulo 15)  
**Impacto:** Impossível implementar validação de pendências, consolidação, geração e exportação do cartão ponto.  
**Pergunta:** Quais são os critérios que tornam um período "fechável"? Quais pendências bloqueiam o fechamento? O fechamento é reversível? (Responsável: Cliente/DP)

---

**Gap:** Regras de assinatura do cartão ponto não especificadas (Módulos 6, 7, 16)  
**Impacto:** Impossível definir prazo, obrigatoriedade, consequências de não-assinatura e validade jurídica.  
**Pergunta:** Qual o prazo para assinatura? É obrigatória? Pode haver assinatura com ressalvas? Qual o nível de assinatura digital necessário (simples/avançada/qualificada ICP-Brasil)? (Responsável: Cliente/Jurídico)

---

**Gap:** Tipos de solicitação e workflow de aprovação não definidos (Módulos 5, 14.4)  
**Impacto:** Impossível construir fluxo de criação, aprovação, rejeição e histórico de solicitações.  
**Pergunta:** Quais tipos de ajuste são permitidos (correção, inclusão, exclusão, justificativa)? Quais campos são obrigatórios por tipo? Há níveis de aprovação? Há prazos? (Responsável: Cliente/RH)

---

**Gap:** Regras de banco de horas não detalhadas (Módulos 4.2, 13.4)  
**Impacto:** Impossível implementar acúmulo, compensação, saldo negativo, validade e cálculo correto.  
**Pergunta:** Quais são as regras de acúmulo (limites diário/mensal)? Como funciona a compensação (automática ou manual)? O que acontece com saldo negativo? Há validade do banco? (Responsável: Cliente/DP)

---

**Gap:** Fluxo de cadastro de empresa não detalhado (Módulo 12.1)  
**Impacto:** Impossível construir formulário, validações e permissões de cadastro.  
**Pergunta:** Quais campos compõem o cadastro de empresa? Quem tem permissão (admin Saquetti ou RH da empresa)? Quais validações de CNPJ são aplicadas? (Responsável: PO/Saquetti)

---

**Gap:** Telas 15.3, 15.4 e 15.5 não detalhadas (Módulo 15)  
**Impacto:** Impossível implementar consolidação, geração e exportação do cartão ponto.  
**Pergunta:** Quais são os campos, layout, ações e regras das telas de Consolidação do período, Geração do cartão ponto e Exportação? (Responsável: PO/Cliente)

---

**Gap:** Fluxo de verificação de código não mapeado (Módulo 1 Mobile)  
**Impacto:** Fluxo de recuperação de senha está incompleto, impossível implementar a tela intermediária de inserção do código.  
**Pergunta:** Qual é a tela completa de verificação de código (campos, validações, feedback de erro)? (Responsável: PO)

---

**Gap:** Validações de registro de ponto não especificadas (Módulo 3.2)  
**Impacto:** Impossível implementar validações de geolocalização, intervalo mínimo, marcações duplicadas, foto/biometria.  
**Pergunta:** Quais validações devem ser aplicadas no registro de ponto (GPS obrigatório, intervalo mínimo entre marcações, tratamento de duplicadas, validação de foto)? (Responsável: Cliente/Jurídico)

---

**Gap:** Critério "senha técnica padrão para Gestores Master" não verificável (Módulo 15.1.3)  
**Impacto:** Impossível implementar segurança de reabertura de período sem definir o mecanismo de senha.  
**Pergunta:** A senha técnica é fixa, gerada por administrador, rotacionável? Como será validada em testes? (Responsável: PO/Segurança)

---

**Gap:** Fluxo de vinculação de afastamento ao colaborador ausente (Módulo 12.4)  
**Impacto:** Impossível construir tela de registro sem saber como o afastamento é vinculado ao colaborador.  
**Pergunta:** O afastamento é criado a partir do perfil do colaborador (12.6) ou de uma tela independente? Há campo de seleção de colaborador(es)? (Responsável: PO)

---

**Gap:** Fluxo de vinculação de férias ao colaborador ausente (Módulo 12.5)  
**Impacto:** Impossível construir tela de registro sem saber como o período de férias é vinculado ao colaborador.  
**Pergunta:** As férias são registradas a partir do perfil do colaborador (12.6) ou de uma tela independente? Há campo de seleção de colaborador(es)? (Responsável: PO)

---

**Gap:** Origem e cálculo do saldo de férias não especificado (Módulo 12.5)  
**Impacto:** Impossível validar se os dias cabem no saldo ou processar venda de férias.  
**Pergunta:** Onde o saldo de férias é definido e calculado? Quais são os critérios de acúmulo? Existe módulo específico para gestão de saldo? (Responsável: Cliente/DP)

---

**Gap:** Regras de recuperação de senha incompletas (Módulos 10.2, 10.3)  
**Impacto:** Impossível implementar fluxo completo de recuperação sem definir validações, formato do e-mail, validade do link, etc.  
**Pergunta:** Qual o formato do e-mail enviado? Tempo de validade do link? O que acontece se expirar? Quais validações da nova senha? (Responsável: PO/Segurança)

---

**Gap:** Tela 11.1 citada mas não detalhada (Módulo 11)  
**Impacto:** Impossível construir dashboard operacional sem especificação de fontes de dados, regras de cálculo e definição de pendências.  
**Pergunta:** Quais são os campos, fontes de dados, regras de cálculo dos percentuais e definição de "pendências" na tela 11.1? (Responsável: PO)

---

**Gap:** Tela 11.2 citada mas não detalhada (Módulo 11)  
**Impacto:** Impossível construir tela de alertas sem especificar tipos de inconsistência, lógica de geração e ação "Resolver".  
**Pergunta:** Quais tipos de inconsistência existem? Como são gerados automaticamente? A ação "Resolver" abre modal, vai para outro módulo ou edita inline? (Responsável: PO/Cliente)

---

**Gap:** Telas 14.2, 14.3, 14.4 não detalhadas (Módulo 14)  
**Impacto:** Impossível construir gestão de marcações sem layout, campos, interações e regras de negócio das telas principais.  
**Pergunta:** Quais são os campos, layout, ações e regras de negócio de cada uma das telas de Gestão de Marcações? (Responsável: PO)

---

**Gap:** Modelos de cartão ponto não detalhados (Módulo 15.4)  
**Impacto:** Impossível implementar geração de cartão ponto sem saber as diferenças entre modelos (Padrão, Saquetti, Espelho, Resumido).  
**Pergunta:** Quais são as diferenças de layout, campos e formato entre os quatro modelos de cartão ponto? Como