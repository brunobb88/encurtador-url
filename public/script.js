const urlForm = document.getElementById('url-form');
const urlInput = document.getElementById('url-input');
const btnEncurtar = document.getElementById('btn-encurtar');
const loadingElement = document.getElementById('loading');
const resultadoElement = document.getElementById('resultado');
const urlEncurtadaElement = document.getElementById('url-encurtada');
const btnCopiar = document.getElementById('btn-copiar');
const cliquesElement = document.getElementById('cliques');
const erroElement = document.getElementById('erro');
let currentUrlId = null;

// ✅ URL base dinâmica - funciona local e em produção
const BASE_URL = window.location.origin;

// ✅ ENCURTAR URL
urlForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    await encurtarURL();
});

// ✅ COPIAR URL
btnCopiar.addEventListener('click', copiarURL);

async function encurtarURL() {
    const url = urlInput.value.trim();
    
    if (!url) {
        mostrarErro('Por favor, digite uma URL');
        return;
    }
    
    // Validação básica de URL
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        mostrarErro('Por favor, inclua http:// ou https:// na URL');
        return;
    }
    
    mostrarLoading();
    esconderErro();
    
    try {
        const response = await fetch(`${BASE_URL}/encurtar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ urlOriginal: url })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.erro || `Erro HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        mostrarResultado(data);
        
    } catch (error) {
        console.error('❌ Erro:', error);
        mostrarErro('Erro: ' + error.message);
    } finally {
        esconderLoading();
    }
}

function mostrarResultado(data) {
    currentUrlId = data.id;
    urlEncurtadaElement.href = data.urlEncurtada;
    urlEncurtadaElement.textContent = data.urlEncurtada;
    resultadoElement.classList.remove('hidden');
    
    // Carrega estatísticas iniciais
    carregarEstatisticas(data.id);
}

async function carregarEstatisticas(id) {
    try {
        const response = await fetch(`${BASE_URL}/api/estatisticas/${id}`);
        if (response.ok) {
            const stats = await response.json();
            cliquesElement.textContent = stats.cliques;
        }
    } catch (error) {
        console.log('Não foi possível carregar estatísticas');
    }
}

async function copiarURL() {
    try {
        await navigator.clipboard.writeText(urlEncurtadaElement.href);
        
        // Feedback visual
        btnCopiar.textContent = '✓ Copiado!';
        btnCopiar.classList.add('copied');
        
        setTimeout(() => {
            btnCopiar.textContent = 'Copiar';
            btnCopiar.classList.remove('copied');
        }, 2000);
        
    } catch (error) {
        console.error('Erro ao copiar:', error);
        mostrarErro('Não foi possível copiar para a área de transferência');
    }
}

function mostrarLoading() {
    loadingElement.classList.remove('hidden');
    resultadoElement.classList.add('hidden');
    btnEncurtar.disabled = true;
    btnEncurtar.textContent = 'Processando...';
}

function esconderLoading() {
    loadingElement.classList.add('hidden');
    btnEncurtar.disabled = false;
    btnEncurtar.textContent = 'Encurtar';
}

function mostrarErro(mensagem) {
    erroElement.textContent = mensagem;
    erroElement.classList.remove('hidden');
    resultadoElement.classList.add('hidden');
}

function esconderErro() {
    erroElement.classList.add('hidden');
}

// ✅ TESTE DE CONEXÃO AO CARREGAR
window.addEventListener('load', async () => {
    console.log('🚀 Encurtador de URL carregado!');
    console.log('🌐 URL Base:', BASE_URL);
});
