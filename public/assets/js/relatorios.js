// ===== Relatórios JS =====
const toastContainer = document.getElementById('toastContainer');
const themeToggle = document.getElementById('themeToggle');
const relogio = document.getElementById('relogio');
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');

// Filters
const filtroDataInicio = document.getElementById('filtroDataInicio');
const filtroDataFim = document.getElementById('filtroDataFim');
const filtroGenero = document.getElementById('filtroGenero');
const filtroIdadeMin = document.getElementById('filtroIdadeMin');
const filtroIdadeMax = document.getElementById('filtroIdadeMax');
const filtroAmputacao = document.getElementById('filtroAmputacao');

// Buttons
const btnGerarRelatorio = document.getElementById('btnGerarRelatorio');
const btnLimparFiltros = document.getElementById('btnLimparFiltros');
const btnExportRelatorio = document.getElementById('btnExportRelatorio');
const btnImprimir = document.getElementById('btnImprimir');

// Results
const resumoRelatorio = document.getElementById('resumoRelatorio');
const resultadoRelatorio = document.getElementById('resultadoRelatorio');
const corpoRelatorio = document.getElementById('corpoRelatorio');
const relTotal = document.getElementById('relTotal');
const relMasculino = document.getElementById('relMasculino');
const relFeminino = document.getElementById('relFeminino');
const relIdadeMedia = document.getElementById('relIdadeMedia');
const relResumo = document.getElementById('relResumo');

const formatadorNumero = new Intl.NumberFormat('pt-BR');
let dadosFiltrados = [];

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
    const duration = 500;
    const startTime = performance.now();
    function update(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = formatadorNumero.format(Math.round(start + (val - start) * eased));
        if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}

// ===== Amputation Labels =====
const ampLabels = {
    desarticulacao_ombro: 'Desart. Ombro', transumeral: 'Transumeral',
    desarticulacao_cotovelo: 'Desart. Cotovelo', transradial: 'Transradial',
    desarticulacao_punho: 'Desart. Punho', parcial_mao: 'Parcial Mão',
    dedos_mao: 'Dedos Mão', desarticulacao_quadril: 'Desart. Quadril',
    transfemoral: 'Transfemoral', desarticulacao_joelho: 'Desart. Joelho',
    transtibal: 'Transtibial', syme: 'Syme',
    parcial_pe: 'Parcial Pé', dedos_pe: 'Dedos Pé',
};

function formatAmputacoes(paciente) {
    const amps = paciente.amputacoes?.length ? paciente.amputacoes[0] : null;
    if (!amps) return '<span class="muted-dash">—</span>';
    const selected = Object.keys(ampLabels).filter(k => amps[k] == 1 || amps[k] === true);
    if (!selected.length) return '<span class="muted-dash">—</span>';
    return selected.map(k => `<span class="tag">${escapeHtml(ampLabels[k])}</span>`).join('');
}

// ===== Generate Report =====
async function gerarRelatorio() {
    btnGerarRelatorio.disabled = true;
    btnGerarRelatorio.innerHTML = '<span class="spinner" aria-hidden="true"></span>Gerando...';

    try {
        const resp = await fetch('/paciente?page=1&per_page=10000', {
            headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
        });
        if (!resp.ok) throw new Error('Erro ao carregar dados.');
        const result = await resp.json();
        const pacientes = result.data?.data || [];

        // Apply filters
        dadosFiltrados = pacientes.filter(p => {
            // Date range (based on data_avaliacao)
            if (filtroDataInicio.value && p.data_avaliacao < filtroDataInicio.value) return false;
            if (filtroDataFim.value && p.data_avaliacao > filtroDataFim.value) return false;

            // Gender
            if (filtroGenero.value && p.genero !== filtroGenero.value) return false;

            // Age range
            const idade = Number(p.idade) || 0;
            if (filtroIdadeMin.value && idade < Number(filtroIdadeMin.value)) return false;
            if (filtroIdadeMax.value && idade > Number(filtroIdadeMax.value)) return false;

            // Amputation type
            if (filtroAmputacao.value) {
                const amp = p.amputacoes?.length ? p.amputacoes[0] : null;
                if (!amp || (amp[filtroAmputacao.value] != 1 && amp[filtroAmputacao.value] !== true)) return false;
            }

            return true;
        });

        renderizarResultados(dadosFiltrados);
        mostrarToast(`Relatório gerado: ${dadosFiltrados.length} resultado(s) encontrado(s).`, 'sucesso');
    } catch (error) {
        mostrarToast(error.message, 'erro');
    } finally {
        btnGerarRelatorio.disabled = false;
        btnGerarRelatorio.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>Gerar Relatório';
    }
}

function renderizarResultados(pacientes) {
    // Show result sections
    resumoRelatorio.style.display = '';
    resultadoRelatorio.style.display = '';

    // Summary stats
    const total = pacientes.length;
    animarContador(relTotal, total);
    animarContador(relMasculino, pacientes.filter(p => p.genero === 'Masculino').length);
    animarContador(relFeminino, pacientes.filter(p => p.genero === 'Feminino').length);

    const idades = pacientes.map(p => Number(p.idade)).filter(i => i > 0);
    const idadeMedia = idades.length ? Math.round(idades.reduce((a, b) => a + b, 0) / idades.length) : 0;
    animarContador(relIdadeMedia, idadeMedia);

    // Summary text
    const filtrosAtivos = [];
    if (filtroDataInicio.value) filtrosAtivos.push(`de ${formatarData(filtroDataInicio.value)}`);
    if (filtroDataFim.value) filtrosAtivos.push(`até ${formatarData(filtroDataFim.value)}`);
    if (filtroGenero.value) filtrosAtivos.push(`gênero: ${filtroGenero.value}`);
    if (filtroIdadeMin.value) filtrosAtivos.push(`idade ≥ ${filtroIdadeMin.value}`);
    if (filtroIdadeMax.value) filtrosAtivos.push(`idade ≤ ${filtroIdadeMax.value}`);
    if (filtroAmputacao.value) filtrosAtivos.push(`amputação: ${ampLabels[filtroAmputacao.value] || filtroAmputacao.value}`);

    relResumo.textContent = filtrosAtivos.length
        ? `${total} resultado(s) — Filtros: ${filtrosAtivos.join(', ')}`
        : `${total} resultado(s) — Sem filtros aplicados`;

    // Table
    if (!pacientes.length) {
        corpoRelatorio.innerHTML = `
            <tr>
                <td colspan="9">
                    <div class="empty-state">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="opacity:0.3;margin-bottom:8px"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                        <span>Nenhum resultado para os filtros selecionados.</span>
                    </div>
                </td>
            </tr>`;
        return;
    }

    corpoRelatorio.innerHTML = pacientes.map(p => `
        <tr>
            <td><span class="id-pill">#${escapeHtml(p.id_paciente)}</span></td>
            <td>${escapeHtml(p.nome)}</td>
            <td>${escapeHtml(p.genero)}</td>
            <td>${escapeHtml(p.prontuario)}</td>
            <td>${escapeHtml(p.cpf)}</td>
            <td>${escapeHtml(p.idade)}</td>
            <td>${escapeHtml(p.profissao)}</td>
            <td>${formatarData(p.data_avaliacao)}</td>
            <td><div class="tag-list">${formatAmputacoes(p)}</div></td>
        </tr>
    `).join('');
}

// ===== CSV Export =====
function exportarCSVRelatorio() {
    if (!dadosFiltrados.length) {
        mostrarToast('Nenhum dado para exportar. Gere o relatório primeiro.', 'erro');
        return;
    }

    const headers = ['ID', 'Nome', 'Gênero', 'Prontuário', 'CPF', 'Idade', 'Profissão', 'Data Avaliação', 'Amputações'];
    const rows = dadosFiltrados.map(p => {
        // Get amputation list
        const amps = p.amputacoes?.length ? p.amputacoes[0] : null;
        let ampList = '';
        if (amps) {
            ampList = Object.keys(ampLabels)
                .filter(k => amps[k] == 1 || amps[k] === true)
                .map(k => ampLabels[k])
                .join('; ');
        }
        return [
            p.id_paciente,
            `"${(p.nome || '').replace(/"/g, '""')}"`,
            p.genero || '',
            p.prontuario || '',
            p.cpf || '',
            p.idade || '',
            `"${(p.profissao || '').replace(/"/g, '""')}"`,
            p.data_avaliacao || '',
            `"${ampList}"`,
        ].join(',');
    });

    const csvContent = '\uFEFF' + headers.join(',') + '\n' + rows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `relatorio_pacientes_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    mostrarToast('Relatório exportado com sucesso!', 'sucesso');
}

// ===== Clear Filters =====
function limparFiltros() {
    filtroDataInicio.value = '';
    filtroDataFim.value = '';
    filtroGenero.value = '';
    filtroIdadeMin.value = '';
    filtroIdadeMax.value = '';
    filtroAmputacao.value = '';
    resumoRelatorio.style.display = 'none';
    resultadoRelatorio.style.display = 'none';
    dadosFiltrados = [];
    mostrarToast('Filtros limpos.', 'sucesso');
}

// ===== Print =====
function imprimirRelatorio() {
    if (!dadosFiltrados.length) {
        mostrarToast('Gere o relatório primeiro antes de imprimir.', 'erro');
        return;
    }
    window.print();
}

// ===== Events =====
btnGerarRelatorio?.addEventListener('click', gerarRelatorio);
btnLimparFiltros?.addEventListener('click', limparFiltros);
btnExportRelatorio?.addEventListener('click', exportarCSVRelatorio);
btnImprimir?.addEventListener('click', imprimirRelatorio);

// ===== Init =====
initTema();
atualizarRelogio();
setInterval(atualizarRelogio, 1000);
