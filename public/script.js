const urlForm = document.getElementById('url-form');
const urlInput = document.getElementById('url-input');
const resultadoElement = document.getElementById('resultado');
const urlEncurtadaElement = document.getElementById('url-encurtada');
const erroElement = document.getElementById('erro');

// ✅ 🔥 CORREÇÃO: URL dinâmica
const API_BASE = window.location.origin;

urlForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const url = urlInput.value.trim();
    
    if (!url) {
        mostrarErro('Por favor, digite uma URL');
        return;
    }
    
    // Validação básica
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        mostrarErro('Por favor, inclua http:// ou https://');
        return;
    }
    
    try {
        console.log('🔄 Enviando para:', `${API_BASE}/encurtar`);
        
        const response = await fetch(`${API_BASE}/encurtar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ urlOriginal: url })
        });
        
        console.log('📊 Status:', response.status);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.erro || 'Erro no servidor');
        }
        
        const data = await response.json();
        console.log('✅ Sucesso:', data);
        
        mostrarResultado(data);
        
    } catch (error) {
        console.error('❌ Erro completo:', error);
        mostrarErro('Erro: ' + error.message);
    }
});

function mostrarResultado(data) {
    urlEncurtadaElement.href = data.urlEncurtada;
    urlEncurtadaElement.textContent = data.urlEncurtada;
    resultadoElement.classList.remove('hidden');
    erroElement.classList.add('hidden');
}

function mostrarErro(mensagem) {
    erroElement.textContent = mensagem;
    erroElement.classList.remove('hidden');
    resultadoElement.classList.add('hidden');
}
