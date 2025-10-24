const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;

// ✅ 🔥 CORREÇÃO: CORS para produção
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(express.json());
app.use(express.static('public'));

// Rota de saúde
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Servidor funcionando!' });
});

// Rota principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Banco em memória
let urlDatabase = {};

// Encurtar URL
app.post('/encurtar', (req, res) => {
    console.log('📨 Recebendo:', req.body);
    
    const { urlOriginal } = req.body;
    
    if (!urlOriginal) {
        return res.status(400).json({ erro: 'URL é obrigatória' });
    }
    
    // Valida URL
    try {
        new URL(urlOriginal);
    } catch (e) {
        return res.status(400).json({ erro: 'URL inválida' });
    }
    
    const id = Math.random().toString(36).substring(2, 8);
    const urlBase = `https://${req.headers.host}`;
    
    urlDatabase[id] = urlOriginal;
    
    res.json({
        success: true,
        urlEncurtada: `${urlBase}/${id}`,
        id: id
    });
});

// Redirecionamento
app.get('/:id', (req, res) => {
    const { id } = req.params;
    const originalUrl = urlDatabase[id];
    
    if (originalUrl) {
        console.log(`📍 Redirecionando ${id} para: ${originalUrl}`);
        res.redirect(originalUrl);
    } else {
        res.status(404).send('URL não encontrada');
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
