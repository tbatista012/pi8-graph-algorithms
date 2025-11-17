// frontend/src/pages/Dashboard.jsx
import React from 'react'
import './Dashboard.css'

const Dashboard = ({ onLogout }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>PI8 - Graph Algorithms</h1>
          <div className="user-info">
            <span>Olá, {user.username}!</span>
            <button onClick={onLogout} className="logout-btn">
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="welcome-section">
          <h2>Bem-vindo ao Sistema de Algoritmos de Grafos</h2>
          <p>Seu backend está funcionando perfeitamente! 🎉</p>
          
          <div className="features">
            <div className="feature-card">
              <h3>Bellman-Ford</h3>
              <p>Algoritmo para encontrar caminhos mais curtos</p>
            </div>
            
            <div className="feature-card">
              <h3>Neo4j Integration</h3>
              <p>Banco de dados de grafos conectado</p>
            </div>
            
            <div className="feature-card">
              <h3>Authentication</h3>
              <p>Sistema de login funcionando</p>
            </div>
          </div>
        </div>

        <div className="next-steps">
          <h3>Próximos Passos:</h3>
          <ul>
            <li>✅ Backend configurado</li>
            <li>✅ Banco Neo4j conectado</li>
            <li>✅ Sistema de login</li>
            <li>🔜 Interface do Bellman-Ford</li>
            <li>🔜 Visualização de grafos</li>
            <li>🔜 Histórico de execuções</li>
          </ul>
        </div>
      </main>
    </div>
  )
}

export default Dashboard