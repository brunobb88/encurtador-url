const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
// ✅ IMPORTANTE: Usa a porta do Render OU 3000 localmente
const PORT = process.env.PORT || 3000;

// ✅ CONFIGURAÇÃO ESSENCIAL
app.use(express.json());
app.use(express.static('public'));

// ✅ ARQUIVO PARA PERSISTÊNCIA
const DB_FILE = path.join(__dirname, 'data', 'urls.json');

// ✅ GARANTIR QUE A PASTA DATA EXISTE
if (!fs.existsSync(path.dirname(DB_FILE))) {
    fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
}

// ✅ FUNÇÃO PARA CARREGAR URLs DO ARQUIVO
function carregarURLs() {
    try {
        if (fs.existsSync(DB_FILE)) {
            const data = fs.readFileSync(DB_FILE, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.log('📂 Criando novo arquivo de banco de dados...');
    }
    return {};
}

// ✅ FUNÇÃO PARA SALVAR URLs NO ARQUIVO
function salvarURLs(urls) {
    fs.writeFileSync(DB_FILE, JSON.stringify(urls, null, 2));
}

// ✅ CARREGA URLs AO INICIAR O SERVIDOR
let urlDatabase = carregarURLs();
console.log(`📊 ${Object.keys(urlDatabase).length} URLs carregadas do banco de dados`);

// ✅ ROTA PARA ENCURTAR URL
app.post('/encurtar', (req, res) => {
    console.log('📨 Recebendo requisição...');
    
    const { urlOriginal } = req.body;
    
    if (!urlOriginal) {
        return res.status(400).json({ erro: 'URL é obrigatória' });
    }
    
    // Validação básica de URL
    try {
        new URL(urlOriginal);
    } catch (error) {
        return res.status(400).json({ erro: 'URL inválida' });
    }
    
    // Gera um ID único
    const id = Math.random().toString(36).substring(2, 8);
    
    // ✅ CORREÇÃO PARA DEPLOY: Usa URL dinâmica do Render
    const dominio = req.headers.host || `localhost:${PORT}`;
    const protocolo = req.headers['x-forwarded-proto'] || 'http';
    const urlBase = `${protocolo}://${dominio}`;
    
    // Salva a URL no banco de dados
    urlDatabase[id] = {
        urlOriginal: urlOriginal,
        dataCriacao: new Date().toISOString(),
        cliques: 0
    };
    
    // Salva no arquivo
    salvarURLs(urlDatabase);
    console.log('💾 URL salva:', { id, urlOriginal });
    
    res.json({
        success: true,
        urlEncurtada: `${urlBase}/${id}`,
        id: id
    });
});

// ✅ ROTA DE REDIRECIONAMENTO
app.get('/:id', (req, res) => {
    const id = req.params.id;
    console.log('🔄 Tentando redirecionar ID:', id);
    
    const urlData = urlDatabase[id];
    
    if (urlData) {
        // Conta o clique
        urlData.cliques = (urlData.cliques || 0) + 1;
        salvarURLs(urlDatabase);
        
        console.log('📍 Redirecionando para:', urlData.urlOriginal);
        console.log('👆 Cliques totais:', urlData.cliques);
        
        res.redirect(urlData.urlOriginal);
    } else {
        console.log('❌ ID não encontrado:', id);
        res.status(404).send(`
            <html>
                <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
                    <h1>🔍 URL não encontrada</h1>
                    <p>O link encurtado <strong>${id}</strong> não existe ou expirou.</p>
                    <a href="/" style="color: #667eea; text-decoration: none;">↩️ Voltar ao encurtador</a>
                </body>
            </html>
        `);
    }
});

// ✅ ROTA PARA ESTATÍSTICAS
app.get('/api/estatisticas/:id', (req, res) => {
    const id = req.params.id;
    const urlData = urlDatabase[id];
    
    if (urlData) {
        res.json({
            success: true,
            cliques: urlData.cliques || 0,
            dataCriacao: urlData.dataCriacao,
            urlOriginal: urlData.urlOriginal
        });
    } else {
        res.status(404).json({ success: false, erro: 'URL não encontrada' });
    }
});

// ✅ ROTA PRINCIPAL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ✅ INICIA O SERVIDOR
app.listen(PORT, () => {
    console.log('===================================');
    console.log('🚀 SERVIDOR INICIADO COM SUCESSO!');
    console.log(`📡 Porta: ${PORT}`);
    console.log(`🌐 Modo: ${process.env.NODE_ENV || 'desenvolvimento'}`);
    console.log('===================================');
});
