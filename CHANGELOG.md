# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [1.0.0] - 2025-01-16

### Adicionado
- Sistema de autenticação com diferentes perfis de usuário
- Gestão completa de mesas com status em tempo real
- Cardápio digital com categorias e busca
- Carrinho de compras com cálculo automático
- Sistema de pagamento (dinheiro, cartão, PIX)
- Área da cozinha para acompanhamento de pedidos
- Dashboard administrativo com relatórios
- Funcionalidades PWA completas
- Sistema offline robusto com sincronização automática
- Design responsivo para todos os dispositivos
- Service Worker com cache inteligente
- IndexedDB para armazenamento local
- Background Sync para sincronização offline
- Integração com Supabase (opcional)
- Suporte a impressoras térmicas (estrutura)
- Sistema de totem para clientes

### Funcionalidades Principais
- **Offline-First**: Funciona completamente sem internet
- **Multi-usuário**: 5 perfis diferentes (Admin, Gerente, Caixa, Garçom, Cozinha)
- **Responsivo**: Otimizado para mobile, tablet e desktop
- **PWA**: Instalável como app nativo
- **Tempo Real**: Atualizações instantâneas entre dispositivos
- **Seguro**: Controle de acesso baseado em perfis

### Tecnologias
- React 18 + TypeScript
- Tailwind CSS para styling
- Vite para build e desenvolvimento
- Supabase para backend (opcional)
- Service Workers para funcionalidades offline
- IndexedDB para armazenamento local

### Estrutura do Banco
- Tabelas para produtos, categorias, mesas, pedidos
- Sistema de pagamentos e métodos
- Configurações de impressoras e NFe
- Integrações com delivery e pagamentos

## [Unreleased]

### Planejado
- Integração com iFood e Uber Eats
- Emissão automática de NFe
- Sistema de estoque avançado
- Relatórios detalhados com gráficos
- Sistema de fidelidade
- Gestão de funcionários
- Backup automático na nuvem
- Notificações push
- Modo quiosque para auto-atendimento

### Em Desenvolvimento
- Testes automatizados
- CI/CD pipeline
- Documentação da API
- Guias de instalação detalhados