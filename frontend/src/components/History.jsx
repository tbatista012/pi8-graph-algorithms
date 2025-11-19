import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './History.css';

const History = ({ onLoadExecution }) => {
  const [activeTab, setActiveTab] = useState('history');
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Carregar histórico
  const loadHistory = async () => {
    setLoading(true);
    setError('');
    try {
      console.log('📥 Carregando histórico...');
      const response = await axios.get('/api/algorithms/history');
      console.log('✅ Resposta do histórico:', response.data);
      
      if (response.data.success) {
        setHistory(response.data.history || []);
      } else {
        setError(response.data.error || 'Erro ao carregar histórico');
      }
    } catch (err) {
      console.error('❌ Erro ao carregar histórico:', err);
      setError(err.response?.data?.error || 'Erro de conexão');
    } finally {
      setLoading(false);
    }
  };

  // Carregar estatísticas
  const loadStats = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('/api/algorithms/stats');
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (err) {
      console.error('Erro ao carregar estatísticas:', err);
    } finally {
      setLoading(false);
    }
  };

  // Carregar dados quando mudar de aba
  useEffect(() => {
    if (activeTab === 'history') {
      loadHistory();
    } else if (activeTab === 'stats') {
      loadStats();
    }
  }, [activeTab]);

  // Carregar execução específica
  const handleLoadExecution = async (executionId) => {
    try {
      console.log('🔄 Carregando execução:', executionId);
      const response = await axios.get(`/api/algorithms/history/load/${executionId}`);
      
      if (response.data.success && onLoadExecution) {
        console.log('✅ Execução carregada:', response.data.execution);
        onLoadExecution(response.data.execution);
      }
    } catch (err) {
      console.error('Erro ao carregar execução:', err);
      setError('Erro ao carregar execução');
    }
  };

  // Deletar execução
  const handleDeleteExecution = async (executionId) => {
    if (!window.confirm('Tem certeza que deseja deletar esta execução?')) {
      return;
    }

    try {
      await axios.delete(`/api/algorithms/history/${executionId}`);
      // Recarregar histórico após deletar
      loadHistory();
    } catch (err) {
      console.error('Erro ao deletar execução:', err);
      setError('Erro ao deletar execução');
    }
  };

  // Formatar data
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('pt-BR');
    } catch {
      return dateString;
    }
  };

  return (
    <div className="history-container">
      <div className="history-header">
        <h2>Histórico de Execuções</h2>
        
        {/* Abas */}
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            📋 Histórico
          </button>
          <button 
            className={`tab ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            📊 Estatísticas
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          ❌ {error}
          <button onClick={() => setError('')} className="dismiss-btn">✕</button>
        </div>
      )}

      {/* ABA DE HISTÓRICO */}
      {activeTab === 'history' && (
        <div className="history-content">
          {loading ? (
            <div className="loading">Carregando histórico...</div>
          ) : history.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📊</div>
              <h3>Nenhuma execução encontrada no histórico</h3>
              <p>Execute o algoritmo Bellman-Ford para começar a gerar histórico!</p>
            </div>
          ) : (
            <div className="history-list">
              {history.map((execution, index) => (
                <div key={execution.id || index} className="history-item">
                  <div className="execution-header">
                    <h4>🎯 {execution.algorithm} - Origem: {execution.source}</h4>
                    <span className="execution-date">
                      {formatDate(execution.executedAt)}
                    </span>
                  </div>
                  
                  <div className="execution-details">
                    <div className="detail">
                      <span className="label">Vértices:</span>
                      <span className="value">{execution.verticesCount}</span>
                    </div>
                    <div className="detail">
                      <span className="label">Arestas:</span>
                      <span className="value">{execution.edgesCount}</span>
                    </div>
                    <div className="detail">
                      <span className="label">Iterações:</span>
                      <span className="value">{execution.totalIterations}</span>
                    </div>
                    <div className="detail">
                      <span className="label">Tempo:</span>
                      <span className="value">{execution.executionTime}ms</span>
                    </div>
                    <div className="detail">
                      <span className="label">Ciclo Negativo:</span>
                      <span className={`value ${execution.hasNegativeCycle ? 'negative' : 'positive'}`}>
                        {execution.hasNegativeCycle ? 'Sim' : 'Não'}
                      </span>
                    </div>
                  </div>

                  <div className="execution-actions">
                    <button 
                      className="load-btn"
                      onClick={() => handleLoadExecution(execution.id)}
                    >
                      🔄 Carregar
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDeleteExecution(execution.id)}
                    >
                      🗑️ Deletar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {history.length > 0 && (
            <div className="history-footer">
              <p>Total de {history.length} execuções no histórico</p>
              <button onClick={loadHistory} className="refresh-btn">
                🔄 Atualizar
              </button>
            </div>
          )}
        </div>
      )}

      {/* ABA DE ESTATÍSTICAS */}
      {activeTab === 'stats' && (
        <div className="stats-content">
          {loading ? (
            <div className="loading">Carregando estatísticas...</div>
          ) : stats ? (
            <div className="stats-grid">
              <div className="stat-card total">
                <h3>📈 Total de Execuções</h3>
                <div className="stat-value">{stats.totalExecutions}</div>
              </div>
              
              <div className="stat-card cycles">
                <h3>🔄 Ciclos Negativos</h3>
                <div className="stat-value">{stats.negativeCycles}</div>
              </div>
              
              <div className="stat-card avg-vertices">
                <h3>⚡ Vértices (média)</h3>
                <div className="stat-value">{stats.averageVertices}</div>
              </div>
              
              <div className="stat-card avg-edges">
                <h3>🔗 Arestas (média)</h3>
                <div className="stat-value">{stats.averageEdges}</div>
              </div>

              {/* Execuções por algoritmo */}
              {stats.algorithms && stats.algorithms.length > 0 && (
                <div className="stat-card algorithms">
                  <h3>📊 Execuções por Algoritmo</h3>
                  <div className="algorithms-list">
                    {stats.algorithms.map((algo, index) => (
                      <div key={index} className="algorithm-item">
                        <span className="algo-name">{algo.algorithm}</span>
                        <span className="algo-count">{algo.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📊</div>
              <h3>Nenhuma estatística disponível</h3>
              <p>Execute alguns algoritmos para gerar estatísticas</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default History;