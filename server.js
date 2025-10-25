const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ 🔥 CORREÇÃO: CORS PARA PRODUÇÃO
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Origin, X-Requested-With, Accept');
    
    // Responde imediatamente para requisições OPTIONS
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(express.json());
app.use(express.static('public'));

// ✅ ROTA DE TESTE
app.get('/api/teste', (req, res) => {
    console.log('✅ Rota /api/teste acessada');
    res.json({ 
        status: 'OK', 
        message: 'Backend funcionando!',
        timestamp: new Date().toISOString()
    });
});

// ✅ ROTA PRINCIPAL
app.get('/', (req, res) => {
    console.log('📄 Servindo página principal');
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ✅ BANCO DE DADOS
const urlDatabase = {};

// ✅ ENCURTAR URL
app.post('/api/encurtar', (req, res) => {
    console.log('📨 Recebendo requisição para encurtar URL');
    
    try {
        const { urlOriginal } = req.body;
        
        if (!urlOriginal) {
            return res.status(400).json({ erro: 'URL é obrigatória' });
        }

        const id = Math.random().toString(36).substring(2, 8);
        const urlBase = `https://${req.get('host')}`;
        
        urlDatabase[id] = urlOriginal;
        
        console.log('✅ URL encurtada criada:', id);
        
        res.json({
            success: true,
            urlEncurtada: `${urlBase}/${id}`,
            id: id
        });
        
    } catch (error) {
        console.error('❌ Erro no servidor:', error);
        res.status(500).json({ erro: 'Erro interno do servidor' });
    }
});

// ✅ REDIRECIONAMENTO
app.get('/:id', (req, res) => {
    const { id } = req.params;
    console.log('🔄 Tentando redirecionar:', id);
    
    const originalUrl = urlDatabase[id];
    
    if (originalUrl) {
        console.log('📍 Redirecionando para:', originalUrl);
        res.redirect(originalUrl);
    } else {
        console.log('❌ URL não encontrada:', id);
        res.status(404).send('URL não encontrada');
    }
});

// ✅ INICIAR
app.listen(PORT, () => {
    console.log('===================================');
    console.log('🚀 SERVIDOR INICIADO COM SUCESSO!');
    console.log(`📍 Porta: ${PORT}`);
    console.log('===================================');
});
