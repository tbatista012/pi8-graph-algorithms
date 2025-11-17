// backend/src/routes/authRoutes.js - VERSÃO SIMPLES E FUNCIONAL
import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Usuários em memória (funciona SEM Neo4j)
const users = [
  { username: 'admin', password: '123', email: 'admin@pi8.com' },
  { username: 'user1', password: '123', email: 'user1@pi8.com' },
  { username: 'user2', password: '123', email: 'user2@pi8.com' }
];

// Login SIMPLES e FUNCIONAL
router.post('/login', async (req, res) => {
  console.log('📥 Recebida requisição de login:', req.body.username);
  
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Usuário e senha são obrigatórios' });
  }

  // Buscar usuário
  const user = users.find(u => 
    u.username === username && u.password === password
  );

  if (user) {
    const token = jwt.sign(
      { username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('✅ Login bem-sucedido:', user.username);
    
    return res.json({
      message: 'Login realizado com sucesso!',
      user: {
        username: user.username,
        email: user.email
      },
      token
    });
  }

  console.log('❌ Credenciais inválidas:', username);
  return res.status(401).json({ error: 'Credenciais inválidas' });
});

// Status simples
router.get('/status', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Sistema funcionando em modo simples',
    auth: 'Usuários em memória'
  });
});

export default router;