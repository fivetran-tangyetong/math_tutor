import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw, CheckCircle, Target, TrendingUp } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { getCharacterPattern, generateHandwritingVariation, applyHandwritingVariations } from '../utils/strokePatterns';

type PatternType = 'ascending' | 'descending' | 'mixed';
type SequenceType = '4-6' | '7-9' | '4-9' | 'custom';

interface NumberSequence {
  numbers: string[];
  type: PatternType;
  complexity: 'simple' | 'medium' | 'complex';
}

export default function NumberPatternModule() {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentSequence, setCurrentSequence] = useState<NumberSequence | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentNumberIndex, setCurrentNumberIndex] = useState(0);
  const [currentStrokeIndex, setCurrentStrokeIndex] = useState(0);
  const [strokeProgress, setStrokeProgress] = useState(0);
  const [completedNumbers, setCompletedNumbers] = useState<Set<string>>(new Set());
  const [selectedSequenceType, setSelectedSequenceType] = useState<SequenceType>('4-6');

  const sequences: Record<SequenceType, NumberSequence[]> = {
    '4-6': [
      { numbers: ['4', '5', '6'], type: 'ascending', complexity: 'simple' },
      { numbers: ['6', '5', '4'], type: 'descending', complexity: 'simple' },
      { numbers: ['4', '6', '5'], type: 'mixed', complexity: 'medium' }
    ],
    '7-9': [
      { numbers: ['7', '8', '9'], type: 'ascending', complexity: 'simple' },
      { numbers: ['9', '8', '7'], type: 'descending', complexity: 'simple' },
      { numbers: ['7', '9', '8'], type: 'mixed', complexity: 'medium' }
    ],
    '4-9': [
      { numbers: ['4', '5', '6', '7', '8', '9'], type: 'ascending', complexity: 'complex' },
      { numbers: ['9', '8', '7', '6', '5', '4'], type: 'descending', complexity: 'complex' },
      { numbers: ['4', '7', '5', '8', '6', '9'], type: 'mixed', complexity: 'complex' }
    ],
    'custom': [
      { numbers: ['4', '4', '4'], type: 'ascending', complexity: 'simple' },
      { numbers: ['5', '5', '5'], type: 'ascending', complexity: 'simple' },
      { numbers: ['6', '6', '6'], type: 'ascending', complexity: 'simple' }
    ]
  };

  const startSequence = (sequence: NumberSequence) => {
    setCurrentSequence(sequence);
    setCurrentNumberIndex(0);
    setCurrentStrokeIndex(0);
    setStrokeProgress(0);
    setIsPlaying(false);
    clearCanvas();
  };

  const play = () => {
    if (!currentSequence) return;
    setIsPlaying(true);
  };

  const pause = () => {
    setIsPlaying(false);
  };

  const reset = () => {
    setCurrentNumberIndex(0);
    setCurrentStrokeIndex(0);
    setStrokeProgress(0);
    setIsPlaying(false);
    clearCanvas();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = theme === 'dark' ? '#374151' : '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw practice lines
    ctx.strokeStyle = theme === 'dark' ? '#4B5563' : '#E5E7EB';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    
    const lineSpacing = 60;
    for (let y = lineSpacing; y < canvas.height; y += lineSpacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    ctx.setLineDash([]);
  };

  const drawNumberWithStrokeOrder = (
    ctx: CanvasRenderingContext2D,
    number: string,
    x: number,
    y: number,
    currentStroke: number,
    progress: number
  ) => {
    const pattern = getCharacterPattern(number);
    if (!pattern) return;

    const variation = generateHandwritingVariation();
    const variedPattern = applyHandwritingVariations(pattern, variation);
    const scale = 2;

    ctx.save();
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Draw completed strokes
    for (let i = 0; i < currentStroke; i++) {
      if (i < variedPattern.strokes.length) {
        const stroke = variedPattern.strokes[i];
        ctx.strokeStyle = '#10B981'; // Green for completed
        ctx.globalAlpha = 0.8;
        
        ctx.beginPath();
        stroke.points.forEach((point, index) => {
          const px = x + point.x * scale;
          const py = y + point.y * scale;
          if (index === 0) {
            ctx.moveTo(px, py);
          } else {
            ctx.lineTo(px, py);
          }
        });
        ctx.stroke();
      }
    }

    // Draw current stroke in progress
    if (currentStroke < variedPattern.strokes.length) {
      const stroke = variedPattern.strokes[currentStroke];
      const pointsToShow = Math.floor(stroke.points.length * progress);
      
      if (pointsToShow > 0) {
        ctx.strokeStyle = '#3B82F6'; // Blue for current
        ctx.globalAlpha = 1.0;
        ctx.lineWidth = 4;
        
        ctx.beginPath();
        for (let i = 0; i <= pointsToShow; i++) {
          if (i < stroke.points.length) {
            const point = stroke.points[i];
            const px = x + point.x * scale;
            const py = y + point.y * scale;
            if (i === 0) {
              ctx.moveTo(px, py);
            } else {
              ctx.lineTo(px, py);
            }
          }
        }
        ctx.stroke();

        // Draw pen tip
        if (pointsToShow < stroke.points.length) {
          const lastPoint = stroke.points[pointsToShow];
          const tipX = x + lastPoint.x * scale;
          const tipY = y + lastPoint.y * scale;
          
          ctx.fillStyle = '#FF6B6B';
          ctx.globalAlpha = 0.8;
          ctx.beginPath();
          ctx.arc(tipX, tipY, 4, 0, 2 * Math.PI);
          ctx.fill();
        }
      }
    }

    // Draw stroke order indicators
    variedPattern.strokes.forEach((stroke, index) => {
      if (stroke.points.length > 0) {
        const startPoint = stroke.points[0];
        const indicatorX = x + startPoint.x * scale;
        const indicatorY = y + startPoint.y * scale - 25;
        
        const isCompleted = index < currentStroke;
        const isCurrent = index === currentStroke;
        
        ctx.fillStyle = isCompleted ? '#10B981' : isCurrent ? '#3B82F6' : '#6B7280';
        ctx.globalAlpha = 1.0;
        
        ctx.beginPath();
        ctx.arc(indicatorX, indicatorY, 12, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.fillStyle = 'white';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText((index + 1).toString(), indicatorX, indicatorY);

        // Draw directional arrow for current stroke
        if (isCurrent && stroke.points.length > 1) {
          const start = stroke.points[0];
          const end = stroke.points[Math.min(2, stroke.points.length - 1)];
          
          const dx = end.x - start.x;
          const dy = end.y - start.y;
          const length = Math.sqrt(dx * dx + dy * dy);
          
          if (length > 0) {
            const unitX = dx / length;
            const unitY = dy / length;
            
            const arrowLength = 20;
            const arrowX = indicatorX + unitX * arrowLength;
            const arrowY = indicatorY + unitY * arrowLength;
            
            ctx.strokeStyle = '#3B82F6';
            ctx.lineWidth = 3;
            ctx.globalAlpha = 0.8;
            
            ctx.beginPath();
            ctx.moveTo(indicatorX, indicatorY);
            ctx.lineTo(arrowX, arrowY);
            ctx.stroke();
            
            // Arrow head
            ctx.fillStyle = '#3B82F6';
            ctx.beginPath();
            ctx.moveTo(arrowX, arrowY);
            ctx.lineTo(arrowX - unitX * 8 + unitY * 4, arrowY - unitY * 8 - unitX * 4);
            ctx.lineTo(arrowX - unitX * 8 - unitY * 4, arrowY - unitY * 8 + unitX * 4);
            ctx.closePath();
            ctx.fill();
          }
        }
      }
    });

    ctx.restore();
  };

  const drawSequence = () => {
    if (!currentSequence) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    clearCanvas();

    const startX = 100;
    const startY = 100;
    const spacing = 120;

    currentSequence.numbers.forEach((number, index) => {
      const x = startX + index * spacing;
      const y = startY;
      
      if (index < currentNumberIndex) {
        // Completed numbers
        drawNumberWithStrokeOrder(ctx, number, x, y, 999, 1);
        
        // Completion checkmark
        ctx.fillStyle = '#10B981';
        ctx.beginPath();
        ctx.arc(x + 40, y - 40, 15, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x + 35, y - 40);
        ctx.lineTo(x + 38, y - 37);
        ctx.lineTo(x + 45, y - 43);
        ctx.stroke();
        
      } else if (index === currentNumberIndex) {
        // Current number
        drawNumberWithStrokeOrder(ctx, number, x, y, currentStrokeIndex, strokeProgress);
      } else {
        // Future numbers (faded)
        ctx.globalAlpha = 0.3;
        drawNumberWithStrokeOrder(ctx, number, x, y, 0, 0);
        ctx.globalAlpha = 1.0;
      }
    });

    // Draw progress indicator
    const progressWidth = (currentSequence.numbers.length * spacing) - 20;
    const progressX = startX - 10;
    const progressY = startY + 80;
    
    ctx.fillStyle = theme === 'dark' ? '#4B5563' : '#E5E7EB';
    ctx.fillRect(progressX, progressY, progressWidth, 6);
    
    const currentProgress = (currentNumberIndex + (currentStrokeIndex + strokeProgress) / 10) / currentSequence.numbers.length;
    ctx.fillStyle = '#3B82F6';
    ctx.fillRect(progressX, progressY, progressWidth * currentProgress, 6);
  };

  // Animation loop
  useEffect(() => {
    if (!isPlaying || !currentSequence) return;

    const interval = setInterval(() => {
      const currentNumber = currentSequence.numbers[currentNumberIndex];
      const pattern = getCharacterPattern(currentNumber);
      
      if (!pattern) return;

      setStrokeProgress(prev => {
        const newProgress = prev + 0.02;
        
        if (newProgress >= 1) {
          // Move to next stroke
          setCurrentStrokeIndex(prevStroke => {
            const nextStroke = prevStroke + 1;
            
            if (nextStroke >= pattern.strokes.length) {
              // Move to next number
              setCurrentNumberIndex(prevNumber => {
                const nextNumber = prevNumber + 1;
                
                if (nextNumber >= currentSequence.numbers.length) {
                  // Sequence complete
                  setIsPlaying(false);
                  setCompletedNumbers(prev => new Set([...prev, ...currentSequence.numbers]));
                  return prevNumber;
                }
                
                return nextNumber;
              });
              
              return 0;
            }
            
            return nextStroke;
          });
          
          return 0;
        }
        
        return newProgress;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isPlaying, currentSequence, currentNumberIndex, currentStrokeIndex]);

  useEffect(() => {
    drawSequence();
  }, [currentSequence, currentNumberIndex, currentStrokeIndex, strokeProgress, theme]);

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
          <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
            <Target className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className={`text-lg font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Number Pattern Module (4-9)
            </h2>
            <p className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Sequential patterns with natural variations and stroke guidance
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={reset}
            disabled={!currentSequence}
            className={`p-2 rounded-lg transition-colors ${
              theme === 'dark'
                ? 'bg-gray-700 hover:bg-gray-600 text-white disabled:opacity-50'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-50'
            }`}
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          
          <button
            onClick={isPlaying ? pause : play}
            disabled={!currentSequence}
            className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sequence Selection */}
        <div className="lg:col-span-1">
          <h3 className={`text-sm font-medium mb-3 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Select Sequence Type
          </h3>
          
          <div className="space-y-2 mb-4">
            {Object.keys(sequences).map((type) => (
              <button
                key={type}
                onClick={() => setSelectedSequenceType(type as SequenceType)}
                className={`w-full text-left p-3 rounded-lg text-sm transition-colors ${
                  selectedSequenceType === type
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                    : theme === 'dark'
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {type === '4-6' ? 'Numbers 4-6' :
                 type === '7-9' ? 'Numbers 7-9' :
                 type === '4-9' ? 'Full Range 4-9' :
                 'Practice Mode'}
              </button>
            ))}
          </div>

          <h3 className={`text-sm font-medium mb-3 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Available Patterns
          </h3>
          
          <div className="space-y-2">
            {sequences[selectedSequenceType].map((sequence, index) => (
              <button
                key={index}
                onClick={() => startSequence(sequence)}
                className={`w-full text-left p-3 rounded-lg text-sm transition-all hover:scale-[1.02] ${
                  currentSequence === sequence
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white'
                    : theme === 'dark'
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium mb-1">
                      {sequence.numbers.join(' → ')}
                    </div>
                    <div className={`text-xs ${
                      currentSequence === sequence ? 'text-white/80' : 'opacity-70'
                    }`}>
                      {sequence.type} • {sequence.complexity}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    {sequence.numbers.every(num => completedNumbers.has(num)) && (
                      <CheckCircle className="h-4 w-4 text-green-400" />
                    )}
                    <TrendingUp className={`h-3 w-3 ${
                      sequence.complexity === 'simple' ? 'text-green-400' :
                      sequence.complexity === 'medium' ? 'text-yellow-400' :
                      'text-red-400'
                    }`} />
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Completion Feedback */}
          <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
            <h4 className={`text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-green-400' : 'text-green-600'
            }`}>
              Progress Tracking
            </h4>
            <div className="text-xs space-y-1">
              <div>Completed Numbers: {completedNumbers.size}/6</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(completedNumbers.size / 6) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Canvas */}
        <div className="lg:col-span-3">
          <div className="relative w-full h-96 rounded-xl overflow-hidden border-2 border-dashed border-gray-300">
            <canvas
              ref={canvasRef}
              className="w-full h-full"
              style={{ backgroundColor: theme === 'dark' ? '#374151' : '#ffffff' }}
            />
            
            {!currentSequence && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Target className={`h-12 w-12 mx-auto mb-4 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-300'
                  }`} />
                  <p className={`text-lg ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Select a number pattern to begin
                  </p>
                  <p className={`text-sm mt-2 ${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    Watch stroke-by-stroke formation with directional guidance
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}