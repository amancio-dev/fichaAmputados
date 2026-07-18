<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sistema de Ficha de Amputados</title>
    <meta name="description" content="Sistema profissional de cadastro e gerenciamento de fichas de pacientes amputados">
    <meta name="csrf-token" content="{{ csrf_token()}}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="{{ asset('assets/css/paciente.css')}}">
    <script src="{{ asset('assets/js/paciente.js')}}" defer></script>
</head>
<body>

    <div class="app-layout">

        {{-- Sidebar Navigation --}}
        <aside class="sidebar" id="sidebar">
            <div class="sidebar-logo">
                <div class="logo-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                    </svg>
                </div>
                <div class="logo-text">
                    <h3>CliniPro</h3>
                    <span>Gestão de Amputados</span>
                </div>
            </div>

            <nav class="sidebar-nav">
                <a href="/" class="nav-item active" id="navPacientes">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                    <span>Pacientes</span>
                </a>
                <a href="/dashboard" class="nav-item" id="navDashboard">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="3" width="7" height="7"/>
                        <rect x="14" y="3" width="7" height="7"/>
                        <rect x="14" y="14" width="7" height="7"/>
                        <rect x="3" y="14" width="7" height="7"/>
                    </svg>
                    <span>Dashboard</span>
                </a>
                <a href="/relatorios" class="nav-item" id="navRelatorios">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                        <line x1="16" y1="13" x2="8" y2="13"/>
                        <line x1="16" y1="17" x2="8" y2="17"/>
                        <polyline points="10 9 9 9 8 9"/>
                    </svg>
                    <span>Relatórios</span>
                </a>
            </nav>

            <div class="sidebar-footer">
                <span>CliniPro v1.0</span>
            </div>
        </aside>

        {{-- Main Content --}}
        <div class="main-content">

            {{-- Top Bar --}}
            <header class="topbar">
                <div class="topbar-left">
                    <button type="button" class="sidebar-toggle" id="sidebarToggle" aria-label="Abrir menu">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="3" y1="12" x2="21" y2="12"/>
                            <line x1="3" y1="6" x2="21" y2="6"/>
                            <line x1="3" y1="18" x2="21" y2="18"/>
                        </svg>
                    </button>
                    <div>
                        <span class="topbar-title">Ficha de Amputados</span>
                        <div class="header-status">
                            <span class="status-dot" aria-hidden="true"></span>
                            <span>Atendimento clínico</span>
                        </div>
                    </div>
                </div>
                <div class="topbar-right">
                    <span class="topbar-clock" id="relogio"></span>
                    <button type="button" class="theme-toggle" id="themeToggle" aria-label="Alternar tema">
                        <svg class="icon-moon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                        </svg>
                        <svg class="icon-sun" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:none">
                            <circle cx="12" cy="12" r="5"/>
                            <line x1="12" y1="1" x2="12" y2="3"/>
                            <line x1="12" y1="21" x2="12" y2="23"/>
                            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                            <line x1="1" y1="12" x2="3" y2="12"/>
                            <line x1="21" y1="12" x2="23" y2="12"/>
                            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                        </svg>
                    </button>
                </div>
            </header>

            <main class="page-content">

                {{-- Stats Cards --}}
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-header">
                            <span class="stat-label">Total de Pacientes</span>
                            <div class="stat-icon stat-icon-blue">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                    <circle cx="9" cy="7" r="4"/>
                                </svg>
                            </div>
                        </div>
                        <div class="stat-value" id="statTotalPacientes">0</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-header">
                            <span class="stat-label">Cadastros Hoje</span>
                            <div class="stat-icon stat-icon-green">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                    <line x1="16" y1="2" x2="16" y2="6"/>
                                    <line x1="8" y1="2" x2="8" y2="6"/>
                                    <line x1="3" y1="10" x2="21" y2="10"/>
                                </svg>
                            </div>
                        </div>
                        <div class="stat-value" id="statCadastrosHoje">0</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-header">
                            <span class="stat-label">Amputações Registradas</span>
                            <div class="stat-icon stat-icon-purple">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                                </svg>
                            </div>
                        </div>
                        <div class="stat-value" id="statAmputacoes">0</div>
                    </div>
                </div>

                {{-- Mensagem de feedback (legacy, hidden) --}}
                <div id="mensagem" class="mensagem" role="alert" aria-live="polite"></div>

                {{-- Formulário de cadastro / edição --}}
                <div class="card">
                    <div class="section-header">
                        <div>
                            <h2>Dados do paciente</h2>
                            <p>Identificação, avaliação e informações de acompanhamento.</p>
                        </div>
                        <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
                            <span class="form-mode-badge" id="formModeBadge">Novo cadastro</span>
                            <button type="button" id="btnNovoPaciente" class="btn-neutral">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px">
                                    <line x1="12" y1="5" x2="12" y2="19"/>
                                    <line x1="5" y1="12" x2="19" y2="12"/>
                                </svg>
                                Novo cadastro
                            </button>
                        </div>
                    </div>

                    <form id="formPaciente" novalidate>
                        <input type="hidden" id="id_paciente">

                        <div class="form-grid">
                            <div class="form-group">
                                <label for="nome">Nome</label>
                                <input type="text" id="nome" name="nome" placeholder="Nome completo" autocomplete="name" required>
                            </div>

                            <div class="form-group">
                                <label for="genero">Gênero</label>
                                <select id="genero" name="genero" required>
                                    <option value="" disabled selected>Selecione</option>
                                    <option value="Masculino">Masculino</option>
                                    <option value="Feminino">Feminino</option>
                                    <option value="Outro">Outro</option>
                                </select>
                            </div>

                            <div class="form-group">
                                <label for="prontuario">Prontuário</label>
                                <input type="number" id="prontuario" name="prontuario" placeholder="Nº do prontuário" required>
                            </div>

                            <div class="form-group">
                                <label for="cpf">CPF</label>
                                <input type="text" id="cpf" name="cpf" placeholder="000.000.000-00" required maxlength="14">
                            </div>

                            <div class="form-group">
                                <label for="data_nascimento">Data de nascimento</label>
                                <input type="date" id="data_nascimento" name="data_nascimento" required>
                            </div>

                            <div class="form-group">
                                <label for="idade">Idade</label>
                                <input type="number" id="idade" name="idade" placeholder="Auto" required readonly>
                            </div>

                            <div class="form-group">
                                <label for="profissao">Profissão</label>
                                <input type="text" id="profissao" name="profissao" placeholder="Profissão">
                            </div>

                            <div class="form-group">
                                <label for="acompanhante">Acompanhante</label>
                                <input type="text" id="acompanhante" name="acompanhante" placeholder="Nome do acompanhante">
                            </div>

                            <div class="form-group">
                                <label for="data_avaliacao">Data de avaliação</label>
                                <input type="date" id="data_avaliacao" name="data_avaliacao" required>
                            </div>
                        </div>

                        <details class="amputacao">
                            <summary>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-3px;margin-right:8px">
                                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                                </svg>
                                Nível de amputação
                            </summary>
                            <div class="amputacao-grid">
                                <label class="chk"><input type="checkbox" id="desarticulacao_ombro"><span>Desarticulação ombro</span></label>
                                <label class="chk"><input type="checkbox" id="transumeral"><span>Transumeral</span></label>
                                <label class="chk"><input type="checkbox" id="desarticulacao_cotovelo"><span>Desarticulação cotovelo</span></label>
                                <label class="chk"><input type="checkbox" id="transradial"><span>Transradial</span></label>
                                <label class="chk"><input type="checkbox" id="desarticulacao_punho"><span>Desarticulação punho</span></label>
                                <label class="chk"><input type="checkbox" id="parcial_mao"><span>Parcial mão</span></label>
                                <label class="chk"><input type="checkbox" id="dedos_mao"><span>Dedos da mão</span></label>
                                <label class="chk"><input type="checkbox" id="desarticulacao_quadril"><span>Desarticulação quadril</span></label>
                                <label class="chk"><input type="checkbox" id="transfemoral"><span>Transfemoral</span></label>
                                <label class="chk"><input type="checkbox" id="desarticulacao_joelho"><span>Desarticulação joelho</span></label>
                                <label class="chk"><input type="checkbox" id="transtibal"><span>Transtibial</span></label>
                                <label class="chk"><input type="checkbox" id="syme"><span>Syme</span></label>
                                <label class="chk"><input type="checkbox" id="parcial_pe"><span>Parcial pé</span></label>
                                <label class="chk"><input type="checkbox" id="dedos_pe"><span>Dedos do pé</span></label>
                                <label class="chk"><input type="checkbox" id="direito" name="direito"><span>Lado direito</span></label>
                                <label class="chk"><input type="checkbox" id="esquerdo" name="esquerdo"><span>Lado esquerdo</span></label>

                                <div class="form-group">
                                    <label for="tempo_amputacao">Tempo desde a amputação</label>
                                    <input type="text" id="tempo_amputacao" name="tempo_amputacao" placeholder="ex: 2 anos">
                                </div>
                                <div class="form-group">
                                    <label for="lado_dominante">Lado dominante</label>
                                    <input type="text" id="lado_dominante" name="lado_dominante" placeholder="Direito/Esquerdo">
                                </div>
                            </div>
                        </details>

                        <div class="form-actions">
                            <button type="button" class="btn-neutral is-hidden" id="btnCancelarEdicao">Cancelar edição</button>
                            <button type="submit" class="btn-salvar">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px">
                                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                                    <polyline points="17 21 17 13 7 13 7 21"/>
                                    <polyline points="7 3 7 8 15 8"/>
                                </svg>
                                Salvar Paciente
                            </button>
                        </div>
                    </form>
                </div>

                {{-- Listagem com pesquisa --}}
                <div class="card">
                    <div class="section-header section-header-inline">
                        <div>
                            <h2>Pacientes cadastrados</h2>
                            <p id="listaResumo">Busca e manutenção dos registros salvos.</p>
                        </div>
                        <div style="display:flex;gap:10px;align-items:flex-end;flex-wrap:wrap">
                            <div class="search-field">
                                <label for="pesquisa">Pesquisar</label>
                                <div class="search-input-wrapper">
                                    <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <circle cx="11" cy="11" r="8"/>
                                        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                                    </svg>
                                    <input type="search" id="pesquisa" placeholder="Nome, CPF, prontuário ou profissão">
                                </div>
                            </div>
                            <button type="button" class="btn-export" id="btnExportCSV" title="Exportar lista em CSV">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                    <polyline points="7 10 12 15 17 10"/>
                                    <line x1="12" y1="15" x2="12" y2="3"/>
                                </svg>
                                Exportar
                            </button>
                        </div>
                    </div>

                    <div class="list-overview" aria-label="Resumo da listagem">
                        <span><strong id="totalPacientes">0</strong> pacientes</span>
                        <span>Página <strong id="paginaAtualResumo">1</strong> de <strong id="totalPaginasResumo">1</strong></span>
                    </div>

                    <div class="table-responsive" role="region" aria-label="Lista de pacientes">
                        <table>
                            <thead>
                                <tr>
                                    <th scope="col">ID</th>
                                    <th scope="col">Nome</th>
                                    <th scope="col">Gênero</th>
                                    <th scope="col">Prontuário</th>
                                    <th scope="col">CPF</th>
                                    <th scope="col">Idade</th>
                                    <th scope="col">Data Avaliação</th>
                                    <th scope="col">Amputações</th>
                                    <th scope="col">Ações</th>
                                </tr>
                            </thead>
                            <tbody id="listaPacientes"></tbody>
                        </table>
                    </div>

                    <div id="paginacao" role="navigation" aria-label="Paginação"></div>
                </div>

            </main>
        </div>
    </div>

    {{-- Modal de confirmação --}}
    <div class="modal-overlay" id="modalConfirm" style="display:none">
        <div class="modal">
            <div class="modal-header">
                <h3 id="modalConfirmTitle">Confirmar exclusão</h3>
                <button type="button" class="modal-close" id="modalConfirmClose" aria-label="Fechar">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                </button>
            </div>
            <div class="modal-body">
                <p id="modalConfirmMessage">Deseja realmente excluir este paciente? Esta ação não pode ser desfeita.</p>
            </div>
            <div class="modal-actions">
                <button type="button" class="btn-neutral" id="modalConfirmCancel">Cancelar</button>
                <button type="button" class="btn-excluir" id="modalConfirmOk">Excluir</button>
            </div>
        </div>
    </div>

    {{-- Modal de detalhes do paciente --}}
    <div class="modal-overlay" id="modalDetalhes" style="display:none">
        <div class="modal modal-lg">
            <div class="modal-header">
                <h3>Detalhes do Paciente</h3>
                <button type="button" class="modal-close" id="modalDetalhesClose" aria-label="Fechar">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                </button>
            </div>
            <div class="modal-body" id="modalDetalhesBody">
            </div>
            <div class="modal-actions">
                <button type="button" class="btn-neutral" id="modalDetalhesCloseBtn">Fechar</button>
            </div>
        </div>
    </div>

    {{-- Toast container --}}
    <div class="toast-container" id="toastContainer"></div>

</body>
</html>
