# 🍽️ Sistema PDV Allyson Henrique

Sistema de Ponto de Venda (PDV) moderno e responsivo com funcionalidades offline, desenvolvido como Progressive Web App (PWA).

## ✨ Características Principais

- 📱 **PWA Completa** - Instalável como app nativo
- 🔄 **Funcionalidade Offline** - Continua funcionando sem internet
- 🎨 **Design Responsivo** - Otimizado para todos os dispositivos
- 🔐 **Sistema de Autenticação** - Diferentes perfis de acesso
- 🍔 **Gestão de Cardápio** - Produtos organizados por categoria
- 🪑 **Controle de Mesas** - Gestão completa de mesas e reservas
- 💳 **Múltiplos Pagamentos** - Dinheiro, cartão e PIX
- 🧾 **Impressão de Cupons** - Integração com impressoras térmicas
- 📊 **Relatórios** - Dashboard com métricas em tempo real

## 🚀 Tecnologias Utilizadas

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Database**: Supabase (PostgreSQL)
- **PWA**: Service Workers + IndexedDB
- **Offline**: Background Sync + Cache API
- **Deploy**: Netlify

## 🏗️ Arquitetura

### Funcionalidades Offline
- **Service Worker** com estratégias de cache inteligentes
- **IndexedDB** para armazenamento local robusto
- **Sincronização automática** quando a conexão retorna
- **Fila de operações** para garantir que nada se perca

### Perfis de Usuário
- **Admin** - Acesso completo ao sistema
- **Gerente** - Relatórios e operações avançadas
- **Operador de Caixa** - Vendas e atendimento
- **Garçom** - Mesas e pedidos
- **Cozinha** - Apenas área de preparo

## 🛠️ Instalação e Configuração

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- Conta no Supabase (opcional, para sincronização)

### Instalação Local

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/pdv-allyson-henrique.git
cd pdv-allyson-henrique

# Instale as dependências
npm install

# Configure as variáveis de ambiente (opcional)
cp .env.example .env

# Inicie o servidor de desenvolvimento
npm run dev
```

### Configuração do Supabase (Opcional)

1. Crie um projeto no [Supabase](https://supabase.com)
2. Execute as migrações em `supabase/migrations/`
3. Configure as variáveis no arquivo `.env`:

```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
```

## 📱 Como Usar

### Login Rápido (Demo)
- **Admin**: `admin` / `admin123`
- **Caixa**: `joao` / `123456`
- **Garçom**: `maria` / `123456`
- **Cozinha**: `carlos` / `123456`
- **Gerente**: `ana` / `123456`

### Fluxo de Trabalho

1. **Login** com credenciais apropriadas
2. **Selecionar Mesa** ou criar pedido balcão/delivery
3. **Adicionar Produtos** do cardápio
4. **Finalizar Pedido** com forma de pagamento
5. **Acompanhar na Cozinha** o preparo
6. **Entregar** e finalizar atendimento

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview

# Linting
npm run lint
```

## 📦 Estrutura do Projeto

```
src/
├── components/          # Componentes React
├── hooks/              # Custom hooks
├── services/           # Serviços (API, offline, etc.)
├── types/              # Definições TypeScript
├── data/               # Dados mock
├── lib/                # Configurações de bibliotecas
├── utils/              # Utilitários
└── graphql/            # Queries e mutations GraphQL

public/
├── sw.js               # Service Worker
├── manifest.json       # PWA Manifest
└── icons/              # Ícones da aplicação

supabase/
└── migrations/         # Migrações do banco de dados
```

## 🌐 Funcionalidades Offline

O sistema foi projetado para funcionar completamente offline:

- **Pedidos** são salvos localmente
- **Produtos** ficam em cache
- **Pagamentos em dinheiro** funcionam normalmente
- **Sincronização automática** quando a internet retorna
- **Indicador visual** do status de conectividade

## 🔒 Segurança

- Autenticação baseada em perfis
- Controle de acesso por funcionalidade
- Validação de dados no frontend e backend
- Criptografia de dados sensíveis

## 📊 Integrações Futuras

- **iFood, Uber Eats** - Pedidos de delivery
- **Mercado Pago, PagSeguro** - Pagamentos online
- **NFe.io** - Emissão de notas fiscais
- **Impressoras térmicas** - Cupons e comandas

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

**Allyson Henrique**
- Sistema desenvolvido para gestão de restaurantes e lanchonetes
- Foco em simplicidade, performance e confiabilidade

## 🆘 Suporte

Para suporte e dúvidas:
- Abra uma [issue](https://github.com/seu-usuario/pdv-allyson-henrique/issues)
- Entre em contato via email

---

⭐ Se este projeto te ajudou, considere dar uma estrela no repositório!# PDV_AH
