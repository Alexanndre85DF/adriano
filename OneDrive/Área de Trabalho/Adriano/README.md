# 🧪 Sistema de Análise de Dados - Alunos Química

Sistema para cruzamento e análise de dados acadêmicos usando CPF como chave de relacionamento.

## 📊 Análise Realizada

### Dados da Planilha:
- **Aba Página1**: 454 registros com 13 colunas (dados mais completos)
- **Aba Página2**: 421 registros com 16 colunas (dados complementares)
- **CPFs em comum**: 388 registros
- **CPFs únicos na Página1**: 62 registros
- **CPFs únicos na Página2**: 33 registros
- **Total unificado**: 487 registros

### ✅ Conclusão: SIM, é possível cruzar os dados!

## 🚀 Soluções Disponíveis

### 1. 📄 Solução HTML (`solucao_html.html`)
- Interface simples e rápida
- Funciona em qualquer navegador
- Não requer instalação de software
- Ideal para visualização básica

### 2. 🚀 Solução Streamlit (`solucao_streamlit.py`)
- Interface interativa e moderna
- Upload de arquivos Excel diretamente
- Filtros e busca em tempo real
- Visualizações e gráficos
- Relatórios automáticos
- **RECOMENDADA** para seu caso

## 📋 Como Usar

### Opção 1: HTML
1. Abra o arquivo `solucao_html.html` no navegador
2. Os dados já estão processados e prontos para visualização

### Opção 2: Streamlit (Recomendada)
1. Instale as dependências:
```bash
pip install -r requirements.txt
```

2. Execute a aplicação:
```bash
streamlit run solucao_streamlit.py
```

3. Faça upload do seu arquivo Excel
4. Explore os dados com filtros e visualizações

## 🎯 Funcionalidades

### ✨ Principais Recursos:
- **Cruzamento Automático**: Une dados das duas abas pelo CPF
- **Busca Inteligente**: Encontre alunos por CPF, nome ou matrícula
- **Filtros Avançados**: Por situação, polo, turma, etc.
- **Visualizações**: Gráficos de situação, evasão, distribuição
- **Exportação**: Download em CSV ou Excel
- **Relatórios**: Análise automática dos dados

### 📊 Dados Processados:
- Eliminação de duplicatas
- Complementação de informações
- Unificação de estruturas
- Validação de consistência

## 📁 Arquivos Gerados

- `Dados_Unificados_Quimica.xlsx`: Dataset unificado final
- `solucao_html.html`: Interface web simples
- `solucao_streamlit.py`: Aplicação interativa completa
- `requirements.txt`: Dependências Python
- `README.md`: Documentação completa

## 💡 Recomendação

**Use a solução Streamlit** porque oferece:
1. Upload fácil de novos arquivos
2. Interface muito mais amigável
3. Filtros e busca em tempo real
4. Visualizações dos dados cruzados
5. Relatórios automáticos da análise
6. Exportação flexível dos resultados

## 🔧 Suporte Técnico

Para dúvidas ou problemas:
- Verifique se o arquivo Excel tem as abas "Página1" e "Página2"
- Certifique-se de que a coluna CPF está presente em ambas as abas
- Para Streamlit, verifique se todas as dependências estão instaladas

---

**🎉 Resultado**: Sistema completo para cruzamento e análise de dados acadêmicos, com duas opções de interface para diferentes necessidades!
