const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;

// ✅ MIDDLEWARE BÁSICO
app.use(express.json());
app.use(express.static('public'));

// ✅ ROTA DE TESTE - VERIFIQUE ESTA PRIMEIRO
app.get('/api/teste', (req, res) => {
    console.log('✅ Teste recebido');
    res.json({ 
        status: 'OK', 
        message: 'Backend funcionando perfeitamente!',
        timestamp: new Date().toISOString()
    });
});

// ✅ ROTA PRINCIPAL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ✅ BANCO SIMPLES
const urlDatabase = {};

// ✅ ENCURTAR URL
app.post('/api/encurtar', (req, res) => {
    console.log('📨 Body recebido:', req.body);
    
    try {
        const { urlOriginal } = req.body;
        
        if (!urlOriginal) {
            return res.status(400).json({ erro: 'URL é obrigatória' });
        }

        // Gera ID
        const id = Math.random().toString(36).substring(2, 8);
        const urlBase = `https://${req.get('host')}`;
        
        // Salva
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
    const originalUrl = urlDatabase[id];
    
    if (originalUrl) {
        console.log(`📍 Redirecionando: ${id} -> ${originalUrl}`);
        res.redirect(originalUrl);
    } else {
        res.status(404).send('URL não encontrada');
    }
});

// ✅ INICIAR
app.listen(PORT, () => {
    console.log('===================================');
    console.log('🚀 SERVIDOR RODANDO!');
    console.log(`📍 Porta: ${PORT}`);
    console.log('===================================');
});
