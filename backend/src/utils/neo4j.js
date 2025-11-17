// backend/src/utils/neo4j.js - COM URL CORRETA
import neo4j from 'neo4j-driver';
import dotenv from 'dotenv';

dotenv.config();

class Neo4jConnection {
  constructor() {
    this.driver = null;
    this.isConnected = false;
    this.connectionUrl = 'neo4j://127.0.0.1:7687'; // ⭐ URL CORRETA!
    this.init();
  }

  async init() {
    console.log('🚀 CONECTANDO AO NEO4J...');
    console.log(`📍 URL: ${this.connectionUrl}`);
    console.log('👤 Usuário: neo4j');
    
    await this.createConnection();
  }

  async createConnection() {
    try {
      this.driver = neo4j.driver(
        this.connectionUrl, // ⭐ URL ESPECÍFICA DO SEU NEO4J
        neo4j.auth.basic('neo4j', 'pi123456'),
        {
          encrypted: false,
          trust: "TRUST_ALL_CERTIFICATES",
          connectionAcquisitionTimeout: 10000,
          maxConnectionLifetime: 60000
        }
      );

      console.log('✅ Driver criado. Testando conexão...');
      await this.testConnection();
      
    } catch (error) {
      console.error('💥 ERRO ao criar driver:', error.message);
      throw error;
    }
  }

  async testConnection() {
    const session = this.driver.session();
    try {
      console.log('🧪 Executando teste de conexão...');
      const result = await session.run('RETURN 1 as test');
      this.isConnected = true;
      console.log('✅ NEO4J CONECTADO COM SUCESSO!');
      console.log('🎉 Sistema pronto para uso!');
      return true;
    } catch (error) {
      this.isConnected = false;
      console.error('💥 FALHA NA CONEXÃO:');
      console.error('   Mensagem:', error.message);
      console.error('   URL:', this.connectionUrl);
      throw error;
    } finally {
      await session.close();
    }
  }

  getSession() {
    if (!this.isConnected) {
      throw new Error('NEO4J NÃO CONECTADO');
    }
    return this.driver.session();
  }

  async close() {
    if (this.driver) {
      await this.driver.close();
      this.isConnected = false;
      console.log('🔒 Conexão Neo4j fechada');
    }
  }
}

const neo4jInstance = new Neo4jConnection();

export default {
  get driver() { return neo4jInstance.driver; },
  get isConnected() { return neo4jInstance.isConnected; },
  getSession: () => neo4jInstance.getSession(),
  testConnection: () => neo4jInstance.testConnection(),
  close: () => neo4jInstance.close()
};