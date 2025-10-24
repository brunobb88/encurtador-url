// ✅ ELEMENTOS
const urlForm = document.getElementById('url-form');
const urlInput = document.getElementById('url-input');
const resultadoElement = document.getElementById('resultado');
const urlEncurtadaElement = document.getElementById('url-encurtada');
const erroElement = document.getElementById('erro');

// ✅ URL BASE DINÂMICA
const API_BASE = window.location.origin;

console.log('🔧 Script carregado. API Base:', API_BASE);

// ✅ TESTE DE CONEXÃO AO CARREGAR
async function testarConexao() {
    try {
        console.log('🧪 Testando conexão com:', `${API_BASE}/api/teste`);
        const response = await fetch(`${API_BASE}/api/teste`);
        const data = await response.json();
        console.log('✅ Conexão OK:', data);
    } catch (error) {
        console.error('❌ Falha na conexão:', error);
    }
}

// ✅ ENCURTAR URL
async function encurtarURL(e) {
    e.preventDefault();
    
    const url = urlInput.value.trim();
    
    if (!url) {
        mostrarErro('Por favor, digite uma URL');
        return;
    }
    
    // Limpa estados anteriores
    esconderResultado();
    esconderErro();
    
    try {
        console.log('🔄 Enviando URL:', url);
        
        const response = await fetch(`${API_BASE}/api/encurtar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ urlOriginal: url })
        });
        
        console.log('📊 Status da resposta:', response.status);
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('✅ Resposta recebida:', data);
        
        mostrarResultado(data);
        
    } catch (error) {
        console.error('❌ Erro completo:', error);
        mostrarErro('Falha na conexão. Tente novamente.');
    }
}

function mostrarResultado(data) {
    urlEncurtadaElement.href = data.urlEncurtada;
    urlEncurtadaElement.textContent = data.urlEncurtada;
    resultadoElement.classList.remove('hidden');
}

function mostrarErro(mensagem) {
    erroElement.textContent = mensagem;
    erroElement.classList.remove('hidden');
}

function esconderResultado() {
    resultadoElement.classList.add('hidden');
}

function esconderErro() {
    erroElement.classList.add('hidden');
}

// ✅ EVENT LISTENERS
urlForm.addEventListener('submit', encurtarURL);

// ✅ TESTAR CONEXÃO AO INICIAR
testarConexao();
