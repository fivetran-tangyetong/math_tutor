import React, { useState, useRef, useEffect } from 'react';
import { BookOpen, Play, Pause, RotateCcw, CheckCircle, ArrowRight } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { getCharacterPattern, generateHandwritingVariation, applyHandwritingVariations } from '../utils/strokePatterns';

type LetterCase = 'uppercase' | 'lowercase' | 'mixed';
type PracticeMode = 'individual' | 'words' | 'sentences';

interface LetterGroup {
  name: string;
  letters: string[];
  description: string;
}

export default function AlphabetModule() {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedCase, setSelectedCase] = useState<LetterCase>('uppercase');
  const [practiceMode, setPracticeMode] = useState<PracticeMode>('individual');
  const [currentLetter, setCurrentLetter] = useState<string>('A');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStrokeIndex, setCurrentStrokeIndex] = useState(0);
  const [strokeProgress, setStrokeProgress] = useState(0);
  const [completedLetters, setCompletedLetters] = useState<Set<string>>(new Set());

  const letterGroups: LetterGroup[] = [
    {
      name: 'Basic Strokes',
      letters: ['I', 'L', 'T', 'F', 'E', 'H'],
      description: 'Straight lines and simple combinations'
    },
    {
      name: 'Curved Letters',
      letters: ['O', 'C', 'G', 'Q', 'S', 'U'],
      description: 'Circular and curved formations'
    },
    {
      name: 'Angular Letters',
      letters: ['A', 'V', 'W', 'X', 'Y', 'Z'],
      description: 'Diagonal lines and angles'
    },
    {
      name: 'Complex Forms',
      letters: ['B', 'D', 'P', 'R', 'K', 'M', 'N'],
      description: 'Multiple strokes and combinations'
    }
  ];

  const practiceWords = [
    'CAT', 'DOG', 'SUN', 'MOON', 'STAR', 'TREE',
    'BOOK', 'HAND', 'LOVE', 'HOPE', 'DREAM', 'SMILE'
  ];

  const practiceSentences = [
    'THE QUICK BROWN FOX',
    'HELLO WORLD',
    'PRACTICE MAKES PERFECT',
    'BEAUTIFUL HANDWRITING'
  ];

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = theme === 'dark' ? '#374151' : '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw baseline guides
    ctx.strokeStyle = theme === 'dark' ? '#4B5563' : '#E5E7EB';
    ctx.lineWidth = 1;
    
    const baselineY = canvas.height / 2;
    const lineHeight = 60;
    
    // Baseline
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(0, baselineY);
    ctx.lineTo(canvas.width, baselineY);
    ctx.stroke();
    
    // Top line
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(0, baselineY - lineHeight);
    ctx.lineTo(canvas.width, baselineY - lineHeight);
    ctx.stroke();
    
    // Bottom line
    ctx.beginPath();
    ctx.moveTo(0, baselineY + lineHeight/2);
    ctx.lineTo(canvas.width, baselineY + lineHeight/2);
    ctx.stroke();
    
    ctx.setLineDash([]);
  };

  const drawLetterWithGuidance = (
    ctx: CanvasRenderingContext2D,
    letter: string,
    x: number,
    y: number,
    currentStroke: number,
    progress: number,
    showGuidance: boolean = true
  ) => {
    const pattern = getCharacterPattern(letter);
    if (!pattern) return;

    const variation = generateHandwritingVariation();
    const variedPattern = applyHandwritingVariations(pattern, variation);
    const scale = 3;

    ctx.save();
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Draw completed strokes
    for (let i = 0; i < currentStroke; i++) {
      if (i < variedPattern.strokes.length) {
        const stroke = variedPattern.strokes[i];
        ctx.strokeStyle = '#10B981';
        ctx.globalAlpha = 0.9;
        
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
        ctx.strokeStyle = '#3B82F6';
        ctx.globalAlpha = 1.0;
        ctx.lineWidth = 5;
        
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

        // Animated pen tip
        if (pointsToShow < stroke.points.length) {
          const lastPoint = stroke.points[pointsToShow];
          const tipX = x + lastPoint.x * scale;
          const tipY = y + lastPoint.y * scale;
          
          const pulseAlpha = 0.6 + Math.sin(Date.now() * 0.01) * 0.4;
          ctx.fillStyle = '#FF6B6B';
          ctx.globalAlpha = pulseAlpha;
          ctx.beginPath();
          ctx.arc(tipX, tipY, 6, 0, 2 * Math.PI);
          ctx.fill();
          
          // Ink trail effect
          ctx.globalAlpha = 0.3;
          ctx.beginPath();
          ctx.arc(tipX, tipY, 12, 0, 2 * Math.PI);
          ctx.fill();
        }
      }
    }

    // Show stroke guidance
    if (showGuidance) {
      variedPattern.strokes.forEach((stroke, index) => {
        if (stroke.points.length > 0) {
          const startPoint = stroke.points[0];
          const indicatorX = x + startPoint.x * scale;
          const indicatorY = y + startPoint.y * scale - 35;
          
          const isCompleted = index < currentStroke;
          const isCurrent = index === currentStroke;
          const isFuture = index > currentStroke;
          
          // Stroke number indicator
          ctx.fillStyle = isCompleted ? '#10B981' : 
                         isCurrent ? '#3B82F6' : 
                         '#6B7280';
          ctx.globalAlpha = isFuture ? 0.5 : 1.0;
          
          ctx.beginPath();
          ctx.arc(indicatorX, indicatorY, 15, 0, 2 * Math.PI);
          ctx.fill();
          
          ctx.fillStyle = 'white';
          ctx.font = 'bold 16px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText((index + 1).toString(), indicatorX, indicatorY);

          // Direction arrow for current stroke
          if (isCurrent && stroke.points.length > 1) {
            const start = stroke.points[0];
            const end = stroke.points[Math.min(3, stroke.points.length - 1)];
            
            const dx = end.x - start.x;
            const dy = end.y - start.y;
            const length = Math.sqrt(dx * dx + dy * dy);
            
            if (length > 0) {
              const unitX = dx / length;
              const unitY = dy / length;
              
              const arrowLength = 25;
              const arrowX = indicatorX + unitX * arrowLength;
              const arrowY = indicatorY + unitY * arrowLength;
              
              // Animated arrow
              const arrowAlpha = 0.7 + Math.sin(Date.now() * 0.008) * 0.3;
              ctx.strokeStyle = '#3B82F6';
              ctx.lineWidth = 4;
              ctx.globalAlpha = arrowAlpha;
              
              ctx.beginPath();
              ctx.moveTo(indicatorX, indicatorY);
              ctx.lineTo(arrowX, arrowY);
              ctx.stroke();
              
              // Arrow head
              ctx.fillStyle = '#3B82F6';
              ctx.beginPath();
              ctx.moveTo(arrowX, arrowY);
              ctx.lineTo(arrowX - unitX * 10 + unitY * 5, arrowY - unitY * 10 - unitX * 5);
              ctx.lineTo(arrowX - unitX * 10 - unitY * 5, arrowY - unitY * 10 + unitX * 5);
              ctx.closePath();
              ctx.fill();
            }
          }

          // Starting point indicator
          if (index === 0 || isCurrent) {
            const startX = x + startPoint.x * scale;
            const startY = y + startPoint.y * scale;
            
            ctx.fillStyle = isCurrent ? '#FF6B6B' : '#10B981';
            ctx.globalAlpha = 0.8;
            ctx.beginPath();
            ctx.arc(startX, startY, 8, 0, 2 * Math.PI);
            ctx.fill();
            
            // Pulsing effect for current starting point
            if (isCurrent) {
              const pulseRadius = 8 + Math.sin(Date.now() * 0.01) * 4;
              ctx.globalAlpha = 0.3;
              ctx.beginPath();
              ctx.arc(startX, startY, pulseRadius, 0, 2 * Math.PI);
              ctx.fill();
            }
          }
        }
      });
    }

    ctx.restore();
  };

  const drawCurrentPractice = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    clearCanvas();

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    if (practiceMode === 'individual') {
      drawLetterWithGuidance(ctx, currentLetter, centerX - 40, centerY - 30, currentStrokeIndex, strokeProgress);
      
      // Letter name
      ctx.fillStyle = theme === 'dark' ? '#E5E7EB' : '#374151';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`Letter: ${currentLetter}`, centerX, centerY + 80);
      
    } else if (practiceMode === 'words') {
      // Draw word practice
      const word = practiceWords[0]; // For demo
      let x = centerX - (word.length * 30);
      
      word.split('').forEach((letter, index) => {
        const isCurrentLetter = index === Math.floor(currentStrokeIndex / 10);
        const letterStroke = isCurrentLetter ? currentStrokeIndex % 10 : (index < Math.floor(currentStrokeIndex / 10) ? 999 : 0);
        const letterProgress = isCurrentLetter ? strokeProgress : (index < Math.floor(currentStrokeIndex / 10) ? 1 : 0);
        
        drawLetterWithGuidance(ctx, letter, x, centerY - 30, letterStroke, letterProgress, isCurrentLetter);
        x += 60;
      });
      
      ctx.fillStyle = theme === 'dark' ? '#E5E7EB' : '#374151';
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`Word: ${word}`, centerX, centerY + 80);
    }
  };

  // Animation loop
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      const pattern = getCharacterPattern(currentLetter);
      if (!pattern) return;

      setStrokeProgress(prev => {
        const newProgress = prev + 0.03;
        
        if (newProgress >= 1) {
          setCurrentStrokeIndex(prevStroke => {
            const nextStroke = prevStroke + 1;
            
            if (nextStroke >= pattern.strokes.length) {
              setIsPlaying(false);
              setCompletedLetters(prev => new Set([...prev, currentLetter]));
              return prevStroke;
            }
            
            return nextStroke;
          });
          
          return 0;
        }
        
        return newProgress;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [isPlaying, currentLetter, currentStrokeIndex]);

  useEffect(() => {
    drawCurrentPractice();
  }, [currentLetter, currentStrokeIndex, strokeProgress, practiceMode, theme]);

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

  const startLetter = (letter: string) => {
    setCurrentLetter(letter);
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
          <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className={`text-lg font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Alphabet Training Module
            </h2>
            <p className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Complete letter set with standardized stroke patterns
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
            className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:from-emerald-600 hover:to-teal-700"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Controls */}
        <div className="lg:col-span-1 space-y-6">
          {/* Case Selection */}
          <div>
            <h3 className={`text-sm font-medium mb-3 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Letter Case
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {(['uppercase', 'lowercase', 'mixed'] as LetterCase[]).map((caseType) => (
                <button
                  key={caseType}
                  onClick={() => setSelectedCase(caseType)}
                  className={`p-3 rounded-lg text-sm transition-colors ${
                    selectedCase === caseType
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white'
                      : theme === 'dark'
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {caseType.charAt(0).toUpperCase() + caseType.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Practice Mode */}
          <div>
            <h3 className={`text-sm font-medium mb-3 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Practice Mode
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {(['individual', 'words', 'sentences'] as PracticeMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setPracticeMode(mode)}
                  className={`p-3 rounded-lg text-sm transition-colors ${
                    practiceMode === mode
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                      : theme === 'dark'
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Letter Groups */}
          <div>
            <h3 className={`text-sm font-medium mb-3 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Letter Groups
            </h3>
            <div className="space-y-3">
              {letterGroups.map((group, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-gray-700/50 border-gray-600'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <h4 className={`font-medium text-sm mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {group.name}
                  </h4>
                  <p className={`text-xs mb-2 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {group.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {group.letters.map((letter) => (
                      <button
                        key={letter}
                        onClick={() => startLetter(selectedCase === 'lowercase' ? letter.toLowerCase() : letter)}
                        className={`w-8 h-8 rounded text-xs font-medium transition-all hover:scale-110 ${
                          currentLetter === (selectedCase === 'lowercase' ? letter.toLowerCase() : letter)
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white'
                            : completedLetters.has(selectedCase === 'lowercase' ? letter.toLowerCase() : letter)
                              ? 'bg-green-100 text-green-700 border border-green-300'
                              : theme === 'dark'
                                ? 'bg-gray-600 hover:bg-gray-500 text-gray-300'
                                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                        }`}
                      >
                        {selectedCase === 'lowercase' ? letter.toLowerCase() : letter}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
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
            
            {/* Overlay Instructions */}
            <div className="absolute top-4 left-4 right-4">
              <div className={`p-3 rounded-lg backdrop-blur-sm ${
                theme === 'dark'
                  ? 'bg-gray-800/80 border border-gray-700'
                  : 'bg-white/80 border border-gray-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className={`text-sm ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Current Stroke
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className={`text-sm ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Completed
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <span className={`text-sm ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Pen Position
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Summary */}
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className={`p-4 rounded-lg ${
              theme === 'dark'
                ? 'bg-gray-700/50'
                : 'bg-gray-50'
            }`}>
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className={`font-medium ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Completed Letters
                </span>
              </div>
              <div className="text-2xl font-bold text-green-500">
                {completedLetters.size}/26
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(completedLetters.size / 26) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className={`p-4 rounded-lg ${
              theme === 'dark'
                ? 'bg-gray-700/50'
                : 'bg-gray-50'
            }`}>
              <div className="flex items-center space-x-2 mb-2">
                <ArrowRight className="h-5 w-5 text-blue-500" />
                <span className={`font-medium ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Current Progress
                </span>
              </div>
              <div className="text-lg font-medium text-blue-500">
                Stroke {currentStrokeIndex + 1}
              </div>
              <div className="text-sm text-gray-500">
                {Math.round(strokeProgress * 100)}% complete
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}