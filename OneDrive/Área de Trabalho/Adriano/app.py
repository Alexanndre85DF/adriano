import streamlit as st
import pandas as pd

# Configuração da página
st.set_page_config(
    page_title="Análise de Dados - Alunos Química",
    page_icon="🧪",
    layout="wide"
)

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

def main():
    # Cabeçalho principal
    st.title("🧪 Análise de Dados - Alunos Química")
    st.subheader("Sistema de Cruzamento e Análise de Dados por CPF")
    
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
            
            # Métricas principais
            col1, col2, col3, col4 = st.columns(4)
            
            with col1:
                st.metric("📊 Total de Alunos", len(df_unified))
            
            with col2:
                st.metric("🆔 CPFs Únicos", df_unified['CPF'].nunique())
            
            with col3:
                st.metric("🔄 Dados Cruzados", len(cpfs_comuns))
            
            with col4:
                novos_registros = len(df_unified) - len(df_pagina1)
                st.metric("➕ Novos Registros", novos_registros)
            
            # Filtros e busca
            st.subheader("🔍 Busca e Filtros")
            
            col1, col2 = st.columns(2)
            
            with col1:
                search_term = st.text_input("🔍 Buscar por CPF, Nome ou Matrícula:")
            
            with col2:
                situacao_filter = st.selectbox(
                    "📋 Filtrar por Situação:",
                    options=['Todos'] + list(df_unified['SITUACAO'].unique())
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
            
            # Mostrar dados filtrados
            st.subheader(f"📋 Dados Filtrados ({len(df_filtered)} registros)")
            
            # Selecionar colunas para exibir
            colunas_disponiveis = df_filtered.columns.tolist()
            colunas_padrao = ['CPF', 'NOME_ALUNO', 'MATR_ALUNO', 'SITUACAO']
            if 'EMAIL' in colunas_disponiveis:
                colunas_padrao.append('EMAIL')
            if 'Nome do Polo' in colunas_disponiveis:
                colunas_padrao.append('Nome do Polo')
            if 'Turma' in colunas_disponiveis:
                colunas_padrao.append('Turma')
            
            colunas_selecionadas = st.multiselect(
                "Selecione as colunas para exibir:",
                options=colunas_disponiveis,
                default=colunas_padrao
            )
            
            if colunas_selecionadas:
                st.dataframe(df_filtered[colunas_selecionadas], use_container_width=True)
            
            # Download dos dados
            st.subheader("💾 Download dos Dados")
            
            col1, col2 = st.columns(2)
            
            with col1:
                csv_filtered = df_filtered.to_csv(index=False)
                st.download_button(
                    label="📄 Baixar Dados Filtrados (CSV)",
                    data=csv_filtered,
                    file_name="dados_filtrados.csv",
                    mime="text/csv"
                )
            
            with col2:
                csv_completo = df_unified.to_csv(index=False)
                st.download_button(
                    label="📊 Baixar Dados Completos (CSV)",
                    data=csv_completo,
                    file_name="dados_completos.csv",
                    mime="text/csv"
                )
    
    else:
        # Página inicial
        st.markdown("""
        ## 🎯 Bem-vindo ao Sistema de Análise de Dados
        
        Este sistema permite:
        
        ### ✨ Funcionalidades Principais:
        - **📊 Cruzamento de Dados**: Une informações das duas abas pelo CPF
        - **🔍 Busca Inteligente**: Encontre alunos por CPF, nome ou matrícula
        - **📋 Filtros Avançados**: Filtre por situação, polo, etc.
        - **💾 Exportação**: Baixe dados em CSV
        
        ### 📁 Como Usar:
        1. **Upload**: Carregue seu arquivo Excel na barra lateral
        2. **Processamento**: O sistema unifica automaticamente os dados
        3. **Análise**: Explore os dados com filtros
        4. **Download**: Exporte os resultados processados
        
        ### 🎯 Resultados Esperados:
        - Dados unificados e completos
        - Eliminação de duplicatas
        - Informações complementares das duas fontes
        """)

if __name__ == "__main__":
    main()
