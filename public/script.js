const urlForm = document.getElementById('url-form');
const urlInput = document.getElementById('url-input');
const resultadoElement = document.getElementById('resultado');
const urlEncurtadaElement = document.getElementById('url-encurtada');
const erroElement = document.getElementById('erro');

// ✅ ENCURTAR URL
urlForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const url = urlInput.value.trim();
    
    if (!url) {
        mostrarErro('Por favor, digite uma URL');
        return;
    }
    
    try {
        const response = await fetch('/encurtar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ urlOriginal: url })
        });
        
        if (!response.ok) {
            throw new Error('Erro ao encurtar URL');
        }
        
        const data = await response.json();
        mostrarResultado(data);
        
    } catch (error) {
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
