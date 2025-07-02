import React, { useState, useRef, useEffect } from 'react';
import { Hand, Activity, Gauge, AlertCircle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface PressurePoint {
  x: number;
  y: number;
  pressure: number;
  timestamp: number;
}

type PressureMode = 'thickness' | 'color' | 'feedback' | 'detection';

export default function PressureSensitivityDemo() {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pressureMode, setPressureMode] = useState<PressureMode>('thickness');
  const [isDrawing, setIsDrawing] = useState(false);
  const [pressurePoints, setPressurePoints] = useState<PressurePoint[]>([]);
  const [currentPressure, setCurrentPressure] = useState(0);
  const [averagePressure, setAveragePressure] = useState(0);
  const [pressureErrors, setPressureErrors] = useState<string[]>([]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = theme === 'dark' ? '#374151' : '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw pressure guidelines
    ctx.strokeStyle = theme === 'dark' ? '#4B5563' : '#E5E7EB';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 4]);
    
    // Light pressure zone
    ctx.fillStyle = 'rgba(34, 197, 94, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height * 0.3);
    
    // Medium pressure zone
    ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
    ctx.fillRect(0, canvas.height * 0.3, canvas.width, canvas.height * 0.4);
    
    // Heavy pressure zone
    ctx.fillStyle = 'rgba(239, 68, 68, 0.1)';
    ctx.fillRect(0, canvas.height * 0.7, canvas.width, canvas.height * 0.3);
    
    ctx.setLineDash([]);
    
    // Zone labels
    ctx.fillStyle = theme === 'dark' ? '#9CA3AF' : '#6B7280';
    ctx.font = '12px Arial';
    ctx.textAlign = 'right';
    ctx.fillText('Light', canvas.width - 10, 20);
    ctx.fillText('Medium', canvas.width - 10, canvas.height * 0.5);
    ctx.fillText('Heavy', canvas.width - 10, canvas.height - 10);
  };

  const simulatePressure = (x: number, y: number): number => {
    // Simulate pressure based on position and movement
    const centerX = canvasRef.current?.width ? canvasRef.current.width / 2 : 0;
    const centerY = canvasRef.current?.height ? canvasRef.current.height / 2 : 0;
    
    const distanceFromCenter = Math.sqrt(
      Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
    );
    
    // Base pressure varies with distance from center
    let pressure = 0.3 + (distanceFromCenter / 200) * 0.7;
    
    // Add some randomness for natural variation
    pressure += (Math.random() - 0.5) * 0.2;
    
    // Clamp between 0 and 1
    return Math.max(0, Math.min(1, pressure));
  };

  const drawPressureStroke = (
    ctx: CanvasRenderingContext2D,
    points: PressurePoint[],
    mode: PressureMode
  ) => {
    if (points.length < 2) return;

    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    for (let i = 0; i < points.length - 1; i++) {
      const point = points[i];
      const nextPoint = points[i + 1];
      
      switch (mode) {
        case 'thickness':
          // Vary line thickness based on pressure
          ctx.lineWidth = 2 + (point.pressure * 12);
          ctx.strokeStyle = theme === 'dark' ? '#E5E7EB' : '#374151';
          ctx.globalAlpha = 0.8 + (point.pressure * 0.2);
          break;
          
        case 'color':
          // Vary color intensity based on pressure
          const intensity = Math.floor(point.pressure * 255);
          ctx.strokeStyle = `rgb(${255 - intensity}, ${intensity}, ${Math.floor(intensity * 0.5)})`;
          ctx.lineWidth = 4;
          ctx.globalAlpha = 0.7 + (point.pressure * 0.3);
          break;
          
        case 'feedback':
          // Visual feedback with pressure indicators
          ctx.lineWidth = 3 + (point.pressure * 6);
          const hue = point.pressure * 120; // Green to red
          ctx.strokeStyle = `hsl(${hue}, 70%, 50%)`;
          ctx.globalAlpha = 0.8;
          break;
          
        case 'detection':
          // Error detection mode
          const isError = point.pressure < 0.2 || point.pressure > 0.8;
          ctx.lineWidth = 4;
          ctx.strokeStyle = isError ? '#EF4444' : '#10B981';
          ctx.globalAlpha = isError ? 1.0 : 0.6;
          break;
      }
      
      ctx.beginPath();
      ctx.moveTo(point.x, point.y);
      ctx.lineTo(nextPoint.x, nextPoint.y);
      ctx.stroke();
      
      // Draw pressure indicators for feedback mode
      if (mode === 'feedback' && i % 5 === 0) {
        ctx.fillStyle = ctx.strokeStyle;
        ctx.globalAlpha = 0.6;
        ctx.beginPath();
        ctx.arc(point.x, point.y, 2 + (point.pressure * 4), 0, 2 * Math.PI);
        ctx.fill();
      }
    }

    ctx.restore();
  };

  const drawPressureVisualization = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    clearCanvas();
    
    if (pressurePoints.length > 0) {
      drawPressureStroke(ctx, pressurePoints, pressureMode);
    }
    
    // Draw current pressure indicator
    if (isDrawing && pressurePoints.length > 0) {
      const lastPoint = pressurePoints[pressurePoints.length - 1];
      
      ctx.save();
      ctx.fillStyle = '#FF6B6B';
      ctx.globalAlpha = 0.7 + Math.sin(Date.now() * 0.01) * 0.3;
      
      const radius = 8 + (lastPoint.pressure * 12);
      ctx.beginPath();
      ctx.arc(lastPoint.x, lastPoint.y, radius, 0, 2 * Math.PI);
      ctx.fill();
      
      // Pressure value display
      ctx.fillStyle = theme === 'dark' ? '#E5E7EB' : '#374151';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.globalAlpha = 1.0;
      ctx.fillText(
        `${Math.round(lastPoint.pressure * 100)}%`,
        lastPoint.x,
        lastPoint.y - radius - 10
      );
      
      ctx.restore();
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setIsDrawing(true);
    const pressure = simulatePressure(x, y);
    setCurrentPressure(pressure);
    
    const newPoint: PressurePoint = {
      x,
      y,
      pressure,
      timestamp: Date.now()
    };
    
    setPressurePoints([newPoint]);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const pressure = simulatePressure(x, y);
    setCurrentPressure(pressure);
    
    const newPoint: PressurePoint = {
      x,
      y,
      pressure,
      timestamp: Date.now()
    };
    
    setPressurePoints(prev => [...prev, newPoint]);
    
    // Pressure error detection
    if (pressureMode === 'detection') {
      const errors: string[] = [];
      
      if (pressure < 0.2) {
        errors.push('Pressure too light - increase pen pressure');
      } else if (pressure > 0.8) {
        errors.push('Pressure too heavy - lighten your touch');
      }
      
      // Check for pressure consistency
      if (pressurePoints.length > 5) {
        const recentPressures = pressurePoints.slice(-5).map(p => p.pressure);
        const variance = recentPressures.reduce((sum, p) => sum + Math.pow(p - pressure, 2), 0) / 5;
        
        if (variance > 0.1) {
          errors.push('Inconsistent pressure - try to maintain steady pressure');
        }
      }
      
      setPressureErrors(errors);
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    
    // Calculate average pressure
    if (pressurePoints.length > 0) {
      const avg = pressurePoints.reduce((sum, p) => sum + p.pressure, 0) / pressurePoints.length;
      setAveragePressure(avg);
    }
  };

  const clearDrawing = () => {
    setPressurePoints([]);
    setCurrentPressure(0);
    setAveragePressure(0);
    setPressureErrors([]);
    clearCanvas();
  };

  useEffect(() => {
    drawPressureVisualization();
  }, [pressurePoints, pressureMode, theme, isDrawing]);

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

  return (
    <div className={`rounded-2xl p-6 backdrop-blur-sm border transition-colors duration-300 ${
      theme === 'dark'
        ? 'bg-gray-800/80 border-gray-700'
        : 'bg-white/80 border-gray-200'
    }`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-rose-500 to-pink-600 rounded-lg">
            <Hand className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className={`text-lg font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Pressure Sensitivity Features
            </h2>
            <p className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Line thickness variations and pressure feedback
            </p>
          </div>
        </div>

        <button
          onClick={clearDrawing}
          className={`px-4 py-2 rounded-lg transition-colors ${
            theme === 'dark'
              ? 'bg-gray-700 hover:bg-gray-600 text-white'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
        >
          Clear Canvas
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Pressure Mode Controls */}
        <div className="lg:col-span-1 space-y-6">
          <div>
            <h3 className={`text-sm font-medium mb-3 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Pressure Mode
            </h3>
            <div className="space-y-2">
              {([
                { id: 'thickness', name: 'Line Thickness', icon: Activity, desc: 'Varies stroke width' },
                { id: 'color', name: 'Color Intensity', icon: Gauge, desc: 'Changes color based on pressure' },
                { id: 'feedback', name: 'Visual Feedback', icon: Hand, desc: 'Real-time pressure indicators' },
                { id: 'detection', name: 'Error Detection', icon: AlertCircle, desc: 'Identifies pressure issues' }
              ] as const).map((mode) => {
                const Icon = mode.icon;
                return (
                  <button
                    key={mode.id}
                    onClick={() => setPressureMode(mode.id)}
                    className={`w-full text-left p-3 rounded-lg transition-all hover:scale-[1.02] ${
                      pressureMode === mode.id
                        ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white'
                        : theme === 'dark'
                          ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <Icon className="h-4 w-4 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium">{mode.name}</div>
                        <div className={`text-xs ${
                          pressureMode === mode.id ? 'text-white/80' : 'opacity-70'
                        }`}>
                          {mode.desc}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Real-time Pressure Display */}
          <div className={`p-4 rounded-lg ${
            theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
          }`}>
            <h4 className={`text-sm font-medium mb-3 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Current Pressure
            </h4>
            
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">Live</span>
                  <span className="text-sm font-mono">{Math.round(currentPressure * 100)}%</span>
                </div>
                <div className={`w-full h-3 rounded-full ${
                  theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
                }`}>
                  <div 
                    className="h-3 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-full transition-all duration-150"
                    style={{ width: `${currentPressure * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">Average</span>
                  <span className="text-sm font-mono">{Math.round(averagePressure * 100)}%</span>
                </div>
                <div className={`w-full h-2 rounded-full ${
                  theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
                }`}>
                  <div 
                    className="h-2 bg-blue-500 rounded-full transition-all duration-300"
                    style={{ width: `${averagePressure * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Pressure Guidelines */}
          <div className={`p-4 rounded-lg ${
            theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
          }`}>
            <h4 className={`text-sm font-medium mb-3 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Pressure Guidelines
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Light (0-30%): Sketching, guidelines</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Medium (30-70%): Normal writing</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Heavy (70-100%): Emphasis, bold strokes</span>
              </div>
            </div>
          </div>

          {/* Error Detection */}
          {pressureMode === 'detection' && pressureErrors.length > 0 && (
            <div className="p-4 rounded-lg bg-red-50 border border-red-200">
              <h4 className="text-sm font-medium mb-2 text-red-800">
                Pressure Issues Detected
              </h4>
              <div className="space-y-1">
                {pressureErrors.map((error, index) => (
                  <div key={index} className="text-xs text-red-700 flex items-start space-x-2">
                    <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main Drawing Canvas */}
        <div className="lg:col-span-3">
          <div className="relative w-full h-96 rounded-xl overflow-hidden border-2 border-dashed border-gray-300">
            <canvas
              ref={canvasRef}
              className="w-full h-full cursor-crosshair"
              style={{ backgroundColor: theme === 'dark' ? '#374151' : '#ffffff' }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            />
            
            {/* Instructions Overlay */}
            {pressurePoints.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <Hand className={`h-12 w-12 mx-auto mb-4 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-300'
                  }`} />
                  <p className={`text-lg ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Click and drag to draw
                  </p>
                  <p className={`text-sm mt-2 ${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    Pressure is simulated based on distance from center
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Statistics */}
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className={`p-4 rounded-lg text-center ${
              theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
            }`}>
              <div className="text-2xl font-bold text-rose-500">
                {pressurePoints.length}
              </div>
              <div className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Data Points
              </div>
            </div>
            
            <div className={`p-4 rounded-lg text-center ${
              theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
            }`}>
              <div className="text-2xl font-bold text-blue-500">
                {Math.round(currentPressure * 100)}%
              </div>
              <div className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Current Pressure
              </div>
            </div>
            
            <div className={`p-4 rounded-lg text-center ${
              theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
            }`}>
              <div className="text-2xl font-bold text-green-500">
                {Math.round(averagePressure * 100)}%
              </div>
              <div className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Average Pressure
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}