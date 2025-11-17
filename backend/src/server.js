// backend/src/server.js - VERSÃO COMPLETA COM TESTE NEO4J
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/authRoutes.js';
import algorithmRoutes from './routes/algorithmRoutes.js';

// Import Neo4j
import neo4j from './utils/neo4j.js';

// Configuração
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// ⚠️ MIDDLEWARE: Verificar se Neo4j está conectado
app.use((req, res, next) => {
  if (!neo4j.isConnected && !req.path.includes('/health') && !req.path.includes('/neo4j-test')) {
    return res.status(503).json({
      error: 'Sistema indisponível',
      message: 'Banco de dados Neo4j não conectado',
      solution: 'Verifique se o Neo4j está rodando'
    });
  }
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/algorithms', algorithmRoutes);

// Health Check com status Neo4j
app.get('/api/health', async (req, res) => {
  const neo4jStatus = neo4j.isConnected ? 'CONECTADO' : 'DESCONECTADO';
  
  res.json({
    status: 'OK',
    message: 'PI8 Graph Algorithms API',
    database: {
      neo4j: neo4jStatus,
      status: neo4j.isConnected ? 'OPERACIONAL' : 'INOPERANTE'
    },
    timestamp: new Date().toISOString()
  });
});

// 🔥 NOVO ENDPOINT: Teste direto do Neo4j
app.get('/api/neo4j-test', async (req, res) => {
  try {
    if (!neo4j.isConnected) {
      return res.status(503).json({
        status: 'ERROR',
        message: 'Neo4j não conectado'
      });
    }

    const session = neo4j.getSession();
    const result = await session.run('RETURN "Neo4j está funcionando perfeitamente!" as message, datetime() as timestamp');
    await session.close();
    
    const message = result.records[0].get('message');
    const timestamp = result.records[0].get('timestamp');
    
    res.json({
      status: 'SUCCESS',
      message: 'Conexão Neo4j testada e funcionando',
      data: {
        message: message,
        timestamp: timestamp.toString(),
        queryTime: result.summary.resultAvailableAfter.toString() + 'ms'
      }
    });
    
  } catch (error) {
    console.error('Erro no teste Neo4j:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Falha na conexão Neo4j',
      error: error.message
    });
  }
});

// 🔥 ENDPOINT: Verificar usuários no Neo4j
app.get('/api/neo4j-users', async (req, res) => {
  try {
    if (!neo4j.isConnected) {
      return res.status(503).json({
        status: 'ERROR',
        message: 'Neo4j não conectado'
      });
    }

    const session = neo4j.getSession();
    const result = await session.run('MATCH (u:User) RETURN u.username as username, u.email as email, u.createdAt as createdAt');
    await session.close();
    
    const users = result.records.map(record => ({
      username: record.get('username'),
      email: record.get('email'),
      createdAt: record.get('createdAt')?.toString() || 'N/A'
    }));
    
    res.json({
      status: 'SUCCESS',
      message: `Encontrados ${users.length} usuários no Neo4j`,
      users: users
    });
    
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Falha ao buscar usuários',
      error: error.message
    });
  }
});

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Endpoint não encontrado',
    availableEndpoints: [
      'GET  /api/health',
      'GET  /api/neo4j-test',
      'GET  /api/neo4j-users',
      'POST /api/auth/login',
      'POST /api/algorithms/bellman-ford'
    ]
  });
});

// Error Handler
app.use((error, req, res, next) => {
  console.error('Erro:', error);
  res.status(500).json({ 
    error: 'Erro interno do servidor',
    details: error.message
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Backend rodando na porta ${PORT}`);
  console.log(`📍 Health: http://localhost:${PORT}/api/health`);
  console.log(`🧪 Neo4j Test: http://localhost:${PORT}/api/neo4j-test`);
  console.log(`👥 Neo4j Users: http://localhost:${PORT}/api/neo4j-users`);
  console.log(`🔐 Login: http://localhost:3000`);
  console.log(`⚡ Modo: NEO4J OBRIGATÓRIO`);
});