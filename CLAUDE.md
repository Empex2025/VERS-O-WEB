# Convenções do projeto — rede-social (iSaúde)

Stack: React 19 + Vite + TypeScript + TailwindCSS + shadcn, react-router-dom, react-hook-form + zod.

## Organização de páginas por feature (OBRIGATÓRIO)

As páginas ficam agrupadas em pastas por fluxo/feature dentro de `src/pages/`.
Sempre que criar uma nova tela, coloque-a na pasta da feature correspondente
(crie uma nova pasta se for um fluxo novo). **Manter esse padrão durante todo o
desenvolvimento.**

```
src/pages/
├── login/            # Autenticação / entrada
│   └── Login.tsx
├── cadastro/         # Fluxo de criação de conta
│   ├── Register.tsx
│   ├── RegisterPatient.tsx
│   ├── RegisterProfessional.tsx
│   └── PhoneVerification.tsx
├── recuperar-senha/  # Fluxo de redefinição de senha
│   ├── ForgotPassword.tsx       # Esqueceu sua senha? (email/telefone)
│   ├── NoPhoneAccess.tsx        # Sem acesso ao telefone (falar com suporte)
│   ├── ForgotPasswordCode.tsx   # Código de verificação (6 dígitos)
│   ├── NewPassword.tsx          # Criar nova senha (com força da senha)
│   └── PasswordSuccess.tsx      # Senha alterada com sucesso
│
│  # ── Área logada (rede social) — todas usam <AppShell> ──
├── home/             # Feed principal (Início) + onboarding + localização
├── explorar/         # Busca, categorias e grid de conteúdo
├── pulses/           # Feed vertical de vídeo (reels) + comentários/menu
├── notificacoes/     # Lista de notificações (Hoje / 7 dias)
├── conversas/        # Chats + thread + chamada de vídeo
├── criar-post/       # Composer (Nota, Fotos, Flash, Pulse, Ao Vivo)
├── perfil/           # Perfil (público/privado) + bloquear usuário
└── placeholder/      # Telas ainda não desenhadas (Minha Saúde, Flashs)
```

## Área logada — estrutura compartilhada

- **`src/components/layout/AppShell.tsx`** — chrome de todas as telas logadas:
  header azul (logo + Conversas), sidebar de navegação e coluna direita
  (`SuggestionsRail`). Passe `rightRail={null}` para ocultar a coluna e
  `bare` para miolo full-bleed (ex.: Pulses).
- **`src/components/social/`** — `PostCard`, `FlashsRow` (reutilizados no feed).
- **`src/components/ui/Avatar.tsx`** — avatar com iniciais (sem imagens reais ainda).
- **`src/data/social.ts`** — dados mock (sugestões, flashs, posts). Trocar por API.
- Navegação central em `AppShell` (NavLink). Rotas logadas: `/inicio`, `/explorar`,
  `/pulses`, `/notificacoes`, `/conversas`, `/criar-post`, `/meu-perfil`,
  `/minha-saude`, `/flashs`.

Regras:
- O nome da pasta acompanha o prefixo da rota (`/cadastro/*`, `/recuperar-senha/*`).
- Assets ficam em `src/assets/<feature>/`. A partir de `src/pages/<feature>/`,
  o caminho relativo é `../../assets/...`.
- Rotas centralizadas em `src/App.tsx`.

## Integração com a API (gateway BBF)

O backend é a **isaude-api** (microserviços atrás do gateway **BBF**). O front consome
apenas o BBF. Base URL em **`VITE_API_URL`** (`.env`), default `http://localhost:3000`.

- **`src/services/http.ts`** — cliente `fetch` central: injeta `Authorization: Bearer <token>`,
  serializa JSON, lança `ApiError`, desloga no 401.
- **`src/store/useAuthStore.ts`** — sessão (token + user) persistida no localStorage.
- **`src/services/crud.ts`** — fábricas `makeCrud` (`/{r}/create`, padrão social/teleconsulta)
  e `makeBaseCrud` (POST na base, padrão user-api addresses/phones/cards).
- **Serviços por domínio**: `authService`, `profileService` (`/api/user-api`),
  `socialService` (`/api/social-midia`), `teleconsultaService` (`/api/teleconsulta`).
- **`src/hooks/useApiData.ts`** — busca com **fallback para o mock** quando a API está fora
  (mantém a tela navegável — "modo demo"). Padrão para ligar qualquer tela:
  `const { data } = useApiData(() => service.list(), MOCK, [deps]);`
- Respostas trazem só ids de autor (`autor_id`, `id_usuario_profissional`) — enriquecer com
  `profileService.getUser(id)` quando precisar de nome/avatar (ver `socialService.getFeed`).
- **Telas já ligadas (leitura + fallback)**: login (email+senha), recuperação de senha (3 telas),
  logout, cadastro (paciente/profissional com senha → `POST /users`), feed (Início), Meus Agendamentos,
  Resultados de Exames, Notificações, Histórico da Conta, Meu Perfil (usuário logado), e os modais de
  Opções de Perfil: Cartões, Endereços, Telefones, Documentos (validação).
- **Escritas ligadas (otimista, dispara na API)**: publicar post (`postagem/create`), curtir e comentar
  (`curtida/create`, `comentario/create`), enviar mensagem em Conversas (`POST /conversas`), seguir
  (`seguidor/create` `{ seguindo_id }`), adicionar/excluir cartão, endereço e telefone
  (**formulários controlados → valores reais**), **editar perfil** (`PUT /users/:id` + atualiza o store),
  **agendar consulta** (`agendamento-consulta/create` `{ id_usuario_paciente, id_usuario_profissional, data_hora_inicio, data_hora_fim, tipo_consulta, motivo, comentarios }` — pelo `SchedulePicker`),
  cancelar agendamento (`agendamento-consulta/:id/cancelar`), cadastro (`users`).
- **Meu Perfil / Salvos**: `MeuPerfil` mostra dados reais do usuário logado (bio/stats/posts próprios via `GET /postagem`+`seguidor`);
  `Salvos` lista salvamentos reais (`GET /salvamento`, o post vem em `.postagem`).
- **Conversas** (`src/pages/conversas/Conversas.tsx`): lista (`GET /conversas`), histórico
  (`GET /conversas/historico?usuario_id=<self>&contato_id=<outro>`) e envio (`POST /conversas` `{ destinatario_id, mensagem }`).
- **Explorar** (`explorar/Explorar.tsx`): pessoas reais (`GET /users`, filtro por nome) + seguir; cards abrem o perfil.
- **Pulses** (`pulses/Pulses.tsx`): posts `tipo_conteudo='pulse'` (`GET /postagem`) + autor enriquecido, curtir e comentar reais.
- **Perfis**: `Perfil` (`/perfil/:handle` → `GET /users`, resolve por username/id) e `PerfilProfissional`
  (`/perfil-profissional/:id` → `GET /teleconsulta/profissionais/:id` + `getPublicUser` + avaliações), com fallback mock.
- **Onboarding profissional** (`verificacao-profissional/*`): o `VerificacaoShell` grava a fatia de cada etapa no
  "Próximo" (prop `onNext`): Horário → `disponibilidade-horario/create` (por dia aberto), Endereço →
  `endereco-atendimento/create`, Chave Pix → `chave-pix/create` (`{ tipo_titular:'medico', id_titular:<self>, chave, tipo }`).
- **Pagamento** (`minha-saude/Pagamento.tsx`): checkout com **dados reais** — cartões (`GET /payment-methods`),
  profissional/valor/parcelas vindos do agendamento (via `location.state`). A **cobrança** chama `consulta-payment/create`,
  mas o backend **exige `MERCADO_PAGO_ACCESS_TOKEN` + token de cartão MP** (400/503 sem isso) → tratado como best-effort e segue p/ a confirmação. Falta só a credencial MP.
- **Bloqueado por backend/infra**: Pós-Consulta/avaliação (`avaliacao/create` exige `paciente_cpf`+`profissional_cpf` NOT NULL
  e os `*_id` são `@RelationId` read-only → precisa de rework no backend), Informações de Saúde (sem endpoint),
  vídeo da consulta (WebRTC, infra à parte) e Flashs (placeholder, nunca desenhado).
- **Enriquecer nome de OUTROS usuários**: usar `profileService.getPublicUser(id)` (diretório `GET /users`, cacheado),
  NÃO `getUser(:id)` — este faz **403** para não-donos (proteção IDOR). Seguir usa `seguindo_id`; o backend deriva `seguidor_id` do token.

## Padrão visual das telas de auth

- Cor primária: `#407BFF`. Inputs: fundo `#F3F4F6`, cantos `rounded-xl`.
- Layout: header azul (logo) + faixa de navegação "voltar" (`ChevronLeft` + título) + conteúdo centralizado (`max-w-md`).
- Botão primário: `rounded-full`, desabilitado em `#E5E7EB`/`text-gray-400` até o formulário ficar válido.
- Ícones: `lucide-react`. Fonte: `font-sans`.
- Erros: borda/texto vermelho + `AlertCircle`.
- Chamadas de backend ainda são placeholders (constantes `MOCK_*` comentadas) — substituir por API real.
