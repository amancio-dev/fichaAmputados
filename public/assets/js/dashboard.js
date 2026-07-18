// ===== Dashboard JS =====
const toastContainer = document.getElementById('toastContainer');
const themeToggle = document.getElementById('themeToggle');
const relogio = document.getElementById('relogio');
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');

const statTotal = document.getElementById('statTotal');
const statMes = document.getElementById('statMes');
const statAmputacoes = document.getElementById('statAmputacoes');
const statIdadeMedia = document.getElementById('statIdadeMedia');
const tabelaRecentes = document.getElementById('tabelaRecentes');
const legendGenero = document.getElementById('legendGenero');

const formatadorNumero = new Intl.NumberFormat('pt-BR');

// ===== Shared Utilities =====
function escapeHtml(value) {
    if (value === null || value === undefined || value === '') return '-';
    return String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[c]));
}

function formatarData(valor) {
    if (!valor) return '-';
    const p = String(valor).slice(0, 10).split('-');
    if (p.length !== 3) return escapeHtml(valor);
    return `${p[2]}/${p[1]}/${p[0]}`;
}

function mostrarToast(texto, tipo = 'sucesso') {
    const toast = document.createElement('div');
    toast.className = `toast ${tipo}`;
    const icon = tipo === 'sucesso'
        ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>'
        : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';
    toast.innerHTML = `<div class="toast-icon">${icon}</div><div class="toast-body"><div class="toast-title">${tipo === 'sucesso' ? 'Sucesso' : 'Erro'}</div><div class="toast-message">${escapeHtml(texto)}</div></div><button type="button" class="toast-close" aria-label="Fechar"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>`;
    toastContainer.appendChild(toast);
    const dismiss = () => { toast.classList.add('removing'); setTimeout(() => toast.remove(), 300); };
    toast.querySelector('.toast-close').addEventListener('click', dismiss);
    setTimeout(dismiss, 4000);
}

// Theme
function aplicarTema(isLight) {
    document.body.classList.toggle('light-mode', isLight);
    const moon = themeToggle?.querySelector('.icon-moon');
    const sun = themeToggle?.querySelector('.icon-sun');
    if (moon) moon.style.display = isLight ? 'none' : 'block';
    if (sun) sun.style.display = isLight ? 'block' : 'none';
}

function initTema() { aplicarTema(localStorage.getItem('clinipro-theme') === 'light'); }

themeToggle?.addEventListener('click', () => {
    const isLight = !document.body.classList.contains('light-mode');
    aplicarTema(isLight);
    localStorage.setItem('clinipro-theme', isLight ? 'light' : 'dark');
});

// Clock
function atualizarRelogio() {
    if (!relogio) return;
    const now = new Date();
    relogio.textContent = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
}

// Sidebar
sidebarToggle?.addEventListener('click', () => sidebar?.classList.toggle('is-open'));
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 980 && sidebar?.classList.contains('is-open') && !sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
        sidebar.classList.remove('is-open');
    }
});

// Counter animation
function animarContador(el, target) {
    if (!el) return;
    const val = Number(target) || 0;
    const start = Number(el.textContent.replace(/\D/g, '')) || 0;
    if (start === val) { el.textContent = formatadorNumero.format(val); return; }
    const duration = 600;
    const startTime = performance.now();
    function update(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = formatadorNumero.format(Math.round(start + (val - start) * eased));
        if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}

// ===== Chart.js Color Config =====
function getChartColors() {
    const isLight = document.body.classList.contains('light-mode');
    return {
        text: isLight ? '#475569' : '#8b95b0',
        grid: isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.05)',
        blue: '#38bdf8',
        pink: '#f472b6',
        purple: '#a78bfa',
        green: '#34d399',
        amber: '#fbbf24',
        red: '#f87171',
        cyan: '#22d3ee',
        orange: '#fb923c',
    };
}

// Chart instances
let chartGenero, chartIdade, chartMensal, chartAmputacoes;

function destroyCharts() {
    chartGenero?.destroy();
    chartIdade?.destroy();
    chartMensal?.destroy();
    chartAmputacoes?.destroy();
}

// ===== Data Loading =====
async function carregarDados() {
    try {
        const resp = await fetch('/paciente?page=1&per_page=10000', {
            headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
        });
        if (!resp.ok) throw new Error('Erro ao carregar dados.');
        const result = await resp.json();
        const pacientes = result.data?.data || [];

        processarDados(pacientes);
    } catch (error) {
        mostrarToast(error.message, 'erro');
    }
}

function processarDados(pacientes) {
    const total = pacientes.length;

    // Stats
    animarContador(statTotal, total);

    const mesAtual = new Date().toISOString().slice(0, 7);
    const cadastrosMes = pacientes.filter(p => (p.created_at || '').slice(0, 7) === mesAtual).length;
    animarContador(statMes, cadastrosMes);

    const ampKeys = ['desarticulacao_ombro','transumeral','desarticulacao_cotovelo','transradial','desarticulacao_punho','parcial_mao','dedos_mao','desarticulacao_quadril','transfemoral','desarticulacao_joelho','transtibal','syme','parcial_pe','dedos_pe'];
    const comAmputacao = pacientes.filter(p => {
        if (!p.amputacoes?.length) return false;
        return ampKeys.some(k => p.amputacoes[0][k] == 1 || p.amputacoes[0][k] === true);
    }).length;
    animarContador(statAmputacoes, comAmputacao);

    const idades = pacientes.map(p => Number(p.idade)).filter(i => i > 0);
    const idadeMedia = idades.length ? Math.round(idades.reduce((a, b) => a + b, 0) / idades.length) : 0;
    animarContador(statIdadeMedia, idadeMedia);

    // Charts
    renderizarCharts(pacientes, ampKeys);

    // Recent patients table
    renderizarRecentes(pacientes);
}

function renderizarCharts(pacientes, ampKeys) {
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js not loaded');
        return;
    }

    destroyCharts();
    const c = getChartColors();

    // Defaults
    Chart.defaults.font.family = "'Inter', system-ui, sans-serif";
    Chart.defaults.font.size = 12;
    Chart.defaults.color = c.text;

    // 1. Gender Donut
    const generoCount = {};
    pacientes.forEach(p => {
        const g = p.genero || 'Não informado';
        generoCount[g] = (generoCount[g] || 0) + 1;
    });
    const generoLabels = Object.keys(generoCount);
    const generoData = Object.values(generoCount);
    const generoColors = [c.blue, c.pink, c.purple, c.amber];

    chartGenero = new Chart(document.getElementById('chartGenero'), {
        type: 'doughnut',
        data: {
            labels: generoLabels,
            datasets: [{
                data: generoData,
                backgroundColor: generoColors.slice(0, generoLabels.length),
                borderWidth: 0,
                hoverOffset: 8,
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(15, 17, 23, 0.9)',
                    padding: 12,
                    cornerRadius: 10,
                    titleFont: { weight: '700' },
                },
            },
        },
    });

    // Custom legend
    legendGenero.innerHTML = generoLabels.map((label, i) => `
        <div class="legend-item">
            <span class="legend-dot" style="background:${generoColors[i]}"></span>
            ${escapeHtml(label)}: <span class="legend-value">${generoData[i]}</span>
        </div>
    `).join('');

    // 2. Age Distribution Bar
    const faixas = { '0-17': 0, '18-30': 0, '31-45': 0, '46-60': 0, '61-75': 0, '76+': 0 };
    pacientes.forEach(p => {
        const idade = Number(p.idade);
        if (!idade || idade < 0) return;
        if (idade <= 17) faixas['0-17']++;
        else if (idade <= 30) faixas['18-30']++;
        else if (idade <= 45) faixas['31-45']++;
        else if (idade <= 60) faixas['46-60']++;
        else if (idade <= 75) faixas['61-75']++;
        else faixas['76+']++;
    });

    chartIdade = new Chart(document.getElementById('chartIdade'), {
        type: 'bar',
        data: {
            labels: Object.keys(faixas),
            datasets: [{
                label: 'Pacientes',
                data: Object.values(faixas),
                backgroundColor: c.blue + '33',
                borderColor: c.blue,
                borderWidth: 2,
                borderRadius: 8,
                borderSkipped: false,
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(15, 17, 23, 0.9)',
                    padding: 12,
                    cornerRadius: 10,
                },
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { color: c.text, font: { weight: '600' } },
                },
                y: {
                    beginAtZero: true,
                    grid: { color: c.grid },
                    ticks: {
                        color: c.text,
                        stepSize: 1,
                        font: { weight: '600' },
                    },
                },
            },
        },
    });

    // 3. Monthly Registrations Line
    const meses = {};
    pacientes.forEach(p => {
        const mes = (p.created_at || p.data_avaliacao || '').slice(0, 7);
        if (mes) meses[mes] = (meses[mes] || 0) + 1;
    });
    const mesesOrdenados = Object.keys(meses).sort();
    const ultimos12 = mesesOrdenados.slice(-12);
    const mesesLabels = ultimos12.map(m => {
        const [y, mo] = m.split('-');
        const nomes = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
        return `${nomes[Number(mo) - 1]}/${y.slice(2)}`;
    });

    chartMensal = new Chart(document.getElementById('chartMensal'), {
        type: 'line',
        data: {
            labels: mesesLabels,
            datasets: [{
                label: 'Cadastros',
                data: ultimos12.map(m => meses[m]),
                borderColor: c.green,
                backgroundColor: c.green + '18',
                fill: true,
                tension: 0.4,
                pointRadius: 5,
                pointHoverRadius: 8,
                pointBackgroundColor: c.green,
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                borderWidth: 3,
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(15, 17, 23, 0.9)',
                    padding: 12,
                    cornerRadius: 10,
                },
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { color: c.text, font: { weight: '600' }, maxRotation: 45 },
                },
                y: {
                    beginAtZero: true,
                    grid: { color: c.grid },
                    ticks: { color: c.text, stepSize: 1, font: { weight: '600' } },
                },
            },
        },
    });

    // 4. Amputation Types Horizontal Bar
    const ampLabels = {
        desarticulacao_ombro: 'Desart. Ombro', transumeral: 'Transumeral',
        desarticulacao_cotovelo: 'Desart. Cotovelo', transradial: 'Transradial',
        desarticulacao_punho: 'Desart. Punho', parcial_mao: 'Parcial Mão',
        dedos_mao: 'Dedos Mão', desarticulacao_quadril: 'Desart. Quadril',
        transfemoral: 'Transfemoral', desarticulacao_joelho: 'Desart. Joelho',
        transtibal: 'Transtibial', syme: 'Syme',
        parcial_pe: 'Parcial Pé', dedos_pe: 'Dedos Pé',
    };
    const ampCount = {};
    ampKeys.forEach(k => ampCount[k] = 0);
    pacientes.forEach(p => {
        if (!p.amputacoes?.length) return;
        const a = p.amputacoes[0];
        ampKeys.forEach(k => { if (a[k] == 1 || a[k] === true) ampCount[k]++; });
    });

    // Sort by count descending, filter out zeros
    const ampSorted = Object.entries(ampCount)
        .filter(([, v]) => v > 0)
        .sort((a, b) => b[1] - a[1]);

    const ampBarColors = [c.blue, c.cyan, c.purple, c.pink, c.green, c.amber, c.orange, c.red,
        c.blue, c.cyan, c.purple, c.pink, c.green, c.amber];

    chartAmputacoes = new Chart(document.getElementById('chartAmputacoes'), {
        type: 'bar',
        data: {
            labels: ampSorted.map(([k]) => ampLabels[k] || k),
            datasets: [{
                label: 'Ocorrências',
                data: ampSorted.map(([, v]) => v),
                backgroundColor: ampSorted.map((_, i) => ampBarColors[i % ampBarColors.length] + '44'),
                borderColor: ampSorted.map((_, i) => ampBarColors[i % ampBarColors.length]),
                borderWidth: 2,
                borderRadius: 6,
                borderSkipped: false,
            }],
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(15, 17, 23, 0.9)',
                    padding: 12,
                    cornerRadius: 10,
                },
            },
            scales: {
                x: {
                    beginAtZero: true,
                    grid: { color: c.grid },
                    ticks: { color: c.text, stepSize: 1, font: { weight: '600' } },
                },
                y: {
                    grid: { display: false },
                    ticks: { color: c.text, font: { size: 11, weight: '600' } },
                },
            },
        },
    });
}

function renderizarRecentes(pacientes) {
    const recentes = [...pacientes]
        .sort((a, b) => (b.id_paciente || 0) - (a.id_paciente || 0))
        .slice(0, 5);

    if (!recentes.length) {
        tabelaRecentes.innerHTML = '<tr><td colspan="6" style="text-align:center;color:var(--text-muted);padding:32px">Nenhum paciente cadastrado.</td></tr>';
        return;
    }

    tabelaRecentes.innerHTML = recentes.map(p => `
        <tr>
            <td><span class="id-pill">#${escapeHtml(p.id_paciente)}</span></td>
            <td>${escapeHtml(p.nome)}</td>
            <td>${escapeHtml(p.genero)}</td>
            <td>${escapeHtml(p.cpf)}</td>
            <td>${escapeHtml(p.idade)}</td>
            <td>${formatarData(p.data_avaliacao)}</td>
        </tr>
    `).join('');
}

// ===== Init =====
initTema();
atualizarRelogio();
setInterval(atualizarRelogio, 1000);

// Wait for Chart.js to be ready
function init() {
    if (typeof Chart !== 'undefined') {
        carregarDados();
    } else {
        setTimeout(init, 100);
    }
}
init();
