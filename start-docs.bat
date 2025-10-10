@echo off
echo ============================================
echo  Iniciando Documentacao - Simulador ADS
echo ============================================
echo.

cd docs

echo [1/2] Verificando dependencias...
if not exist "node_modules" (
    echo [!] Instalando dependencias pela primeira vez...
    call npm install
)

echo.
echo [2/2] Iniciando servidor de documentacao...
echo.
echo ============================================
echo  Documentacao disponivel em:
echo  http://localhost:3001
echo ============================================
echo.

call npm start
# 📚 Documentação - Simulador ADS API

Documentação oficial criada com [Docusaurus](https://docusaurus.io/).

## 🚀 Como Usar

### Desenvolvimento Local

```bash
cd docs
npm install
npm start
```

A documentação estará disponível em: **http://localhost:3001**

### Build para Produção

```bash
npm run build
```

Os arquivos estáticos serão gerados em `docs/build/`.

### Servir Build Localmente

```bash
npm run serve
```

## 📁 Estrutura

```
docs/
├── docs/                    # Arquivos Markdown da documentação
│   ├── intro.md            # Página de introdução
│   ├── guia-rapido.md      # Guia rápido de uso
│   ├── endpoints/          # Documentação dos endpoints
│   │   ├── courses.md
│   │   ├── quiz.md
│   │   └── search.md
│   └── exemplos/           # Exemplos de código
│       ├── basico.md
│       └── imagens.md
├── src/                    # Componentes React customizados
│   ├── components/
│   ├── css/
│   └── pages/
├── static/                 # Arquivos estáticos (imagens, etc)
└── docusaurus.config.ts    # Configuração do Docusaurus
```

## 📝 Conteúdo Disponível

### Introdução
- Visão geral da API
- Estatísticas
- Matérias disponíveis
- Links rápidos

### Guia Rápido
- Instalação e configuração
- Primeiras requisições
- Exemplos básicos

### Endpoints
- **Courses**: Gerenciamento de matérias
- **Quiz**: Geração e validação de simulados
- **Search**: Busca inteligente de questões

### Exemplos
- Código JavaScript pronto para usar
- Integração com React e Vue
- Trabalhar com questões com imagens

## 🎨 Personalização

### Modificar Tema

Edite `src/css/custom.css` para customizar cores e estilos.

### Adicionar Páginas

Crie arquivos `.md` ou `.mdx` em `docs/` ou componentes React em `src/pages/`.

### Modificar Navbar

Edite `docusaurus.config.ts` na seção `themeConfig.navbar`.

## 🌐 Deploy

### GitHub Pages

```bash
npm run deploy
```

### Netlify / Vercel

1. Faça build: `npm run build`
2. Faça deploy da pasta `build/`

## 📖 Documentação do Docusaurus

- [Site oficial](https://docusaurus.io/)
- [Tutorial](https://tutorial.docusaurus.io)
- [Guia de Markdown](https://docusaurus.io/docs/markdown-features)

## ✨ Features Implementadas

- ✅ Navegação lateral organizada
- ✅ Syntax highlighting para código
- ✅ Modo escuro automático
- ✅ Busca integrada
- ✅ Responsivo (mobile-friendly)
- ✅ SEO otimizado
- ✅ Página inicial customizada
- ✅ Exemplos de código interativos

## 🔗 Links

- API: http://localhost:3000
- Documentação: http://localhost:3001
- Repositório: https://github.com/seu-usuario/simulador-ads

