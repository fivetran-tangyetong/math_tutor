import React, { useState, useRef, useEffect } from 'react';
import { Eye, ArrowRight, ArrowDown, ArrowUpRight, RotateCw, Palette } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

type ArrowType = '⟹' | '⟸' | '↗️' | '↻' | '↑' | '↓' | '→' | '←';
type GuidanceMode = 'arrows' | 'colors' | 'opacity' | 'combined';

interface GuidanceDemo {
  name: string;
  description: string;
  arrows: ArrowType[];
  colors: string[];
  example: string;
}

export default function VisualGuidanceSystem() {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [guidanceMode, setGuidanceMode] = useState<GuidanceMode>('combined');
  const [animationProgress, setAnimationProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const guidanceDemos: GuidanceDemo[] = [
    {
      name: 'Directional Flow',
      description: 'Shows stroke direction and sequence',
      arrows: ['→', '↓', '↗️', '↻'],
      colors: ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'],
      example: 'Letter A formation'
    },
    {
      name: 'Connection Links',
      description: 'Links between related elements',
      arrows: ['⟹', '⟸'],
      colors: ['#EF4444', '#06B6D4'],
      example: 'Problem to solution'
    },
    {
      name: 'Circular Motion',
      description: 'Curved and circular strokes',
      arrows: ['↻', '⟲'],
      colors: ['#8B5CF6', '#EC4899'],
      example: 'Letter O, number 8'
    }
  ];

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = theme === 'dark' ? '#374151' : '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const drawArrow = (
    ctx: CanvasRenderingContext2D,
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    color: string,
    type: ArrowType,
    opacity: number = 1
  ) => {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 4;
    ctx.globalAlpha = opacity;
    ctx.lineCap = 'round';

    const dx = endX - startX;
    const dy = endY - startY;
    const length = Math.sqrt(dx * dx + dy * dy);
    const unitX = dx / length;
    const unitY = dy / length;

    // Draw arrow shaft
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    // Draw arrow head
    const headLength = 15;
    const headAngle = Math.PI / 6;

    ctx.beginPath();
    ctx.moveTo(endX, endY);
    ctx.lineTo(
      endX - headLength * Math.cos(Math.atan2(dy, dx) - headAngle),
      endY - headLength * Math.sin(Math.atan2(dy, dx) - headAngle)
    );
    ctx.moveTo(endX, endY);
    ctx.lineTo(
      endX - headLength * Math.cos(Math.atan2(dy, dx) + headAngle),
      endY - headLength * Math.sin(Math.atan2(dy, dx) + headAngle)
    );
    ctx.stroke();

    // Add arrow type indicator
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const midX = (startX + endX) / 2;
    const midY = (startY + endY) / 2 - 20;
    
    // Background for text
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillRect(midX - 15, midY - 10, 30, 20);
    
    ctx.fillStyle = color;
    ctx.fillText(type, midX, midY);

    ctx.restore();
  };

  const drawColorCodedStroke = (
    ctx: CanvasRenderingContext2D,
    points: { x: number; y: number }[],
    colors: string[],
    progress: number
  ) => {
    if (points.length < 2) return;

    ctx.save();
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const totalPoints = points.length;
    const visiblePoints = Math.floor(totalPoints * progress);

    for (let i = 0; i < visiblePoints - 1; i++) {
      const colorIndex = Math.floor((i / totalPoints) * colors.length);
      const color = colors[colorIndex] || colors[0];
      
      // Progressive opacity
      const opacity = guidanceMode === 'opacity' ? 
        0.3 + (i / visiblePoints) * 0.7 : 
        1.0;

      ctx.strokeStyle = color;
      ctx.globalAlpha = opacity;
      
      ctx.beginPath();
      ctx.moveTo(points[i].x, points[i].y);
      ctx.lineTo(points[i + 1].x, points[i + 1].y);
      ctx.stroke();
    }

    // Draw current position indicator
    if (visiblePoints > 0 && visiblePoints < totalPoints) {
      const currentPoint = points[visiblePoints - 1];
      
      ctx.fillStyle = '#FF6B6B';
      ctx.globalAlpha = 0.8 + Math.sin(Date.now() * 0.01) * 0.2;
      ctx.beginPath();
      ctx.arc(currentPoint.x, currentPoint.y, 8, 0, 2 * Math.PI);
      ctx.fill();
      
      // Ripple effect
      ctx.strokeStyle = '#FF6B6B';
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.4;
      const rippleRadius = 8 + Math.sin(Date.now() * 0.015) * 6;
      ctx.beginPath();
      ctx.arc(currentPoint.x, currentPoint.y, rippleRadius, 0, 2 * Math.PI);
      ctx.stroke();
    }

    ctx.restore();
  };

  const drawGuidanceDemo = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    clearCanvas();

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Demo: Letter A with comprehensive guidance
    const letterAPoints = [
      { x: centerX - 60, y: centerY + 60 },  // Bottom left
      { x: centerX, y: centerY - 60 },       // Top
      { x: centerX + 60, y: centerY + 60 },  // Bottom right
    ];

    const crossbarPoints = [
      { x: centerX - 30, y: centerY + 10 },  // Crossbar left
      { x: centerX + 30, y: centerY + 10 },  // Crossbar right
    ];

    // Color scheme based on guidance mode
    const strokeColors = guidanceMode === 'colors' || guidanceMode === 'combined' ?
      ['#3B82F6', '#10B981', '#F59E0B'] :
      ['#6B7280', '#6B7280', '#6B7280'];

    // Draw main strokes with color coding
    if (guidanceMode === 'colors' || guidanceMode === 'combined' || guidanceMode === 'opacity') {
      drawColorCodedStroke(ctx, letterAPoints.slice(0, 2), [strokeColors[0]], animationProgress);
      
      if (animationProgress > 0.33) {
        drawColorCodedStroke(ctx, letterAPoints.slice(1), [strokeColors[1]], (animationProgress - 0.33) * 1.5);
      }
      
      if (animationProgress > 0.66) {
        drawColorCodedStroke(ctx, crossbarPoints, [strokeColors[2]], (animationProgress - 0.66) * 3);
      }
    }

    // Draw directional arrows
    if (guidanceMode === 'arrows' || guidanceMode === 'combined') {
      const arrowOpacity = guidanceMode === 'combined' ? 0.8 : 1.0;
      
      // Stroke 1 arrow (bottom-left to top)
      if (animationProgress > 0.1) {
        drawArrow(
          ctx,
          letterAPoints[0].x - 30,
          letterAPoints[0].y + 20,
          letterAPoints[1].x - 20,
          letterAPoints[1].y - 20,
          strokeColors[0],
          '↗️',
          arrowOpacity
        );
      }

      // Stroke 2 arrow (top to bottom-right)
      if (animationProgress > 0.4) {
        drawArrow(
          ctx,
          letterAPoints[1].x + 20,
          letterAPoints[1].y - 20,
          letterAPoints[2].x + 30,
          letterAPoints[2].y + 20,
          strokeColors[1],
          '↘️',
          arrowOpacity
        );
      }

      // Stroke 3 arrow (crossbar left to right)
      if (animationProgress > 0.7) {
        drawArrow(
          ctx,
          crossbarPoints[0].x - 20,
          crossbarPoints[0].y - 20,
          crossbarPoints[1].x + 20,
          crossbarPoints[1].y - 20,
          strokeColors[2],
          '→',
          arrowOpacity
        );
      }
    }

    // Draw stroke order indicators
    const strokeStarts = [
      letterAPoints[0],
      letterAPoints[1],
      crossbarPoints[0]
    ];

    strokeStarts.forEach((point, index) => {
      const isActive = animationProgress > (index * 0.33);
      const isCompleted = animationProgress > ((index + 1) * 0.33);
      
      ctx.fillStyle = isCompleted ? '#10B981' : 
                     isActive ? strokeColors[index] : 
                     '#6B7280';
      ctx.globalAlpha = isActive ? 1.0 : 0.5;
      
      ctx.beginPath();
      ctx.arc(point.x - 40, point.y - 40, 15, 0, 2 * Math.PI);
      ctx.fill();
      
      ctx.fillStyle = 'white';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText((index + 1).toString(), point.x - 40, point.y - 40);
    });

    // Draw connection indicators between strokes
    if (guidanceMode === 'combined') {
      ctx.strokeStyle = '#8B5CF6';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.globalAlpha = 0.6;
      
      // Connection from stroke 1 to stroke 2
      if (animationProgress > 0.33) {
        ctx.beginPath();
        ctx.moveTo(letterAPoints[1].x, letterAPoints[1].y);
        ctx.lineTo(letterAPoints[1].x, letterAPoints[1].y);
        ctx.stroke();
      }
      
      ctx.setLineDash([]);
    }

    // Add guidance legend
    drawGuidanceLegend(ctx);
  };

  const drawGuidanceLegend = (ctx: CanvasRenderingContext2D) => {
    const legendX = 20;
    const legendY = 20;
    
    ctx.save();
    ctx.fillStyle = theme === 'dark' ? 'rgba(55, 65, 81, 0.9)' : 'rgba(255, 255, 255, 0.9)';
    ctx.fillRect(legendX, legendY, 200, 120);
    
    ctx.strokeStyle = theme === 'dark' ? '#4B5563' : '#E5E7EB';
    ctx.lineWidth = 1;
    ctx.strokeRect(legendX, legendY, 200, 120);
    
    ctx.fillStyle = theme === 'dark' ? '#E5E7EB' : '#374151';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Visual Guidance', legendX + 10, legendY + 20);
    
    const legendItems = [
      { color: '#3B82F6', text: 'First stroke', symbol: '1' },
      { color: '#10B981', text: 'Second stroke', symbol: '2' },
      { color: '#F59E0B', text: 'Third stroke', symbol: '3' },
      { color: '#FF6B6B', text: 'Current position', symbol: '●' }
    ];
    
    ctx.font = '12px Arial';
    legendItems.forEach((item, index) => {
      const y = legendY + 40 + (index * 18);
      
      ctx.fillStyle = item.color;
      ctx.fillText(item.symbol, legendX + 10, y);
      
      ctx.fillStyle = theme === 'dark' ? '#D1D5DB' : '#4B5563';
      ctx.fillText(item.text, legendX + 30, y);
    });
    
    ctx.restore();
  };

  // Animation loop
  useEffect(() => {
    if (!isAnimating) return;

    const interval = setInterval(() => {
      setAnimationProgress(prev => {
        const newProgress = prev + 0.01;
        if (newProgress >= 1) {
          setIsAnimating(false);
          return 1;
        }
        return newProgress;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isAnimating]);

  useEffect(() => {
    drawGuidanceDemo();
  }, [guidanceMode, animationProgress, theme]);

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

  const startAnimation = () => {
    setAnimationProgress(0);
    setIsAnimating(true);
  };

  const resetAnimation = () => {
    setAnimationProgress(0);
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
          <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg">
            <Eye className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className={`text-lg font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Visual Guidance System
            </h2>
            <p className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Directional arrows, color-coding, and progressive opacity
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
            <RotateCw className="h-4 w-4" />
          </button>
          
          <button
            onClick={startAnimation}
            disabled={isAnimating}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg hover:from-amber-600 hover:to-orange-700 disabled:opacity-50"
          >
            {isAnimating ? 'Animating...' : 'Start Demo'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Guidance Mode Controls */}
        <div className="lg:col-span-1 space-y-6">
          <div>
            <h3 className={`text-sm font-medium mb-3 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Guidance Mode
            </h3>
            <div className="space-y-2">
              {([
                { id: 'arrows', name: 'Directional Arrows', icon: ArrowRight },
                { id: 'colors', name: 'Color Coding', icon: Palette },
                { id: 'opacity', name: 'Progressive Opacity', icon: Eye },
                { id: 'combined', name: 'Combined System', icon: RotateCw }
              ] as const).map((mode) => {
                const Icon = mode.icon;
                return (
                  <button
                    key={mode.id}
                    onClick={() => setGuidanceMode(mode.id)}
                    className={`w-full text-left p-3 rounded-lg transition-all hover:scale-[1.02] ${
                      guidanceMode === mode.id
                        ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white'
                        : theme === 'dark'
                          ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="h-4 w-4" />
                      <span className="text-sm font-medium">{mode.name}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Arrow Types Reference */}
          <div className={`p-4 rounded-lg ${
            theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
          }`}>
            <h4 className={`text-sm font-medium mb-3 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Arrow Types
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span>Horizontal</span>
                <span className="text-lg">→ ←</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Vertical</span>
                <span className="text-lg">↑ ↓</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Diagonal</span>
                <span className="text-lg">↗️ ↘️</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Circular</span>
                <span className="text-lg">↻ ↺</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Connection</span>
                <span className="text-lg">⟹ ⟸</span>
              </div>
            </div>
          </div>

          {/* Color Coding Reference */}
          <div className={`p-4 rounded-lg ${
            theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
          }`}>
            <h4 className={`text-sm font-medium mb-3 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Color Coding
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <span>First stroke</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span>Second stroke</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-amber-500 rounded-full"></div>
                <span>Third stroke</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-400 rounded-full"></div>
                <span>Current position</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Demo Canvas */}
        <div className="lg:col-span-3">
          <div className="relative w-full h-96 rounded-xl overflow-hidden border-2 border-dashed border-gray-300">
            <canvas
              ref={canvasRef}
              className="w-full h-full"
              style={{ backgroundColor: theme === 'dark' ? '#374151' : '#ffffff' }}
            />
          </div>

          {/* Progress Indicator */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-medium ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Animation Progress
              </span>
              <span className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {Math.round(animationProgress * 100)}%
              </span>
            </div>
            <div className={`w-full h-2 rounded-full ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
            }`}>
              <div 
                className="h-2 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full transition-all duration-300"
                style={{ width: `${animationProgress * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className={`p-4 rounded-lg ${
              theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
            }`}>
              <h4 className={`font-medium mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Active Features
              </h4>
              <div className="space-y-1 text-sm">
                {guidanceMode === 'arrows' && <div>✓ Directional arrows</div>}
                {guidanceMode === 'colors' && <div>✓ Color-coded strokes</div>}
                {guidanceMode === 'opacity' && <div>✓ Progressive opacity</div>}
                {guidanceMode === 'combined' && (
                  <>
                    <div>✓ Directional arrows</div>
                    <div>✓ Color-coded strokes</div>
                    <div>✓ Stroke connections</div>
                  </>
                )}
              </div>
            </div>

            <div className={`p-4 rounded-lg ${
              theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
            }`}>
              <h4 className={`font-medium mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Benefits
              </h4>
              <div className="space-y-1 text-sm">
                <div>• Clear stroke sequence</div>
                <div>• Direction guidance</div>
                <div>• Visual feedback</div>
                <div>• Learning reinforcement</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}