import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime
import io

# Configuração da página
st.set_page_config(
    page_title="Análise de Dados - Alunos Química",
    page_icon="🧪",
    layout="wide",
    initial_sidebar_state="expanded"
)

# CSS customizado
st.markdown("""
<style>
    .main-header {
        font-size: 3rem;
        color: #2c3e50;
        text-align: center;
        margin-bottom: 2rem;
        background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
    
    .metric-card {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 1rem;
        border-radius: 10px;
        color: white;
        text-align: center;
        margin: 0.5rem 0;
    }
    
    .stDataFrame {
        border-radius: 10px;
        overflow: hidden;
    }
    
    .success-box {
        background-color: #d4edda;
        border: 1px solid #c3e6cb;
        border-radius: 5px;
        padding: 1rem;
        margin: 1rem 0;
    }
</style>
""", unsafe_allow_html=True)

def load_and_process_data(uploaded_file):
    """Carrega e processa os dados do arquivo Excel"""
    try:
        # Ler as abas
        df_pagina1 = pd.read_excel(uploaded_file, sheet_name="Página1")
        df_pagina2 = pd.read_excel(uploaded_file, sheet_name="Página2")
        
        # Criar dataset unificado
        df_unified = df_pagina1.copy()
        
        # Adicionar colunas únicas da Página2
        colunas_pagina2_unicas = ['Nome do Polo', 'Turma']
        for col in colunas_pagina2_unicas:
            if col in df_pagina2.columns:
                df_unified[col] = None
        
        # Preencher dados da Página2 onde há CPFs em comum
        cpfs_pagina1 = set(df_pagina1['CPF'].dropna())
        cpfs_pagina2 = set(df_pagina2['CPF'].dropna())
        cpfs_comuns = cpfs_pagina1.intersection(cpfs_pagina2)
        
        for cpf in cpfs_comuns:
            dados_pagina2 = df_pagina2[df_pagina2['CPF'] == cpf]
            if not dados_pagina2.empty:
                mask = df_unified['CPF'] == cpf
                for col in ['Nome do Polo', 'Turma']:
                    if col in dados_pagina2.columns:
                        valor = dados_pagina2[col].iloc[0]
                        if pd.notna(valor):
                            df_unified.loc[mask, col] = valor
        
        # Adicionar registros únicos da Página2
        cpfs_apenas_pagina2 = cpfs_pagina2 - cpfs_pagina1
        if cpfs_apenas_pagina2:
            df_pagina2_unicos = df_pagina2[df_pagina2['CPF'].isin(cpfs_apenas_pagina2)].copy()
            df_unified = pd.concat([df_unified, df_pagina2_unicos], ignore_index=True, sort=False)
        
        return df_unified, df_pagina1, df_pagina2, cpfs_comuns
        
    except Exception as e:
        st.error(f"Erro ao processar o arquivo: {e}")
        return None, None, None, None

def create_analytics_dashboard(df_unified):
    """Cria dashboard com análises dos dados"""
    
    # Métricas principais
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.metric(
            label="📊 Total de Alunos",
            value=len(df_unified),
            delta=f"{df_unified['CPF'].nunique()} CPFs únicos"
        )
    
    with col2:
        situacoes = df_unified['SITUACAO'].value_counts()
        st.metric(
            label="✅ Alunos Ativos",
            value=situacoes.get('Ativo', 0),
            delta=f"{situacoes.get('Ativo', 0)/len(df_unified)*100:.1f}% do total"
        )
    
    with col3:
        evadidos = df_unified['ANO_EVASAO'].notna().sum()
        st.metric(
            label="📉 Alunos Evadidos",
            value=evadidos,
            delta=f"{evadidos/len(df_unified)*100:.1f}% do total"
        )
    
    with col4:
        polos_unicos = df_unified['Nome do Polo'].nunique() if 'Nome do Polo' in df_unified.columns else 0
        st.metric(
            label="🏫 Polos Atendidos",
            value=polos_unicos,
            delta="Diversos locais"
        )

def create_visualizations(df_unified):
    """Cria visualizações dos dados"""
    
    st.subheader("📈 Visualizações dos Dados")
    
    col1, col2 = st.columns(2)
    
    with col1:
        # Gráfico de situação dos alunos
        situacoes = df_unified['SITUACAO'].value_counts()
        fig_situacao = px.pie(
            values=situacoes.values,
            names=situacoes.index,
            title="Distribuição por Situação",
            color_discrete_sequence=px.colors.qualitative.Set3
        )
        fig_situacao.update_traces(textposition='inside', textinfo='percent+label')
        st.plotly_chart(fig_situacao, use_container_width=True)
    
    with col2:
        # Gráfico de evasão por ano
        if 'ANO_EVASAO' in df_unified.columns:
            anos_evasao = df_unified['ANO_EVASAO'].dropna().value_counts().sort_index()
            fig_evasao = px.bar(
                x=anos_evasao.index,
                y=anos_evasao.values,
                title="Evasão por Ano",
                labels={'x': 'Ano', 'y': 'Número de Evasões'},
                color=anos_evasao.values,
                color_continuous_scale='Reds'
            )
            st.plotly_chart(fig_evasao, use_container_width=True)

def main():
    # Cabeçalho principal
    st.markdown('<h1 class="main-header">🧪 Análise de Dados - Alunos Química</h1>', unsafe_allow_html=True)
    st.markdown("### Sistema de Cruzamento e Análise de Dados por CPF")
    
    # Sidebar para upload
    st.sidebar.header("📁 Upload de Arquivo")
    uploaded_file = st.sidebar.file_uploader(
        "Escolha o arquivo Excel com os dados dos alunos",
        type=['xlsx', 'xls'],
        help="Arquivo deve conter as abas 'Página1' e 'Página2'"
    )
    
    if uploaded_file is not None:
        # Processar dados
        with st.spinner("Processando dados..."):
            df_unified, df_pagina1, df_pagina2, cpfs_comuns = load_and_process_data(uploaded_file)
        
        if df_unified is not None:
            st.success(f"✅ Arquivo processado com sucesso! {len(df_unified)} registros carregados.")
            
            # Mostrar estatísticas do processamento
            with st.expander("📊 Estatísticas do Processamento"):
                col1, col2, col3 = st.columns(3)
                with col1:
                    st.metric("Registros Página1", len(df_pagina1))
                with col2:
                    st.metric("Registros Página2", len(df_pagina2))
                with col3:
                    st.metric("CPFs em Comum", len(cpfs_comuns))
            
            # Dashboard principal
            create_analytics_dashboard(df_unified)
            
            # Visualizações
            create_visualizations(df_unified)
            
            # Filtros e busca
            st.subheader("🔍 Busca e Filtros")
            
            col1, col2, col3 = st.columns(3)
            
            with col1:
                search_term = st.text_input("🔍 Buscar por CPF, Nome ou Matrícula:")
            
            with col2:
                situacao_filter = st.selectbox(
                    "📋 Filtrar por Situação:",
                    options=['Todos'] + list(df_unified['SITUACAO'].unique())
                )
            
            with col3:
                polo_filter = st.selectbox(
                    "🏫 Filtrar por Polo:",
                    options=['Todos'] + (list(df_unified['Nome do Polo'].dropna().unique()) if 'Nome do Polo' in df_unified.columns else [])
                )
            
            # Aplicar filtros
            df_filtered = df_unified.copy()
            
            if search_term:
                mask = (
                    df_filtered['CPF'].astype(str).str.contains(search_term, case=False, na=False) |
                    df_filtered['NOME_ALUNO'].astype(str).str.contains(search_term, case=False, na=False) |
                    df_filtered['MATR_ALUNO'].astype(str).str.contains(search_term, case=False, na=False)
                )
                df_filtered = df_filtered[mask]
            
            if situacao_filter != 'Todos':
                df_filtered = df_filtered[df_filtered['SITUACAO'] == situacao_filter]
            
            if polo_filter != 'Todos' and 'Nome do Polo' in df_filtered.columns:
                df_filtered = df_filtered[df_filtered['Nome do Polo'] == polo_filter]
            
            # Mostrar dados filtrados
            st.subheader(f"📋 Dados Filtrados ({len(df_filtered)} registros)")
            
            # Selecionar colunas para exibir
            colunas_disponiveis = df_filtered.columns.tolist()
            colunas_selecionadas = st.multiselect(
                "Selecione as colunas para exibir:",
                options=colunas_disponiveis,
                default=['CPF', 'NOME_ALUNO', 'MATR_ALUNO', 'SITUACAO', 'EMAIL', 'Nome do Polo', 'Turma']
            )
            
            if colunas_selecionadas:
                st.dataframe(
                    df_filtered[colunas_selecionadas],
                    use_container_width=True,
                    height=400
                )
            
            # Botão para download
            st.subheader("💾 Download dos Dados")
            
            col1, col2, col3 = st.columns(3)
            
            with col1:
                # Download dados filtrados
                csv_filtered = df_filtered.to_csv(index=False)
                st.download_button(
                    label="📄 Baixar Dados Filtrados (CSV)",
                    data=csv_filtered,
                    file_name=f"dados_filtrados_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv",
                    mime="text/csv"
                )
            
            with col2:
                # Download dados completos
                csv_completo = df_unified.to_csv(index=False)
                st.download_button(
                    label="📊 Baixar Dados Completos (CSV)",
                    data=csv_completo,
                    file_name=f"dados_completos_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv",
                    mime="text/csv"
                )
            
            with col3:
                # Download Excel
                output = io.BytesIO()
                with pd.ExcelWriter(output, engine='openpyxl') as writer:
                    df_unified.to_excel(writer, sheet_name='Dados_Unificados', index=False)
                    if df_pagina1 is not None:
                        df_pagina1.to_excel(writer, sheet_name='Página1_Original', index=False)
                    if df_pagina2 is not None:
                        df_pagina2.to_excel(writer, sheet_name='Página2_Original', index=False)
                
                st.download_button(
                    label="📋 Baixar Excel Completo",
                    data=output.getvalue(),
                    file_name=f"dados_unificados_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx",
                    mime="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                )
            
            # Relatório de análise
            with st.expander("📊 Relatório de Análise Detalhada"):
                st.subheader("Resumo Executivo")
                
                col1, col2 = st.columns(2)
                
                with col1:
                    st.write("**Dados Originais:**")
                    st.write(f"- Página1: {len(df_pagina1)} registros")
                    st.write(f"- Página2: {len(df_pagina2)} registros")
                    st.write(f"- CPFs em comum: {len(cpfs_comuns)}")
                
                with col2:
                    st.write("**Dados Unificados:**")
                    st.write(f"- Total de registros: {len(df_unified)}")
                    st.write(f"- CPFs únicos: {df_unified['CPF'].nunique()}")
                    st.write(f"- Novos registros adicionados: {len(df_unified) - len(df_pagina1)}")
                
                # Estatísticas por polo
                if 'Nome do Polo' in df_unified.columns:
                    st.subheader("Distribuição por Polo")
                    polos_stats = df_unified['Nome do Polo'].value_counts()
                    st.bar_chart(polos_stats)
    
    else:
        # Página inicial
        st.markdown("""
        ## 🎯 Bem-vindo ao Sistema de Análise de Dados
        
        Este sistema permite:
        
        ### ✨ Funcionalidades Principais:
        - **📊 Cruzamento de Dados**: Une informações das duas abas pelo CPF
        - **🔍 Busca Inteligente**: Encontre alunos por CPF, nome ou matrícula
        - **📈 Visualizações**: Gráficos e estatísticas dos dados
        - **📋 Filtros Avançados**: Filtre por situação, polo, etc.
        - **💾 Exportação**: Baixe dados em CSV ou Excel
        
        ### 📁 Como Usar:
        1. **Upload**: Carregue seu arquivo Excel na barra lateral
        2. **Processamento**: O sistema unifica automaticamente os dados
        3. **Análise**: Explore os dados com filtros e visualizações
        4. **Download**: Exporte os resultados processados
        
        ### 🎯 Resultados Esperados:
        - Dados unificados e completos
        - Eliminação de duplicatas
        - Informações complementares das duas fontes
        - Relatórios automáticos de análise
        """)
        
        # Exemplo de uso
        st.subheader("📝 Exemplo de Estrutura do Arquivo")
        st.markdown("""
        Seu arquivo Excel deve conter:
        - **Aba 'Página1'**: Dados mais completos (nome, CPF, email, telefone, etc.)
        - **Aba 'Página2'**: Dados complementares (polo, turma, etc.)
        - **Campo CPF**: Usado como chave para cruzamento dos dados
        """)

if __name__ == "__main__":
    main()
