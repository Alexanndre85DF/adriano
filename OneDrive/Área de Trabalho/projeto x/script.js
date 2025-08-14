// Importar variáveis do Firebase
import { auth, db } from './firebase-config.js';

// Lista completa de escolas para autocompletar
const SCHOOLS_LIST = [
    "CENTRO DE ENSINO MEDIO ARY RIBEIRO VALADAO FILHO",
    "CENTRO DE ENSINO MEDIO BOM JESUS",
    "CENTRO DE ENSINO MEDIO DE GURUPI",
    "CENTRO DE ENSINO MÉDIO DE GURUPI",
    "COL DE TECELAGEM ART NSA SENHORA AUXILIADORA",
    "COL EST ALAIR SENA CONCEICAO",
    "COLEGIO AGRICOLA DOM BOSCO",
    "COLÉGIO ESTADUAL ADELAIDE FRANCISCO SOARES",
    "COLEGIO ESTADUAL ANITA CASSIMIRO MORENO",
    "COLEGIO ESTADUAL BENEDITO PEREIRA BANDEIRA",
    "COLEGIO ESTADUAL CANDIDO FIGUEIRA",
    "COLEGIO ESTADUAL DE ALVORADA",
    "COLEGIO ESTADUAL DE TALISMA",
    "COLEGIO ESTADUAL DOM ALANO",
    "COLEGIO ESTADUAL ELSEBAO LIMA",
    "COLEGIO ESTADUAL FAMILIA AGRICOLA JOSE PORFIRIO DE SOUZA",
    "COLEGIO ESTADUAL GIRASSOL DE TEMPO INTEGRAL JOSE SEABRA LEMOS",
    "COLEGIO ESTADUAL JOAO TAVARES MARTINS",
    "COLEGIO ESTADUAL NOSSA SENHORA APARECIDA",
    "COLEGIO ESTADUAL OLAVO BILAC",
    "COLEGIO ESTADUAL PORTO DO RIO MARANHAO",
    "COLEGIO ESTADUAL POSITIVO DE GURUPI",
    "COLEGIO ESTADUAL PROFESSORA ONEIDES ROSA DE MOURA",
    "COLEGIO ESTADUAL REGINA SIQUEIRA CAMPOS",
    "COLEGIO ESTADUAL TARSO DUTRA",
    "COLEGIO ESTADUAL TIRADENTES",
    "COLEGIO MILITAR DO ESTADO DO TOCANTINS - ADJULIO BALTHAZAR",
    "COLEGIO MILITAR DO ESTADO DO TOCANTINS - PROFESSORA MARIA",
    "COLEGIO MILITAR DO ESTADO DO TOCANTINS PRESIDENTE COSTA E SILVA",
    "ESC DE TEC ART NOSSA SRA AUXILIADORA",
    "ESC EST RETIRO",
    "ESC EST TANCREDO DE ALMEIDA NEVES",
    "ESCOLA ESTADUAL ANA MARIA DE JESUS",
    "ESCOLA ESTADUAL DR JOAQUIM PEREIRA DA COSTA",
    "ESCOLA ESTADUAL FE E ALEGRIA PAROQUIAL BERNARDO SAYAO",
    "ESCOLA ESTADUAL GERCINA BORGES TEIXEIRA",
    "ESCOLA ESTADUAL HERCILIA CARVALHO DA SILVA",
    "ESCOLA ESTADUAL NOSSA SENHORA DO CARMO",
    "ESCOLA ESTADUAL OLAVO BILAC",
    "ESCOLA ESTADUAL PADRE JOSE DE ANCHIETA",
    "ESCOLA ESTADUAL PASSO A PASSO",
    "ESCOLA ESTADUAL PRESBITERIANA ARAGUAIA",
    "ESCOLA ESTADUAL PRESBITERIANA EDUCACIONAL",
    "ESCOLA ESTADUAL RUI BARBOSA",
    "ESCOLA ESTADUAL SALVADOR CAETANO",
    "ESCOLA ESTADUAL VALDIR LINS",
    "ESCOLA ESTADUAL VILA GUARACY",
    "ESCOLA INDIGENA BARRA DO RIO VERDE",
    "ESCOLA INDIGENA IJANARI",
    "ESCOLA INDIGENA IJAWALA",
    "ESCOLA INDIGENA SANAWE",
    "ESCOLA INDIGENA TAINA",
    "ESCOLA INDIGENA TEMANARE",
    "ESCOLA INDIGENA TEWADURE",
    "ESCOLA INDIGENA TXUIRI-HINA",
    "ESCOLA INDIGENA WAHURI",
    "ESCOLA INDIGENA WATAKURI",
    "INSTITUTO EDUCACIONAL PASSO A PASSO"
];

// Lista completa de municípios para autocompletar
const MUNICIPALITIES_LIST = [
    "Alvorada",
    "Araguaçu",
    "Cariri do Tocantins",
    "Crixás do Tocantins",
    "Dueré",
    "Figueirópolis",
    "Formoso do Araguaia",
    "Gurupi",
    "Jaú do Tocantins",
    "Palmeirópolis",
    "Peixe",
    "Sandolândia",
    "São Salvador do Tocantins",
    "São Valério",
    "Sucupira",
    "Talismã"
];

// Função para gerar o HTML do datalist de escolas
function generateSchoolsDatalist() {
    return SCHOOLS_LIST.map(school => `<option value="${school}">`).join('');
}

// Função para atualizar todos os datalists de escolas
function updateAllSchoolsDatalists() {
    const datalists = document.querySelectorAll('datalist[id="schoolsList"]');
    datalists.forEach(datalist => {
        datalist.innerHTML = generateSchoolsDatalist();
    });
}

// Função para atualizar todos os dropdowns de municípios
function updateAllMunicipalitiesDropdowns() {
    const municipalitySelects = document.querySelectorAll('select[id="municipality"]');
    municipalitySelects.forEach(select => {
        // Manter a primeira opção (Selecione o município)
        const firstOption = select.querySelector('option[value=""]');
        select.innerHTML = '';
        if (firstOption) {
            select.appendChild(firstOption);
        }
        
        // Adicionar as opções da lista real
        MUNICIPALITIES_LIST.forEach(municipality => {
            const option = document.createElement('option');
            option.value = municipality;
            option.textContent = municipality;
            select.appendChild(option);
        });
    });
}

// Função para gerar o HTML do dropdown de municípios
function generateMunicipalitiesDropdown() {
    return MUNICIPALITIES_LIST.map(municipality => 
        `<option value="${municipality}">${municipality}</option>`
    ).join('');
}

// Função para lidar com o login
async function handleLogin(e) {
    e.preventDefault();
    
    const cpfEmail = document.getElementById('cpfEmail').value.trim();
    const password = document.getElementById('password').value;
    
    // Verificar se é o super admin
    if (cpfEmail === "01099080150" && password === "brasilia85") {
        // Super admin - ir para painel admin
        showAdminPanel();
        return;
    }
    
    // Para usuários normais, buscar diretamente no Firestore
    try {
        await searchUserByCPF(cpfEmail, password);
    } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        alert("Erro ao fazer login. Verifique suas credenciais.");
    }
}

// Função para mostrar dashboard
function showDashboard() {
    document.body.innerHTML = `
        <div class="dashboard-container">
            <header class="admin-header">
                <h1>Dashboard do Usuário</h1>
                <button class="logout-btn" onclick="logout()">Sair</button>
            </header>
            
            <div class="admin-content">
                <div class="admin-section">
                    <div class="notification-area">
                        <div class="notification-icon">
                            <i class="fas fa-bell"></i>
                            <span class="notification-count">0</span>
                        </div>
                        <div class="error-banner">
                            Erro ao carregar avisos
                        </div>
                    </div>
                </div>
                
                <div class="admin-section">
                    <h2>Menu Principal</h2>
                    <div class="menu-buttons">
                        <button class="menu-btn primary" onclick="generateAssessment()">
                            Gerar Monitoramento
                        </button>
                        <button class="menu-btn primary" onclick="viewAssessment()">
                            Registros
                        </button>
                        <button class="menu-btn primary" onclick="viewAll()">
                            Visualizar Todos
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Carregar avisos após mostrar o dashboard
    loadNotices();
}

// Função para mostrar painel admin
function showAdminPanel() {
    document.body.innerHTML = `
        <div class="admin-container">
            <header class="admin-header">
                <h1>Painel de Administração</h1>
                <button class="logout-btn" onclick="logout()">Sair</button>
            </header>
            
            <div class="admin-content">
                <div class="admin-section">
                    <h2>Gerenciar Usuários</h2>
                    <button class="admin-btn" onclick="showUserForm()">Cadastrar Novo Usuário</button>
                    <button class="admin-btn" onclick="listUsers()">Listar Usuários</button>
                </div>
                
                <div class="admin-section">
                    <h2>Gerenciar Monitoramentos</h2>
                    <button class="admin-btn" onclick="generateAssessment()">Gerar Monitoramento</button>
                    <button class="admin-btn" onclick="viewAssessment()">Registros</button>
                    <button class="admin-btn" onclick="viewAll()">Visualizar Todos</button>
                </div>
                
                <div class="admin-section">
                    <h2>Gerenciar Avisos</h2>
                    <button class="admin-btn" onclick="showNoticeForm()">Criar Novo Aviso</button>
                    <button class="admin-btn" onclick="listNotices()">Gerenciar Avisos</button>
                </div>
            </div>
        </div>
    `;
    
    // Carregar avisos após mostrar o painel admin
    loadNotices();
}

// Funções do dashboard
function generateAssessment() {
    document.body.innerHTML = `
        <div class="dashboard-container">
            <header class="admin-header">
                <h1>Gerar Monitoramento</h1>
                <button class="logout-btn" onclick="logout()">Sair</button>
            </header>
            
            <div class="admin-content">
                <div class="admin-section">
                    <h2>Selecione o tipo de monitoramento</h2>
                    <p style="text-align: center; color: #7f8c8d; margin-bottom: 30px;">
                        Escolha uma das opções abaixo para gerar seu monitoramento
                    </p>
                    
                    <div class="menu-buttons">
                        <button class="menu-btn primary" onclick="openAssessmentForm('Currículo')">
                            <strong>Currículo</strong>
                        </button>
                        
                        <button class="menu-btn primary" onclick="openAssessmentForm('Supervisão')">
                            <strong>Supervisão</strong>
                        </button>
                        
                        <button class="menu-btn primary" onclick="openAssessmentForm('Equipe Multiprofissional')">
                            <strong>Equipe Multiprofissional</strong>
                        </button>
                    </div>
                    
                    <div style="text-align: center; margin-top: 30px;">
                        <button class="admin-btn" onclick="goBack()">Voltar ao Menu</button>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Função para voltar ao menu principal
function goBack() {
    // Verificar se é admin ou usuário normal para voltar para a tela correta
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.role === 'admin') {
        showAdminPanel();
    } else {
        showDashboard();
    }
}

// Função para abrir formulário específico do assessoramento
function openAssessmentForm(type) {
    document.body.innerHTML = `
        <div class="dashboard-container">
            <header class="admin-header">
                <h1>Gerar Monitoramento - ${type}</h1>
                <button class="logout-btn" onclick="logout()">Sair</button>
            </header>
            
            <div class="admin-content">
                <div class="admin-section">
                    <h2>Selecione o tipo de questionário</h2>
                    <p style="text-align: center; color: #7f8c8d; margin-bottom: 30px;">
                        Escolha um dos questionários abaixo para preencher
                    </p>
                    
                    <div class="menu-buttons questionnaire-layout">
                        <button class="menu-btn primary" onclick="openQuestionnaire('${type}', 'Frequência dos Estudantes')">
                            <strong>Frequência dos Estudantes</strong>
                        </button>
                        
                        <button class="menu-btn primary" onclick="openQuestionnaire('${type}', 'Frequência da Busca Ativa')">
                            <strong>Frequência da Busca Ativa</strong>
                        </button>
                        
                        <button class="menu-btn primary" onclick="openQuestionnaire('${type}', 'Aulas Previstas e Aulas Dadas')">
                            <strong>Aulas Previstas e Aulas Dadas</strong>
                        </button>
                        
                        <button class="menu-btn primary" onclick="openQuestionnaire('${type}', 'Estudantes Abaixo da Média')">
                            <strong>Estudantes Abaixo da Média</strong>
                        </button>
                    </div>
                    
                    <div style="text-align: center; margin-top: 30px;">
                        <button class="admin-btn" onclick="goBack()">Voltar ao Menu</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Função para abrir questionário específico
function openQuestionnaire(assessmentType, questionnaireType) {
    let formHTML = '';
    
    switch(questionnaireType) {
        case 'Frequência dos Estudantes':
            formHTML = createStudentFrequencyForm(assessmentType, questionnaireType);
            break;
        case 'Frequência da Busca Ativa':
            formHTML = createActiveSearchForm(assessmentType, questionnaireType);
            break;
        case 'Aulas Previstas e Aulas Dadas':
            formHTML = createClassesForm(assessmentType, questionnaireType);
            break;
        case 'Estudantes Abaixo da Média':
            formHTML = createBelowAverageForm(assessmentType, questionnaireType);
            break;
    }
    
    document.body.innerHTML = formHTML;
    
    // Atualizar todos os datalists de escolas
    updateAllSchoolsDatalists();
    
    // Atualizar todos os dropdowns de municípios
    updateAllMunicipalitiesDropdowns();
}

// Formulário de Frequência dos Estudantes
function createStudentFrequencyForm(assessmentType, questionnaireType) {
    return `
        <div class="dashboard-container">
            <header class="admin-header">
                <h1>${questionnaireType} - ${assessmentType}</h1>
                <button class="logout-btn" onclick="logout()">Sair</button>
            </header>
            
            <div class="admin-content">
                <form id="studentFrequencyForm" onsubmit="saveQuestionnaire(event)">
                    <input type="hidden" id="assessmentType" value="${assessmentType}">
                    <input type="hidden" id="questionnaireType" value="${questionnaireType}">
                    
                    <div class="admin-section">
                        <h3>Informações Gerais</h3>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Técnico que está registrando:</label>
                                <input type="text" id="technicianName" placeholder="Nome do técnico" required>
                            </div>
                            <div class="form-group">
                                <label>Escola:</label>
                                <input type="text" id="schoolName" list="schoolsList" placeholder="Nome da escola" required>
                                <datalist id="schoolsList">
                                    <option value="Escola A">
                                    <option value="Escola B">
                                    <option value="Escola C">
                                </datalist>
                            </div>
                            <div class="form-group">
                                <label>Município:</label>
                                <select id="municipality" required>
                                    <option value="">Selecione o município</option>
                                    <option value="Município A">Município A</option>
                                    <option value="Município B">Município B</option>
                                    <option value="Município C">Município C</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Data:</label>
                                <input type="date" id="registrationDate" required>
                            </div>
                        </div>
                    </div>
                    
                                         <div class="admin-section">
                         <h3>Turma 1</h3>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Data de Referência:</label>
                                <input type="date" id="referenceDate" required>
                            </div>
                            <div class="form-group">
                                <label>ID da Turma:</label>
                                <input type="text" id="classId" required>
                            </div>
                            <div class="form-group">
                                <label>Nome da Turma:</label>
                                <input type="text" id="className" required>
                            </div>
                                                         <div class="form-group">
                                 <label>Etapa:</label>
                                 <select id="stage" required>
                                     <option value="">Selecione</option>
                                     <option value="Ensino Fundamental">Ensino Fundamental</option>
                                     <option value="Ensino Médio">Ensino Médio</option>
                                 </select>
                             </div>
                        </div>
                        <button type="button" class="admin-btn delete" onclick="removeClass(this)">Remover Turma</button>
                    </div>
                    
                    <div class="admin-section">
                        <h3>Estudantes da Turma</h3>
                        <button type="button" class="admin-btn" onclick="addStudent()">+ Adicionar Estudante</button>
                        
                        <div id="studentsContainer">
                            <div class="student-block">
                                <h4>Estudante 1</h4>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label>Nome do(a) estudante:</label>
                                        <input type="text" name="studentName[]" placeholder="Nome completo" required>
                                    </div>
                                    <div class="form-group">
                                        <label>Nº de faltas consecutivas:</label>
                                        <input type="number" name="consecutiveAbsences[]" placeholder="0" min="0" required>
                                    </div>
                                                                         <div class="form-group">
                                         <label>Status:</label>
                                         <select name="studentStatus[]" required>
                                             <option value="">Selecione</option>
                                             <option value="Pendente">Pendente</option>
                                             <option value="Resolvido">Resolvido</option>
                                         </select>
                                     </div>
                                 </div>
                                 <button type="button" class="admin-btn delete" onclick="removeStudent(this)">Remover</button>
                             </div>
                         </div>
                     </div>
                    
                    <div class="admin-section">
                        <h3>Observações</h3>
                        <div class="form-group">
                            <textarea id="observations" rows="6" placeholder="Observações adicionais..."></textarea>
                        </div>
                    </div>
                    
                    <div class="admin-section">
                        <h3>Links de Documentos</h3>
                        <p>Insira links para Google Drive, Google Docs, Planilhas ou outros documentos online</p>
                        <p>Ex: https://drive.google.com/... | https://docs.google.com/...</p>
                        <div class="form-group">
                            <textarea id="documentLinks" rows="6" placeholder="Cole aqui os links..."></textarea>
                        </div>
                    </div>
                    
                    <div class="admin-section">
                        <button type="button" class="admin-btn" onclick="addClass()">+ Adicionar Nova Turma</button>
                    </div>
                    
                    <div class="form-buttons">
                        <button type="submit" class="admin-btn">Salvar Monitoramento</button>
                        <button type="button" class="admin-btn secondary" onclick="goBackToAssessment()">Voltar</button>
                    </div>
                </form>
            </div>
        </div>
    `;
}

// Formulário de Frequência da Busca Ativa
function createActiveSearchForm(assessmentType, questionnaireType) {
    return `
        <div class="dashboard-container">
            <header class="admin-header">
                <h1>${questionnaireType} - ${assessmentType}</h1>
                <button class="logout-btn" onclick="logout()">Sair</button>
            </header>
            
            <div class="admin-content">
                <form id="activeSearchForm" onsubmit="saveQuestionnaire(event)">
                    <input type="hidden" id="assessmentType" value="${assessmentType}">
                    <input type="hidden" id="questionnaireType" value="${questionnaireType}">
                    
                    <div class="admin-section">
                        <h3>Informações Gerais</h3>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Técnico que está registrando:</label>
                                <input type="text" id="technicianName" placeholder="Nome do técnico" required>
                            </div>
                            <div class="form-group">
                                <label>Escola:</label>
                                <input type="text" id="schoolName" list="schoolsList" placeholder="Nome da escola" required>
                                <datalist id="schoolsList">
                                    <option value="Escola A">
                                    <option value="Escola B">
                                    <option value="Escola C">
                                </datalist>
                            </div>
                            <div class="form-group">
                                <label>Município:</label>
                                <select id="municipality" required>
                                    <option value="">Selecione o município</option>
                                    <option value="Município A">Município A</option>
                                    <option value="Município B">Município B</option>
                                    <option value="Município C">Município C</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Data:</label>
                                <input type="date" id="registrationDate" required>
                            </div>
                        </div>
                    </div>
                    
                    <div class="admin-section">
                        <h3>Turmas da Busca Ativa</h3>
                        <button type="button" class="admin-btn" onclick="addActiveSearchClass()">+ Adicionar Turma</button>
                        
                        <div id="activeSearchClassesContainer">
                            <div class="admin-section">
                                <h3>Turma 1</h3>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label>Nome da Turma:</label>
                                        <input type="text" name="className[]" placeholder="Nome da turma" required>
                                    </div>
                                    <div class="form-group">
                                        <label>Turno:</label>
                                        <select name="shift[]" required>
                                            <option value="">Selecione o turno</option>
                                            <option value="Manhã">Manhã</option>
                                            <option value="Tarde">Tarde</option>
                                            <option value="Noite">Noite</option>
                                            <option value="Integral">Integral</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div class="admin-section">
                                    <h3>Estudantes da Turma</h3>
                                    <button type="button" class="admin-btn" onclick="addActiveSearchStudent(this)">+ Adicionar Estudante</button>
                                    
                                    <div class="students-container">
                                        <div class="student-block">
                                            <h4>Estudante 1</h4>
                                            <div class="form-row">
                                                <div class="form-group">
                                                    <label>Nome do(a) estudante:</label>
                                                    <input type="text" name="studentName[]" placeholder="Nome completo" required>
                                                </div>
                                                <div class="form-group">
                                                    <label>N° de faltas:</label>
                                                    <input type="number" name="absences[]" placeholder="0" min="0" value="0" required>
                                                </div>
                                            </div>
                                            
                                            <div class="form-row">
                                                <div class="form-group">
                                                    <label>Status:</label>
                                                    <div class="checkbox-group">
                                                        <label class="checkbox-label">
                                                            <input type="checkbox" name="pcd[]" value="PCD"> PCD
                                                        </label>
                                                        <label class="checkbox-label">
                                                            <input type="checkbox" name="minor[]" value="Menor de Idade"> Menor de Idade
                                                        </label>
                                                        <label class="checkbox-label">
                                                            <input type="checkbox" name="medicalCertificate[]" value="Atestado Médico"> Atestado Médico
                                                        </label>
                                                        <label class="checkbox-label">
                                                            <input type="checkbox" name="guardianship[]" value="Conselho Tutelar"> Conselho Tutelar
                                                        </label>
                                                        <label class="checkbox-label">
                                                            <input type="checkbox" name="publicProsecutor[]" value="Ministério Público"> Ministério Público
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div class="form-row">
                                                <div class="form-group">
                                                    <label>Número de Visitas:</label>
                                                    <div class="checkbox-group">
                                                        <label class="checkbox-label">
                                                            <input type="checkbox" name="visit1[]" value="1" onchange="updateVisitTotal(this)"> 1ª visita
                                                        </label>
                                                        <label class="checkbox-label">
                                                            <input type="checkbox" name="visit2[]" value="2" onchange="updateVisitTotal(this)"> 2ª visita
                                                        </label>
                                                        <label class="checkbox-label">
                                                            <input type="checkbox" name="visit3[]" value="3" onchange="updateVisitTotal(this)"> 3ª visita
                                                        </label>
                                                    </div>
                                                    <p>Total de visitas: <span class="visit-total">0</span></p>
                                                </div>
                                            </div>
                                            
                                            <button type="button" class="admin-btn delete" onclick="removeActiveSearchStudent(this)">Remover</button>
                                        </div>
                                    </div>
                                </div>
                                
                                <button type="button" class="admin-btn delete" onclick="removeActiveSearchClass(this)">Remover Turma</button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="admin-section">
                        <h3>Observações</h3>
                        <div class="form-group">
                            <textarea id="observations" rows="6" placeholder="Observações adicionais..."></textarea>
                        </div>
                    </div>
                    
                    <div class="admin-section">
                        <h3>Links de Documentos</h3>
                        <p>Insira links para Google Drive, Google Docs, Planilhas ou outros documentos online</p>
                        <p>Ex: https://drive.google.com/... | https://docs.google.com/...</p>
                        <div class="form-group">
                            <textarea id="documentLinks" rows="6" placeholder="Cole aqui os links..."></textarea>
                        </div>
                    </div>
                    
                    <div class="form-buttons">
                        <button type="submit" class="admin-btn">Salvar Monitoramento</button>
                        <button type="button" class="admin-btn secondary" onclick="goBackToAssessment()">Voltar</button>
                    </div>
                </form>
            </div>
        </div>
    `;
}

// Formulário de Aulas Previstas e Aulas Dadas
function createClassesForm(assessmentType, questionnaireType) {
    return `
        <div class="dashboard-container">
            <header class="admin-header">
                <h1>${questionnaireType} - ${assessmentType}</h1>
                <button class="logout-btn" onclick="logout()">Sair</button>
            </header>
            
            <div class="admin-content">
                <form id="classesForm" onsubmit="saveQuestionnaire(event)">
                    <input type="hidden" id="assessmentType" value="${assessmentType}">
                    <input type="hidden" id="questionnaireType" value="${questionnaireType}">
                    
                    <div class="admin-section">
                        <h3>Informações Gerais</h3>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Técnico que está registrando:</label>
                                <input type="text" id="technicianName" placeholder="Nome do técnico" required>
                            </div>
                            <div class="form-group">
                                <label>Escola:</label>
                                <input type="text" id="schoolName" list="schoolsList" placeholder="Nome da escola" required>
                                <datalist id="schoolsList">
                                    <option value="Escola A">
                                    <option value="Escola B">
                                    <option value="Escola C">
                                </datalist>
                            </div>
                            <div class="form-group">
                                <label>Município:</label>
                                <select id="municipality" required>
                                    <option value="">Selecione o município</option>
                                    <option value="Município A">Município A</option>
                                    <option value="Município B">Município B</option>
                                    <option value="Município C">Município C</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Data:</label>
                                <input type="date" id="registrationDate" required>
                            </div>
                        </div>
                    </div>
                    

                    
                    <div id="classesRecordsContainer">
                        <div class="admin-section">
                            <div class="section-header">
                                <h3>Registro 1</h3>
                                <button type="button" class="admin-btn delete" onclick="removeClassRecord(this)">Remover</button>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Data de Referência:</label>
                                    <input type="date" name="referenceDate[]" required>
                                </div>
                                <div class="form-group">
                                    <label>Nome da Turma:</label>
                                    <input type="text" name="className[]" placeholder="Nome da turma" required>
                                </div>
                                <div class="form-group">
                                    <label>Aulas Previstas no Período:</label>
                                    <input type="number" name="plannedClasses[]" placeholder="0" min="0" required onchange="calculatePercentage(this)">
                                </div>
                                <div class="form-group">
                                    <label>Nome do(a) Professor(a):</label>
                                    <input type="text" name="teacherName[]" placeholder="Nome completo" required>
                                </div>
                                <div class="form-group">
                                    <label>Situação:</label>
                                    <select name="situation[]" required>
                                        <option value="">Selecione</option>
                                        <option value="Pendente">Pendente</option>
                                        <option value="Resolvido">Resolvido</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label>ID da Turma:</label>
                                    <input type="text" name="classId[]" placeholder="ID da turma" required>
                                </div>
                                <div class="form-group">
                                    <label>Componente Curricular:</label>
                                    <input type="text" name="discipline[]" placeholder="Nome do componente curricular" required>
                                </div>
                                <div class="form-group">
                                    <label>Aulas Dadas no Período:</label>
                                    <input type="number" name="givenClasses[]" placeholder="0" min="0" required onchange="calculatePercentage(this)">
                                </div>
                                <div class="form-group">
                                    <label>Bimestre:</label>
                                    <select name="bimester[]" required>
                                        <option value="">Selecione</option>
                                        <option value="1º Bimestre">1º Bimestre</option>
                                        <option value="2º Bimestre">2º Bimestre</option>
                                        <option value="3º Bimestre">3º Bimestre</option>
                                        <option value="4º Bimestre">4º Bimestre</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>Percentual de Cumprimento:</label>
                                    <input type="text" name="completionRate[]" placeholder="0%" readonly>
                                </div>
                            </div>
                            
                            <div class="admin-section">
                                <h4>Motivos de não realização/registro:</h4>
                                <div class="checkbox-group">
                                    <label class="checkbox-label">
                                        <input type="checkbox" name="reasonTeacherAbsence[]" value="Falta do Docente"> Falta do Docente
                                    </label>
                                    <label class="checkbox-label">
                                        <input type="checkbox" name="reasonStrike[]" value="Greve/Suspensão"> Greve/Suspensão
                                    </label>
                                    <label class="checkbox-label">
                                        <input type="checkbox" name="reasonSchoolEvent[]" value="Evento Escolar"> Evento Escolar
                                    </label>
                                    <label class="checkbox-label">
                                        <input type="checkbox" name="reasonSGEUnavailable[]" value="Indisponibilidade SGE"> Indisponibilidade SGE
                                    </label>
                                    <label class="checkbox-label">
                                        <input type="checkbox" name="reasonHoliday[]" value="Feriado"> Feriado
                                    </label>
                                    <label class="checkbox-label">
                                        <input type="checkbox" name="reasonSGENotLaunched[]" value="Não Lançamento SGE Professor"> Não Lançamento SGE Professor
                                    </label>
                                    <label class="checkbox-label">
                                        <input type="checkbox" name="reasonOthers[]" value="Outros"> Outros
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="admin-section">
                        <button type="button" class="admin-btn" onclick="addClassRecord()">+ Adicionar Novo Registro</button>
                    </div>
                    
                    <div class="admin-section">
                        <h3>Observações</h3>
                        <div class="form-group">
                            <textarea id="observations" rows="6" placeholder="Observações adicionais..."></textarea>
                        </div>
                    </div>
                    
                    <div class="admin-section">
                        <h3>Links de Documentos</h3>
                        <p>Insira links para Google Drive, Google Docs, Planilhas ou outros documentos online</p>
                        <p>Ex: https://drive.google.com/... | https://docs.google.com/...</p>
                        <div class="form-group">
                            <textarea id="documentLinks" rows="6" placeholder="Cole aqui os links..."></textarea>
                        </div>
                    </div>
                    
                    <div class="form-buttons">
                        <button type="submit" class="admin-btn">Salvar Monitoramento</button>
                        <button type="button" class="admin-btn secondary" onclick="goBackToAssessment()">Voltar</button>
                    </div>
                </form>
            </div>
        </div>
    `;
}

// Formulário de Estudantes Abaixo da Média
function createBelowAverageForm(assessmentType, questionnaireType) {
    return `
        <div class="dashboard-container">
            <header class="admin-header">
                <h1>${questionnaireType} - ${assessmentType}</h1>
                <button class="logout-btn" onclick="logout()">Sair</button>
            </header>
            
            <div class="admin-content">
                <form id="belowAverageForm" onsubmit="saveQuestionnaire(event)">
                    <input type="hidden" id="assessmentType" value="${assessmentType}">
                    <input type="hidden" id="questionnaireType" value="${questionnaireType}">
                    
                    <div class="admin-section">
                        <h3>Informações Gerais</h3>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Técnico que está registrando:</label>
                                <input type="text" id="technicianName" placeholder="Nome do técnico" required>
                            </div>
                            <div class="form-group">
                                <label>Escola:</label>
                                <input type="text" id="schoolName" list="schoolsList" placeholder="Nome da escola" required>
                                <datalist id="schoolsList">
                                    <option value="Escola A">
                                    <option value="Escola B">
                                    <option value="Escola C">
                                </datalist>
                            </div>
                            <div class="form-group">
                                <label>Município:</label>
                                <select id="municipality" required>
                                    <option value="">Selecione o município</option>
                                    <option value="Município A">Município A</option>
                                    <option value="Município B">Município B</option>
                                    <option value="Município C">Município C</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Data:</label>
                                <input type="date" id="registrationDate" required>
                            </div>
                        </div>
                    </div>
                    
                    <div class="admin-section">
                        <div class="form-row">
                            <div class="form-group">
                                <label>Bimestre:</label>
                                <select id="bimester" required>
                                    <option value="">Selecione</option>
                                    <option value="1º Bimestre">1º Bimestre</option>
                                    <option value="2º Bimestre">2º Bimestre</option>
                                    <option value="3º Bimestre">3º Bimestre</option>
                                    <option value="4º Bimestre">4º Bimestre</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <div class="admin-section">
                        <div class="section-header">
                            <h3>Turmas e Estudantes</h3>
                            <button type="button" class="admin-btn" onclick="addBelowAverageClass()">+ Adicionar Turma</button>
                        </div>
                        
                        <div id="belowAverageClassesContainer">
                            <div class="admin-section">
                                <div class="section-header">
                                    <h3>Turma 1</h3>
                                    <button type="button" class="admin-btn delete" onclick="removeBelowAverageClass(this)">Remover Turma</button>
                                </div>
                                
                                <div class="form-row">
                                    <div class="form-group">
                                        <label>Nome da Turma:</label>
                                        <input type="text" name="className[]" placeholder="Nome da turma" required>
                                    </div>
                                    <div class="form-group">
                                        <label>Total de Estudantes na Turma:</label>
                                        <input type="number" name="totalStudents[]" placeholder="0" min="0" required onchange="calculateBelowAveragePercentage(this)">
                                    </div>
                                </div>
                                
                                <div class="admin-section">
                                    <h4>Estudantes Abaixo da Média</h4>
                                    <button type="button" class="admin-btn" onclick="addBelowAverageStudent(this)">+ Adicionar Estudante</button>
                                    
                                    <div class="students-container">
                                        <div class="student-block">
                                            <h5>Estudante 1</h5>
                                            <div class="form-row">
                                                <div class="form-group">
                                                    <label>Nome do(a) Estudante:</label>
                                                    <input type="text" name="studentName[]" placeholder="Nome completo" required>
                                                </div>
                                                <div class="form-group">
                                                    <label>Nota:</label>
                                                    <input type="number" name="grade[]" placeholder="0.0" min="0" max="10" step="0.1" value="0.0" required>
                                                </div>
                                                <div class="form-group">
                                                    <label>Situação:</label>
                                                    <select name="studentStatus[]" required onchange="calculateBelowAveragePercentage(this)">
                                                        <option value="">Selecione</option>
                                                        <option value="Pendente">Pendente</option>
                                                        <option value="Resolvido">Resolvido</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <button type="button" class="admin-btn delete" onclick="removeBelowAverageStudent(this)">Remover</button>
                                        </div>
                                    </div>
                                    
                                    <div class="percentage-display">
                                        <p><strong>Estudantes abaixo da média: <span class="below-average-count">0</span></strong></p>
                                        <p><strong>Percentual: <span class="below-average-percentage">0%</span></strong></p>
                                        <button type="button" class="admin-btn" onclick="calculateBelowAveragePercentage(this)">Calcular</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="admin-section">
                        <h3>Habilidades Críticas:</h3>
                        <div class="form-group">
                            <textarea id="criticalSkills" rows="6" placeholder="Liste as habilidades/descritores críticos apurados no SGE"></textarea>
                        </div>
                    </div>
                    
                    <div class="admin-section">
                        <h3>Observações:</h3>
                        <div class="form-group">
                            <textarea id="observations" rows="6" placeholder="Observações adicionais..."></textarea>
                        </div>
                    </div>
                    
                    <div class="admin-section">
                        <h3>Links de Evidências:</h3>
                        <p>Cole aqui os links (um por linha) para relatórios do SGE, planilhas no Drive, etc.</p>
                        <p>Ex.: https://... (um link por linha)</p>
                        <div class="form-group">
                            <textarea id="documentLinks" rows="6" placeholder="Cole aqui os links..."></textarea>
                        </div>
                    </div>
                    
                    <div class="form-buttons">
                        <button type="submit" class="admin-btn">Salvar Monitoramento</button>
                        <button type="button" class="admin-btn secondary" onclick="goBackToAssessment()">Voltar</button>
                    </div>
                </form>
            </div>
        </div>
    `;
}

// Funções auxiliares para os formulários
function addClass() {
    // Contar apenas as turmas (seções que começam com "Turma")
    const existingClasses = document.querySelectorAll('.admin-section h3');
    let classCount = 1;
    
    for (let h3 of existingClasses) {
        if (h3.textContent.startsWith('Turma')) {
            classCount++;
        }
    }
    
    const newClassHTML = `
        <div class="admin-section">
            <h3>Turma ${classCount}</h3>
            <div class="form-row">
                <div class="form-group">
                    <label>Data de Referência:</label>
                    <input type="date" name="referenceDate[]" required>
                </div>
                <div class="form-group">
                    <label>ID da Turma:</label>
                    <input type="text" name="classId[]" required>
                </div>
                <div class="form-group">
                    <label>Nome da Turma:</label>
                    <input type="text" name="className[]" required>
                </div>
                                 <div class="form-group">
                     <label>Etapa:</label>
                     <select name="stage[]" required>
                         <option value="">Selecione</option>
                         <option value="Ensino Fundamental">Ensino Fundamental</option>
                         <option value="Ensino Médio">Ensino Médio</option>
                     </select>
                 </div>
            </div>
            <button type="button" class="admin-btn delete" onclick="removeClass(this)">Remover Turma</button>
        </div>
    `;
    
    // Inserir antes do botão "Adicionar Nova Turma"
    const addButton = document.querySelector('button[onclick="addClass()"]');
    addButton.insertAdjacentHTML('beforebegin', newClassHTML);
}

function addStudent() {
    const studentCount = document.querySelectorAll('.student-block').length + 1;
    const newStudentHTML = `
        <div class="student-block">
            <h4>Estudante ${studentCount}</h4>
            <div class="form-row">
                <div class="form-group">
                    <label>Nome do(a) estudante:</label>
                    <input type="text" name="studentName[]" placeholder="Nome completo" required>
                </div>
                <div class="form-group">
                    <label>Nº de faltas consecutivas:</label>
                    <input type="number" name="consecutiveAbsences[]" placeholder="0" min="0" required>
                </div>
                                 <div class="form-group">
                     <label>Status:</label>
                     <select name="studentStatus[]" required>
                         <option value="">Selecione</option>
                         <option value="Pendente">Pendente</option>
                         <option value="Resolvido">Resolvido</option>
                     </select>
                 </div>
            </div>
            <button type="button" class="admin-btn delete" onclick="removeStudent(this)">Remover</button>
        </div>
    `;
    
    document.getElementById('studentsContainer').insertAdjacentHTML('beforeend', newStudentHTML);
}

function removeClass(button) {
    if (confirm('Tem certeza que deseja remover esta turma?')) {
        button.closest('.admin-section').remove();
    }
}

function removeStudent(button) {
    if (confirm('Tem certeza que deseja remover este estudante?')) {
        button.closest('.student-block').remove();
    }
}

// Funções auxiliares para Busca Ativa
function addActiveSearchClass() {
    // Contar apenas as turmas (seções que começam com "Turma")
    const existingClasses = document.querySelectorAll('#activeSearchClassesContainer .admin-section h3');
    let classCount = 1;
    
    for (let h3 of existingClasses) {
        if (h3.textContent.startsWith('Turma')) {
            classCount++;
        }
    }
    
    const newClassHTML = `
        <div class="admin-section">
            <h3>Turma ${classCount}</h3>
            <div class="form-row">
                <div class="form-group">
                    <label>Nome da Turma:</label>
                    <input type="text" name="className[]" placeholder="Nome da turma" required>
                </div>
                <div class="form-group">
                    <label>Turno:</label>
                    <select name="shift[]" required>
                        <option value="">Selecione o turno</option>
                        <option value="Manhã">Manhã</option>
                        <option value="Tarde">Tarde</option>
                        <option value="Noite">Noite</option>
                        <option value="Integral">Integral</option>
                    </select>
                </div>
            </div>
            
            <div class="admin-section">
                <h3>Estudantes da Turma</h3>
                <button type="button" class="admin-btn" onclick="addActiveSearchStudent(this)">+ Adicionar Estudante</button>
                
                <div class="students-container">
                    <div class="student-block">
                        <h4>Estudante 1</h4>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Nome do(a) estudante:</label>
                                <input type="text" name="studentName[]" placeholder="Nome completo" required>
                            </div>
                            <div class="form-group">
                                <label>N° de faltas:</label>
                                <input type="number" name="absences[]" placeholder="0" min="0" value="0" required>
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label>Status:</label>
                                <div class="checkbox-group">
                                    <label class="checkbox-label">
                                        <input type="checkbox" name="pcd[]" value="PCD"> PCD
                                    </label>
                                    <label class="checkbox-label">
                                        <input type="checkbox" name="minor[]" value="Menor de Idade"> Menor de Idade
                                    </label>
                                    <label class="checkbox-label">
                                        <input type="checkbox" name="medicalCertificate[]" value="Atestado Médico"> Atestado Médico
                                    </label>
                                    <label class="checkbox-label">
                                        <input type="checkbox" name="guardianship[]" value="Conselho Tutelar"> Conselho Tutelar
                                    </label>
                                    <label class="checkbox-label">
                                        <input type="checkbox" name="publicProsecutor[]" value="Ministério Público"> Ministério Público
                                    </label>
                                </div>
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label>Número de Visitas:</label>
                                <div class="checkbox-group">
                                    <label class="checkbox-label">
                                        <input type="checkbox" name="visit1[]" value="1" onchange="updateVisitTotal(this)"> 1ª visita
                                    </label>
                                    <label class="checkbox-label">
                                        <input type="checkbox" name="visit2[]" value="2" onchange="updateVisitTotal(this)"> 2ª visita
                                    </label>
                                    <label class="checkbox-label">
                                        <input type="checkbox" name="visit3[]" value="3" onchange="updateVisitTotal(this)"> 3ª visita
                                    </label>
                                </div>
                                <p>Total de visitas: <span class="visit-total">0</span></p>
                            </div>
                        </div>
                        
                        <button type="button" class="admin-btn delete" onclick="removeActiveSearchStudent(this)">Remover</button>
                    </div>
                </div>
            </div>
            
            <button type="button" class="admin-btn delete" onclick="removeActiveSearchClass(this)">Remover Turma</button>
        </div>
    `;
    
    document.getElementById('activeSearchClassesContainer').insertAdjacentHTML('beforeend', newClassHTML);
}

function addActiveSearchStudent(button) {
    const studentContainer = button.nextElementSibling;
    const studentCount = studentContainer.querySelectorAll('.student-block').length + 1;
    const newStudentHTML = `
        <div class="student-block">
            <h4>Estudante ${studentCount}</h4>
            <div class="form-row">
                <div class="form-group">
                    <label>Nome do(a) estudante:</label>
                    <input type="text" name="studentName[]" placeholder="Nome completo" required>
                </div>
                <div class="form-group">
                    <label>N° de faltas:</label>
                    <input type="number" name="absences[]" placeholder="0" min="0" value="0" required>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label>Status:</label>
                    <div class="checkbox-group">
                        <label class="checkbox-label">
                            <input type="checkbox" name="pcd[]" value="PCD"> PCD
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" name="minor[]" value="Menor de Idade"> Menor de Idade
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" name="medicalCertificate[]" value="Atestado Médico"> Atestado Médico
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" name="guardianship[]" value="Conselho Tutelar"> Conselho Tutelar
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" name="publicProsecutor[]" value="Ministério Público"> Ministério Público
                        </label>
                    </div>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label>Número de Visitas:</label>
                    <div class="checkbox-group">
                        <label class="checkbox-label">
                            <input type="checkbox" name="visit1[]" value="1" onchange="updateVisitTotal(this)"> 1ª visita
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" name="visit2[]" value="2" onchange="updateVisitTotal(this)"> 2ª visita
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" name="visit3[]" value="3" onchange="updateVisitTotal(this)"> 3ª visita
                        </label>
                    </div>
                    <p>Total de visitas: <span class="visit-total">0</span></p>
                </div>
            </div>
            
            <button type="button" class="admin-btn delete" onclick="removeActiveSearchStudent(this)">Remover</button>
        </div>
    `;
    
    studentContainer.insertAdjacentHTML('beforeend', newStudentHTML);
}

function removeActiveSearchClass(button) {
    if (confirm('Tem certeza que deseja remover esta turma?')) {
        button.closest('.admin-section').remove();
    }
}

function removeActiveSearchStudent(button) {
    if (confirm('Tem certeza que deseja remover este estudante?')) {
        button.closest('.student-block').remove();
    }
}

function updateVisitTotal(checkbox) {
    const studentBlock = checkbox.closest('.student-block');
    const visitCheckboxes = studentBlock.querySelectorAll('input[name^="visit"]:checked');
    const totalSpan = studentBlock.querySelector('.visit-total');
    
    let total = 0;
    visitCheckboxes.forEach(cb => {
        total += parseInt(cb.value);
    });
    
    totalSpan.textContent = total;
}

// Função para calcular a porcentagem de cumprimento das aulas
function calculatePercentage(input) {
    const recordSection = input.closest('.admin-section');
    const plannedClassesInput = recordSection.querySelector('input[name="plannedClasses[]"]');
    const givenClassesInput = recordSection.querySelector('input[name="givenClasses[]"]');
    const completionRateInput = recordSection.querySelector('input[name="completionRate[]"]');
    
    if (plannedClassesInput && givenClassesInput && completionRateInput) {
        const planned = parseInt(plannedClassesInput.value) || 0;
        const given = parseInt(givenClassesInput.value) || 0;
        
        if (planned > 0) {
            const percentage = ((given / planned) * 100).toFixed(1);
            completionRateInput.value = `${percentage}%`;
        } else {
            completionRateInput.value = '0%';
        }
    }
}

// Função para adicionar novo registro de aulas
function addClassRecord() {
    const container = document.getElementById('classesRecordsContainer');
    // Contar apenas os registros existentes (excluindo seções que não são registros)
    const existingRecords = container.querySelectorAll('.admin-section .section-header h3');
    const recordCount = existingRecords.length + 1;
    
    const newRecordHTML = `
        <div class="admin-section">
            <div class="section-header">
                <h3>Registro ${recordCount}</h3>
                <button type="button" class="admin-btn delete" onclick="removeClassRecord(this)">Remover</button>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label>Data de Referência:</label>
                    <input type="date" name="referenceDate[]" required>
                </div>
                <div class="form-group">
                    <label>Nome da Turma:</label>
                    <input type="text" name="className[]" placeholder="Nome da turma" required>
                </div>
                <div class="form-group">
                    <label>Aulas Previstas no Período:</label>
                    <input type="number" name="plannedClasses[]" placeholder="0" min="0" required onchange="calculatePercentage(this)">
                </div>
                <div class="form-group">
                    <label>Nome do(a) Professor(a):</label>
                    <input type="text" name="teacherName[]" placeholder="Nome completo" required>
                </div>
                <div class="form-group">
                    <label>Situação:</label>
                    <select name="situation[]" required>
                        <option value="">Selecione</option>
                        <option value="Pendente">Pendente</option>
                        <option value="Resolvido">Resolvido</option>
                    </select>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label>ID da Turma:</label>
                    <input type="text" name="classId[]" placeholder="ID da turma" required>
                </div>
                <div class="form-group">
                    <label>Componente Curricular:</label>
                    <input type="text" name="discipline[]" placeholder="Nome do componente curricular" required>
                </div>
                <div class="form-group">
                    <label>Aulas Dadas no Período:</label>
                    <input type="number" name="givenClasses[]" placeholder="0" min="0" required onchange="calculatePercentage(this)">
                </div>
                <div class="form-group">
                    <label>Bimestre:</label>
                    <select name="bimester[]" required>
                        <option value="">Selecione</option>
                        <option value="1º Bimestre">1º Bimestre</option>
                        <option value="2º Bimestre">2º Bimestre</option>
                        <option value="3º Bimestre">3º Bimestre</option>
                        <option value="4º Bimestre">4º Bimestre</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Percentual de Cumprimento:</label>
                    <input type="text" name="completionRate[]" placeholder="0%" readonly>
                </div>
            </div>
            
            <div class="admin-section">
                <h4>Motivos de não realização/registro:</h4>
                <div class="checkbox-group">
                    <label class="checkbox-label">
                        <input type="checkbox" name="reasonTeacherAbsence[]" value="Falta do Docente"> Falta do Docente
                    </label>
                    <label class="checkbox-label">
                        <input type="checkbox" name="reasonStrike[]" value="Greve/Suspensão"> Greve/Suspensão
                    </label>
                    <label class="checkbox-label">
                        <input type="checkbox" name="reasonSchoolEvent[]" value="Evento Escolar"> Evento Escolar
                    </label>
                    <label class="checkbox-label">
                        <input type="checkbox" name="reasonSGEUnavailable[]" value="Indisponibilidade SGE"> Indisponibilidade SGE
                    </label>
                    <label class="checkbox-label">
                        <input type="checkbox" name="reasonHoliday[]" value="Feriado"> Feriado
                    </label>
                    <label class="checkbox-label">
                        <input type="checkbox" name="reasonSGENotLaunched[]" value="Não Lançamento SGE Professor"> Não Lançamento SGE Professor
                    </label>
                    <label class="checkbox-label">
                        <input type="checkbox" name="reasonOthers[]" value="Outros"> Outros
                    </label>
                </div>
            </div>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', newRecordHTML);
}

// Função para remover registro de aulas
function removeClassRecord(button) {
    if (confirm('Tem certeza que deseja remover este registro?')) {
        const recordSection = button.closest('.admin-section');
        recordSection.remove();
        
        // Renumerar os registros restantes
        const container = document.getElementById('classesRecordsContainer');
        const records = container.querySelectorAll('.admin-section .section-header h3');
        records.forEach((header, index) => {
            header.textContent = `Registro ${index + 1}`;
        });
    }
}

// Funções auxiliares para Estudantes Abaixo da Média
function addBelowAverageClass() {
    const container = document.getElementById('belowAverageClassesContainer');
    // Contar apenas as turmas existentes (seções que começam com "Turma")
    const existingClasses = container.querySelectorAll('.admin-section .section-header h3');
    const classCount = existingClasses.length + 1;
    
    const newClassHTML = `
        <div class="admin-section">
            <div class="section-header">
                <h3>Turma ${classCount}</h3>
                <button type="button" class="admin-btn delete" onclick="removeBelowAverageClass(this)">Remover Turma</button>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label>Nome da Turma:</label>
                    <input type="text" name="className[]" placeholder="Nome da turma" required>
                </div>
                <div class="form-group">
                    <label>Total de Estudantes na Turma:</label>
                    <input type="number" name="totalStudents[]" placeholder="0" min="0" required onchange="calculateBelowAveragePercentage(this)">
                </div>
            </div>
            
            <div class="admin-section">
                <h4>Estudantes Abaixo da Média</h4>
                <button type="button" class="admin-btn" onclick="addBelowAverageStudent(this)">+ Adicionar Estudante</button>
                
                <div class="students-container">
                    <div class="student-block">
                        <h5>Estudante 1</h5>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Nome do(a) Estudante:</label>
                                <input type="text" name="studentName[]" placeholder="Nome completo" required>
                            </div>
                            <div class="form-group">
                                <label>Nota:</label>
                                <input type="number" name="grade[]" placeholder="0.0" min="0" max="10" step="0.1" value="0.0" required>
                            </div>
                            <div class="form-group">
                                <label>Situação:</label>
                                <select name="studentStatus[]" required onchange="calculateBelowAveragePercentage(this)">
                                    <option value="">Selecione</option>
                                    <option value="Pendente">Pendente</option>
                                    <option value="Resolvido">Resolvido</option>
                                </select>
                            </div>
                        </div>
                        <button type="button" class="admin-btn delete" onclick="removeBelowAverageStudent(this)">Remover</button>
                    </div>
                </div>
                
                <div class="percentage-display">
                    <p><strong>Estudantes abaixo da média: <span class="below-average-count">0</span></strong></p>
                    <p><strong>Percentual: <span class="below-average-percentage">0%</span></strong></p>
                    <button type="button" class="admin-btn" onclick="calculateBelowAveragePercentage(this)">Calcular</button>
                </div>
            </div>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', newClassHTML);
}

function removeBelowAverageClass(button) {
    if (confirm('Tem certeza que deseja remover esta turma?')) {
        const classSection = button.closest('.admin-section');
        classSection.remove();
        
        // Renumerar as turmas restantes
        const container = document.getElementById('belowAverageClassesContainer');
        const classes = container.querySelectorAll('.admin-section .section-header h3');
        classes.forEach((header, index) => {
            header.textContent = `Turma ${index + 1}`;
        });
    }
}

// Função para adicionar estudante abaixo da média
function addBelowAverageStudent(button) {
    const studentContainer = button.nextElementSibling;
    const studentCount = studentContainer.querySelectorAll('.student-block').length + 1;
    const newStudentHTML = `
        <div class="student-block">
            <h5>Estudante ${studentCount}</h5>
            <div class="form-row">
                <div class="form-group">
                    <label>Nome do(a) Estudante:</label>
                    <input type="text" name="studentName[]" placeholder="Nome completo" required>
                </div>
                <div class="form-group">
                    <label>Nota:</label>
                    <input type="number" name="grade[]" placeholder="0.0" min="0" max="10" step="0.1" value="0.0" required>
                </div>
                <div class="form-group">
                    <label>Situação:</label>
                    <select name="studentStatus[]" required onchange="calculateBelowAveragePercentage(this)">
                        <option value="">Selecione</option>
                        <option value="Pendente">Pendente</option>
                        <option value="Resolvido">Resolvido</option>
                    </select>
                </div>
            </div>
            <button type="button" class="admin-btn delete" onclick="removeBelowAverageStudent(this)">Remover</button>
        </div>
    `;
    
    studentContainer.insertAdjacentHTML('beforeend', newStudentHTML);
}

// Função para remover estudante abaixo da média
function removeBelowAverageStudent(button) {
    if (confirm('Tem certeza que deseja remover este estudante?')) {
        button.closest('.student-block').remove();
    }
}

// Função para calcular percentual de estudantes abaixo da média
function calculateBelowAveragePercentage(input) {
    const classSection = input.closest('.admin-section');
    const totalStudentsInput = classSection.querySelector('input[name="totalStudents[]"]');
    const studentStatusSelects = classSection.querySelectorAll('select[name="studentStatus[]"]');
    
    if (totalStudentsInput) {
        const totalStudents = parseInt(totalStudentsInput.value) || 0;
        let belowAverageCount = 0;
        
        studentStatusSelects.forEach(select => {
            if (select.value === 'Pendente') {
                belowAverageCount++;
            }
        });
        
        const percentage = totalStudents > 0 ? ((belowAverageCount / totalStudents) * 100).toFixed(1) : 0;
        
        const countSpan = classSection.querySelector('.below-average-count');
        const percentageSpan = classSection.querySelector('.below-average-percentage');
        
        if (countSpan) countSpan.textContent = belowAverageCount;
        if (percentageSpan) percentageSpan.textContent = `${percentage}%`;
    }
}

// Função para voltar ao menu de assessoramento
function goBackToAssessment() {
    const assessmentType = document.getElementById('assessmentType').value;
    openAssessmentForm(assessmentType);
}

// Função para salvar questionário
async function saveQuestionnaire(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const questionnaireData = {
        assessmentType: document.getElementById('assessmentType').value,
        questionnaireType: document.getElementById('questionnaireType').value,
        technicianName: document.getElementById('technicianName').value,
        schoolName: document.getElementById('schoolName').value,
        municipality: document.getElementById('municipality').value,
        registrationDate: document.getElementById('registrationDate').value,
        observations: document.getElementById('observations').value,
        documentLinks: document.getElementById('documentLinks').value,
        timestamp: new Date(),
        userId: auth.currentUser ? auth.currentUser.uid : 'anonymous'
    };
    
    try {
        const docRef = await addDoc(collection(db, 'monitoramentos'), questionnaireData);
        alert('Questionário salvo com sucesso!');
        goBackToAssessment();
    } catch (error) {
        console.error('Erro ao salvar questionário:', error);
        alert('Erro ao salvar questionário. Tente novamente.');
    }
}

// Função para visualizar todos os monitoramentos
async function viewAll() {
    try {
        const querySnapshot = await getDocs(collection(db, 'monitoramentos'));
        const questionnaires = [];
        
        querySnapshot.forEach((doc) => {
            questionnaires.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        // Mostrar lista de todos os questionários
        showQuestionnairesList(questionnaires);
    } catch (error) {
        console.error('Erro ao buscar questionários:', error);
        alert('Erro ao carregar questionários.');
    }
}

// Função para mostrar lista de questionários
function showQuestionnairesList(questionnaires) {
    document.body.innerHTML = `
        <div class="dashboard-container">
            <header class="admin-header">
                <h1>Todos os Monitoramentos</h1>
                <button class="logout-btn" onclick="logout()">Sair</button>
            </header>
            
            <div class="admin-content">
                <div class="admin-section">
                    <h2>Questionários Salvos</h2>
                    <div class="questionnaires-list">
                        ${questionnaires.map(q => `
                            <div class="questionnaire-item">
                                <h3>${q.questionnaireType} - ${q.assessmentType}</h3>
                                <p><strong>Escola:</strong> ${q.schoolName}</p>
                                <p><strong>Município:</strong> ${q.municipality}</p>
                                <p><strong>Técnico:</strong> ${q.technicianName}</p>
                                <p><strong>Data:</strong> ${new Date(q.timestamp.toDate()).toLocaleDateString()}</p>
                                <button class="admin-btn" onclick="viewQuestionnaire('${q.id}')">Visualizar</button>
                            </div>
                        `).join('')}
                    </div>
                    
                    <div style="text-align: center; margin-top: 30px;">
                        <button class="admin-btn" onclick="goBack()">Voltar ao Menu</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Função para visualizar questionário específico
async function viewQuestionnaire(questionnaireId) {
    try {
        const docRef = doc(db, 'monitoramentos', questionnaireId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            const questionnaire = docSnap.data();
            showQuestionnaireDetails(questionnaire, questionnaireId);
        } else {
            alert('Questionário não encontrado.');
        }
    } catch (error) {
        console.error('Erro ao buscar questionário:', error);
        alert('Erro ao carregar questionário.');
    }
}

// Função para mostrar detalhes do questionário
function showQuestionnaireDetails(questionnaire, questionnaireId) {
    document.body.innerHTML = `
        <div class="dashboard-container">
            <header class="admin-header">
                <h1>Detalhes do Questionário</h1>
                <button class="logout-btn" onclick="logout()">Sair</button>
            </header>
            
            <div class="admin-content">
                <div class="admin-section">
                    <h2>${questionnaire.questionnaireType} - ${questionnaire.assessmentType}</h2>
                    <div class="questionnaire-details">
                        <p><strong>Técnico:</strong> ${questionnaire.technicianName}</p>
                        <p><strong>Escola:</strong> ${questionnaire.schoolName}</p>
                        <p><strong>Município:</strong> ${questionnaire.municipality}</p>
                        <p><strong>Data:</strong> ${new Date(questionnaire.timestamp.toDate()).toLocaleDateString()}</p>
                        <p><strong>Observações:</strong> ${questionnaire.observations || 'Nenhuma'}</p>
                        <p><strong>Links de Documentos:</strong> ${questionnaire.documentLinks || 'Nenhum'}</p>
                    </div>
                    
                    <div style="text-align: center; margin-top: 30px;">
                        <button class="admin-btn" onclick="viewAll()">Voltar à Lista</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Função para visualizar registros
async function viewAssessment() {
    try {
        const querySnapshot = await getDocs(collection(db, 'monitoramentos'));
        const questionnaires = [];
        
        querySnapshot.forEach((doc) => {
            questionnaires.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        showAssessmentRecords(questionnaires);
    } catch (error) {
        console.error('Erro ao buscar registros:', error);
        alert('Erro ao carregar registros.');
    }
}

// Função para mostrar registros de assessoramento
function showAssessmentRecords(questionnaires) {
    document.body.innerHTML = `
        <div class="dashboard-container">
            <header class="admin-header">
                <h1>Registros de Monitoramentos</h1>
                <button class="logout-btn" onclick="logout()">Sair</button>
            </header>
            
            <div class="admin-content">
                <div class="admin-section">
                    <h2>Questionários Salvos</h2>
                    <div class="records-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>ESCOLA</th>
                                    <th>MUNICÍPIO</th>
                                    <th>TÉCNICO(A)</th>
                                    <th>DATA</th>
                                    <th>AÇÕES</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${questionnaires.map(q => `
                                    <tr>
                                        <td>${q.schoolName}</td>
                                        <td>${q.municipality}</td>
                                        <td>${q.technicianName}</td>
                                        <td>${new Date(q.timestamp.toDate()).toLocaleDateString()}</td>
                                        <td class="actions-column">
                                            <button class="action-btn view" onclick="viewQuestionnaire('${q.id}')">Ver Detalhes</button>
                                            <button class="action-btn link" onclick="generateLink('${q.id}')">Gerar Link</button>
                                            <button class="action-btn pdf" onclick="generatePDF('${q.id}')">Gerar PDF</button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                    
                    <div style="text-align: center; margin-top: 30px;">
                        <button class="admin-btn" onclick="goBack()">Voltar ao Menu</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Função para gerar link
function generateLink(questionnaireId) {
    const link = `${window.location.origin}${window.location.pathname}?id=${questionnaireId}`;
    navigator.clipboard.writeText(link).then(() => {
        alert('Link copiado para a área de transferência!');
    }).catch(() => {
        // Fallback para navegadores que não suportam clipboard API
        const textArea = document.createElement('textarea');
        textArea.value = link;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('Link copiado para a área de transferência!');
    });
}

// Função para gerar PDF (placeholder)
function generatePDF(questionnaireId) {
    alert('Funcionalidade de geração de PDF será implementada em breve.');
}

// Função para logout
function logout() {
    localStorage.removeItem('currentUser');
    window.location.reload();
}

// Função para buscar usuário por CPF
async function searchUserByCPF(cpfEmail, password) {
    try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('cpf', '==', cpfEmail));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            const userData = userDoc.data();
            
            if (userData.password === password) {
                // Login bem-sucedido
                localStorage.setItem('currentUser', JSON.stringify({
                    uid: userDoc.id,
                    ...userData
                }));
                showDashboard();
            } else {
                alert('Senha incorreta.');
            }
        } else {
            alert('Usuário não encontrado.');
        }
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        throw error;
    }
}

// Função para carregar avisos
async function loadNotices() {
    try {
        const noticesRef = collection(db, 'notices');
        const q = query(noticesRef, orderBy('timestamp', 'desc'), limit(5));
        const querySnapshot = await getDocs(q);
        
        const notificationArea = document.querySelector('.notification-area');
        if (notificationArea) {
            const notificationCount = notificationArea.querySelector('.notification-count');
            const errorBanner = notificationArea.querySelector('.error-banner');
            
            if (querySnapshot.empty) {
                if (notificationCount) notificationCount.textContent = '0';
                if (errorBanner) errorBanner.textContent = 'Nenhum aviso';
            } else {
                if (notificationCount) notificationCount.textContent = querySnapshot.size.toString();
                if (errorBanner) errorBanner.textContent = `${querySnapshot.size} aviso(s)`;
            }
        }
    } catch (error) {
        console.error('Erro ao carregar avisos:', error);
        const notificationArea = document.querySelector('.notification-area');
        if (notificationArea) {
            const errorBanner = notificationArea.querySelector('.error-banner');
            if (errorBanner) errorBanner.textContent = 'Erro ao carregar avisos';
        }
    }
}

// Função para mostrar formulário de usuário
function showUserForm() {
    document.body.innerHTML = `
        <div class="admin-container">
            <header class="admin-header">
                <h1>Cadastrar Novo Usuário</h1>
                <button class="logout-btn" onclick="logout()">Sair</button>
            </header>
            
            <div class="admin-content">
                <form id="userForm" onsubmit="saveUser(event)">
                    <div class="admin-section">
                        <h2>Dados do Usuário</h2>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Nome Completo:</label>
                                <input type="text" id="userName" required>
                            </div>
                            <div class="form-group">
                                <label>CPF:</label>
                                <input type="text" id="userCPF" required>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Email:</label>
                                <input type="email" id="userEmail" required>
                            </div>
                            <div class="form-group">
                                <label>Senha:</label>
                                <input type="password" id="userPassword" required>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Função:</label>
                                <select id="userRole" required>
                                    <option value="">Selecione</option>
                                    <option value="técnico">Técnico</option>
                                    <option value="supervisor">Supervisor</option>
                                    <option value="admin">Administrador</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-buttons">
                        <button type="submit" class="admin-btn">Salvar Usuário</button>
                        <button type="button" class="admin-btn secondary" onclick="showAdminPanel()">Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    `;
}

// Função para salvar usuário
async function saveUser(event) {
    event.preventDefault();
    
    const userData = {
        name: document.getElementById('userName').value,
        cpf: document.getElementById('userCPF').value,
        email: document.getElementById('userEmail').value,
        password: document.getElementById('userPassword').value,
        role: document.getElementById('userRole').value,
        timestamp: new Date()
    };
    
    try {
        await addDoc(collection(db, 'users'), userData);
        alert('Usuário cadastrado com sucesso!');
        showAdminPanel();
    } catch (error) {
        console.error('Erro ao cadastrar usuário:', error);
        alert('Erro ao cadastrar usuário. Tente novamente.');
    }
}

// Função para listar usuários
async function listUsers() {
    try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const users = [];
        
        querySnapshot.forEach((doc) => {
            users.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        showUsersList(users);
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        alert('Erro ao carregar usuários.');
    }
}

// Função para mostrar lista de usuários
function showUsersList(users) {
    document.body.innerHTML = `
        <div class="admin-container">
            <header class="admin-header">
                <h1>Lista de Usuários</h1>
                <button class="logout-btn" onclick="logout()">Sair</button>
            </header>
            
            <div class="admin-content">
                <div class="admin-section">
                    <h2>Usuários Cadastrados</h2>
                    <div class="users-list">
                        ${users.map(user => `
                            <div class="user-item">
                                <h3>${user.name}</h3>
                                <p><strong>CPF:</strong> ${user.cpf}</p>
                                <p><strong>Email:</strong> ${user.email}</p>
                                <p><strong>Função:</strong> ${user.role}</p>
                                <p><strong>Data de Cadastro:</strong> ${new Date(user.timestamp.toDate()).toLocaleDateString()}</p>
                            </div>
                        `).join('')}
                    </div>
                    
                    <div style="text-align: center; margin-top: 30px;">
                        <button class="admin-btn" onclick="showAdminPanel()">Voltar ao Menu</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Função para mostrar formulário de aviso
function showNoticeForm() {
    document.body.innerHTML = `
        <div class="admin-container">
            <header class="admin-header">
                <h1>Criar Novo Aviso</h1>
                <button class="logout-btn" onclick="logout()">Sair</button>
            </header>
            
            <div class="admin-content">
                <form id="noticeForm" onsubmit="saveNotice(event)">
                    <div class="admin-section">
                        <h2>Dados do Aviso</h2>
                        <div class="form-group">
                            <label>Título:</label>
                            <input type="text" id="noticeTitle" required>
                        </div>
                        <div class="form-group">
                            <label>Mensagem:</label>
                            <textarea id="noticeMessage" rows="6" required></textarea>
                        </div>
                        <div class="form-group">
                            <label>Prioridade:</label>
                            <select id="noticePriority" required>
                                <option value="">Selecione</option>
                                <option value="baixa">Baixa</option>
                                <option value="média">Média</option>
                                <option value="alta">Alta</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-buttons">
                        <button type="submit" class="admin-btn">Salvar Aviso</button>
                        <button type="button" class="admin-btn secondary" onclick="showAdminPanel()">Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    `;
}

// Função para salvar aviso
async function saveNotice(event) {
    event.preventDefault();
    
    const noticeData = {
        title: document.getElementById('noticeTitle').value,
        message: document.getElementById('noticeMessage').value,
        priority: document.getElementById('noticePriority').value,
        timestamp: new Date()
    };
    
    try {
        await addDoc(collection(db, 'notices'), noticeData);
        alert('Aviso criado com sucesso!');
        showAdminPanel();
    } catch (error) {
        console.error('Erro ao criar aviso:', error);
        alert('Erro ao criar aviso. Tente novamente.');
    }
}

// Função para listar avisos
async function listNotices() {
    try {
        const querySnapshot = await getDocs(collection(db, 'notices'));
        const notices = [];
        
        querySnapshot.forEach((doc) => {
            notices.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        showNoticesList(notices);
    } catch (error) {
        console.error('Erro ao buscar avisos:', error);
        alert('Erro ao carregar avisos.');
    }
}

// Função para mostrar lista de avisos
function showNoticesList(notices) {
    document.body.innerHTML = `
        <div class="admin-container">
            <header class="admin-header">
                <h1>Lista de Avisos</h1>
                <button class="logout-btn" onclick="logout()">Sair</button>
            </header>
            
            <div class="admin-content">
                <div class="admin-section">
                    <h2>Avisos Cadastrados</h2>
                    <div class="notices-list">
                        ${notices.map(notice => `
                            <div class="notice-item">
                                <h3>${notice.title}</h3>
                                <p><strong>Mensagem:</strong> ${notice.message}</p>
                                <p><strong>Prioridade:</strong> ${notice.priority}</p>
                                <p><strong>Data:</strong> ${new Date(notice.timestamp.toDate()).toLocaleDateString()}</p>
                            </div>
                        `).join('')}
                    </div>
                    
                    <div style="text-align: center; margin-top: 30px;">
                        <button class="admin-btn" onclick="showAdminPanel()">Voltar ao Menu</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Exportar funções para uso global
window.viewQuestionnaire = viewQuestionnaire;
window.deleteQuestionnaire = deleteQuestionnaire;
window.makeFormReadOnly = makeFormReadOnly;
window.addBackButton = addBackButton;
window.fillFormWithSavedData = fillFormWithSavedData;
window.fillStudentFrequencyData = fillStudentFrequencyData;
window.fillActiveSearchData = fillActiveSearchData;
window.fillClassesData = fillClassesData;
window.fillBelowAverageData = fillBelowAverageData;
window.generateLink = generateLink;
window.generatePDF = generatePDF;