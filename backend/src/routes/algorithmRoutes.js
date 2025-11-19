import express from 'express';
import neo4j from '../utils/neo4j.js';

const router = express.Router();

// Bellman-Ford Algorithm - IMPLEMENTAÇÃO COMPLETA
router.post('/bellman-ford', async (req, res) => {
  try {
    const { vertices, edges, source } = req.body;

    console.log('🧮 Executando Bellman-Ford...');
    console.log('   Vértices:', vertices);
    console.log('   Arestas:', edges);
    console.log('   Origem:', source);

    // Validações
    if (!vertices || !edges || !source) {
      return res.status(400).json({
        error: 'Vertices, edges and source are required'
      });
    }

    if (!Array.isArray(vertices) || !Array.isArray(edges)) {
      return res.status(400).json({
        error: 'Vertices and edges must be arrays'
      });
    }

    if (!vertices.includes(source)) {
      return res.status(400).json({
        error: 'Source vertex must be in vertices array'
      });
    }

    // Inicialização
    const distances = {};
    const predecessors = {};
    const steps = [];

    vertices.forEach(vertex => {
      distances[vertex] = Infinity;
      predecessors[vertex] = null;
    });
    distances[source] = 0;

    // Passo inicial
    steps.push({
      iteration: 0,
      message: 'Inicialização - Distâncias definidas',
      distances: { ...distances },
      predecessors: { ...predecessors },
      changed: [source]
    });

    const startTime = Date.now();

    // Relaxamento das arestas (V-1 vezes)
    for (let i = 0; i < vertices.length - 1; i++) {
      let updated = false;
      const changedVertices = [];

      edges.forEach(edge => {
        const { source: from, destination: to, weight } = edge;

        if (distances[from] !== Infinity && 
            distances[from] + weight < distances[to]) {
          distances[to] = distances[from] + weight;
          predecessors[to] = from;
          updated = true;
          
          if (!changedVertices.includes(to)) {
            changedVertices.push(to);
          }
        }
      });

      steps.push({
        iteration: i + 1,
        message: `Iteração ${i + 1} - ${updated ? 'Atualizações realizadas' : 'Sem atualizações'}`,
        distances: { ...distances },
        predecessors: { ...predecessors },
        changed: [...changedVertices]
      });

      if (!updated) break;
    }

    // Verificar ciclos negativos
    let hasNegativeCycle = false;
    let negativeCycleInfo = null;

    edges.forEach(edge => {
      const { source: from, destination: to, weight } = edge;
      
      if (distances[from] !== Infinity && 
          distances[from] + weight < distances[to]) {
        hasNegativeCycle = true;
        negativeCycleInfo = {
          from,
          to,
          weight
        };
      }
    });

    const executionTime = Date.now() - startTime;

    // Resultado final
    const result = {
      distances,
      predecessors,
      hasNegativeCycle,
      negativeCycleInfo,
      steps,
      totalIterations: steps.length,
      executionTime,
      source
    };

    if (hasNegativeCycle) {
      result.negativeCycleMessage = `Ciclo negativo detectado entre ${negativeCycleInfo.from} e ${negativeCycleInfo.to}`;
    }

    // Salvar no Neo4j
    // Salvar no Neo4j - SEMPRE salvar (com ou sem login)
if (neo4j.isConnected) {
    try {
        console.log('💾 Tentando salvar no Neo4j...');
        const session = neo4j.getSession();
        
        await session.run(
            `CREATE (r:AlgorithmResult {
                algorithm: $algorithm,
                source: $source,
                vertices: $vertices,
                edges: $edges,
                verticesCount: $verticesCount,
                edgesCount: $edgesCount,
                result: $result,
                hasNegativeCycle: $hasNegativeCycle,
                totalIterations: $totalIterations,
                executionTime: $executionTime,
                executedAt: datetime(),
                username: $username
            }) RETURN r`,
            {
                algorithm: 'Bellman-Ford',
                source: source,
                vertices: JSON.stringify(vertices),
                edges: JSON.stringify(edges),
                verticesCount: vertices.length,
                edgesCount: edges.length,
                result: JSON.stringify(result),
                hasNegativeCycle: hasNegativeCycle,
                totalIterations: result.totalIterations,
                executionTime: result.executionTime,
                username: 'guest' // Usuário padrão para testes
            }
        );
        
        await session.close();
        console.log('✅ Resultado SALVO no Neo4j com sucesso!');
    } catch (dbError) {
        console.error('❌ ERRO ao salvar no Neo4j:', dbError.message);
        console.error('Detalhes do erro:', dbError);
    }
} else {
    console.log('⚠️ Neo4j não conectado - não foi possível salvar');
}

    console.log('✅ Bellman-Ford executado com sucesso');
    res.json(result);

  } catch (error) {
    console.error('💥 Erro no Bellman-Ford:', error);
    res.status(500).json({ 
      error: 'Erro ao executar algoritmo',
      details: error.message 
    });
  }
});

// HISTÓRICO COMPLETO - Buscar execuções anteriores
router.get('/history', async (req, res) => {
  try {
    if (!neo4j.isConnected) {
      return res.json({ 
        success: true,
        history: [], 
        message: 'Neo4j offline - histórico não disponível' 
      });
    }

    const session = neo4j.getSession();
   const result = await session.run(
  `MATCH (result:AlgorithmResult)
   RETURN result
   ORDER BY result.executedAt DESC
   LIMIT 20`
);

    const history = result.records.map(record => {
      const node = record.get('result');
      const properties = node.properties;
      
      return {
        id: node.identity.toString(),
        algorithm: properties.algorithm,
        source: properties.source,
        verticesCount: properties.verticesCount,
        edgesCount: properties.edgesCount,
        hasNegativeCycle: properties.hasNegativeCycle,
        totalIterations: properties.totalIterations,
        executionTime: properties.executionTime,
        executedAt: properties.executedAt,
        vertices: JSON.parse(properties.vertices),
        edges: JSON.parse(properties.edges),
        result: JSON.parse(properties.result)
      };
    });

    await session.close();

    res.json({
      success: true,
      history: history,
      total: history.length,
      message: `Encontradas ${history.length} execuções no histórico`
    });

  } catch (error) {
    console.error('Erro ao buscar histórico:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erro ao buscar histórico',
      details: error.message 
    });
  }
});

// ESTATÍSTICAS DO SISTEMA
router.get('/stats', async (req, res) => {
  try {
    if (!neo4j.isConnected) {
      return res.json({ 
        success: true,
        stats: {},
        message: 'Neo4j offline - estatísticas não disponíveis' 
      });
    }

    const session = neo4j.getSession();
    
    // Total de execuções
    const totalResult = await session.run(
      'MATCH (r:AlgorithmResult) RETURN count(r) as totalExecutions'
    );
    
    // Execuções por algoritmo
    const algoResult = await session.run(
      'MATCH (r:AlgorithmResult) RETURN r.algorithm as algorithm, count(r) as count'
    );
    
    // Execuções com ciclo negativo
    const cycleResult = await session.run(
      'MATCH (r:AlgorithmResult {hasNegativeCycle: true}) RETURN count(r) as negativeCycles'
    );
    
    // Média de vértices e arestas
    const avgResult = await session.run(
      'MATCH (r:AlgorithmResult) RETURN avg(r.verticesCount) as avgVertices, avg(r.edgesCount) as avgEdges'
    );

    await session.close();

    const stats = {
      totalExecutions: totalResult.records[0].get('totalExecutions').toNumber(),
      algorithms: algoResult.records.map(record => ({
        algorithm: record.get('algorithm'),
        count: record.get('count').toNumber()
      })),
      negativeCycles: cycleResult.records[0].get('negativeCycles').toNumber(),
      averageVertices: Math.round(avgResult.records[0].get('avgVertices') * 100) / 100,
      averageEdges: Math.round(avgResult.records[0].get('avgEdges') * 100) / 100
    };

    res.json({
      success: true,
      stats: stats,
      message: 'Estatísticas carregadas com sucesso'
    });

  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erro ao buscar estatísticas',
      details: error.message 
    });
  }
});

// DELETAR EXECUÇÃO DO HISTÓRICO
router.delete('/history/:id', async (req, res) => {
  try {
    if (!neo4j.isConnected) {
      return res.status(503).json({ 
        success: false,
        error: 'Neo4j offline' 
      });
    }

    const { id } = req.params;
    const session = neo4j.getSession();
    
    const result = await session.run(
      'MATCH (r:AlgorithmResult) WHERE id(r) = $id DELETE r RETURN count(r) as deleted',
      { id: parseInt(id) }
    );

    await session.close();

    const deletedCount = result.records[0].get('deleted').toNumber();

    if (deletedCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Execução não encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Execução deletada do histórico com sucesso',
      deletedId: id
    });

  } catch (error) {
    console.error('Erro ao deletar execução:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erro ao deletar execução',
      details: error.message 
    });
  }
});

// CARREGAR EXECUÇÃO ESPECÍFICA
router.get('/history/load/:id', async (req, res) => {
  try {
    if (!neo4j.isConnected) {
      return res.status(503).json({ 
        success: false,
        error: 'Neo4j offline' 
      });
    }

    const { id } = req.params;
    const session = neo4j.getSession();
    
    const result = await session.run(
      'MATCH (r:AlgorithmResult) WHERE id(r) = $id RETURN r',
      { id: parseInt(id) }
    );

    await session.close();

    if (result.records.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Execução não encontrada'
      });
    }

    const node = result.records[0].get('r');
    const properties = node.properties;

    const execution = {
      id: node.identity.toString(),
      algorithm: properties.algorithm,
      source: properties.source,
      vertices: JSON.parse(properties.vertices),
      edges: JSON.parse(properties.edges),
      result: JSON.parse(properties.result),
      executedAt: properties.executedAt
    };

    res.json({
      success: true,
      execution: execution,
      message: 'Execução carregada com sucesso'
    });

  } catch (error) {
    console.error('Erro ao carregar execução:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erro ao carregar execução',
      details: error.message 
    });
  }
});

export default router;