<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard — CliniPro</title>
    <meta name="description" content="Painel de controle com estatísticas e gráficos do sistema de amputados">
    <meta name="csrf-token" content="{{ csrf_token()}}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="{{ asset('assets/css/paciente.css')}}">
    <link rel="stylesheet" href="{{ asset('assets/css/dashboard.css')}}">
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.7/dist/chart.umd.min.js" defer></script>
    <script src="{{ asset('assets/js/dashboard.js')}}" defer></script>
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
                <a href="/dashboard" class="nav-item active">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                    <span>Dashboard</span>
                </a>
                <a href="/relatorios" class="nav-item">
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
                        <span class="topbar-title">Dashboard</span>
                        <div class="header-status">
                            <span class="status-dot" aria-hidden="true"></span>
                            <span>Visão geral do sistema</span>
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

                {{-- Stats Row --}}
                <div class="stats-grid stats-grid-4">
                    <div class="stat-card">
                        <div class="stat-header">
                            <span class="stat-label">Total de Pacientes</span>
                            <div class="stat-icon stat-icon-blue">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                            </div>
                        </div>
                        <div class="stat-value" id="statTotal">0</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-header">
                            <span class="stat-label">Cadastros Este Mês</span>
                            <div class="stat-icon stat-icon-green">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                            </div>
                        </div>
                        <div class="stat-value" id="statMes">0</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-header">
                            <span class="stat-label">Amputações Registradas</span>
                            <div class="stat-icon stat-icon-purple">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                            </div>
                        </div>
                        <div class="stat-value" id="statAmputacoes">0</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-header">
                            <span class="stat-label">Idade Média</span>
                            <div class="stat-icon" style="background:rgba(251,191,36,0.12);color:#fbbf24">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                            </div>
                        </div>
                        <div class="stat-value" id="statIdadeMedia">0</div>
                    </div>
                </div>

                {{-- Charts Row 1 --}}
                <div class="charts-row">
                    <div class="card chart-card">
                        <div class="section-header">
                            <div>
                                <h2>Distribuição por Gênero</h2>
                                <p>Proporção de pacientes por gênero.</p>
                            </div>
                        </div>
                        <div class="chart-container chart-container-sm">
                            <canvas id="chartGenero"></canvas>
                        </div>
                        <div class="chart-legend" id="legendGenero"></div>
                    </div>
                    <div class="card chart-card">
                        <div class="section-header">
                            <div>
                                <h2>Distribuição por Idade</h2>
                                <p>Faixas etárias dos pacientes cadastrados.</p>
                            </div>
                        </div>
                        <div class="chart-container">
                            <canvas id="chartIdade"></canvas>
                        </div>
                    </div>
                </div>

                {{-- Charts Row 2 --}}
                <div class="charts-row">
                    <div class="card chart-card">
                        <div class="section-header">
                            <div>
                                <h2>Cadastros por Mês</h2>
                                <p>Evolução mensal de novos cadastros.</p>
                            </div>
                        </div>
                        <div class="chart-container">
                            <canvas id="chartMensal"></canvas>
                        </div>
                    </div>
                    <div class="card chart-card">
                        <div class="section-header">
                            <div>
                                <h2>Tipos de Amputação</h2>
                                <p>Frequência de cada nível de amputação.</p>
                            </div>
                        </div>
                        <div class="chart-container chart-container-tall">
                            <canvas id="chartAmputacoes"></canvas>
                        </div>
                    </div>
                </div>

                {{-- Recent Patients --}}
                <div class="card">
                    <div class="section-header">
                        <div>
                            <h2>Últimos Pacientes Cadastrados</h2>
                            <p>Os 5 registros mais recentes do sistema.</p>
                        </div>
                        <a href="/" class="btn-neutral" style="text-decoration:none">
                            Ver todos
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-left:6px"><polyline points="9 18 15 12 9 6"/></svg>
                        </a>
                    </div>
                    <div class="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nome</th>
                                    <th>Gênero</th>
                                    <th>CPF</th>
                                    <th>Idade</th>
                                    <th>Data Avaliação</th>
                                </tr>
                            </thead>
                            <tbody id="tabelaRecentes"></tbody>
                        </table>
                    </div>
                </div>

            </main>
        </div>
    </div>

    <div class="toast-container" id="toastContainer"></div>

</body>
</html>
