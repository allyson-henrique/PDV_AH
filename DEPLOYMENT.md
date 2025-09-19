# 🚀 Guia de Deploy

Este documento descreve como fazer o deploy do Sistema PDV Allyson Henrique em diferentes plataformas.

## 📋 Pré-requisitos

- Node.js 18+
- Conta no Supabase (opcional, para funcionalidades online)
- Conta na plataforma de deploy escolhida

## 🌐 Opções de Deploy

### 1. Netlify (Recomendado)

#### Deploy Automático via Git

1. **Conecte seu repositório**:
   - Acesse [Netlify](https://netlify.com)
   - Clique em "New site from Git"
   - Conecte seu repositório GitHub

2. **Configurações de Build**:
   ```
   Build command: npm run build
   Publish directory: dist
   ```

3. **Variáveis de Ambiente**:
   - Vá em Site settings > Environment variables
   - Adicione as variáveis do arquivo `.env.example`

#### Deploy Manual

```bash
# Build do projeto
npm run build

# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

### 2. Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### 3. GitHub Pages

1. **Configure o workflow**:
   Crie `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build
    
    - name: Deploy
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

### 4. Docker

```dockerfile
# Dockerfile
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```bash
# Build e run
docker build -t pdv-allyson .
docker run -p 80:80 pdv-allyson
```

## ⚙️ Configurações de Produção

### Variáveis de Ambiente Essenciais

```env
# Supabase (se usando sincronização)
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-publica

# Configurações da aplicação
VITE_APP_NAME="Allyson Henrique - Sistema PDV"
VITE_COMPANY_NAME="Allyson Henrique"
```

### Otimizações para Produção

1. **PWA Configuration**:
   - Verifique se `manifest.json` está correto
   - Confirme que Service Worker está registrado
   - Teste instalação em diferentes dispositivos

2. **Performance**:
   - Ative compressão gzip/brotli
   - Configure cache headers apropriados
   - Otimize imagens e assets

3. **SEO e Meta Tags**:
   - Verifique meta tags no `index.html`
   - Configure Open Graph para compartilhamento
   - Adicione structured data se necessário

## 🔧 Configuração do Servidor

### Headers Recomendados

```nginx
# nginx.conf
server {
    listen 80;
    server_name seu-dominio.com;
    root /usr/share/nginx/html;
    index index.html;

    # PWA Support
    location / {
        try_files $uri $uri/ /index.html;
        
        # Cache headers
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
        
        # Service Worker
        location = /sw.js {
            expires 0;
            add_header Cache-Control "no-cache, no-store, must-revalidate";
        }
        
        # Manifest
        location = /manifest.json {
            expires 1d;
            add_header Cache-Control "public";
        }
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

## 📊 Monitoramento

### Métricas Importantes

1. **Performance**:
   - Lighthouse Score
   - Core Web Vitals
   - Tempo de carregamento

2. **PWA**:
   - Taxa de instalação
   - Uso offline
   - Sincronização de dados

3. **Funcionalidade**:
   - Pedidos criados
   - Erros de pagamento
   - Tempo de resposta

### Ferramentas Recomendadas

- **Google Analytics** - Métricas de uso
- **Sentry** - Monitoramento de erros
- **Lighthouse CI** - Performance contínua
- **Supabase Analytics** - Métricas de banco

## 🔒 Segurança

### Checklist de Segurança

- [ ] HTTPS configurado
- [ ] Headers de segurança configurados
- [ ] Variáveis sensíveis não expostas
- [ ] Validação de dados no frontend e backend
- [ ] Rate limiting configurado (se aplicável)
- [ ] Backup de dados configurado

### Variáveis Sensíveis

⚠️ **NUNCA** commite:
- Chaves privadas de API
- Senhas de banco de dados
- Certificados digitais
- Tokens de acesso

## 🆘 Troubleshooting

### Problemas Comuns

1. **Build falha**:
   ```bash
   # Limpe cache e reinstale
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

2. **Service Worker não atualiza**:
   - Force refresh (Ctrl+Shift+R)
   - Limpe cache do browser
   - Verifique console para erros

3. **Funcionalidade offline não funciona**:
   - Verifique se Service Worker está registrado
   - Confirme que IndexedDB está funcionando
   - Teste em modo incógnito

4. **Supabase não conecta**:
   - Verifique URLs e chaves
   - Confirme políticas RLS
   - Teste conexão direta

### Logs Úteis

```bash
# Verificar build
npm run build 2>&1 | tee build.log

# Verificar Service Worker
# No DevTools > Application > Service Workers

# Verificar IndexedDB
# No DevTools > Application > Storage > IndexedDB
```

## 📞 Suporte

Para problemas de deploy:
1. Verifique este guia primeiro
2. Consulte a documentação da plataforma
3. Abra uma issue no GitHub
4. Entre em contato com suporte

---

**Dica**: Sempre teste o deploy em ambiente de staging antes de produção! 🎯