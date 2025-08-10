# Alex Morallis - Guardião da Democracia

Um jogo RPG narrativo interativo onde você assume o papel de **Alex Morallis**, Guardião da Ordem Constitucional, em uma missão para proteger a democracia brasileira contra o grupo radical "Os Uniformes".

## 🎮 Sobre o Jogo

- **Gênero**: RPG Narrativo / Visual Novel
- **Tema**: Política, Democracia, Constituição
- **Plataforma**: Navegador Web (React + Tailwind CSS)
- **Deploy**: Netlify

## 🚀 Funcionalidades

### Sistema de Narrativa
- **6 capítulos** com múltiplas escolhas
- **Sistema de consequências** que afetam o final
- **Narrativa ramificada** baseada em decisões morais e políticas

### Sistema de Batalha
- **Combate por turnos** contra Capitão Botanagua
- **3 ações disponíveis**: Atacar, Defender, Poder Supremo
- **Barras de vida e poder** com feedback visual
- **Log de batalha** em tempo real

### Interface
- **Design responsivo** com Tailwind CSS
- **Cores patrióticas** (verde e amarelo do Brasil)
- **Animações suaves** e feedback visual
- **Ícones do Lucide React**
- **Seção "Como Jogar"** com explicações detalhadas das regras

### Sistema de Status
- **Vida**: Afetada por batalhas
- **Poder**: Consumido por habilidades especiais
- **Reputação**: Afetada por decisões políticas
- **Pontos Constitucionais**: Medem respeito à democracia

### Guia de Jogabilidade
- **Seção "Como Jogar"**: Explicações detalhadas sobre sistemas e regras
- **Sistema de Status**: Barras visuais para vida, poder, reputação e pontos constitucionais
- **Sistema de Batalha**: Combate por turnos com 3 ações disponíveis
- **Sistema de Decisões**: Consequências que afetam o final do jogo
- **Contexto da História**: Informações sobre personagens e enredo

## 🛠️ Tecnologias Utilizadas

- **React 18** - Framework principal
- **Tailwind CSS** - Estilização
- **Lucide React** - Ícones
- **Vite** - Build tool
- **Netlify** - Deploy

## 📦 Instalação

### Pré-requisitos
- Node.js 16+ 
- npm ou yarn

### Passos

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd alex-morallis-rpg
```

2. **Instale as dependências**
```bash
npm install
```

3. **Execute em modo desenvolvimento**
```bash
npm run dev
```

4. **Acesse o jogo**
```
http://localhost:3000
```

## 🏗️ Build para Produção

```bash
npm run build
```

## 🚀 Deploy no Netlify

### Método 1: Deploy Automático
1. Conecte seu repositório GitHub ao Netlify
2. Configure as seguintes opções:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Node version**: 16 ou superior

### Método 2: Deploy Manual
1. Execute `npm run build`
2. Faça upload da pasta `dist` para o Netlify

## 🎯 Como Jogar

### Início
1. Clique em "Iniciar Jornada" no menu principal
2. Para entender as regras, clique em "Como Jogar" no menu
3. Leia a narrativa e escolha suas ações
4. Cada decisão afeta sua reputação e pontos constitucionais

### Sistema de Decisões
- **Decisões constitucionais**: Aumentam pontos de constituição
- **Decisões controversas**: Podem diminuir reputação
- **Decisões equilibradas**: Mantêm estabilidade

### Batalha Final
- **Atacar**: Causa dano básico (10-30)
- **Defender**: Recupera vida (5-20)
- **Poder Supremo**: Dano alto (20-50) mas consome 30 de poder

### Finais Possíveis
- **Final Perfeito**: Reputação ≥70 e Constituição ≥60
- **Final Bom**: Reputação ≥50 e Constituição ≥40
- **Final Regular**: Reputação ≥30 e Constituição ≥20
- **Final Ruim**: Valores abaixo dos mínimos

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── DialogueBox.jsx    # Narrativa e escolhas
│   ├── Battle.jsx         # Sistema de batalha
│   └── StatusBar.jsx      # Barras de status
├── data/
│   └── story.js          # Dados da narrativa
├── App.jsx               # Componente principal
├── main.jsx              # Entry point
└── index.css             # Estilos globais
```

## 🎨 Personalização

### Cores
As cores patrióticas estão definidas em `tailwind.config.js`:
- `brasil-green`: #009739
- `brasil-yellow`: #ffcc29
- `dark-green`: #006b2e

### Narrativa
Edite `src/data/story.js` para modificar:
- Capítulos e escolhas
- Efeitos das decisões
- Finais possíveis

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto é uma obra de ficção e não representa eventos reais. Criado para fins educacionais e de entretenimento.

## 🎭 Créditos

- **Tema**: Inspirado em eventos políticos brasileiros (ficcional)
- **Design**: Interface moderna com cores patrióticas
- **Narrativa**: Sistema de escolhas com consequências morais

---

**Jogue agora e defenda a democracia brasileira! 🇧🇷** 