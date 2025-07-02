import React, { useState, useRef, useEffect } from 'react';
import { Link, ArrowRight, GitBranch, Zap, Play, Pause } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface ConnectionNode {
  id: string;
  x: number;
  y: number;
  label: string;
  type: 'problem' | 'step' | 'solution' | 'verification';
  status: 'pending' | 'active' | 'completed';
}

interface Connection {
  from: string;
  to: string;
  type: 'sequence' | 'dependency' | 'verification' | 'branch';
  animated: boolean;
}

export default function ConnectionVisualization() {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);
  const [selectedExample, setSelectedExample] = useState('algebra');

  const examples = {
    algebra: {
      name: 'Algebraic Equation',
      problem: '2x + 5 = 13',
      nodes: [
        { id: 'problem', x: 100, y: 100, label: '2x + 5 = 13', type: 'problem' as const, status: 'completed' as const },
        { id: 'step1', x: 300, y: 100, label: 'Subtract 5', type: 'step' as const, status: 'completed' as const },
        { id: 'step2', x: 500, y: 100, label: '2x = 8', type: 'step' as const, status: 'active' as const },
        { id: 'step3', x: 700, y: 100, label: 'Divide by 2', type: 'step' as const, status: 'pending' as const },
        { id: 'solution', x: 500, y: 250, label: 'x = 4', type: 'solution' as const, status: 'pending' as const },
        { id: 'verify', x: 300, y: 250, label: 'Check: 2(4)+5=13', type: 'verification' as const, status: 'pending' as const }
      ],
      connections: [
        { from: 'problem', to: 'step1', type: 'sequence' as const, animated: true },
        { from: 'step1', to: 'step2', type: 'sequence' as const, animated: true },
        { from: 'step2', to: 'step3', type: 'sequence' as const, animated: false },
        { from: 'step3', to: 'solution', type: 'sequence' as const, animated: false },
        { from: 'solution', to: 'verify', type: 'verification' as const, animated: false },
        { from: 'verify', to: 'problem', type: 'verification' as const, animated: false }
      ]
    },
    geometry: {
      name: 'Circle Area',
      problem: 'Area of circle r=5',
      nodes: [
        { id: 'problem', x: 100, y: 150, label: 'Circle r=5', type: 'problem' as const, status: 'completed' as const },
        { id: 'formula', x: 300, y: 100, label: 'A = πr²', type: 'step' as const, status: 'completed' as const },
        { id: 'substitute', x: 500, y: 100, label: 'A = π(5)²', type: 'step' as const, status: 'active' as const },
        { id: 'calculate', x: 700, y: 150, label: 'A = 25π', type: 'step' as const, status: 'pending' as const },
        { id: 'solution', x: 500, y: 250, label: 'A ≈ 78.54', type: 'solution' as const, status: 'pending' as const },
        { id: 'diagram', x: 300, y: 250, label: 'Draw Circle', type: 'verification' as const, status: 'pending' as const }
      ],
      connections: [
        { from: 'problem', to: 'formula', type: 'sequence' as const, animated: true },
        { from: 'formula', to: 'substitute', type: 'sequence' as const, animated: true },
        { from: 'substitute', to: 'calculate', type: 'sequence' as const, animated: false },
        { from: 'calculate', to: 'solution', type: 'sequence' as const, animated: false },
        { from: 'problem', to: 'diagram', type: 'branch' as const, animated: false },
        { from: 'diagram', to: 'solution', type: 'verification' as const, animated: false }
      ]
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = theme === 'dark' ? '#374151' : '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const drawNode = (
    ctx: CanvasRenderingContext2D,
    node: ConnectionNode,
    isHighlighted: boolean = false
  ) => {
    const { x, y, label, type, status } = node;
    
    ctx.save();
    
    // Node colors based on type and status
    const colors = {
      problem: { bg: '#3B82F6', border: '#1D4ED8' },
      step: { bg: '#10B981', border: '#047857' },
      solution: { bg: '#F59E0B', border: '#D97706' },
      verification: { bg: '#8B5CF6', border: '#7C3AED' }
    };
    
    const statusAlpha = {
      pending: 0.4,
      active: 1.0,
      completed: 0.8
    };
    
    const nodeColor = colors[type];
    ctx.globalAlpha = statusAlpha[status];
    
    // Enhanced node styling
    const nodeWidth = 120;
    const nodeHeight = 40;
    const cornerRadius = 8;
    
    // Shadow for depth
    if (status === 'active' || isHighlighted) {
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetY = 4;
    }
    
    // Node background
    ctx.fillStyle = nodeColor.bg;
    ctx.beginPath();
    ctx.roundRect(x - nodeWidth/2, y - nodeHeight/2, nodeWidth, nodeHeight, cornerRadius);
    ctx.fill();
    
    // Node border
    ctx.strokeStyle = nodeColor.border;
    ctx.lineWidth = status === 'active' ? 3 : 2;
    ctx.stroke();
    
    // Reset shadow
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
    
    // Pulsing effect for active nodes
    if (status === 'active') {
      const pulseAlpha = 0.3 + Math.sin(Date.now() * 0.005) * 0.2;
      ctx.globalAlpha = pulseAlpha;
      ctx.fillStyle = nodeColor.bg;
      ctx.beginPath();
      ctx.roundRect(x - nodeWidth/2 - 4, y - nodeHeight/2 - 4, nodeWidth + 8, nodeHeight + 8, cornerRadius + 2);
      ctx.fill();
    }
    
    // Node text
    ctx.globalAlpha = 1.0;
    ctx.fillStyle = 'white';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Multi-line text handling
    const words = label.split(' ');
    if (words.length > 2) {
      const line1 = words.slice(0, Math.ceil(words.length / 2)).join(' ');
      const line2 = words.slice(Math.ceil(words.length / 2)).join(' ');
      ctx.fillText(line1, x, y - 6);
      ctx.fillText(line2, x, y + 6);
    } else {
      ctx.fillText(label, x, y);
    }
    
    // Status indicator
    const indicatorRadius = 6;
    const indicatorX = x + nodeWidth/2 - 10;
    const indicatorY = y - nodeHeight/2 + 10;
    
    const statusColors = {
      pending: '#6B7280',
      active: '#EF4444',
      completed: '#10B981'
    };
    
    ctx.fillStyle = statusColors[status];
    ctx.beginPath();
    ctx.arc(indicatorX, indicatorY, indicatorRadius, 0, 2 * Math.PI);
    ctx.fill();
    
    // Completion checkmark
    if (status === 'completed') {
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(indicatorX - 3, indicatorY);
      ctx.lineTo(indicatorX - 1, indicatorY + 2);
      ctx.lineTo(indicatorX + 3, indicatorY - 2);
      ctx.stroke();
    }
    
    ctx.restore();
  };

  const drawConnection = (
    ctx: CanvasRenderingContext2D,
    connection: Connection,
    nodes: ConnectionNode[],
    animationProgress: number = 0
  ) => {
    const fromNode = nodes.find(n => n.id === connection.from);
    const toNode = nodes.find(n => n.id === connection.to);
    
    if (!fromNode || !toNode) return;
    
    ctx.save();
    
    // Connection styling based on type
    const connectionStyles = {
      sequence: { color: '#3B82F6', width: 3, dash: [] },
      dependency: { color: '#10B981', width: 2, dash: [5, 5] },
      verification: { color: '#8B5CF6', width: 2, dash: [10, 5] },
      branch: { color: '#F59E0B', width: 2, dash: [3, 3] }
    };
    
    const style = connectionStyles[connection.type];
    ctx.strokeStyle = style.color;
    ctx.lineWidth = style.width;
    ctx.setLineDash(style.dash);
    ctx.lineCap = 'round';
    
    // Calculate connection points (edge of nodes, not center)
    const dx = toNode.x - fromNode.x;
    const dy = toNode.y - fromNode.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const unitX = dx / distance;
    const unitY = dy / distance;
    
    const nodeRadius = 60; // Half of node width
    const startX = fromNode.x + unitX * nodeRadius;
    const startY = fromNode.y + unitY * nodeRadius;
    const endX = toNode.x - unitX * nodeRadius;
    const endY = toNode.y - unitY * nodeRadius;
    
    // Animated drawing for active connections
    if (connection.animated && animationProgress < 1) {
      const currentEndX = startX + (endX - startX) * animationProgress;
      const currentEndY = startY + (endY - startY) * animationProgress;
      
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(currentEndX, currentEndY);
      ctx.stroke();
      
      // Animated pen tip
      if (animationProgress > 0) {
        ctx.fillStyle = style.color;
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.arc(currentEndX, currentEndY, 4, 0, 2 * Math.PI);
        ctx.fill();
      }
    } else {
      // Static connection
      ctx.globalAlpha = connection.animated ? 1.0 : 0.6;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
      
      // Arrow head
      const arrowLength = 12;
      const arrowAngle = Math.PI / 6;
      const angle = Math.atan2(dy, dx);
      
      ctx.fillStyle = style.color;
      ctx.beginPath();
      ctx.moveTo(endX, endY);
      ctx.lineTo(
        endX - arrowLength * Math.cos(angle - arrowAngle),
        endY - arrowLength * Math.sin(angle - arrowAngle)
      );
      ctx.lineTo(
        endX - arrowLength * Math.cos(angle + arrowAngle),
        endY - arrowLength * Math.sin(angle + arrowAngle)
      );
      ctx.closePath();
      ctx.fill();
    }
    
    // Connection type label
    if (connection.type !== 'sequence') {
      const midX = (startX + endX) / 2;
      const midY = (startY + endY) / 2;
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fillRect(midX - 25, midY - 8, 50, 16);
      
      ctx.fillStyle = style.color;
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(connection.type, midX, midY);
    }
    
    ctx.restore();
  };

  const drawProgressIndicator = (ctx: CanvasRenderingContext2D, nodes: ConnectionNode[]) => {
    const completedNodes = nodes.filter(n => n.status === 'completed').length;
    const totalNodes = nodes.length;
    const progress = completedNodes / totalNodes;
    
    // Progress bar
    const barX = 50;
    const barY = 50;
    const barWidth = 200;
    const barHeight = 8;
    
    ctx.fillStyle = theme === 'dark' ? '#4B5563' : '#E5E7EB';
    ctx.fillRect(barX, barY, barWidth, barHeight);
    
    ctx.fillStyle = '#10B981';
    ctx.fillRect(barX, barY, barWidth * progress, barHeight);
    
    // Progress text
    ctx.fillStyle = theme === 'dark' ? '#E5E7EB' : '#374151';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Progress: ${Math.round(progress * 100)}%`, barX, barY - 10);
  };

  const drawVisualization = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    clearCanvas();
    
    const example = examples[selectedExample as keyof typeof examples];
    const animationProgress = (animationStep % 100) / 100;
    
    // Draw connections first (behind nodes)
    example.connections.forEach(connection => {
      drawConnection(ctx, connection, example.nodes, animationProgress);
    });
    
    // Draw nodes
    example.nodes.forEach(node => {
      drawNode(ctx, node);
    });
    
    // Draw progress indicator
    drawProgressIndicator(ctx, example.nodes);
    
    // Draw legend
    drawLegend(ctx);
  };

  const drawLegend = (ctx: CanvasRenderingContext2D) => {
    const legendX = 50;
    const legendY = 300;
    
    ctx.save();
    ctx.fillStyle = theme === 'dark' ? 'rgba(55, 65, 81, 0.9)' : 'rgba(255, 255, 255, 0.9)';
    ctx.fillRect(legendX, legendY, 250, 120);
    
    ctx.strokeStyle = theme === 'dark' ? '#4B5563' : '#E5E7EB';
    ctx.lineWidth = 1;
    ctx.strokeRect(legendX, legendY, 250, 120);
    
    ctx.fillStyle = theme === 'dark' ? '#E5E7EB' : '#374151';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Connection Types', legendX + 10, legendY + 20);
    
    const legendItems = [
      { color: '#3B82F6', text: 'Sequence flow', dash: [] },
      { color: '#10B981', text: 'Dependency', dash: [5, 5] },
      { color: '#8B5CF6', text: 'Verification', dash: [10, 5] },
      { color: '#F59E0B', text: 'Branch/Alternative', dash: [3, 3] }
    ];
    
    ctx.font = '10px Arial';
    legendItems.forEach((item, index) => {
      const y = legendY + 40 + (index * 18);
      
      // Draw line sample
      ctx.strokeStyle = item.color;
      ctx.lineWidth = 2;
      ctx.setLineDash(item.dash);
      ctx.beginPath();
      ctx.moveTo(legendX + 10, y);
      ctx.lineTo(legendX + 30, y);
      ctx.stroke();
      
      // Draw text
      ctx.fillStyle = theme === 'dark' ? '#D1D5DB' : '#4B5563';
      ctx.fillText(item.text, legendX + 40, y + 3);
    });
    
    ctx.setLineDash([]);
    ctx.restore();
  };

  // Animation loop
  useEffect(() => {
    if (!isAnimating) return;

    const interval = setInterval(() => {
      setAnimationStep(prev => prev + 1);
    }, 100);

    return () => clearInterval(interval);
  }, [isAnimating]);

  useEffect(() => {
    drawVisualization();
  }, [selectedExample, animationStep, theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
    }

    clearCanvas();
  }, [theme]);

  const toggleAnimation = () => {
    setIsAnimating(!isAnimating);
  };

  const resetAnimation = () => {
    setAnimationStep(0);
    setIsAnimating(false);
  };

  return (
    <div className={`rounded-2xl p-6 backdrop-blur-sm border transition-colors duration-300 ${
      theme === 'dark'
        ? 'bg-gray-800/80 border-gray-700'
        : 'bg-white/80 border-gray-200'
    }`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg">
            <Link className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className={`text-lg font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Connection Visualization
            </h2>
            <p className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Step-by-step progression indicators and relationship markers
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={resetAnimation}
            className={`p-2 rounded-lg transition-colors ${
              theme === 'dark'
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            <GitBranch className="h-4 w-4" />
          </button>
          
          <button
            onClick={toggleAnimation}
            className="p-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700"
          >
            {isAnimating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Example Selection */}
        <div className="lg:col-span-1 space-y-6">
          <div>
            <h3 className={`text-sm font-medium mb-3 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Example Problems
            </h3>
            <div className="space-y-2">
              {Object.entries(examples).map(([key, example]) => (
                <button
                  key={key}
                  onClick={() => setSelectedExample(key)}
                  className={`w-full text-left p-3 rounded-lg transition-all hover:scale-[1.02] ${
                    selectedExample === key
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                      : theme === 'dark'
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  <div className="font-medium text-sm mb-1">{example.name}</div>
                  <div className={`text-xs font-mono ${
                    selectedExample === key ? 'text-white/80' : 'opacity-70'
                  }`}>
                    {example.problem}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Node Types */}
          <div className={`p-4 rounded-lg ${
            theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
          }`}>
            <h4 className={`text-sm font-medium mb-3 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Node Types
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span>Problem Statement</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span>Solution Step</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-amber-500 rounded"></div>
                <span>Final Solution</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-purple-500 rounded"></div>
                <span>Verification</span>
              </div>
            </div>
          </div>

          {/* Status Indicators */}
          <div className={`p-4 rounded-lg ${
            theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
          }`}>
            <h4 className={`text-sm font-medium mb-3 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Status Indicators
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Completed</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Active/Current</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                <span>Pending</span>
              </div>
            </div>
          </div>

          {/* Animation Controls */}
          <div className={`p-4 rounded-lg ${
            theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
          }`}>
            <h4 className={`text-sm font-medium mb-3 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Animation
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Status</span>
                <span className={`font-medium ${
                  isAnimating ? 'text-green-500' : 'text-gray-500'
                }`}>
                  {isAnimating ? 'Running' : 'Stopped'}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Step</span>
                <span className="font-mono">{animationStep}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Visualization Canvas */}
        <div className="lg:col-span-3">
          <div className="relative w-full h-96 rounded-xl overflow-hidden border-2 border-dashed border-gray-300">
            <canvas
              ref={canvasRef}
              className="w-full h-full"
              style={{ backgroundColor: theme === 'dark' ? '#374151' : '#ffffff' }}
            />
          </div>

          {/* Connection Summary */}
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className={`p-4 rounded-lg ${
              theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
            }`}>
              <h4 className={`font-medium mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Connection Benefits
              </h4>
              <div className="space-y-1 text-sm">
                <div>• Visual learning path</div>
                <div>• Clear step relationships</div>
                <div>• Progress tracking</div>
                <div>• Error identification</div>
              </div>
            </div>

            <div className={`p-4 rounded-lg ${
              theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
            }`}>
              <h4 className={`font-medium mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Interactive Features
              </h4>
              <div className="space-y-1 text-sm">
                <div>• Animated transitions</div>
                <div>• Step-by-step reveal</div>
                <div>• Connection highlighting</div>
                <div>• Progress indicators</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}