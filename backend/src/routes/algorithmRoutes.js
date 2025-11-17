// backend/src/routes/algorithmRoutes.js
import express from 'express';

const router = express.Router();

// Bellman-Ford Algorithm
router.post('/bellman-ford', (req, res) => {
  try {
    const { vertices, edges, source } = req.body;

    // Validar entrada
    if (!vertices || !edges || !source) {
      return res.status(400).json({ error: 'Vertices, edges e source são obrigatórios' });
    }

    // Inicializar distâncias e predecessores
    const distances = {};
    const predecessors = {};
    
    vertices.forEach(vertex => {
      distances[vertex] = Infinity;
      predecessors[vertex] = null;
    });
    distances[source] = 0;

    // Relaxar as arestas
    for (let i = 0; i < vertices.length - 1; i++) {
      edges.forEach(edge => {
        const { source: u, destination: v, weight } = edge;
        
        if (distances[u] + weight < distances[v]) {
          distances[v] = distances[u] + weight;
          predecessors[v] = u;
        }
      });
    }

    // Verificar ciclos negativos
    let hasNegativeCycle = false;
    
    for (const edge of edges) {
      const { source: u, destination: v, weight } = edge;
      
      if (distances[u] + weight < distances[v]) {
        hasNegativeCycle = true;
        break;
      }
    }

    res.json({
      success: true,
      distances,
      predecessors,
      hasNegativeCycle,
      source
    });

  } catch (error) {
    console.error('Erro no Bellman-Ford:', error);
    res.status(500).json({ error: 'Erro ao executar algoritmo' });
  }
});

export default router;