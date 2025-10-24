// ✅ ELEMENTOS DO HTML
const urlForm = document.getElementById('url-form');
const urlInput = document.getElementById('url-input');
const resultadoElement = document.getElementById('resultado');
const urlEncurtadaElement = document.getElementById('url-encurtada');
const erroElement = document.getElementById('erro');

// ✅ URL BASE
const API_BASE = window.location.origin;

console.log('🔧 Script carregado. API Base:', API_BASE);

// ✅ TESTAR CONEXÃO
async function testarConexao() {
    try {
        console.log('🧪 Testando conexão com:', API_BASE + '/api/teste');
        const response = await fetch(API_BASE + '/api/teste');
        const data = await response.json();
        console.log('✅ Conexão OK:', data);
        return true;
    } catch (error) {
        console.error('❌ Falha na conexão:', error);
        return false;
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
    
    esconderResultado();
    esconderErro();
    
    try {
        console.log('🔄 Enviando URL:', url);
        
        const response = await fetch(API_BASE + '/api/encurtar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ urlOriginal: url })
        });
        
        console.log('📊 Status:', response.status);
        
        if (!response.ok) {
            throw new Error('Erro no servidor: ' + response.status);
        }
        
        const data = await response.json();
        console.log('✅ Sucesso:', data);
        
        mostrarResultado(data);
        
    } catch (error) {
        console.error('❌ Erro:', error);
        mostrarErro('Erro: ' + error.message);
    }
}

// ✅ MOSTRAR RESULTADO
function mostrarResultado(data) {
    urlEncurtadaElement.href = data.urlEncurtada;
    urlEncurtadaElement.textContent = data.urlEncurtada;
    resultadoElement.classList.remove('hidden');
}

// ✅ MOSTRAR ERRO
function mostrarErro(mensagem) {
    erroElement.textContent = mensagem;
    erroElement.classList.remove('hidden');
}

// ✅ ESCONDER ELEMENTOS
function esconderResultado() {
    resultadoElement.classList.add('hidden');
}

function esconderErro() {
    erroElement.classList.add('hidden');
}

// ✅ CONFIGURAR EVENTOS
urlForm.addEventListener('submit', encurtarURL);

// ✅ INICIAR TESTE
testarConexao();
