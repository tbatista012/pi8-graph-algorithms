// frontend/src/components/History.jsx - COM EXPORT DEFAULT CORRETO
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './History.css';

const History = ({ onLoadExecution }) => {
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('history');

  // Carregar histórico
  const loadHistory = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/algorithms/history');
      
      if (response.data.success) {
        setHistory(response.data.history);
      } else {
        setError(response.data.error || 'Erro ao carregar histórico');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Erro de conexão');
    } finally {
      setLoading(false);
    }
  };

  // Carregar estatísticas
  const loadStats = async () => {
    try {
      const response = await axios.get('/api/algorithms/stats');
      
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (err) {
      console.error('Erro ao carregar estatísticas:', err);
    }
  };

  // Deletar execução
  const deleteExecution = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta execução do histórico?')) {
      return;
    }

    try {
      const response = await axios.delete(`/api/algorithms/history/${id}`);
      
      if (response.data.success) {
        setHistory(history.filter(item => item.id !== id));
        loadStats();
      } else {
        setError(response.data.error || 'Erro ao deletar execução');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao deletar execução');
    }
  };

  // Carregar execução específica
  const loadExecution = async (id) => {
    try {
      const response = await axios.get(`/api/algorithms/history/load/${id}`);
      
      if (response.data.success && onLoadExecution) {
        onLoadExecution(response.data.execution);
      } else {
        setError('Erro ao carregar execução');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao carregar execução');
    }
  };

  // Carregar dados iniciais
  useEffect(() => {
    loadHistory();
    loadStats();
  }, []);

  // Formatar data
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR');
  };

  if (loading) {
    return (
      <div className="history-container">
        <div className="loading-history">
          <div className="loading-spinner"></div>
          <p>Carregando histórico...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="history-container">
      <div className="history-header">
        <h2>📊 Histórico de Execuções</h2>
        <div className="history-actions">
          <button 
            className="refresh-btn"
            onClick={() => {
              loadHistory();
              loadStats();
            }}
          >
            🔄 Atualizar
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="history-tabs">
        <button 
          className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          📋 Histórico
        </button>
        <button 
          className={`tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          📈 Estatísticas
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button className="dismiss-btn" onClick={() => setError('')}>✕</button>
        </div>
      )}

      {/* Conteúdo das Tabs */}
      <div className="tab-content">
        {activeTab === 'history' && (
          <div className="history-content">
            {history.length === 0 ? (
              <div className="empty-history">
                <p>📝 Nenhuma execução encontrada no histórico</p>
                <p>Execute o algoritmo Bellman-Ford para começar a gerar histórico!</p>
              </div>
            ) : (
              <div className="executions-list">
                {history.map((execution) => (
                  <div key={execution.id} className="execution-card">
                    <div className="execution-header">
                      <h4>Algoritmo: {execution.algorithm}</h4>
                      <span className="execution-date">
                        {formatDate(execution.executedAt)}
                      </span>
                    </div>
                    
                    <div className="execution-details">
                      <div className="detail-item">
                        <span className="label">Origem:</span>
                        <span className="value">{execution.source}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Vértices:</span>
                        <span className="value">{execution.verticesCount}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Arestas:</span>
                        <span className="value">{execution.edgesCount}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Iterações:</span>
                        <span className="value">{execution.totalIterations}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Ciclo Negativo:</span>
                        <span className={`value ${execution.hasNegativeCycle ? 'negative' : 'positive'}`}>
                          {execution.hasNegativeCycle ? 'Sim' : 'Não'}
                        </span>
                      </div>
                    </div>

                    <div className="execution-actions">
                      <button 
                        className="load-btn"
                        onClick={() => loadExecution(execution.id)}
                      >
                        🔄 Carregar
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => deleteExecution(execution.id)}
                      >
                        🗑️ Excluir
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="stats-content">
            {stats ? (
              <div className="stats-grid">
                <div className="stat-card total">
                  <h3>Total de Execuções</h3>
                  <div className="stat-value">{stats.totalExecutions}</div>
                </div>

                <div className="stat-card cycles">
                  <h3>Ciclos Negativos</h3>
                  <div className="stat-value">{stats.negativeCycles}</div>
                </div>

                <div className="stat-card average">
                  <h3>Média de Vértices</h3>
                  <div className="stat-value">{stats.averageVertices}</div>
                </div>

                <div className="stat-card average">
                  <h3>Média de Arestas</h3>
                  <div className="stat-value">{stats.averageEdges}</div>
                </div>

                <div className="stat-card full-width">
                  <h3>Distribuição por Algoritmo</h3>
                  <div className="algorithms-distribution">
                    {stats.algorithms.map((algo) => (
                      <div key={algo.algorithm} className="algorithm-item">
                        <span className="algo-name">{algo.algorithm}:</span>
                        <span className="algo-count">{algo.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="stat-card full-width">
                  <h3>Resumo do Sistema</h3>
                  <div className="system-summary">
                    <p>📈 <strong>{stats.totalExecutions}</strong> execuções realizadas</p>
                    <p>⚠️ <strong>{stats.negativeCycles}</strong> ciclos negativos detectados</p>
                    <p>📊 Grafos com média de <strong>{stats.averageVertices}</strong> vértices e <strong>{stats.averageEdges}</strong> arestas</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="empty-stats">
                <p>📈 Nenhuma estatística disponível</p>
                <p>Execute alguns algoritmos para gerar estatísticas!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ⚠️ IMPORTANTE: Exportação como default
export default History;