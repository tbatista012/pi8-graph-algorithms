// frontend/src/components/GraphVisualization.jsx
import React, { useCallback, useMemo } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from 'reactflow';
import 'reactflow/dist/style.css';

const GraphVisualization = ({ 
  vertices = [], 
  edges = [], 
  distances = {},
  predecessors = {},
  currentStep = null,
  source = '',
  onNodeClick,
  onEdgeClick
}) => {
  // Converter dados para formato do React Flow
  const initialNodes = useMemo(() => {
    return vertices.map((vertex, index) => {
      const isSource = vertex === source;
      const distance = distances[vertex];
      const isInfinity = distance === Infinity;
      
      return {
        id: vertex,
        position: {
          x: 100 + (index % 3) * 200,
          y: 100 + Math.floor(index / 3) * 150
        },
        data: { 
          label: (
            <div className="node-content">
              <div className="node-label">{vertex}</div>
              {distance !== undefined && (
                <div className={`node-distance ${isInfinity ? 'infinity' : ''}`}>
                  {isInfinity ? '∞' : distance}
                </div>
              )}
            </div>
          )
        },
        style: {
          background: isSource ? '#e74c3c' : '#3498db',
          color: 'white',
          border: '2px solid #2c3e50',
          borderRadius: '50%',
          width: 80,
          height: 80,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '16px',
          fontWeight: 'bold',
          boxShadow: isSource ? '0 0 10px #e74c3c' : '0 4px 6px rgba(0,0,0,0.1)',
        },
      };
    });
  }, [vertices, distances, source]);

  const initialEdges = useMemo(() => {
    return edges.map((edge, index) => {
      const isInCurrentStep = currentStep?.edge?.u === edge.source && 
                             currentStep?.edge?.v === edge.destination;
      
      return {
        id: `e${edge.source}-${edge.destination}-${index}`,
        source: edge.source,
        target: edge.destination,
        label: (
          <div className={`edge-label ${isInCurrentStep ? 'highlight' : ''}`}>
            {edge.weight}
          </div>
        ),
        style: {
          stroke: isInCurrentStep ? '#e67e22' : '#34495e',
          strokeWidth: isInCurrentStep ? 3 : 2,
        },
        markerEnd: {
          type: 'arrowclosed',
          color: isInCurrentStep ? '#e67e22' : '#34495e',
        },
      };
    });
  }, [edges, currentStep]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edgesState, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  // Atualizar nós quando dados mudarem
  React.useEffect(() => {
    setNodes(initialNodes);
  }, [initialNodes, setNodes]);

  React.useEffect(() => {
    setEdges(initialEdges);
  }, [initialEdges, setEdges]);

  // Highlight do caminho mais curto
  const shortestPathEdges = useMemo(() => {
    if (!predecessors || Object.keys(predecessors).length === 0) return [];
    
    const pathEdges = [];
    Object.entries(predecessors).forEach(([vertex, pred]) => {
      if (pred && pred !== vertex) {
        pathEdges.push({
          source: pred,
          target: vertex,
          isShortestPath: true
        });
      }
    });
    return pathEdges;
  }, [predecessors]);

  // Aplicar highlights do caminho mais curto
  React.useEffect(() => {
    if (shortestPathEdges.length > 0) {
      const updatedEdges = edgesState.map(edge => {
        const isShortestPath = shortestPathEdges.some(
          pathEdge => pathEdge.source === edge.source && pathEdge.target === edge.target
        );
        
        return {
          ...edge,
          style: {
            ...edge.style,
            stroke: isShortestPath ? '#27ae60' : edge.style?.stroke,
            strokeWidth: isShortestPath ? 4 : edge.style?.strokeWidth,
          },
          markerEnd: {
            type: 'arrowclosed',
            color: isShortestPath ? '#27ae60' : edge.markerEnd?.color,
          },
        };
      });
      
      setEdges(updatedEdges);
    }
  }, [shortestPathEdges, edgesState, setEdges]);

  return (
    <div style={{ width: '100%', height: '500px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <ReactFlow
        nodes={nodes}
        edges={edgesState}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        attributionPosition="bottom-left"
      >
        <Controls />
        <MiniMap 
          nodeColor="#3498db"
          maskColor="rgba(0, 0, 0, 0.1)"
        />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};

export default GraphVisualization;