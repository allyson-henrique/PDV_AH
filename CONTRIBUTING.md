# Contribuindo para o Sistema PDV Allyson Henrique

Obrigado por considerar contribuir para este projeto! Este guia irá ajudá-lo a entender como contribuir de forma efetiva.

## 🚀 Como Contribuir

### Reportando Bugs

1. Verifique se o bug já não foi reportado nas [issues existentes](https://github.com/seu-usuario/pdv-allyson-henrique/issues)
2. Se não encontrar, crie uma nova issue com:
   - Descrição clara do problema
   - Passos para reproduzir
   - Comportamento esperado vs atual
   - Screenshots se aplicável
   - Informações do ambiente (browser, OS, etc.)

### Sugerindo Melhorias

1. Abra uma issue com a tag "enhancement"
2. Descreva claramente a melhoria proposta
3. Explique por que seria útil para o projeto
4. Se possível, sugira uma implementação

### Desenvolvendo

#### Configuração do Ambiente

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/pdv-allyson-henrique.git
cd pdv-allyson-henrique

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env

# Inicie o servidor de desenvolvimento
npm run dev
```

#### Padrões de Código

- **TypeScript**: Use tipagem forte sempre que possível
- **ESLint**: Siga as regras configuradas
- **Prettier**: Formatação automática
- **Commits**: Use mensagens descritivas em português

#### Estrutura de Commits

```
tipo(escopo): descrição

Exemplos:
feat(auth): adicionar login com diferentes perfis
fix(cart): corrigir cálculo de total com desconto
docs(readme): atualizar instruções de instalação
style(header): melhorar responsividade do cabeçalho
```

#### Fluxo de Desenvolvimento

1. **Fork** o repositório
2. **Clone** seu fork localmente
3. **Crie uma branch** para sua feature:
   ```bash
   git checkout -b feature/nome-da-feature
   ```
4. **Desenvolva** seguindo os padrões do projeto
5. **Teste** suas mudanças
6. **Commit** suas alterações:
   ```bash
   git commit -m "feat(escopo): descrição da mudança"
   ```
7. **Push** para seu fork:
   ```bash
   git push origin feature/nome-da-feature
   ```
8. **Abra um Pull Request**

### Pull Requests

#### Antes de Submeter

- [ ] Código segue os padrões do projeto
- [ ] Testes passam (quando aplicável)
- [ ] Documentação foi atualizada se necessário
- [ ] Funcionalidade foi testada em diferentes dispositivos
- [ ] Funcionalidade offline foi testada (se aplicável)

#### Template do PR

```markdown
## Descrição
Breve descrição das mudanças realizadas.

## Tipo de Mudança
- [ ] Bug fix
- [ ] Nova funcionalidade
- [ ] Breaking change
- [ ] Documentação

## Como Testar
1. Passos para testar a funcionalidade
2. Cenários específicos a verificar
3. Dispositivos/browsers testados

## Screenshots (se aplicável)
Adicione screenshots das mudanças visuais.

## Checklist
- [ ] Código segue os padrões do projeto
- [ ] Funcionalidade testada
- [ ] Documentação atualizada
- [ ] Funcionalidade offline testada (se aplicável)
```

## 🏗️ Arquitetura do Projeto

### Componentes

- **Modulares**: Cada componente tem uma responsabilidade específica
- **Reutilizáveis**: Componentes podem ser usados em diferentes contextos
- **Tipados**: Todas as props são tipadas com TypeScript

### Hooks Customizados

- **useCart**: Gestão do carrinho de compras
- **useOrders**: Gestão de pedidos
- **useTables**: Controle de mesas
- **useOffline**: Funcionalidades offline

### Serviços

- **offlineManager**: Gestão de dados offline
- **paymentService**: Processamento de pagamentos
- **printerService**: Integração com impressoras
- **nfeService**: Emissão de notas fiscais

## 🧪 Testes

### Testes Manuais Essenciais

1. **Funcionalidade Offline**:
   - Desconecte a internet
   - Crie pedidos
   - Verifique se são salvos localmente
   - Reconecte e verifique sincronização

2. **Responsividade**:
   - Teste em mobile, tablet e desktop
   - Verifique navegação e usabilidade
   - Confirme que todos os elementos são acessíveis

3. **Perfis de Usuário**:
   - Teste login com diferentes perfis
   - Verifique permissões de acesso
   - Confirme funcionalidades específicas

### Cenários de Teste

- [ ] Login/logout funcionando
- [ ] Criação de pedidos
- [ ] Gestão de mesas
- [ ] Processamento de pagamentos
- [ ] Funcionalidade offline
- [ ] Sincronização online
- [ ] Responsividade mobile
- [ ] Performance geral

## 📋 Roadmap

### Próximas Funcionalidades

- [ ] Integração com iFood/Uber Eats
- [ ] Sistema de estoque avançado
- [ ] Relatórios detalhados
- [ ] Emissão de NFe
- [ ] Integração com impressoras
- [ ] Sistema de fidelidade
- [ ] Gestão de funcionários
- [ ] Backup automático

### Melhorias Técnicas

- [ ] Testes automatizados
- [ ] CI/CD pipeline
- [ ] Monitoramento de performance
- [ ] Logs estruturados
- [ ] Documentação da API

## 🤔 Dúvidas?

Se tiver dúvidas sobre como contribuir:

1. Leia a documentação completa
2. Verifique as issues existentes
3. Abra uma issue com sua dúvida
4. Entre em contato com os mantenedores

## 🙏 Reconhecimentos

Agradecemos a todos os contribuidores que ajudam a tornar este projeto melhor!

---

**Lembre-se**: Toda contribuição, por menor que seja, é valiosa! 🎉