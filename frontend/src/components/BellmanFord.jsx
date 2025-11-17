// frontend/src/components/BellmanFord.jsx - VERSÃO COMPLETA
import React, { useState } from 'react';
import axios from 'axios';
import GraphVisualization from './GraphVisualization';
import './BellmanFord.css';

const BellmanFord = ({ loadedExecution, onNewExecution }) => {
  const [graph, setGraph] = useState({
    vertices: ['A', 'B', 'C', 'D'],
    edges: [
      { source: 'A', destination: 'B', weight: 4 },
      { source: 'A', destination: 'C', weight: 2 },
      { source: 'C', destination: 'B', weight: 1 },
      { source: 'B', destination: 'D', weight: 2 }
    ],
    source: 'A'
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [showGraph, setShowGraph] = useState(true);

  // Efeito para carregar execução quando recebida do histórico
  React.useEffect(() => {
    if (loadedExecution) {
      console.log('🔄 Carregando execução do histórico:', loadedExecution);
      
      setGraph({
        vertices: loadedExecution.vertices,
        edges: loadedExecution.edges,
        source: loadedExecution.source
      });
      
      setResult(loadedExecution.result);
      setCurrentStep(loadedExecution.result.steps.length - 1);
      setError('');
      
      // Notificar que a execução foi carregada
      if (onNewExecution) {
        onNewExecution();
      }
    }
  }, [loadedExecution, onNewExecution]);

  const handleVertexChange = (index, value) => {
    const newVertices = [...graph.vertices];
    newVertices[index] = value.toUpperCase();
    setGraph({ ...graph, vertices: newVertices });
  };

  const addVertex = () => {
    const newVertex = String.fromCharCode(65 + graph.vertices.length);
    setGraph({
      ...graph,
      vertices: [...graph.vertices, newVertex]
    });
  };

  const removeVertex = (index) => {
    const vertexToRemove = graph.vertices[index];
    const newVertices = graph.vertices.filter((_, i) => i !== index);
    const newEdges = graph.edges.filter(edge => 
      edge.source !== vertexToRemove && edge.destination !== vertexToRemove
    );
    
    setGraph({
      ...graph,
      vertices: newVertices,
      edges: newEdges,
      source: graph.source === vertexToRemove ? (newVertices[0] || '') : graph.source
    });
  };

  const handleEdgeChange = (index, field, value) => {
    const newEdges = [...graph.edges];
    newEdges[index] = { ...newEdges[index], [field]: value };
    setGraph({ ...graph, edges: newEdges });
  };

  const addEdge = () => {
    setGraph({
      ...graph,
      edges: [...graph.edges, { source: '', destination: '', weight: 1 }]
    });
  };

  const removeEdge = (index) => {
    const newEdges = graph.edges.filter((_, i) => i !== index);
    setGraph({ ...graph, edges: newEdges });
  };

  const executeAlgorithm = async () => {
    setLoading(true);
    setError('');
    setResult(null);
    setCurrentStep(0);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/algorithms/bellman-ford', graph, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      setResult(response.data);
      console.log('✅ Resultado:', response.data);
      
      // Notificar que uma nova execução foi iniciada
      if (onNewExecution) {
        onNewExecution();
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao executar algoritmo');
      console.error('❌ Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (result && currentStep < result.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const reset = () => {
    setResult(null);
    setCurrentStep(0);
    setError('');
    
    // Resetar para o grafo padrão
    setGraph({
      vertices: ['A', 'B', 'C', 'D'],
      edges: [
        { source: 'A', destination: 'B', weight: 4 },
        { source: 'A', destination: 'C', weight: 2 },
        { source: 'C', destination: 'B', weight: 1 },
        { source: 'B', destination: 'D', weight: 2 }
      ],
      source: 'A'
    });

    if (onNewExecution) {
      onNewExecution();
    }
  };

  const currentStepData = result?.steps[currentStep];

  return (
    <div className="bellman-ford">
      <div className="bellman-header">
        <h2>Algoritmo Bellman-Ford</h2>
        {loadedExecution && (
          <div className="loaded-indicator">
            ✅ Execução carregada do histórico
          </div>
        )}
      </div>
      
      <div className="algorithm-container">
        {/* CONFIGURAÇÃO DO GRAFO */}
        <div className="graph-config">
          <h3>Configuração do Grafo</h3>
          
          {/* BOTÃO TOGGLE GRÁFICO */}
          <div className="graph-toggle">
            <button 
              type="button"
              onClick={() => setShowGraph(!showGraph)}
              className="toggle-btn"
            >
              {showGraph ? '🔽 Ocultar Gráfico' : '🔼 Mostrar Gráfico'}
            </button>
          </div>

          {/* VISUALIZAÇÃO DO GRAFO */}
          {showGraph && (
            <div className="graph-visualization-section">
              <h4>Visualização do Grafo</h4>
              <GraphVisualization
                vertices={graph.vertices}
                edges={graph.edges}
                distances={currentStepData?.distances || {}}
                predecessors={currentStepData?.predecessors || {}}
                currentStep={currentStepData}
                source={graph.source}
              />
            </div>
          )}

          {/* VÉRTICES */}
          <div className="vertices-section">
            <h4>Vértices</h4>
            {graph.vertices.map((vertex, index) => (
              <div key={index} className="vertex-input">
                <input
                  type="text"
                  value={vertex}
                  onChange={(e) => handleVertexChange(index, e.target.value)}
                  maxLength="1"
                  placeholder="A"
                />
                <button 
                  type="button" 
                  onClick={() => removeVertex(index)}
                  disabled={graph.vertices.length <= 2}
                >
                  ✕
                </button>
              </div>
            ))}
            <button type="button" onClick={addVertex}>+ Vértice</button>
          </div>

          {/* ARESTAS */}
          <div className="edges-section">
            <h4>Arestas</h4>
            {graph.edges.map((edge, index) => (
              <div key={index} className="edge-input">
                <select
                  value={edge.source}
                  onChange={(e) => handleEdgeChange(index, 'source', e.target.value)}
                >
                  <option value="">Origem</option>
                  {graph.vertices.map(vertex => (
                    <option key={vertex} value={vertex}>{vertex}</option>
                  ))}
                </select>
                
                <span>→</span>
                
                <select
                  value={edge.destination}
                  onChange={(e) => handleEdgeChange(index, 'destination', e.target.value)}
                >
                  <option value="">Destino</option>
                  {graph.vertices.map(vertex => (
                    <option key={vertex} value={vertex}>{vertex}</option>
                  ))}
                </select>
                
                <input
                  type="number"
                  value={edge.weight}
                  onChange={(e) => handleEdgeChange(index, 'weight', parseInt(e.target.value) || 0)}
                  placeholder="Peso"
                />
                
                <button type="button" onClick={() => removeEdge(index)}>✕</button>
              </div>
            ))}
            <button type="button" onClick={addEdge}>+ Aresta</button>
          </div>

          {/* ORIGEM */}
          <div className="source-section">
            <h4>Vértice Origem</h4>
            <select
              value={graph.source}
              onChange={(e) => setGraph({ ...graph, source: e.target.value })}
            >
              {graph.vertices.map(vertex => (
                <option key={vertex} value={vertex}>{vertex}</option>
              ))}
            </select>
          </div>

          <button 
            className="execute-btn"
            onClick={executeAlgorithm}
            disabled={loading || graph.vertices.length === 0 || graph.edges.length === 0}
          >
            {loading ? (
              <>
                <div className="loading-spinner"></div>
                Executando...
              </>
            ) : (
              'Executar Bellman-Ford'
            )}
          </button>
        </div>

        {/* RESULTADOS */}
        <div className="results-section">
          {error && (
            <div className="error-message">
              <strong>Erro:</strong> {error}
              <button className="dismiss-btn" onClick={() => setError('')}>✕</button>
            </div>
          )}

          {result && (
            <div className="results">
              <h3>Resultados</h3>
              
              {/* VISUALIZAÇÃO DO GRAFO NOS RESULTADOS */}
              {showGraph && (
                <div className="results-graph">
                  <h4>Grafo com Resultados</h4>
                  <GraphVisualization
                    vertices={graph.vertices}
                    edges={graph.edges}
                    distances={currentStepData?.distances || result.distances}
                    predecessors={currentStepData?.predecessors || result.predecessors}
                    currentStep={currentStepData}
                    source={graph.source}
                  />
                </div>
              )}

              {/* CONTROLES DE PASSO A PASSO */}
              {result.steps.length > 1 && (
                <div className="step-controls">
                  <button onClick={prevStep} disabled={currentStep === 0}>
                    ◀ Anterior
                  </button>
                  <span>
                    Passo {currentStep + 1} de {result.steps.length}
                  </span>
                  <button onClick={nextStep} disabled={currentStep === result.steps.length - 1}>
                    Próximo ▶
                  </button>
                </div>
              )}

              {/* VISUALIZAÇÃO DO PASSO ATUAL */}
              {currentStepData && (
                <div className="current-step">
                  <div className="step-info">
                    <strong>{currentStepData.message}</strong>
                  </div>
                  
                  <div className="distances">
                    <h4>Distâncias:</h4>
                    {Object.entries(currentStepData.distances).map(([vertex, distance]) => (
                      <div 
                        key={vertex} 
                        className={`distance-item ${currentStepData.changed?.includes(vertex) ? 'changed' : ''}`}
                      >
                        <span className="vertex">{vertex}:</span>
                        <span className="distance">
                          {distance === Infinity ? '∞' : distance}
                        </span>
                      </div>
                    ))}
                  </div>

                  {currentStepData.predecessors && (
                    <div className="predecessors">
                      <h4>Predecessores:</h4>
                      {Object.entries(currentStepData.predecessors).map(([vertex, pred]) => (
                        <div key={vertex} className="predecessor-item">
                          <span className="vertex">{vertex}:</span>
                          <span className="predecessor">{pred || '—'}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* RESULTADO FINAL */}
              {currentStep === result.steps.length - 1 && (
                <div className="final-results">
                  <h4>Resultado Final:</h4>
                  
                  {result.hasNegativeCycle ? (
                    <div className="negative-cycle-warning">
                      <strong>⚠️ Ciclo Negativo Detectado!</strong>
                      <p>{result.negativeCycleMessage}</p>
                      <div className="cycle-path">
                        {result.negativeCycle.join(' → ')}
                      </div>
                    </div>
                  ) : (
                    <div className="shortest-paths">
                      <table className="results-table">
                        <thead>
                          <tr>
                            <th>Vértice</th>
                            <th>Distância</th>
                            <th>Caminho</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(result.distances).map(([vertex, distance]) => (
                            <tr key={vertex}>
                              <td>{vertex}</td>
                              <td>{distance === Infinity ? '∞' : distance}</td>
                              <td>
                                {getPath(vertex, result.predecessors, result.source)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              <button className="reset-btn" onClick={reset}>
                Novo Cálculo
              </button>
            </div>
          )}

          {!result && !error && !loading && (
            <div className="welcome-message">
              <h4>🎯 Bem-vindo ao Bellman-Ford!</h4>
              <p>Configure seu grafo à esquerda e clique em "Executar Bellman-Ford" para começar.</p>
              <div className="tips">
                <p><strong>💡 Dicas:</strong></p>
                <ul>
                  <li>Adicione vértices usando o botão "+ Vértice"</li>
                  <li>Crie arestas entre os vértices com pesos</li>
                  <li>Selecione o vértice de origem</li>
                  <li>Visualize o processo passo a passo</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Função auxiliar para reconstruir caminhos
const getPath = (vertex, predecessors, source) => {
  if (vertex === source) return vertex;
  if (predecessors[vertex] === null) return 'Inalcançável';
  
  const path = [];
  let current = vertex;
  
  while (current !== null && current !== source) {
    path.unshift(current);
    current = predecessors[current];
    if (path.includes(current)) break; // Prevenir loops
  }
  
  path.unshift(source);
  return path.join(' → ');
};

export default BellmanFord;