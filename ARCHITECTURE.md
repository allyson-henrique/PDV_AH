# 🏗️ Arquitetura do Sistema PDV

[![q-developer-quest-tdc-2025](https://img.shields.io/badge/q--developer--quest--tdc--2025-orange?style=for-the-badge)](https://github.com/allysonhenrique/pdv-allyson-henrique)

## 📁 Organização de Arquivos

### Estrutura por Domínio (Domain-Driven Design)

```
src/
├── components/          # Componentes base reutilizáveis
│   ├── layout/         # Header, navegação, notificações
│   ├── modals/         # Modais compartilhados
│   └── ui/             # Componentes UI primitivos
├── features/           # Features organizadas por domínio
│   ├── pos/           # Point of Sale (Vendas)
│   ├── kitchen/       # Cozinha e Totem
│   ├── analytics/     # Relatórios e Analytics
│   ├── inventory/     # Gestão de Estoque
│   └── admin/         # Administração
├── pages/             # Páginas principais (Login, etc.)
├── shared/            # Código compartilhado
│   ├── constants/     # Constantes globais
│   └── utils/         # Utilitários
├── hooks/             # Custom React Hooks
├── services/          # Serviços (API, offline, etc.)
├── types/             # Definições TypeScript
└── test/              # Testes organizados
```

## 🎯 Benefícios da Organização

### 1. **Separação por Domínio**
- Cada feature tem sua própria pasta
- Facilita manutenção e escalabilidade
- Reduz acoplamento entre módulos

### 2. **Imports Organizados**
- Arquivos `index.ts` em cada pasta
- Imports limpos e organizados
- Facilita refatoração

### 3. **Testabilidade**
- Testes organizados por tipo
- Fácil localização de testes
- Cobertura por feature

## 🔄 Fluxo de Dados

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Pages     │───▶│  Features   │───▶│  Services   │
│  (Login)    │    │ (POS, etc.) │    │ (API, DB)   │
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Components  │    │   Hooks     │    │   Types     │
│ (Layout/UI) │    │ (State Mgmt)│    │ (TypeScript)│
└─────────────┘    └─────────────┘    └─────────────┘
```

## 🚀 MCP Server (Microservice)

### Funcionalidades
- **Cost Calculator**: Cálculo de custos em tempo real
- **AWS Diagrams**: Geração de diagramas de arquitetura
- **Real-time Events**: WebSocket para atualizações
- **Background Jobs**: Processamento assíncrono

### Endpoints
```
GET  /api/health                    # Health check
POST /api/calculate-cost           # Calculadora de custos
GET  /api/architecture/pdv         # Diagrama PDV
GET  /api/architecture/costs       # Breakdown de custos
GET  /api/architecture/deployment  # Pipeline de deploy
GET  /api/architecture/security    # Camadas de segurança
```

## 📊 Métricas de Qualidade

### Cobertura de Testes
- **Unitários**: >85% (Vitest + Testing Library)
- **Integração**: Fluxos completos
- **E2E**: Cenários críticos (Playwright)

### Performance
- **Lighthouse Score**: >90
- **PWA Score**: 100/100
- **Acessibilidade**: >95 (WCAG 2.1)

### Arquitetura
- **Offline-First**: Funciona sem internet
- **Microservices**: Separação clara de responsabilidades
- **Type Safety**: 100% TypeScript
- **Modern Stack**: React 18, Vite, Tailwind

## 🔧 Scripts de Desenvolvimento

```bash
# Frontend
npm run dev              # Servidor de desenvolvimento
npm run build            # Build para produção
npm run test             # Testes unitários
npm run test:e2e         # Testes E2E

# MCP Server
npm run mcp:dev          # Servidor MCP em desenvolvimento
npm run mcp:server       # Servidor MCP em produção

# Qualidade
npm run lint             # Linting e formatação
npm run test:coverage    # Cobertura de testes
```

## 🎨 Padrões de Código

### Nomenclatura
- **Componentes**: PascalCase (`ProductCard.tsx`)
- **Hooks**: camelCase com prefixo `use` (`useCart.ts`)
- **Serviços**: camelCase (`offlineManager.ts`)
- **Types**: PascalCase (`UserProfile`)

### Estrutura de Componentes
```typescript
// 1. Imports
import React from 'react'
import { Icon } from 'lucide-react'

// 2. Types/Interfaces
interface ComponentProps {
  // props definition
}

// 3. Component
export const Component: React.FC<ComponentProps> = ({ props }) => {
  // 4. Hooks
  // 5. Handlers
  // 6. Render
  return <div>...</div>
}
```

## 🔐 Segurança

### Autenticação
- JWT tokens
- Role-based access control
- Session management

### Dados
- Encryption at rest
- Encryption in transit
- Row Level Security (RLS)

### Infraestrutura
- HTTPS only
- CORS configurado
- Rate limiting
- Input validation

---

Esta arquitetura garante **escalabilidade**, **manutenibilidade** e **qualidade** para o sistema PDV empresarial.