<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Relatórios — CliniPro</title>
    <meta name="description" content="Relatórios filtrados de pacientes amputados">
    <meta name="csrf-token" content="{{ csrf_token()}}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="{{ asset('assets/css/paciente.css')}}">
    <link rel="stylesheet" href="{{ asset('assets/css/dashboard.css')}}">
    <script src="{{ asset('assets/js/relatorios.js')}}" defer></script>
</head>
<body>

    <div class="app-layout">

        {{-- Sidebar --}}
        <aside class="sidebar" id="sidebar">
            <div class="sidebar-logo">
                <div class="logo-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                </div>
                <div class="logo-text">
                    <h3>CliniPro</h3>
                    <span>Gestão de Amputados</span>
                </div>
            </div>
            <nav class="sidebar-nav">
                <a href="/" class="nav-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    <span>Pacientes</span>
                </a>
                <a href="/dashboard" class="nav-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                    <span>Dashboard</span>
                </a>
                <a href="/relatorios" class="nav-item active">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                    <span>Relatórios</span>
                </a>
            </nav>
            <div class="sidebar-footer"><span>CliniPro v1.0</span></div>
        </aside>

        {{-- Main --}}
        <div class="main-content">
            <header class="topbar">
                <div class="topbar-left">
                    <button type="button" class="sidebar-toggle" id="sidebarToggle" aria-label="Abrir menu">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
                    </button>
                    <div>
                        <span class="topbar-title">Relatórios</span>
                        <div class="header-status">
                            <span class="status-dot" aria-hidden="true"></span>
                            <span>Geração de relatórios</span>
                        </div>
                    </div>
                </div>
                <div class="topbar-right">
                    <span class="topbar-clock" id="relogio"></span>
                    <button type="button" class="theme-toggle" id="themeToggle" aria-label="Alternar tema">
                        <svg class="icon-moon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                        <svg class="icon-sun" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:none"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                    </button>
                </div>
            </header>

            <main class="page-content">

                {{-- Filters --}}
                <div class="card">
                    <div class="section-header">
                        <div>
                            <h2>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-3px;margin-right:8px"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
                                Filtros do Relatório
                            </h2>
                            <p>Selecione os critérios para gerar o relatório.</p>
                        </div>
                        <button type="button" class="btn-neutral" id="btnLimparFiltros">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
                            Limpar filtros
                        </button>
                    </div>

                    <div class="filter-grid">
                        <div class="form-group">
                            <label for="filtroDataInicio">Data Início</label>
                            <input type="date" id="filtroDataInicio">
                        </div>
                        <div class="form-group">
                            <label for="filtroDataFim">Data Fim</label>
                            <input type="date" id="filtroDataFim">
                        </div>
                        <div class="form-group">
                            <label for="filtroGenero">Gênero</label>
                            <select id="filtroGenero">
                                <option value="">Todos</option>
                                <option value="Masculino">Masculino</option>
                                <option value="Feminino">Feminino</option>
                                <option value="Outro">Outro</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="filtroIdadeMin">Idade Mínima</label>
                            <input type="number" id="filtroIdadeMin" placeholder="Ex: 18" min="0">
                        </div>
                        <div class="form-group">
                            <label for="filtroIdadeMax">Idade Máxima</label>
                            <input type="number" id="filtroIdadeMax" placeholder="Ex: 80" min="0">
                        </div>
                        <div class="form-group">
                            <label for="filtroAmputacao">Tipo de Amputação</label>
                            <select id="filtroAmputacao">
                                <option value="">Todos</option>
                                <option value="desarticulacao_ombro">Desart. Ombro</option>
                                <option value="transumeral">Transumeral</option>
                                <option value="desarticulacao_cotovelo">Desart. Cotovelo</option>
                                <option value="transradial">Transradial</option>
                                <option value="desarticulacao_punho">Desart. Punho</option>
                                <option value="parcial_mao">Parcial Mão</option>
                                <option value="dedos_mao">Dedos Mão</option>
                                <option value="desarticulacao_quadril">Desart. Quadril</option>
                                <option value="transfemoral">Transfemoral</option>
                                <option value="desarticulacao_joelho">Desart. Joelho</option>
                                <option value="transtibal">Transtibial</option>
                                <option value="syme">Syme</option>
                                <option value="parcial_pe">Parcial Pé</option>
                                <option value="dedos_pe">Dedos Pé</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-actions" style="margin-top:18px">
                        <button type="button" class="btn-salvar" id="btnGerarRelatorio">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                            Gerar Relatório
                        </button>
                    </div>
                </div>

                {{-- Results Summary --}}
                <div class="stats-grid stats-grid-4" id="resumoRelatorio" style="display:none">
                    <div class="stat-card">
                        <div class="stat-header">
                            <span class="stat-label">Resultados Encontrados</span>
                            <div class="stat-icon stat-icon-blue">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                            </div>
                        </div>
                        <div class="stat-value" id="relTotal">0</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-header">
                            <span class="stat-label">Masculino</span>
                            <div class="stat-icon" style="background:rgba(56,189,248,0.12);color:#38bdf8">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                            </div>
                        </div>
                        <div class="stat-value" id="relMasculino">0</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-header">
                            <span class="stat-label">Feminino</span>
                            <div class="stat-icon" style="background:rgba(244,114,182,0.12);color:#f472b6">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                            </div>
                        </div>
                        <div class="stat-value" id="relFeminino">0</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-header">
                            <span class="stat-label">Idade Média</span>
                            <div class="stat-icon" style="background:rgba(251,191,36,0.12);color:#fbbf24">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                            </div>
                        </div>
                        <div class="stat-value" id="relIdadeMedia">0</div>
                    </div>
                </div>

                {{-- Results Table --}}
                <div class="card" id="resultadoRelatorio" style="display:none">
                    <div class="section-header section-header-inline">
                        <div>
                            <h2>Resultados do Relatório</h2>
                            <p id="relResumo">Dados filtrados conforme critérios selecionados.</p>
                        </div>
                        <div style="display:flex;gap:10px;flex-wrap:wrap">
                            <button type="button" class="btn-export" id="btnExportRelatorio">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                                Exportar CSV
                            </button>
                            <button type="button" class="btn-neutral" id="btnImprimir">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                                Imprimir
                            </button>
                        </div>
                    </div>

                    <div class="table-responsive">
                        <table id="tabelaRelatorio">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nome</th>
                                    <th>Gênero</th>
                                    <th>Prontuário</th>
                                    <th>CPF</th>
                                    <th>Idade</th>
                                    <th>Profissão</th>
                                    <th>Data Avaliação</th>
                                    <th>Amputações</th>
                                </tr>
                            </thead>
                            <tbody id="corpoRelatorio"></tbody>
                        </table>
                    </div>
                </div>

            </main>
        </div>
    </div>

    <div class="toast-container" id="toastContainer"></div>

</body>
</html>
