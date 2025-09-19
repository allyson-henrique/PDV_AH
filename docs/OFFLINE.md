# 📴 Funcionalidades Offline

Este documento explica como o sistema funciona offline e como implementar novas funcionalidades offline-first.

## 🎯 Visão Geral

O Sistema PDV foi projetado com arquitetura **offline-first**, garantindo que as operações essenciais funcionem mesmo sem conexão com a internet.

## 🏗️ Arquitetura Offline

### Service Worker (`public/sw.js`)

O Service Worker implementa diferentes estratégias de cache:

```javascript
// Cache First - Recursos estáticos
- HTML, CSS, JS, imagens
- Sempre busca do cache primeiro
- Atualiza em background

// Network First - APIs
- Dados dinâmicos
- Tenta rede primeiro
- Fallback para cache se offline

// Stale While Revalidate - Outros recursos
- Serve do cache imediatamente
- Atualiza em background
```

### IndexedDB (`src/services/offlineManager.ts`)

Armazenamento local estruturado:

```javascript
Stores:
├── offline_orders     // Pedidos offline
├── products_cache     // Cache de produtos
├── app_settings       // Configurações
├── sync_queue         // Fila de sincronização
└── sync_status        // Status de sincronização
```

## 🔄 Fluxo de Sincronização

### 1. Modo Online
```
Usuário → Ação → Cache Local + API → Sucesso
```

### 2. Modo Offline
```
Usuário → Ação → Cache Local → Fila de Sync → Aguarda Conexão
```

### 3. Reconexão
```
Conexão Detectada → Background Sync → API → Limpa Fila → Atualiza Cache
```

## 📊 Dados Offline

### O que Funciona Offline

✅ **Totalmente Offline**:
- Visualizar produtos do cardápio
- Adicionar itens ao carrinho
- Calcular totais e impostos
- Criar pedidos
- Pagamentos em dinheiro
- Imprimir cupons (impressora local)
- Controle básico de mesas
- Visualizar pedidos salvos

⚠️ **Funcionalidade Limitada**:
- Pagamentos com cartão (depende do terminal)
- PIX (precisa gerar QR code online)
- Sincronização com delivery apps
- Relatórios em tempo real

❌ **Requer Internet**:
- Emissão de NFe para SEFAZ
- Integração com bancos
- Backup em nuvem
- Atualizações de preços remotas

### Estrutura de Dados Offline

```typescript
interface OfflineOrder {
  id: string;
  items: CartItem[];
  total: number;
  paymentInfo: PaymentInfo;
  customerInfo?: CustomerInfo;
  status: 'pending' | 'synced' | 'error';
  createdAt: string;
  syncAttempts: number;
  lastSyncAttempt?: string;
  syncError?: string;
}
```

## 🛠️ Implementando Novas Funcionalidades Offline

### 1. Adicionar ao Cache

```typescript
// Em offlineManager.ts
async cacheNewData(data: any[]): Promise<void> {
  if (!this.db) await this.initDB();
  
  const tx = this.db.transaction(['new_store'], 'readwrite');
  const store = tx.objectStore('new_store');
  
  for (const item of data) {
    await store.put({
      ...item,
      lastUpdated: new Date().toISOString()
    });
  }
}
```

### 2. Criar Hook Offline

```typescript
// hooks/useNewFeatureOffline.ts
export const useNewFeatureOffline = () => {
  const { isOnline } = useOffline();
  
  const performAction = async (data: any) => {
    if (isOnline) {
      // Fluxo online normal
      return await apiCall(data);
    } else {
      // Salvar offline
      return await offlineManager.saveOfflineAction(data);
    }
  };
  
  return { performAction };
};
```

### 3. Adicionar à Sincronização

```typescript
// Em offlineManager.ts
async syncNewFeature(): Promise<void> {
  const pendingActions = await this.getPendingActions('new_feature');
  
  for (const action of pendingActions) {
    try {
      await apiService.syncAction(action);
      await this.markAsSynced(action.id);
    } catch (error) {
      await this.markSyncError(action.id, error);
    }
  }
}
```

## 🔍 Debugging Offline

### DevTools

1. **Application Tab**:
   - Service Workers: Status e logs
   - Storage: IndexedDB, Cache, LocalStorage
   - Manifest: Configuração PWA

2. **Network Tab**:
   - Simular offline: "Offline" checkbox
   - Throttling: Simular conexão lenta

3. **Console**:
   - Logs do Service Worker
   - Erros de sincronização
   - Status de cache

### Comandos Úteis

```javascript
// No console do browser

// Verificar Service Worker
navigator.serviceWorker.getRegistrations()

// Verificar cache
caches.keys()

// Verificar IndexedDB
indexedDB.databases()

// Forçar sincronização
offlineManager.forceSyncNow()

// Estatísticas offline
offlineManager.getOfflineStats()
```

## 📈 Monitoramento Offline

### Métricas Importantes

1. **Taxa de Uso Offline**: % de tempo usado sem internet
2. **Pedidos Offline**: Quantidade de pedidos criados offline
3. **Taxa de Sincronização**: % de dados sincronizados com sucesso
4. **Tempo de Sincronização**: Tempo médio para sincronizar
5. **Erros de Sync**: Quantidade e tipos de erros

### Implementação de Métricas

```typescript
// Analytics offline
const trackOfflineUsage = () => {
  const stats = {
    isOffline: !navigator.onLine,
    offlineTime: getOfflineTime(),
    pendingOrders: offlineStats.unsyncedOrders,
    lastSync: offlineStats.lastSync
  };
  
  // Enviar quando online
  if (navigator.onLine) {
    analytics.track('offline_usage', stats);
  } else {
    // Salvar para enviar depois
    localStorage.setItem('pending_analytics', JSON.stringify(stats));
  }
};
```

## 🚨 Tratamento de Erros Offline

### Estratégias de Retry

```typescript
const retryStrategies = {
  // Retry imediato para erros temporários
  immediate: [408, 429, 502, 503, 504],
  
  // Retry com backoff exponencial
  exponential: [500, 502, 503],
  
  // Não retry para erros permanentes
  noRetry: [400, 401, 403, 404, 422]
};
```

### Fallbacks

1. **Dados não encontrados**: Usar cache local
2. **API indisponível**: Modo offline automático
3. **Sincronização falha**: Reagendar para depois
4. **Storage cheio**: Limpar dados antigos

## 🔧 Configurações Avançadas

### Cache Personalizado

```typescript
// Configurar TTL do cache
const cacheConfig = {
  products: { ttl: 24 * 60 * 60 * 1000 }, // 24 horas
  orders: { ttl: 7 * 24 * 60 * 60 * 1000 }, // 7 dias
  settings: { ttl: Infinity } // Nunca expira
};
```

### Sincronização Customizada

```typescript
// Prioridades de sincronização
const syncPriorities = {
  high: ['orders', 'payments'],
  medium: ['products', 'tables'],
  low: ['analytics', 'logs']
};
```

## 📱 PWA e Offline

### Manifest Configuration

```json
{
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#f97316",
  "icons": [...],
  "shortcuts": [
    {
      "name": "Novo Pedido",
      "url": "/menu",
      "icons": [...]
    }
  ]
}
```

### Installation Prompt

```typescript
// Controlar quando mostrar prompt de instalação
const shouldShowInstallPrompt = () => {
  return !isInstalled && 
         !wasPromptDismissed && 
         userEngagement > threshold;
};
```

## 🧪 Testando Funcionalidades Offline

### Cenários de Teste

1. **Offline Completo**:
   - Desconecte internet
   - Teste todas as funcionalidades
   - Verifique dados salvos localmente

2. **Conexão Intermitente**:
   - Simule conexão instável
   - Teste sincronização parcial
   - Verifique retry automático

3. **Reconexão**:
   - Volte online
   - Verifique sincronização automática
   - Confirme integridade dos dados

### Ferramentas de Teste

```bash
# Simular offline no Chrome DevTools
# Network tab > Offline checkbox

# Lighthouse PWA audit
npx lighthouse --view --preset=desktop

# Workbox testing
npx workbox-cli --help
```

## 🔮 Futuras Melhorias

### Planejadas

- [ ] Sincronização diferencial (apenas mudanças)
- [ ] Compressão de dados offline
- [ ] Backup automático local
- [ ] Modo offline avançado com IA
- [ ] Previsão de demanda offline
- [ ] Cache preditivo

### Experimentais

- [ ] WebAssembly para processamento local
- [ ] Blockchain para auditoria offline
- [ ] Machine Learning local
- [ ] Realidade aumentada para cardápio

---

**Lembre-se**: O objetivo é que o usuário nem perceba quando está offline! 🎯