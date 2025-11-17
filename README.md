# 🚀 PI8 Graph Algorithms

Sistema completo de algoritmos de grafos com interface visual interativa, histórico persistente e execução em tempo real do algoritmo Bellman-Ford.

![React](https://img.shields.io/badge/React-18.2.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![Neo4j](https://img.shields.io/badge/Neo4j-5.0+-orange)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Execução](#-execução)
- [Uso](#-uso)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [API](#-api)
- [Solução de Problemas](#-solução-de-problemas)
- [Contribuição](#-contribuição)

## 🎯 Visão Geral

Sistema desenvolvido para estudo e aplicação de algoritmos de grafos, com foco no algoritmo **Bellman-Ford** para encontrar caminhos mais curtos em grafos com pesos negativos.

**Características principais:**
- 🎨 Interface visual interativa com React Flow
- 📊 Execução passo a passo com animações
- 💾 Persistência de dados com Neo4j
- 📈 Sistema completo de histórico e estatísticas
- 🔐 Autenticação segura com JWT

## ✨ Funcionalidades

### 🧮 Algoritmo Bellman-Ford
- Configuração visual de vértices e arestas
- Execução animada passo a passo
- Detecção automática de ciclos negativos
- Visualização em tempo real das distâncias
- Reconstrução de caminhos mais curtos

### 📊 Sistema de Histórico
- Persistência completa no Neo4j
- Recarregamento de execuções anteriores
- Estatísticas detalhadas do sistema
- Gerenciamento do histórico (visualizar/excluir)

### 🎨 Visualização Interativa
- Grafos dinâmicos com arrastar e soltar
- Zoom e pan intuitivos
- Highlights durante a execução
- Interface totalmente responsiva

### 🔐 Segurança
- Autenticação com JWT
- Sistema de usuários
- Proteção de rotas da API

## 🛠 Tecnologias

### Backend
- **Node.js** + Express
- **Neo4j** - Banco de dados de grafos
- **JWT** - Autenticação
- **CORS** - Configuração de origens

### Frontend
- **React 18** - Interface do usuário
- **React Flow** - Visualização de grafos
- **React Router** - Navegação
- **Axios** - Cliente HTTP
- **CSS3** - Estilização

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Git** - [Download](https://git-scm.com/)
- **Node.js 18+** - [Download](https://nodejs.org/)
- **Java JDK 17** - [Download](https://adoptium.net/)
- **Docker** (Recomendado) - [Download](https://docs.docker.com/get-docker/)

  *ou*

- **Neo4j Desktop** - [Download](https://neo4j.com/download/)

## 🚀 Instalação

### 1. Clonar o Repositório

```bash
git clone https://github.com/tbatista012/pi8-graph-algorithms.git
cd pi8-graph-algorithms
```

### 2. Instalar Dependências

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd ../frontend
npm install
```

## 🗄️ Configurar Banco de Dados

### Opção A: Docker (Recomendado)

```bash
docker run \
    --name neo4j-pi8 \
    -p 7474:7474 -p 7687:7687 \
    -d \
    -e NEO4J_AUTH=neo4j/pi123456 \
    neo4j:latest
```

### Opção B: Neo4j Desktop

1. Instale o Neo4j Desktop
2. Crie uma nova instância
3. Configure a senha: `pi123456`
4. Inicie a instância

## 🎯 Execução

### Terminal 1 - Backend
```bash
cd backend
npm start
```

**Saída esperada:**
```
🚀 Backend rodando na porta 3001
✅ NEO4J: Conectado com sucesso!
```

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

**Saída esperada:**
```
Local: http://localhost:3000
```

## 🌐 Acessos

| Serviço | URL | Credenciais |
|---------|-----|-------------|
| **Aplicação** | http://localhost:3000 | `admin` / `123` |
| **Neo4j Browser** | http://localhost:7474 | `neo4j` / `pi123456` |
| **API Health** | http://localhost:3001/api/health | - |

## 📖 Uso

### Primeiros Passos

1. **Acesse** http://localhost:3000
2. **Faça login** com:
   - Usuário: `admin`
   - Senha: `123`

3. **Configure seu grafo:**
   - Adicione vértices usando "+ Vértice"
   - Crie arestas com pesos usando "+ Aresta"
   - Selecione o vértice de origem

4. **Execute o algoritmo:**
   - Clique em "Executar Bellman-Ford"
   - Observe a execução passo a passo
   - Use os controles para navegar entre os passos

### Funcionalidades Avançadas

- **Histórico:** Acesse a aba "Histórico" para ver execuções anteriores
- **Estatísticas:** Veja métricas do sistema na aba de histórico
- **Carregar Execuções:** Clique em "Carregar" para recriar grafos anteriores
- **Visualização:** Use zoom e arraste para explorar o grafo

## 📁 Estrutura do Projeto

```
pi8-graph-algorithms/
├── 📁 backend/
│   ├── 📁 src/
│   │   ├── 📁 routes/           # Rotas da API
│   │   │   ├── authRoutes.js    # Autenticação
│   │   │   └── algorithmRoutes.js # Algoritmos
│   │   ├── 📁 utils/
│   │   │   └── neo4j.js         # Conexão com banco
│   │   └── server.js            # Servidor principal
│   ├── package.json
│   └── .env
├── 📁 frontend/
│   ├── 📁 src/
│   │   ├── 📁 components/
│   │   │   ├── BellmanFord.jsx  # Interface principal
│   │   │   ├── GraphVisualization.jsx # Visualização
│   │   │   ├── History.jsx      # Histórico
│   │   │   └── *.css           # Estilos
│   │   ├── 📁 pages/
│   │   │   └── Dashboard.jsx    # Dashboard principal
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 🔌 API

### Endpoints Principais

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/api/auth/login` | Autenticação de usuário |
| `POST` | `/api/algorithms/bellman-ford` | Executar Bellman-Ford |
| `GET` | `/api/algorithms/history` | Buscar histórico |
| `GET` | `/api/algorithms/stats` | Estatísticas do sistema |
| `DELETE` | `/api/algorithms/history/:id` | Excluir execução |

### Exemplo de Requisição Bellman-Ford

```json
POST /api/algorithms/bellman-ford
{
  "vertices": ["A", "B", "C"],
  "edges": [
    {"source": "A", "destination": "B", "weight": 4},
    {"source": "A", "destination": "C", "weight": 2}
  ],
  "source": "A"
}
```

## 🐛 Solução de Problemas

### Problemas Comuns

**Erro: Porta já em uso**
```bash
# Encontrar processo
netstat -ano | findstr :3001

# Matar processo (substitua PID)
taskkill /PID 12345 /F
```

**Erro: Neo4j não conecta**
```bash
# Testar conexão
curl http://localhost:7474

# Reiniciar container Docker
docker restart neo4j-pi8
```

**Erro: Módulos não encontrados**
```bash
# Limpar cache e reinstalar
rm -rf node_modules
rm package-lock.json
npm install
```

**Erro: Java não encontrado**
- Verifique se JDK 17 está instalado
- Configure a variável de ambiente `JAVA_HOME`

### Verificação de Saúde

```bash
# Testar Neo4j
curl http://localhost:7474

# Testar Backend
curl http://localhost:3001/api/health

# Testar Frontend
# Acesse: http://localhost:3000
```

## 🤝 Contribuição

Contribuições são bem-vindas! Siga estos passos:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👨‍💻 Desenvolvedor

**Thomas Batista**
- GitHub: [@tbatista012](https://github.com/tbatista012)

## 🙏 Agradecimentos

- Equipe do **React Flow** pela excelente biblioteca de visualização
- Comunidade **Neo4j** pela documentação completa
- **Stack Overflow** pela ajuda em desafios técnicos

---

**⭐ Se este projeto foi útil, considere dar uma estrela no repositório!**

---

<div align="center">

**🚀 Desenvolvido com 💙 para o estudo de algoritmos de grafos**

</div>
