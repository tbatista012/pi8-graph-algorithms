// frontend/src/pages/Dashboard.jsx - VERSÃO CORRIGIDA
import React, { useState } from 'react'
import BellmanFord from '../components/BellmanFord'
import History from '../components/History'
import './Dashboard.css'

const Dashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('bellman-ford')
  const [loadedExecution, setLoadedExecution] = useState(null)
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  // Função para carregar uma execução do histórico
  const handleLoadExecution = (execution) => {
    setLoadedExecution(execution)
    setActiveTab('bellman-ford')
  }

  // Função para resetar o estado quando uma nova execução começar
  const handleNewExecution = () => {
    setLoadedExecution(null)
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>PI8 - Graph Algorithms</h1>
          <div className="user-info">
            <span>👤 Olá, {user.username}!</span>
            <button onClick={onLogout} className="logout-btn">
              Sair
            </button>
          </div>
        </div>
      </header>

      <nav className="dashboard-nav">
        <button 
          className={`nav-btn ${activeTab === 'bellman-ford' ? 'active' : ''}`}
          onClick={() => setActiveTab('bellman-ford')}
        >
          🧮 Bellman-Ford
        </button>
        <button 
          className={`nav-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          📊 Histórico
        </button>
        <button 
          className={`nav-btn ${activeTab === 'about' ? 'active' : ''}`}
          onClick={() => setActiveTab('about')}
        >
          ℹ️ Sobre
        </button>
      </nav>

      <main className="dashboard-main">
        {activeTab === 'bellman-ford' && (
          <BellmanFord 
            loadedExecution={loadedExecution}
            onNewExecution={handleNewExecution}
          />
        )}
        
        {activeTab === 'history' && (
          <History onLoadExecution={handleLoadExecution} />
        )}
        
        {activeTab === 'about' && (
          <div className="tab-content">
            <h2>Sobre o Sistema</h2>
            <div className="about-content">
              <div className="feature-card">
                <h3>🎯 Bellman-Ford</h3>
                <p>Algoritmo para encontrar caminhos mais curtos em grafos com pesos negativos. Detecta ciclos negativos automaticamente.</p>
              </div>
              
              <div className="feature-card">
                <h3>🗄️ Neo4j</h3>
                <p>Banco de dados de grafos para armazenar resultados e históricos de execuções.</p>
              </div>
              
              <div className="feature-card">
                <h3>📊 Histórico Completo</h3>
                <p>Acesse execuções anteriores, visualize estatísticas e recarregue grafos passados.</p>
              </div>

              <div className="feature-card">
                <h3>⚡ Visualização Interativa</h3>
                <p>Gráficos em tempo real com highlights durante a execução do algoritmo.</p>
              </div>

              <div className="feature-card">
                <h3>🔐 Autenticação Segura</h3>
                <p>Sistema de login com JWT para proteger seus dados e execuções.</p>
              </div>

              <div className="feature-card">
                <h3>📈 Estatísticas em Tempo Real</h3>
                <p>Monitoramento de execuções, ciclos negativos e métricas do sistema.</p>
              </div>
            </div>

            <div className="system-info">
              <h3>Informações do Sistema</h3>
              <div className="info-grid">
                <div className="info-item">
                  <strong>Backend:</strong> Node.js + Express
                </div>
                <div className="info-item">
                  <strong>Frontend:</strong> React + Vite
                </div>
                <div className="info-item">
                  <strong>Banco de Dados:</strong> Neo4j
                </div>
                <div className="info-item">
                  <strong>Visualização:</strong> React Flow
                </div>
                <div className="info-item">
                  <strong>Autenticação:</strong> JWT
                </div>
                <div className="info-item">
                  <strong>Estilo:</strong> CSS Customizado
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default Dashboard