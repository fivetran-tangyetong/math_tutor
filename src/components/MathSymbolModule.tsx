import React, { useState, useRef, useEffect } from 'react';
import { Zap, Play, Pause, RotateCcw, Calculator, Brackets, Percent } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { getCharacterPattern, generateHandwritingVariation, applyHandwritingVariations } from '../utils/strokePatterns';

interface SymbolGroup {
  name: string;
  symbols: string[];
  description: string;
  icon: React.ComponentType<any>;
  color: string;
}

export default function MathSymbolModule() {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentSymbol, setCurrentSymbol] = useState<string>('+');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStrokeIndex, setCurrentStrokeIndex] = useState(0);
  const [strokeProgress, setStrokeProgress] = useState(0);
  const [completedSymbols, setCompletedSymbols] = useState<Set<string>>(new Set());
  const [selectedGroup, setSelectedGroup] = useState<string>('operators');

  const symbolGroups: SymbolGroup[] = [
    {
      name: 'Basic Operators',
      symbols: ['+', '-', '×', '÷', '='],
      description: 'Core mathematical operators',
      icon: Calculator,
      color: 'from-blue-500 to-indigo-600'
    },
    {
      name: 'Comparison',
      symbols: ['<', '>', '≤', '≥', '≠', '≈'],
      description: 'Comparison and relation symbols',
      icon: Zap,
      color: 'from-purple-500 to-violet-600'
    },
    {
      name: 'Grouping',
      symbols: ['(', ')', '[', ']', '{', '}'],
      description: 'Parentheses, brackets, and braces',
      icon: Brackets,
      color: 'from-emerald-500 to-teal-600'
    },
    {
      name: 'Advanced',
      symbols: ['√', '²', '³', '∞', 'π', '∫'],
      description: 'Advanced mathematical symbols',
      icon: Percent,
      color: 'from-amber-500 to-orange-600'
    }
  ];

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = theme === 'dark' ? '#374151' : '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw alignment grid
    ctx.strokeStyle = theme === 'dark' ? '#4B5563' : '#E5E7EB';
    ctx.lineWidth = 0.5;
    ctx.setLineDash([3, 3]);
    
    const gridSize = 30;
    for (let x = 0; x <= canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    
    for (let y = 0; y <= canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    
    // Center lines
    ctx.setLineDash([]);
    ctx.strokeStyle = theme === 'dark' ? '#6B7280' : '#D1D5DB';
    ctx.lineWidth = 1;
    
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
  };

  const drawSymbolWithPrecision = (
    ctx: CanvasRenderingContext2D,
    symbol: string,
    x: number,
    y: number,
    currentStroke: number,
    progress: number
  ) => {
    const pattern = getCharacterPattern(symbol);
    if (!pattern) {
      // Fallback for unsupported symbols
      ctx.save();
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = theme === 'dark' ? '#E5E7EB' : '#374151';
      ctx.globalAlpha = 0.5;
      ctx.fillText(symbol, x, y);
      ctx.restore();
      return;
    }

    const variation = generateHandwritingVariation();
    const variedPattern = applyHandwritingVariations(pattern, variation);
    const scale = 4;

    ctx.save();
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Draw completed strokes with precision
    for (let i = 0; i < currentStroke; i++) {
      if (i < variedPattern.strokes.length) {
        const stroke = variedPattern.strokes[i];
        
        // Color coding for different stroke types
        const strokeColors = ['#10B981', '#059669', '#047857'];
        ctx.strokeStyle = strokeColors[i % strokeColors.length];
        ctx.globalAlpha = 0.9;
        
        ctx.beginPath();
        stroke.points.forEach((point, index) => {
          const px = x + point.x * scale;
          const py = y + point.y * scale;
          
          // Apply pressure-sensitive width
          const pressure = point.pressure || 1;
          ctx.lineWidth = 3 + (pressure * 4);
          
          if (index === 0) {
            ctx.moveTo(px, py);
          } else {
            ctx.lineTo(px, py);
          }
        });
        ctx.stroke();
      }
    }

    // Draw current stroke with animation
    if (currentStroke < variedPattern.strokes.length) {
      const stroke = variedPattern.strokes[currentStroke];
      const pointsToShow = Math.floor(stroke.points.length * progress);
      
      if (pointsToShow > 0) {
        ctx.strokeStyle = '#3B82F6';
        ctx.globalAlpha = 1.0;
        
        // Animated stroke drawing
        ctx.beginPath();
        for (let i = 0; i <= pointsToShow; i++) {
          if (i < stroke.points.length) {
            const point = stroke.points[i];
            const px = x + point.x * scale;
            const py = y + point.y * scale;
            
            // Progressive pressure application
            const pressure = (point.pressure || 1) * (i / pointsToShow);
            ctx.lineWidth = 4 + (pressure * 3);
            
            if (i === 0) {
              ctx.moveTo(px, py);
            } else {
              ctx.lineTo(px, py);
            }
          }
        }
        ctx.stroke();

        // Enhanced pen tip with trail effect
        if (pointsToShow < stroke.points.length) {
          const lastPoint = stroke.points[pointsToShow];
          const tipX = x + lastPoint.x * scale;
          const tipY = y + lastPoint.y * scale;
          
          // Main pen tip
          const tipAlpha = 0.8 + Math.sin(Date.now() * 0.01) * 0.2;
          ctx.fillStyle = '#FF6B6B';
          ctx.globalAlpha = tipAlpha;
          ctx.beginPath();
          ctx.arc(tipX, tipY, 8, 0, 2 * Math.PI);
          ctx.fill();
          
          // Ink trail
          ctx.globalAlpha = 0.4;
          ctx.beginPath();
          ctx.arc(tipX, tipY, 16, 0, 2 * Math.PI);
          ctx.fill();
          
          // Pressure indicator
          const pressure = lastPoint.pressure || 1;
          ctx.globalAlpha = 0.6;
          ctx.strokeStyle = '#FF6B6B';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(tipX, tipY, 8 + (pressure * 8), 0, 2 * Math.PI);
          ctx.stroke();
        }
      }
    }

    // Enhanced stroke guidance system
    variedPattern.strokes.forEach((stroke, index) => {
      if (stroke.points.length > 0) {
        const startPoint = stroke.points[0];
        const indicatorX = x + startPoint.x * scale;
        const indicatorY = y + startPoint.y * scale - 50;
        
        const isCompleted = index < currentStroke;
        const isCurrent = index === currentStroke;
        const isFuture = index > currentStroke;
        
        // Stroke number with enhanced styling
        const bgColor = isCompleted ? '#10B981' : 
                       isCurrent ? '#3B82F6' : 
                       '#6B7280';
        
        ctx.fillStyle = bgColor;
        ctx.globalAlpha = isFuture ? 0.4 : 1.0;
        
        // Enhanced circle with shadow
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetY = 2;
        
        ctx.beginPath();
        ctx.arc(indicatorX, indicatorY, 18, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;
        
        // Number text
        ctx.fillStyle = 'white';
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText((index + 1).toString(), indicatorX, indicatorY);

        // Enhanced directional arrows with color coding
        if (isCurrent && stroke.points.length > 1) {
          const start = stroke.points[0];
          const end = stroke.points[Math.min(4, stroke.points.length - 1)];
          
          const dx = end.x - start.x;
          const dy = end.y - start.y;
          const length = Math.sqrt(dx * dx + dy * dy);
          
          if (length > 0) {
            const unitX = dx / length;
            const unitY = dy / length;
            
            // Direction classification
            const angle = Math.atan2(dy, dx) * 180 / Math.PI;
            let arrowColor = '#3B82F6';
            
            if (Math.abs(angle) < 30 || Math.abs(angle) > 150) {
              arrowColor = '#10B981'; // Horizontal - green
            } else if (Math.abs(angle - 90) < 30 || Math.abs(angle + 90) < 30) {
              arrowColor = '#F59E0B'; // Vertical - amber
            } else {
              arrowColor = '#8B5CF6'; // Diagonal - purple
            }
            
            const arrowLength = 35;
            const arrowX = indicatorX + unitX * arrowLength;
            const arrowY = indicatorY + unitY * arrowLength;
            
            // Animated arrow with pulsing effect
            const pulseScale = 1 + Math.sin(Date.now() * 0.008) * 0.1;
            ctx.strokeStyle = arrowColor;
            ctx.lineWidth = 5 * pulseScale;
            ctx.globalAlpha = 0.9;
            
            ctx.beginPath();
            ctx.moveTo(indicatorX, indicatorY);
            ctx.lineTo(arrowX, arrowY);
            ctx.stroke();
            
            // Enhanced arrow head
            ctx.fillStyle = arrowColor;
            ctx.beginPath();
            ctx.moveTo(arrowX, arrowY);
            ctx.lineTo(arrowX - unitX * 12 + unitY * 6, arrowY - unitY * 12 - unitX * 6);
            ctx.lineTo(arrowX - unitX * 12 - unitY * 6, arrowY - unitY * 12 + unitX * 6);
            ctx.closePath();
            ctx.fill();
          }
        }

        // Starting point with enhanced visibility
        const startX = x + startPoint.x * scale;
        const startY = y + startPoint.y * scale;
        
        if (isCurrent) {
          // Pulsing start indicator
          const pulseRadius = 10 + Math.sin(Date.now() * 0.012) * 4;
          ctx.fillStyle = '#FF6B6B';
          ctx.globalAlpha = 0.6;
          ctx.beginPath();
          ctx.arc(startX, startY, pulseRadius, 0, 2 * Math.PI);
          ctx.fill();
          
          ctx.globalAlpha = 1.0;
          ctx.beginPath();
          ctx.arc(startX, startY, 6, 0, 2 * Math.PI);
          ctx.fill();
        }
      }
    });

    ctx.restore();
  };

  const drawCurrentSymbol = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    clearCanvas();

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    drawSymbolWithPrecision(ctx, currentSymbol, centerX, centerY, currentStrokeIndex, strokeProgress);
    
    // Symbol information display
    ctx.fillStyle = theme === 'dark' ? '#E5E7EB' : '#374151';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Symbol: ${currentSymbol}`, centerX, centerY + 120);
    
    // Usage example
    const examples: Record<string, string> = {
      '+': '2 + 3 = 5',
      '-': '5 - 2 = 3',
      '×': '4 × 3 = 12',
      '÷': '8 ÷ 2 = 4',
      '=': 'x = 5',
      '<': '3 < 5',
      '>': '7 > 4',
      '(': '(x + 1)',
      ')': '(x + 1)',
      '[': '[1, 2, 3]',
      ']': '[1, 2, 3]'
    };
    
    if (examples[currentSymbol]) {
      ctx.font = '16px Arial';
      ctx.fillStyle = theme === 'dark' ? '#9CA3AF' : '#6B7280';
      ctx.fillText(`Example: ${examples[currentSymbol]}`, centerX, centerY + 150);
    }
  };

  // Animation loop
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      const pattern = getCharacterPattern(currentSymbol);
      if (!pattern) {
        setIsPlaying(false);
        return;
      }

      setStrokeProgress(prev => {
        const newProgress = prev + 0.025;
        
        if (newProgress >= 1) {
          setCurrentStrokeIndex(prevStroke => {
            const nextStroke = prevStroke + 1;
            
            if (nextStroke >= pattern.strokes.length) {
              setIsPlaying(false);
              setCompletedSymbols(prev => new Set([...prev, currentSymbol]));
              return prevStroke;
            }
            
            return nextStroke;
          });
          
          return 0;
        }
        
        return newProgress;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isPlaying, currentSymbol, currentStrokeIndex]);

  useEffect(() => {
    drawCurrentSymbol();
  }, [currentSymbol, currentStrokeIndex, strokeProgress, theme]);

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

  const startSymbol = (symbol: string) => {
    setCurrentSymbol(symbol);
    setCurrentStrokeIndex(0);
    setStrokeProgress(0);
    setIsPlaying(false);
  };

  const play = () => setIsPlaying(true);
  const pause = () => setIsPlaying(false);
  const reset = () => {
    setCurrentStrokeIndex(0);
    setStrokeProgress(0);
    setIsPlaying(false);
  };

  return (
    <div className={`rounded-2xl p-6 backdrop-blur-sm border transition-colors duration-300 ${
      theme === 'dark'
        ? 'bg-gray-800/80 border-gray-700'
        : 'bg-white/80 border-gray-200'
    }`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-violet-600 rounded-lg">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className={`text-lg font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Mathematical Symbol Integration
            </h2>
            <p className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Core operators, grouping symbols, and proper alignment
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={reset}
            className={`p-2 rounded-lg transition-colors ${
              theme === 'dark'
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          
          <button
            onClick={isPlaying ? pause : play}
            className="p-2 bg-gradient-to-r from-purple-500 to-violet-600 text-white rounded-lg hover:from-purple-600 hover:to-violet-700"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Symbol Groups */}
        <div className="lg:col-span-1 space-y-4">
          {symbolGroups.map((group, index) => {
            const Icon = group.icon;
            const isSelected = selectedGroup === group.name.toLowerCase().replace(' ', '');
            
            return (
              <div
                key={index}
                className={`p-4 rounded-lg border transition-all duration-200 ${
                  isSelected
                    ? `bg-gradient-to-r ${group.color} text-white border-transparent`
                    : theme === 'dark'
                      ? 'bg-gray-700/50 border-gray-600 hover:bg-gray-700'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`p-2 rounded-lg ${
                    isSelected ? 'bg-white/20' : 'bg-current/10'
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">{group.name}</h3>
                    <p className={`text-xs ${
                      isSelected ? 'text-white/80' : 'opacity-70'
                    }`}>
                      {group.description}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  {group.symbols.map((symbol) => (
                    <button
                      key={symbol}
                      onClick={() => startSymbol(symbol)}
                      className={`h-10 rounded-lg text-lg font-bold transition-all hover:scale-110 ${
                        currentSymbol === symbol
                          ? 'bg-white text-gray-900 shadow-lg'
                          : completedSymbols.has(symbol)
                            ? 'bg-green-100 text-green-700 border border-green-300'
                            : isSelected
                              ? 'bg-white/20 hover:bg-white/30'
                              : theme === 'dark'
                                ? 'bg-gray-600 hover:bg-gray-500 text-gray-300'
                                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                      }`}
                    >
                      {symbol}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Canvas */}
        <div className="lg:col-span-3">
          <div className="relative w-full h-96 rounded-xl overflow-hidden border-2 border-dashed border-gray-300">
            <canvas
              ref={canvasRef}
              className="w-full h-full"
              style={{ backgroundColor: theme === 'dark' ? '#374151' : '#ffffff' }}
            />
            
            {/* Legend */}
            <div className="absolute top-4 right-4">
              <div className={`p-3 rounded-lg backdrop-blur-sm ${
                theme === 'dark'
                  ? 'bg-gray-800/80 border border-gray-700'
                  : 'bg-white/80 border border-gray-200'
              }`}>
                <h4 className={`text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Stroke Direction Colors
                </h4>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Horizontal →</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                    <span>Vertical ↑↓</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span>Diagonal ↗↘</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Progress and Statistics */}
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className={`p-4 rounded-lg text-center ${
              theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
            }`}>
              <div className="text-2xl font-bold text-purple-500">
                {completedSymbols.size}
              </div>
              <div className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Symbols Mastered
              </div>
            </div>
            
            <div className={`p-4 rounded-lg text-center ${
              theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
            }`}>
              <div className="text-2xl font-bold text-blue-500">
                {currentStrokeIndex + 1}
              </div>
              <div className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Current Stroke
              </div>
            </div>
            
            <div className={`p-4 rounded-lg text-center ${
              theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
            }`}>
              <div className="text-2xl font-bold text-green-500">
                {Math.round(strokeProgress * 100)}%
              </div>
              <div className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Progress
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}