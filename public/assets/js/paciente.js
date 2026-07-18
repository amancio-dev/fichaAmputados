// ===== DOM References =====
const formPaciente = document.getElementById('formPaciente');
const inputId = document.getElementById('id_paciente');
const inputNome = document.getElementById('nome');
const inputGenero = document.getElementById('genero');
const inputProntuario = document.getElementById('prontuario');
const inputCpf = document.getElementById('cpf');
const inputDataNascimento = document.getElementById('data_nascimento');
const inputIdade = document.getElementById('idade');
const inputProfissao = document.getElementById('profissao');
const inputAcompanhante = document.getElementById('acompanhante');
const inputDataAvaliacao = document.getElementById('data_avaliacao');
const listaPacientes = document.getElementById('listaPacientes');
const paginacao = document.getElementById('paginacao');
const mensagem = document.getElementById('mensagem');
const pesquisa = document.getElementById('pesquisa');
const formModeBadge = document.getElementById('formModeBadge');
const btnCancelarEdicao = document.getElementById('btnCancelarEdicao');
const btnNovoPaciente = document.getElementById('btnNovoPaciente');
const btnSalvar = formPaciente.querySelector('.btn-salvar');
const totalPacientes = document.getElementById('totalPacientes');
const paginaAtualResumo = document.getElementById('paginaAtualResumo');
const totalPaginasResumo = document.getElementById('totalPaginasResumo');
const listaResumo = document.getElementById('listaResumo');
const toastContainer = document.getElementById('toastContainer');
const btnExportCSV = document.getElementById('btnExportCSV');
const themeToggle = document.getElementById('themeToggle');
const relogio = document.getElementById('relogio');
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const statTotalPacientes = document.getElementById('statTotalPacientes');
const statCadastrosHoje = document.getElementById('statCadastrosHoje');
const statAmputacoes = document.getElementById('statAmputacoes');

// Confirm modal
const modalConfirm = document.getElementById('modalConfirm');
const modalConfirmOk = document.getElementById('modalConfirmOk');
const modalConfirmCancel = document.getElementById('modalConfirmCancel');
const modalConfirmClose = document.getElementById('modalConfirmClose');
const modalConfirmMessage = document.getElementById('modalConfirmMessage');

// Details modal
const modalDetalhes = document.getElementById('modalDetalhes');
const modalDetalhesBody = document.getElementById('modalDetalhesBody');
const modalDetalhesClose = document.getElementById('modalDetalhesClose');
const modalDetalhesCloseBtn = document.getElementById('modalDetalhesCloseBtn');

const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content || '';
const amputacaoDetails = document.querySelector('details.amputacao');
const formatadorNumero = new Intl.NumberFormat('pt-BR');

let paginaAtual = 1;
let modoEdicao = false;
let amputacaoId = null;
let searchTimer = null;
let pendingDeleteId = null;

// Amputation checkboxes
const chkDesartOmbro = document.getElementById('desarticulacao_ombro');
const chkTransumeral = document.getElementById('transumeral');
const chkDesartCotovelo = document.getElementById('desarticulacao_cotovelo');
const chkTransradial = document.getElementById('transradial');
const chkDesartPunho = document.getElementById('desarticulacao_punho');
const chkParcialMao = document.getElementById('parcial_mao');
const chkDedosMao = document.getElementById('dedos_mao');
const chkDesartQuadril = document.getElementById('desarticulacao_quadril');
const chkTransfemoral = document.getElementById('transfemoral');
const chkDesartJoelho = document.getElementById('desarticulacao_joelho');
const chkTranstibal = document.getElementById('transtibal');
const chkSyme = document.getElementById('syme');
const chkParcialPe = document.getElementById('parcial_pe');
const chkDedosPe = document.getElementById('dedos_pe');
const chkDireito = document.getElementById('direito');
const chkEsquerdo = document.getElementById('esquerdo');
const inputTempoAmputacao = document.getElementById('tempo_amputacao');
const inputLadoDominante = document.getElementById('lado_dominante');

const camposAmputacao = [
    chkDesartOmbro, chkTransumeral, chkDesartCotovelo, chkTransradial,
    chkDesartPunho, chkParcialMao, chkDedosMao, chkDesartQuadril,
    chkTransfemoral, chkDesartJoelho, chkTranstibal, chkSyme,
    chkParcialPe, chkDedosPe, chkDireito, chkEsquerdo,
];

const SALVAR_ICON = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>';

// ===== Utility Functions =====
function escapeHtml(value) {
    if (value === null || value === undefined || value === '') return '-';
    return String(value).replace(/[&<>"']/g, (char) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;',
    }[char]));
}

function formatarData(valor) {
    if (!valor) return '-';
    const partes = String(valor).slice(0, 10).split('-');
    if (partes.length !== 3) return escapeHtml(valor);
    const [ano, mes, dia] = partes;
    return `${dia}/${mes}/${ano}`;
}

// ===== CPF Mask =====
function aplicarMascaraCPF(value) {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    let masked = digits;
    if (digits.length > 3) masked = digits.slice(0, 3) + '.' + digits.slice(3);
    if (digits.length > 6) masked = digits.slice(0, 3) + '.' + digits.slice(3, 6) + '.' + digits.slice(6);
    if (digits.length > 9) masked = digits.slice(0, 3) + '.' + digits.slice(3, 6) + '.' + digits.slice(6, 9) + '-' + digits.slice(9);
    return masked;
}

if (inputCpf) {
    inputCpf.addEventListener('input', (e) => {
        const pos = e.target.selectionStart;
        const before = e.target.value.length;
        e.target.value = aplicarMascaraCPF(e.target.value);
        const after = e.target.value.length;
        const newPos = pos + (after - before);
        e.target.setSelectionRange(newPos, newPos);
    });
}

// ===== Toast Notifications =====
function mostrarToast(texto, tipo = 'sucesso') {
    const toast = document.createElement('div');
    toast.className = `toast ${tipo}`;

    const iconSvg = tipo === 'sucesso'
        ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>'
        : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';

    const title = tipo === 'sucesso' ? 'Sucesso' : 'Erro';

    toast.innerHTML = `
        <div class="toast-icon">${iconSvg}</div>
        <div class="toast-body">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${escapeHtml(texto)}</div>
        </div>
        <button type="button" class="toast-close" aria-label="Fechar">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
    `;

    toastContainer.appendChild(toast);

    const closeBtn = toast.querySelector('.toast-close');
    const dismiss = () => {
        toast.classList.add('removing');
        setTimeout(() => toast.remove(), 300);
    };
    closeBtn.addEventListener('click', dismiss);
    setTimeout(dismiss, 4000);
}

// Legacy redirect to toast
function mostrarMensagem(texto, tipo = 'sucesso') {
    mostrarToast(texto, tipo);
}

// ===== Theme Toggle =====
function aplicarTema(isLight) {
    document.body.classList.toggle('light-mode', isLight);
    const moonIcon = themeToggle?.querySelector('.icon-moon');
    const sunIcon = themeToggle?.querySelector('.icon-sun');
    if (moonIcon) moonIcon.style.display = isLight ? 'none' : 'block';
    if (sunIcon) sunIcon.style.display = isLight ? 'block' : 'none';
}

function initTema() {
    const saved = localStorage.getItem('clinipro-theme');
    aplicarTema(saved === 'light');
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const isLight = !document.body.classList.contains('light-mode');
        aplicarTema(isLight);
        localStorage.setItem('clinipro-theme', isLight ? 'light' : 'dark');
    });
}

// ===== Real-time Clock =====
function atualizarRelogio() {
    if (!relogio) return;
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    relogio.textContent = `${h}:${m}:${s}`;
}

// ===== Sidebar Toggle =====
if (sidebarToggle) {
    sidebarToggle.addEventListener('click', () => {
        sidebar?.classList.toggle('is-open');
    });
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 980 && sidebar?.classList.contains('is-open')) {
            if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
                sidebar.classList.remove('is-open');
            }
        }
    });
}

// ===== Animated Counter =====
function animarContador(element, targetValue) {
    if (!element) return;
    const target = Number(targetValue) || 0;
    const duration = 600;
    const start = Number(element.textContent.replace(/\D/g, '')) || 0;
    if (start === target) { element.textContent = formatadorNumero.format(target); return; }
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(start + (target - start) * eased);
        element.textContent = formatadorNumero.format(current);
        if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}

// ===== Stats =====
function atualizarStats(meta = {}, pacientes = []) {
    const total = Number(meta.total ?? 0);
    animarContador(statTotalPacientes, total);

    const hoje = new Date().toISOString().slice(0, 10);
    const cadastrosHoje = pacientes.filter(p => {
        const created = p.created_at || '';
        return created.slice(0, 10) === hoje;
    }).length;
    animarContador(statCadastrosHoje, cadastrosHoje);

    const amputacoes = pacientes.filter(p => {
        if (!p.amputacoes || !p.amputacoes.length) return false;
        const a = p.amputacoes[0];
        const ampKeys = ['desarticulacao_ombro','transumeral','desarticulacao_cotovelo','transradial','desarticulacao_punho','parcial_mao','dedos_mao','desarticulacao_quadril','transfemoral','desarticulacao_joelho','transtibal','syme','parcial_pe','dedos_pe'];
        return ampKeys.some(k => a[k] === 1 || a[k] === '1' || a[k] === true);
    }).length;
    animarContador(statAmputacoes, amputacoes);
}

// ===== Amputation & Form Helpers =====
function limparCamposAmputacao() {
    camposAmputacao.forEach((campo) => { if (campo) campo.checked = false; });
    if (inputTempoAmputacao) inputTempoAmputacao.value = '';
    if (inputLadoDominante) inputLadoDominante.value = '';
}

function atualizarModoFormulario(editando = false) {
    modoEdicao = editando;
    formModeBadge.textContent = editando ? 'Editando paciente' : 'Novo cadastro';
    formModeBadge.classList.toggle('is-editing', editando);
    btnCancelarEdicao.classList.toggle('is-hidden', !editando);
    btnSalvar.innerHTML = SALVAR_ICON + (editando ? 'Atualizar Paciente' : 'Salvar Paciente');
}

function limparFormulario() {
    formPaciente.reset();
    inputId.value = '';
    inputIdade.value = '';
    amputacaoId = null;
    limparCamposAmputacao();
    atualizarModoFormulario(false);
    formPaciente.querySelectorAll('.is-valid, .is-invalid').forEach(el => {
        el.classList.remove('is-valid', 'is-invalid');
    });
}

function focarFormulario() {
    formPaciente.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => inputNome.focus(), 250);
}

function alternarEnvioFormulario(enviando) {
    btnSalvar.disabled = enviando;
    if (enviando) {
        btnSalvar.innerHTML = '<span class="spinner" aria-hidden="true"></span>' + (modoEdicao ? 'Atualizando...' : 'Salvando...');
    } else {
        btnSalvar.innerHTML = SALVAR_ICON + (modoEdicao ? 'Atualizar Paciente' : 'Salvar Paciente');
    }
}

function calcularIdade(dataNascimento) {
    if (!dataNascimento) return '';
    const data = new Date(dataNascimento);
    if (Number.isNaN(data.getTime())) return '';
    const hoje = new Date();
    let idade = hoje.getFullYear() - data.getFullYear();
    const mesAtual = hoje.getMonth();
    const mesNascimento = data.getMonth();
    if (mesAtual < mesNascimento || (mesAtual === mesNascimento && hoje.getDate() < data.getDate())) idade -= 1;
    return idade;
}

function atualizarIdadeComBaseNaDataNascimento() {
    const idadeCalculada = calcularIdade(inputDataNascimento.value);
    inputIdade.value = idadeCalculada === '' ? '' : String(idadeCalculada);
}

function montarPayload() {
    return {
        nome: inputNome.value.trim(),
        genero: inputGenero.value.trim(),
        prontuario: inputProntuario.value ? Number(inputProntuario.value) : null,
        cpf: inputCpf.value.trim(),
        data_nascimento: inputDataNascimento.value.trim(),
        idade: inputIdade.value ? Number(inputIdade.value) : null,
        profissao: inputProfissao.value.trim(),
        acompanhante: inputAcompanhante.value.trim(),
        data_avaliacao: inputDataAvaliacao.value.trim(),
    };
}

function montarAmputacaoPayload() {
    return {
        desarticulacao_ombro: chkDesartOmbro?.checked ? 1 : 0,
        transumeral: chkTransumeral?.checked ? 1 : 0,
        desarticulacao_cotovelo: chkDesartCotovelo?.checked ? 1 : 0,
        transradial: chkTransradial?.checked ? 1 : 0,
        desarticulacao_punho: chkDesartPunho?.checked ? 1 : 0,
        parcial_mao: chkParcialMao?.checked ? 1 : 0,
        dedos_mao: chkDedosMao?.checked ? 1 : 0,
        desarticulacao_quadril: chkDesartQuadril?.checked ? 1 : 0,
        transfemoral: chkTransfemoral?.checked ? 1 : 0,
        desarticulacao_joelho: chkDesartJoelho?.checked ? 1 : 0,
        transtibal: chkTranstibal?.checked ? 1 : 0,
        syme: chkSyme?.checked ? 1 : 0,
        parcial_pe: chkParcialPe?.checked ? 1 : 0,
        dedos_pe: chkDedosPe?.checked ? 1 : 0,
        direito: chkDireito?.checked ? 1 : 0,
        esquerdo: chkEsquerdo?.checked ? 1 : 0,
        tempo_amputacao: inputTempoAmputacao?.value?.trim() || '',
        lado_dominante: inputLadoDominante?.value?.trim() || '',
    };
}

// ===== Skeleton Loading =====
function renderizarCarregamento() {
    listaPacientes.setAttribute('aria-busy', 'true');
    const skeletonRows = Array.from({ length: 5 }, () => `
        <tr class="skeleton-row">
            <td><div class="skeleton" style="width:48px;height:18px"></div></td>
            <td><div class="skeleton" style="width:140px;height:18px"></div></td>
            <td><div class="skeleton" style="width:70px;height:18px"></div></td>
            <td><div class="skeleton" style="width:80px;height:18px"></div></td>
            <td><div class="skeleton" style="width:110px;height:18px"></div></td>
            <td><div class="skeleton" style="width:36px;height:18px"></div></td>
            <td><div class="skeleton" style="width:85px;height:18px"></div></td>
            <td><div class="skeleton" style="width:100px;height:18px"></div></td>
            <td><div class="skeleton" style="width:140px;height:18px"></div></td>
        </tr>
    `).join('');
    listaPacientes.innerHTML = skeletonRows;
}

function renderizarVazio() {
    const temBusca = pesquisa.value.trim().length > 0;
    const texto = temBusca ? 'Nenhum paciente corresponde à busca.' : 'Nenhum paciente cadastrado.';
    listaPacientes.innerHTML = `
        <tr>
            <td colspan="9">
                <div class="empty-state">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="opacity:0.3;margin-bottom:8px">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                    </svg>
                    <span>${texto}</span>
                </div>
            </td>
        </tr>
    `;
}

function atualizarResumo(meta = {}, quantidadeVisivel = 0) {
    const total = Number(meta.total ?? quantidadeVisivel);
    const pagina = Number(meta.current_page ?? paginaAtual);
    const paginas = Number(meta.last_page ?? 1);
    const inicio = meta.from ?? (total ? 1 : 0);
    const fim = meta.to ?? quantidadeVisivel;

    totalPacientes.textContent = formatadorNumero.format(total);
    paginaAtualResumo.textContent = formatadorNumero.format(pagina || 1);
    totalPaginasResumo.textContent = formatadorNumero.format(paginas || 1);

    if (!total) {
        listaResumo.textContent = pesquisa.value.trim()
            ? 'Nenhum resultado para a busca atual.'
            : 'Nenhum registro cadastrado.';
        return;
    }
    listaResumo.textContent = `${formatadorNumero.format(inicio)} a ${formatadorNumero.format(fim)} de ${formatadorNumero.format(total)} registros`;
}

function formatAmputacoes(paciente) {
    const labels = {
        desarticulacao_ombro: 'Ombro', transumeral: 'Transumeral',
        desarticulacao_cotovelo: 'Cotovelo', transradial: 'Transradial',
        desarticulacao_punho: 'Punho', parcial_mao: 'Parcial mão',
        dedos_mao: 'Dedos mão', desarticulacao_quadril: 'Quadril',
        transfemoral: 'Transfemoral', desarticulacao_joelho: 'Joelho',
        transtibal: 'Transtibial', syme: 'Syme',
        parcial_pe: 'Parcial pé', dedos_pe: 'Dedos pé',
    };

    const amps = paciente.amputacoes && paciente.amputacoes.length ? paciente.amputacoes[0] : null;
    if (!amps) return '<span class="muted-dash">—</span>';

    const selected = Object.keys(labels).filter((key) => (
        amps[key] === 1 || amps[key] === '1' || amps[key] === true
    ));

    if (!selected.length) return '<span class="muted-dash">—</span>';

    return selected.map((key, index) => {
        const extraClass = index > 2 ? ' tag-hidden' : '';
        return `<span class="tag${extraClass}">${escapeHtml(labels[key])}</span>`;
    }).concat(selected.length > 3 ? [
        `<button type="button" class="tag tag-more" aria-label="Mostrar mais amputações">+${selected.length - 3}</button>`,
    ] : []).join('');
}

function renderizarPacientes(pacientes) {
    listaPacientes.innerHTML = pacientes.map((paciente) => {
        const idPaciente = escapeHtml(paciente.id_paciente);
        return `
            <tr>
                <td><span class="id-pill">#${idPaciente}</span></td>
                <td>${escapeHtml(paciente.nome)}</td>
                <td>${escapeHtml(paciente.genero)}</td>
                <td>${escapeHtml(paciente.prontuario)}</td>
                <td>${escapeHtml(paciente.cpf)}</td>
                <td>${escapeHtml(paciente.idade)}</td>
                <td>${formatarData(paciente.data_avaliacao)}</td>
                <td><div class="tag-list">${formatAmputacoes(paciente)}</div></td>
                <td>
                    <div class="acoes">
                        <button type="button" class="btn-ver" data-id="${idPaciente}" title="Ver detalhes">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                            Ver
                        </button>
                        <button type="button" class="btn-editar" data-id="${idPaciente}" title="Editar paciente">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                            Editar
                        </button>
                        <button type="button" class="btn-excluir" data-id="${idPaciente}" title="Excluir paciente">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                            Excluir
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// ===== API: Load Patients =====
async function carregarPacientes(page = 1) {
    paginaAtual = page;
    renderizarCarregamento();

    const params = new URLSearchParams({ page, busca: pesquisa.value.trim() });

    try {
        const response = await fetch(`/paciente?${params.toString()}`, {
            headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
        });

        if (!response.ok) throw new Error('Não foi possível carregar os pacientes.');

        const resultado = await response.json();
        const pacientes = resultado.data?.data || [];
        const meta = resultado.data || {};

        listaPacientes.removeAttribute('aria-busy');
        atualizarResumo(meta, pacientes.length);
        atualizarStats(meta, pacientes);

        if (!pacientes.length) {
            renderizarVazio();
            paginacao.innerHTML = '';
            return;
        }

        renderizarPacientes(pacientes);
        renderizarPaginacao(meta);
    } catch (error) {
        listaPacientes.removeAttribute('aria-busy');
        renderizarVazio();
        mostrarMensagem(error.message, 'erro');
    }
}

function renderizarPaginacao(meta) {
    const totalPaginas = meta.last_page || 1;
    const paginaAtualAtual = meta.current_page || 1;

    if (totalPaginas <= 1) { paginacao.innerHTML = ''; return; }

    const botoes = [
        `<button type="button" ${paginaAtualAtual === 1 ? 'disabled' : ''} data-page="${paginaAtualAtual - 1}">` +
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>' +
        ' Anterior</button>',
    ];

    for (let i = 1; i <= totalPaginas; i += 1) {
        botoes.push(`<button type="button" class="${i === paginaAtualAtual ? 'pagina-ativa' : ''}" data-page="${i}">${i}</button>`);
    }

    botoes.push(
        `<button type="button" ${paginaAtualAtual === totalPaginas ? 'disabled' : ''} data-page="${paginaAtualAtual + 1}">Próximo ` +
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>' +
        '</button>'
    );

    paginacao.innerHTML = botoes.join('');
}

// ===== API: Save Patient =====
async function salvarPaciente(event) {
    event.preventDefault();
    alternarEnvioFormulario(true);

    const payload = montarPayload();

    try {
        const url = modoEdicao && inputId.value ? `/paciente/${inputId.value}` : '/paciente';
        const method = modoEdicao && inputId.value ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': csrfToken,
                'X-Requested-With': 'XMLHttpRequest',
            },
            body: JSON.stringify(payload),
        });

        const resultado = await response.json();
        if (!response.ok) throw new Error(resultado.message || 'Erro ao salvar paciente.');

        const pacienteId = resultado.data?.id_paciente || resultado.data?.id || inputId.value;
        const amputPayload = montarAmputacaoPayload();
        amputPayload.paciente_id = pacienteId;

        const hasAmputData = Object.keys(amputPayload).some((key) => {
            if (key === 'paciente_id') return false;
            const value = amputPayload[key];
            return (typeof value === 'number' && value === 1) || (typeof value === 'string' && value.length > 0);
        });

        if (hasAmputData) {
            try {
                const ampUrl = amputacaoId ? `/amputacao/${amputacaoId}` : '/amputacao';
                const ampMethod = amputacaoId ? 'PUT' : 'POST';
                const ampResp = await fetch(ampUrl, {
                    method: ampMethod,
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'X-CSRF-TOKEN': csrfToken,
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                    body: JSON.stringify(amputPayload),
                });
                const ampResult = await ampResp.json();
                if (ampResp.ok) {
                    amputacaoId = ampResult.data?.id || ampResult.data?.id_amputacao || amputacaoId;
                } else {
                    console.warn('Amputacao save error', ampResult);
                }
            } catch (err) {
                console.warn('Erro ao salvar amputação', err);
            }
        }

        mostrarMensagem(resultado.message || 'Paciente salvo com sucesso.', 'sucesso');
        limparFormulario();
        carregarPacientes(1);
    } catch (error) {
        mostrarMensagem(error.message, 'erro');
    } finally {
        alternarEnvioFormulario(false);
    }
}

// ===== Amputation Fill =====
function preencherAmputacao(found) {
    amputacaoId = found.id || found.id_amputacao || null;
    if (chkDesartOmbro) chkDesartOmbro.checked = !!found.desarticulacao_ombro;
    if (chkTransumeral) chkTransumeral.checked = !!found.transumeral;
    if (chkDesartCotovelo) chkDesartCotovelo.checked = !!found.desarticulacao_cotovelo;
    if (chkTransradial) chkTransradial.checked = !!found.transradial;
    if (chkDesartPunho) chkDesartPunho.checked = !!found.desarticulacao_punho;
    if (chkParcialMao) chkParcialMao.checked = !!found.parcial_mao;
    if (chkDedosMao) chkDedosMao.checked = !!found.dedos_mao;
    if (chkDesartQuadril) chkDesartQuadril.checked = !!found.desarticulacao_quadril;
    if (chkTransfemoral) chkTransfemoral.checked = !!found.transfemoral;
    if (chkDesartJoelho) chkDesartJoelho.checked = !!found.desarticulacao_joelho;
    if (chkTranstibal) chkTranstibal.checked = !!found.transtibal;
    if (chkSyme) chkSyme.checked = !!found.syme;
    if (chkParcialPe) chkParcialPe.checked = !!found.parcial_pe;
    if (chkDedosPe) chkDedosPe.checked = !!found.dedos_pe;
    if (chkDireito) chkDireito.checked = !!found.direito;
    if (chkEsquerdo) chkEsquerdo.checked = !!found.esquerdo;
    if (inputTempoAmputacao) inputTempoAmputacao.value = found.tempo_amputacao || '';
    if (inputLadoDominante) inputLadoDominante.value = found.lado_dominante || '';
}

async function carregarAmputacaoDoPaciente(pacienteId) {
    try {
        const response = await fetch(`/amputacao?paciente_id=${pacienteId}`, {
            headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
        });
        if (!response.ok) return;
        const data = await response.json();
        const list = data.data || [];
        const found = Array.isArray(list) ? list[0] : null;
        if (found) {
            preencherAmputacao(found);
            if (amputacaoDetails) amputacaoDetails.open = true;
            return;
        }
        amputacaoId = null;
        limparCamposAmputacao();
    } catch (err) {
        console.warn('Erro ao carregar amputação', err);
    }
}

// ===== API: Edit Patient =====
async function editarPaciente(id) {
    try {
        const response = await fetch(`/paciente/${id}`, {
            headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
        });
        if (!response.ok) throw new Error('Não foi possível carregar o paciente.');

        const resultado = await response.json();
        const paciente = resultado.data;

        inputId.value = paciente.id_paciente;
        inputNome.value = paciente.nome || '';
        inputGenero.value = paciente.genero || '';
        inputProntuario.value = paciente.prontuario ?? '';
        inputCpf.value = paciente.cpf || '';
        inputDataNascimento.value = paciente.data_nascimento || '';
        inputIdade.value = paciente.idade ?? '';
        if (!inputIdade.value && inputDataNascimento.value) atualizarIdadeComBaseNaDataNascimento();
        inputProfissao.value = paciente.profissao || '';
        inputAcompanhante.value = paciente.acompanhante || '';
        inputDataAvaliacao.value = paciente.data_avaliacao || '';

        limparCamposAmputacao();
        atualizarModoFormulario(true);
        focarFormulario();
        carregarAmputacaoDoPaciente(paciente.id_paciente);
    } catch (error) {
        mostrarMensagem(error.message, 'erro');
    }
}

// ===== Custom Confirm Modal =====
function abrirModalConfirm(id) {
    pendingDeleteId = id;
    modalConfirmMessage.textContent = `Deseja realmente excluir o paciente #${id}? Esta ação não pode ser desfeita.`;
    modalConfirm.style.display = 'flex';
}

function fecharModalConfirm() {
    modalConfirm.style.display = 'none';
    pendingDeleteId = null;
}

modalConfirmCancel?.addEventListener('click', fecharModalConfirm);
modalConfirmClose?.addEventListener('click', fecharModalConfirm);
modalConfirm?.addEventListener('click', (e) => {
    if (e.target === modalConfirm) fecharModalConfirm();
});

modalConfirmOk?.addEventListener('click', async () => {
    if (!pendingDeleteId) return;
    const id = pendingDeleteId;
    fecharModalConfirm();
    await excluirPaciente(id);
});

// ===== API: Delete Patient =====
async function excluirPaciente(id) {
    try {
        const response = await fetch(`/paciente/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'X-CSRF-TOKEN': csrfToken,
                'X-Requested-With': 'XMLHttpRequest',
            },
        });
        const resultado = await response.json();
        if (!response.ok) throw new Error(resultado.message || 'Erro ao excluir paciente.');
        mostrarMensagem(resultado.message || 'Paciente excluído com sucesso.', 'sucesso');
        carregarPacientes(paginaAtual);
    } catch (error) {
        mostrarMensagem(error.message, 'erro');
    }
}

// ===== Patient Details Modal =====
async function verDetalhesPaciente(id) {
    try {
        const response = await fetch(`/paciente/${id}`, {
            headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
        });
        if (!response.ok) throw new Error('Não foi possível carregar os detalhes.');
        const resultado = await response.json();
        const p = resultado.data;

        let ampHtml = '<p style="color:var(--text-muted)">Nenhuma amputação registrada.</p>';
        try {
            const ampResp = await fetch(`/amputacao?paciente_id=${p.id_paciente}`, {
                headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
            });
            if (ampResp.ok) {
                const ampData = await ampResp.json();
                const amp = Array.isArray(ampData.data) ? ampData.data[0] : null;
                if (amp) {
                    const ampLabels = {
                        desarticulacao_ombro: 'Desart. Ombro', transumeral: 'Transumeral',
                        desarticulacao_cotovelo: 'Desart. Cotovelo', transradial: 'Transradial',
                        desarticulacao_punho: 'Desart. Punho', parcial_mao: 'Parcial Mão',
                        dedos_mao: 'Dedos Mão', desarticulacao_quadril: 'Desart. Quadril',
                        transfemoral: 'Transfemoral', desarticulacao_joelho: 'Desart. Joelho',
                        transtibal: 'Transtibial', syme: 'Syme',
                        parcial_pe: 'Parcial Pé', dedos_pe: 'Dedos Pé',
                    };
                    const active = Object.keys(ampLabels).filter(k => amp[k] === 1 || amp[k] === '1' || amp[k] === true);
                    if (active.length) {
                        ampHtml = '<div class="tag-list" style="margin-top:6px">' + active.map(k => `<span class="tag">${ampLabels[k]}</span>`).join('') + '</div>';
                    }
                    if (amp.direito) ampHtml += ' <span class="tag" style="margin-top:6px">Lado Direito</span>';
                    if (amp.esquerdo) ampHtml += ' <span class="tag" style="margin-top:6px">Lado Esquerdo</span>';
                    if (amp.tempo_amputacao) ampHtml += `<p style="margin-top:10px;color:var(--text-secondary)"><strong>Tempo:</strong> ${escapeHtml(amp.tempo_amputacao)}</p>`;
                    if (amp.lado_dominante) ampHtml += `<p style="color:var(--text-secondary)"><strong>Lado dominante:</strong> ${escapeHtml(amp.lado_dominante)}</p>`;
                }
            }
        } catch (_) { /* ignore */ }

        modalDetalhesBody.innerHTML = `
            <div class="detail-grid">
                <div class="detail-item"><label>Nome</label><p>${escapeHtml(p.nome)}</p></div>
                <div class="detail-item"><label>Gênero</label><p>${escapeHtml(p.genero)}</p></div>
                <div class="detail-item"><label>Prontuário</label><p>${escapeHtml(p.prontuario)}</p></div>
                <div class="detail-item"><label>CPF</label><p>${escapeHtml(p.cpf)}</p></div>
                <div class="detail-item"><label>Data de Nascimento</label><p>${formatarData(p.data_nascimento)}</p></div>
                <div class="detail-item"><label>Idade</label><p>${escapeHtml(p.idade)}</p></div>
                <div class="detail-item"><label>Profissão</label><p>${escapeHtml(p.profissao)}</p></div>
                <div class="detail-item"><label>Acompanhante</label><p>${escapeHtml(p.acompanhante)}</p></div>
                <div class="detail-item"><label>Data de Avaliação</label><p>${formatarData(p.data_avaliacao)}</p></div>
            </div>
            <div style="margin-top:18px;padding-top:14px;border-top:1px solid var(--border)">
                <label style="font-size:0.82rem;color:var(--text-muted);font-weight:700;text-transform:uppercase;margin-bottom:8px;display:block">Amputações</label>
                ${ampHtml}
            </div>
        `;

        modalDetalhes.style.display = 'flex';
    } catch (error) {
        mostrarMensagem(error.message, 'erro');
    }
}

function fecharModalDetalhes() {
    modalDetalhes.style.display = 'none';
}

modalDetalhesClose?.addEventListener('click', fecharModalDetalhes);
modalDetalhesCloseBtn?.addEventListener('click', fecharModalDetalhes);
modalDetalhes?.addEventListener('click', (e) => {
    if (e.target === modalDetalhes) fecharModalDetalhes();
});

// ===== CSV Export =====
async function exportarCSV() {
    try {
        mostrarToast('Gerando arquivo CSV...', 'sucesso');
        const response = await fetch('/paciente?page=1&per_page=10000', {
            headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
        });
        if (!response.ok) throw new Error('Erro ao carregar dados para exportação.');
        const resultado = await response.json();
        const pacientes = resultado.data?.data || [];

        if (!pacientes.length) {
            mostrarToast('Nenhum paciente para exportar.', 'erro');
            return;
        }

        const headers = ['ID', 'Nome', 'Gênero', 'Prontuário', 'CPF', 'Idade', 'Profissão', 'Data Avaliação'];
        const rows = pacientes.map(p => [
            p.id_paciente,
            `"${(p.nome || '').replace(/"/g, '""')}"`,
            p.genero || '',
            p.prontuario || '',
            p.cpf || '',
            p.idade || '',
            `"${(p.profissao || '').replace(/"/g, '""')}"`,
            p.data_avaliacao || '',
        ].join(','));

        const csvContent = '\uFEFF' + headers.join(',') + '\n' + rows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `pacientes_${new Date().toISOString().slice(0, 10)}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    } catch (error) {
        mostrarToast(error.message, 'erro');
    }
}

btnExportCSV?.addEventListener('click', exportarCSV);

// ===== Form Validation Visual =====
const camposObrigatorios = [inputNome, inputGenero, inputProntuario, inputCpf, inputDataNascimento, inputDataAvaliacao];
camposObrigatorios.forEach(campo => {
    if (!campo) return;
    campo.addEventListener('blur', () => {
        const hasValue = campo.tagName === 'SELECT' ? campo.value !== '' : campo.value.trim() !== '';
        campo.classList.toggle('is-valid', hasValue);
        campo.classList.toggle('is-invalid', !hasValue);
    });
    campo.addEventListener('input', () => {
        campo.classList.remove('is-invalid');
        const hasValue = campo.tagName === 'SELECT' ? campo.value !== '' : campo.value.trim() !== '';
        if (hasValue) campo.classList.add('is-valid');
    });
});

// ===== Event Listeners =====
inputDataNascimento.addEventListener('change', atualizarIdadeComBaseNaDataNascimento);
inputDataNascimento.addEventListener('input', atualizarIdadeComBaseNaDataNascimento);

formPaciente.addEventListener('submit', salvarPaciente);

btnCancelarEdicao.addEventListener('click', () => {
    limparFormulario();
    inputNome.focus();
});

btnNovoPaciente.addEventListener('click', () => {
    limparFormulario();
    focarFormulario();
});

listaPacientes.addEventListener('click', (event) => {
    const botaoMaisTags = event.target.closest('.tag-more');
    const botaoEditar = event.target.closest('.btn-editar');
    const botaoExcluir = event.target.closest('.btn-excluir');
    const botaoVer = event.target.closest('.btn-ver');

    if (botaoMaisTags) {
        const tagList = botaoMaisTags.closest('.tag-list');
        tagList?.classList.add('is-expanded');
        botaoMaisTags.remove();
        return;
    }

    if (botaoVer) verDetalhesPaciente(botaoVer.dataset.id);
    if (botaoEditar) editarPaciente(botaoEditar.dataset.id);
    if (botaoExcluir) abrirModalConfirm(botaoExcluir.dataset.id);
});

paginacao.addEventListener('click', (event) => {
    const botao = event.target.closest('button[data-page]');
    if (!botao) return;
    carregarPacientes(Number(botao.dataset.page));
});

pesquisa.addEventListener('input', () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => carregarPacientes(1), 260);
});

// ===== Initialization =====
initTema();
atualizarRelogio();
setInterval(atualizarRelogio, 1000);
atualizarModoFormulario(false);
carregarPacientes(1);
