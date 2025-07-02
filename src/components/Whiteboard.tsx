import React, { useRef, useEffect, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useSolution } from '../contexts/SolutionContext';
import { 
  getCharacterPattern, 
  interpolateStroke, 
  generateHandwritingVariation,
  applyHandwritingVariations,
  type StrokePoint,
  type HandwritingVariation 
} from '../utils/strokePatterns';

export default function Whiteboard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme, boardColor } = useTheme();
  const { currentSolution, currentStep, isPlaying, animationProgress } = useSolution();
  const [characterVariations] = useState<Map<string, HandwritingVariation>>(new Map());

  const getBoardBackground = () => {
    switch (boardColor) {
      case 'black': return '#1a1a1a';
      case 'green': return '#0f4f3c';
      case 'blue': return '#1e3a8a';
      default: return theme === 'dark' ? '#374151' : '#ffffff';
    }
  };

  const getTextColor = () => {
    if (boardColor === 'white') return theme === 'dark' ? '#ffffff' : '#000000';
    return '#ffffff';
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = getBoardBackground();
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add subtle grid for better visualization
    ctx.strokeStyle = boardColor === 'white' 
      ? (theme === 'dark' ? '#4B5563' : '#E5E7EB')
      : 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 0.5;
    
    const gridSize = 25;
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
  };

  const getCharacterVariation = (char: string, index: number): HandwritingVariation => {
    const key = `${char}_${index}`;
    if (!characterVariations.has(key)) {
      characterVariations.set(key, generateHandwritingVariation());
    }
    return characterVariations.get(key)!;
  };

  const drawNaturalStrokeByStrokeText = (
    ctx: CanvasRenderingContext2D, 
    text: string, 
    x: number, 
    y: number, 
    progress: number = 1,
    fontSize: number = 24
  ) => {
    const chars = text.split('');
    let currentX = x;
    const scale = fontSize / 30;
    
    // Calculate total animation time with natural variations
    const totalDuration = chars.reduce((sum, char, index) => {
      const pattern = getCharacterPattern(char);
      if (!pattern) return sum + 150;
      
      const variation = getCharacterVariation(char, index);
      const charDuration = pattern.strokes.length * 350 * (1 / variation.strokeWidth);
      return sum + charDuration;
    }, 0);
    
    let elapsedTime = 0;
    
    for (let charIndex = 0; charIndex < chars.length; charIndex++) {
      const char = chars[charIndex];
      const pattern = getCharacterPattern(char);
      
      if (!pattern) {
        currentX += 15 * scale;
        continue;
      }
      
      const variation = getCharacterVariation(char, charIndex);
      const variedPattern = applyHandwritingVariations(pattern, variation);
      
      const charDuration = variedPattern.strokes.length * 350 * (1 / variation.strokeWidth);
      const charStartTime = elapsedTime;
      const charEndTime = elapsedTime + charDuration;
      const currentTime = progress * totalDuration;
      
      if (currentTime >= charStartTime) {
        const charProgress = Math.min((currentTime - charStartTime) / charDuration, 1);
        
        // Draw character with natural variations
        drawNaturalCharacterStrokes(ctx, variedPattern, currentX, y, charProgress, scale, variation);
        
        // Show stroke order indicators for current character
        if (charProgress < 1 && charProgress > 0) {
          drawNaturalStrokeOrderIndicators(ctx, variedPattern, currentX, y, charProgress, scale, variation);
        }
      }
      
      currentX += variedPattern.width * scale + (5 * scale * variation.spacing);
      elapsedTime += charDuration;
    }
    
    // Draw animated writing cursor with natural movement
    if (progress < 1) {
      const cursorAlpha = Math.sin(Date.now() * 0.008) * 0.4 + 0.6;
      const cursorOffset = Math.sin(Date.now() * 0.012) * 2;
      
      ctx.save();
      ctx.globalAlpha = cursorAlpha;
      ctx.strokeStyle = '#FF6B6B';
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(currentX + cursorOffset, y - 8);
      ctx.lineTo(currentX + cursorOffset, y + 22);
      ctx.stroke();
      
      // Add pen tip glow
      ctx.shadowColor = '#FF6B6B';
      ctx.shadowBlur = 8;
      ctx.fillStyle = '#FF6B6B';
      ctx.beginPath();
      ctx.arc(currentX + cursorOffset, y + 22, 1.5, 0, 2 * Math.PI);
      ctx.fill();
      
      ctx.restore();
    }
  };

  const drawNaturalCharacterStrokes = (
    ctx: CanvasRenderingContext2D,
    pattern: any,
    x: number,
    y: number,
    progress: number,
    scale: number,
    variation: HandwritingVariation
  ) => {
    const totalStrokes = pattern.strokes.length;
    const currentStrokeIndex = Math.floor(progress * totalStrokes);
    const strokeProgress = (progress * totalStrokes) - currentStrokeIndex;
    
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Draw completed strokes with natural variations
    for (let i = 0; i < currentStrokeIndex; i++) {
      const stroke = pattern.strokes[i];
      drawNaturalCompleteStroke(ctx, stroke, x, y, scale, variation);
    }
    
    // Draw current stroke in progress with natural flow
    if (currentStrokeIndex < totalStrokes && strokeProgress > 0) {
      const currentStroke = pattern.strokes[currentStrokeIndex];
      drawNaturalPartialStroke(ctx, currentStroke, x, y, strokeProgress, scale, variation);
    }
    
    ctx.restore();
  };

  const drawNaturalCompleteStroke = (
    ctx: CanvasRenderingContext2D,
    stroke: any,
    x: number,
    y: number,
    scale: number,
    variation: HandwritingVariation
  ) => {
    if (stroke.points.length === 0) return;
    
    ctx.strokeStyle = getTextColor();
    
    // Apply natural pressure variations
    const baseWidth = 2.5 * scale * variation.strokeWidth;
    
    for (let i = 0; i < stroke.points.length - 1; i++) {
      const point = stroke.points[i];
      const nextPoint = stroke.points[i + 1];
      const pressure = point.pressure || 1;
      
      // Natural line width variation
      const lineWidth = baseWidth * (0.7 + pressure * 0.6);
      const naturalVariation = 1 + (Math.sin(i * 0.5) * 0.1);
      
      ctx.lineWidth = lineWidth * naturalVariation;
      
      // Add subtle opacity variation for natural ink flow
      ctx.globalAlpha = 0.85 + (pressure * 0.15);
      
      ctx.beginPath();
      ctx.moveTo(x + point.x * scale, y + point.y * scale);
      
      if (stroke.naturalCurve && i > 0 && i < stroke.points.length - 2) {
        // Use quadratic curves for smoother, more natural lines
        const controlPoint = stroke.points[i + 1];
        ctx.quadraticCurveTo(
          x + controlPoint.x * scale,
          y + controlPoint.y * scale,
          x + nextPoint.x * scale,
          y + nextPoint.y * scale
        );
      } else {
        ctx.lineTo(x + nextPoint.x * scale, y + nextPoint.y * scale);
      }
      
      ctx.stroke();
    }
    
    ctx.globalAlpha = 1;
  };

  const drawNaturalPartialStroke = (
    ctx: CanvasRenderingContext2D,
    stroke: any,
    x: number,
    y: number,
    progress: number,
    scale: number,
    variation: HandwritingVariation
  ) => {
    const interpolatedPoints = interpolateStroke(stroke, progress);
    if (interpolatedPoints.length === 0) return;
    
    ctx.strokeStyle = getTextColor();
    const baseWidth = 2.5 * scale * variation.strokeWidth;
    
    // Draw the stroke with natural flow
    for (let i = 0; i < interpolatedPoints.length - 1; i++) {
      const point = interpolatedPoints[i];
      const nextPoint = interpolatedPoints[i + 1];
      const pressure = point.pressure || 1;
      
      const lineWidth = baseWidth * (0.7 + pressure * 0.6);
      const progressFade = Math.min(i / Math.max(interpolatedPoints.length - 5, 1), 1);
      
      ctx.lineWidth = lineWidth;
      ctx.globalAlpha = 0.7 + (pressure * 0.3) * progressFade;
      
      ctx.beginPath();
      ctx.moveTo(x + point.x * scale, y + point.y * scale);
      ctx.lineTo(x + nextPoint.x * scale, y + nextPoint.y * scale);
      ctx.stroke();
    }
    
    // Add natural pen tip with subtle glow
    if (interpolatedPoints.length > 0) {
      const lastPoint = interpolatedPoints[interpolatedPoints.length - 1];
      const tipX = x + lastPoint.x * scale;
      const tipY = y + lastPoint.y * scale;
      
      ctx.save();
      ctx.shadowColor = '#FF6B6B';
      ctx.shadowBlur = 6;
      ctx.fillStyle = '#FF6B6B';
      ctx.globalAlpha = 0.9;
      
      // Natural pen tip shape
      ctx.beginPath();
      ctx.arc(tipX, tipY, 2 * scale, 0, 2 * Math.PI);
      ctx.fill();
      
      // Add ink trail effect
      ctx.globalAlpha = 0.4;
      ctx.beginPath();
      ctx.arc(tipX, tipY, 4 * scale, 0, 2 * Math.PI);
      ctx.fill();
      
      ctx.restore();
    }
    
    ctx.globalAlpha = 1;
  };

  const drawNaturalStrokeOrderIndicators = (
    ctx: CanvasRenderingContext2D,
    pattern: any,
    x: number,
    y: number,
    progress: number,
    scale: number,
    variation: HandwritingVariation
  ) => {
    const totalStrokes = pattern.strokes.length;
    const currentStrokeIndex = Math.floor(progress * totalStrokes);
    
    ctx.save();
    ctx.font = `${Math.round(11 * scale)}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Show stroke numbers with natural positioning
    for (let i = 0; i <= currentStrokeIndex && i < totalStrokes; i++) {
      const stroke = pattern.strokes[i];
      if (stroke.points.length === 0) continue;
      
      const startPoint = stroke.points[0];
      const isCurrentStroke = i === currentStrokeIndex;
      
      // Natural positioning with slight randomness
      const offsetX = (Math.sin(i * 2.1) * 3 + Math.cos(i * 1.7) * 2) * scale;
      const offsetY = (Math.cos(i * 1.9) * 3 + Math.sin(i * 2.3) * 2) * scale;
      
      const indicatorX = x + startPoint.x * scale + offsetX;
      const indicatorY = y + startPoint.y * scale - 18 * scale + offsetY;
      
      // Draw stroke number with natural style
      ctx.fillStyle = isCurrentStroke ? '#FF6B6B' : '#4ADE80';
      ctx.globalAlpha = isCurrentStroke ? 1.0 : 0.7;
      
      // Natural circle with slight imperfection
      const radius = 7 * scale;
      const circleVariation = 1 + Math.sin(i * 3.7) * 0.1;
      
      ctx.beginPath();
      ctx.arc(indicatorX, indicatorY, radius * circleVariation, 0, 2 * Math.PI);
      ctx.fill();
      
      // Number with slight offset for natural look
      ctx.fillStyle = 'white';
      ctx.fillText(
        (i + 1).toString(),
        indicatorX + Math.cos(i * 1.3) * 0.5,
        indicatorY + Math.sin(i * 1.1) * 0.5
      );
      
      // Draw natural direction arrow for current stroke
      if (isCurrentStroke && stroke.points.length > 1) {
        drawNaturalDirectionArrow(ctx, stroke, x, y, scale, variation);
      }
    }
    
    ctx.restore();
  };

  const drawNaturalDirectionArrow = (
    ctx: CanvasRenderingContext2D,
    stroke: any,
    x: number,
    y: number,
    scale: number,
    variation: HandwritingVariation
  ) => {
    if (stroke.points.length < 2) return;
    
    const start = stroke.points[0];
    const end = stroke.points[Math.min(3, stroke.points.length - 1)];
    
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    
    if (length === 0) return;
    
    const unitX = dx / length;
    const unitY = dy / length;
    
    const arrowLength = 18 * scale;
    const arrowWidth = 6 * scale;
    
    // Natural arrow positioning with slight curve
    const curveFactor = Math.sin(Date.now() * 0.003) * 0.1;
    const arrowX = x + start.x * scale + unitX * arrowLength + unitY * curveFactor * arrowLength;
    const arrowY = y + start.y * scale + unitY * arrowLength - unitX * curveFactor * arrowLength;
    
    ctx.save();
    ctx.strokeStyle = '#FF6B6B';
    ctx.fillStyle = '#FF6B6B';
    ctx.lineWidth = 2.5 * scale;
    ctx.globalAlpha = 0.85;
    
    // Natural arrow shaft with slight curve
    ctx.beginPath();
    ctx.moveTo(x + start.x * scale, y + start.y * scale);
    
    // Add natural curve to arrow
    const midX = x + start.x * scale + unitX * arrowLength * 0.5;
    const midY = y + start.y * scale + unitY * arrowLength * 0.5;
    const curveOffset = curveFactor * arrowLength * 0.3;
    
    ctx.quadraticCurveTo(
      midX + unitY * curveOffset,
      midY - unitX * curveOffset,
      arrowX,
      arrowY
    );
    ctx.stroke();
    
    // Natural arrow head with slight asymmetry
    const asymmetry = Math.sin(Date.now() * 0.005) * 0.1;
    
    ctx.beginPath();
    ctx.moveTo(arrowX, arrowY);
    ctx.lineTo(
      arrowX - unitX * arrowWidth + unitY * (arrowWidth * 0.4 + asymmetry),
      arrowY - unitY * arrowWidth - unitX * (arrowWidth * 0.4 + asymmetry)
    );
    ctx.lineTo(
      arrowX - unitX * arrowWidth - unitY * (arrowWidth * 0.4 - asymmetry),
      arrowY - unitY * arrowWidth + unitX * (arrowWidth * 0.4 - asymmetry)
    );
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();
  };

  const drawStep = (step: any, progress: number = 1) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.save();
    
    // Apply natural fade-in with slight variation
    const fadeProgress = Math.min(progress * 1.3, 1);
    const naturalFade = fadeProgress * (0.95 + Math.sin(Date.now() * 0.002) * 0.05);
    ctx.globalAlpha = naturalFade;
    
    ctx.fillStyle = step.color || getTextColor();
    ctx.strokeStyle = step.color || getTextColor();

    switch (step.type) {
      case 'expression':
        ctx.font = 'bold 28px "Courier New", monospace';
        ctx.textAlign = 'left';
        drawNaturalStrokeByStrokeText(ctx, step.content, step.position.x, step.position.y, progress, 28);
        break;
        
      case 'explanation':
        ctx.font = '20px "Inter", Arial, sans-serif';
        ctx.textAlign = 'left';
        
        // Handle multi-line text with natural handwriting
        const words = step.content.split(' ');
        let line = '';
        let y = step.position.y;
        const maxWidth = canvas.width - step.position.x - 50;
        let allLines: string[] = [];
        
        // Calculate line breaks
        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + ' ';
          const metrics = ctx.measureText(testLine);
          const testWidth = metrics.width;
          
          if (testWidth > maxWidth && n > 0) {
            allLines.push(line.trim());
            line = words[n] + ' ';
          } else {
            line = testLine;
          }
        }
        allLines.push(line.trim());
        
        // Draw each line with natural handwriting
        allLines.forEach((lineText, index) => {
          if (lineText) {
            const lineProgress = Math.max(0, Math.min((progress * allLines.length) - index, 1));
            const naturalLineSpacing = 35 + Math.sin(index * 1.7) * 2;
            drawNaturalStrokeByStrokeText(ctx, lineText, step.position.x, y + (index * naturalLineSpacing), lineProgress, 20);
          }
        });
        break;
        
      case 'shape':
        drawAnimatedShape(ctx, step, progress);
        break;
        
      case 'graph':
        drawAnimatedGraph(ctx, step, progress);
        break;
    }
    
    ctx.restore();
  };

  const drawAnimatedShape = (ctx: CanvasRenderingContext2D, step: any, progress: number) => {
    const { x, y } = step.position;
    ctx.lineWidth = 3;
    ctx.strokeStyle = step.color;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    if (step.content.includes('circle')) {
      const radiusMatch = step.content.match(/radius\s*(\d+)/);
      const radius = radiusMatch ? parseInt(radiusMatch[1]) * 8 : 40;
      
      // Draw circle with natural handwriting variations
      const segments = 150;
      const segmentsToShow = Math.floor(segments * progress);
      
      ctx.beginPath();
      for (let i = 0; i <= segmentsToShow; i++) {
        const angle = (i / segments) * 2 * Math.PI - Math.PI/2;
        
        // Add natural hand tremor
        const tremor = Math.sin(i * 0.3) * 0.8 + Math.cos(i * 0.7) * 0.6;
        const naturalRadius = radius + tremor;
        
        const pointX = x + Math.cos(angle) * naturalRadius;
        const pointY = y + Math.sin(angle) * naturalRadius;
        
        if (i === 0) {
          ctx.moveTo(pointX, pointY);
        } else {
          ctx.lineTo(pointX, pointY);
        }
      }
      ctx.stroke();
      
      // Natural pen tip with glow
      if (progress < 1 && segmentsToShow > 0) {
        const currentAngle = (segmentsToShow / segments) * 2 * Math.PI - Math.PI/2;
        const tremor = Math.sin(segmentsToShow * 0.3) * 0.8 + Math.cos(segmentsToShow * 0.7) * 0.6;
        const naturalRadius = radius + tremor;
        
        const tipX = x + Math.cos(currentAngle) * naturalRadius;
        const tipY = y + Math.sin(currentAngle) * naturalRadius;
        
        ctx.save();
        ctx.shadowColor = '#FF6B6B';
        ctx.shadowBlur = 8;
        ctx.fillStyle = '#FF6B6B';
        ctx.globalAlpha = 0.9;
        ctx.beginPath();
        ctx.arc(tipX, tipY, 3, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
      }
      
      // Add natural annotations
      if (progress > 0.8) {
        const annotationProgress = (progress - 0.8) / 0.2;
        
        ctx.save();
        ctx.globalAlpha = annotationProgress;
        ctx.setLineDash([4, 6]);
        ctx.lineWidth = 2;
        
        // Natural radius line with slight curve
        const radiusEndX = x + radius * annotationProgress;
        const radiusEndY = y + Math.sin(annotationProgress * Math.PI) * 2;
        
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.quadraticCurveTo(x + radius * 0.5, y - 5, radiusEndX, radiusEndY);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Natural center point
        ctx.fillStyle = step.color;
        ctx.beginPath();
        ctx.arc(x, y, 2.5, 0, 2 * Math.PI);
        ctx.fill();
        
        // Natural radius label
        if (annotationProgress > 0.5) {
          const labelProgress = (annotationProgress - 0.5) / 0.5;
          drawNaturalStrokeByStrokeText(ctx, `r = ${radiusMatch ? radiusMatch[1] : '5'}`, x + radius + 15, y - 5, labelProgress, 18);
        }
        
        ctx.restore();
      }
    }
  };

  const drawAnimatedGraph = (ctx: CanvasRenderingContext2D, step: any, progress: number) => {
    // Similar natural handwriting approach for graphs
    const { x, y } = step.position;
    const width = 220;
    const height = 160;
    
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = step.color;
    ctx.lineCap = 'round';
    
    // Draw axes with natural handwriting style
    if (progress > 0.05) {
      const axisProgress = Math.min((progress - 0.05) / 0.15, 1);
      
      // Natural X-axis with slight curve
      ctx.beginPath();
      ctx.moveTo(x - width/2, y);
      for (let i = 0; i <= axisProgress * 100; i++) {
        const axisX = x - width/2 + (width * i / 100);
        const naturalY = y + Math.sin(i * 0.1) * 0.5;
        ctx.lineTo(axisX, naturalY);
      }
      ctx.stroke();
      
      // Natural Y-axis
      ctx.beginPath();
      ctx.moveTo(x, y + height/2);
      for (let i = 0; i <= axisProgress * 100; i++) {
        const axisY = y + height/2 - (height * i / 100);
        const naturalX = x + Math.cos(i * 0.12) * 0.5;
        ctx.lineTo(naturalX, axisY);
      }
      ctx.stroke();
      
      // Natural axis labels
      if (axisProgress > 0.7) {
        const labelProgress = (axisProgress - 0.7) / 0.3;
        ctx.save();
        ctx.fillStyle = step.color;
        drawNaturalStrokeByStrokeText(ctx, 'x', x + width/2 - 15, y + 25, labelProgress, 16);
        drawNaturalStrokeByStrokeText(ctx, 'y', x - 25, y - height/2 + 20, labelProgress, 16);
        ctx.restore();
      }
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size with proper scaling
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
      ctx.textBaseline = 'top';
      ctx.imageSmoothingEnabled = true;
    }

    clearCanvas();
  }, [theme, boardColor]);

  useEffect(() => {
    if (currentSolution) {
      clearCanvas();
      
      // Draw all completed steps
      for (let i = 0; i < currentStep; i++) {
        if (i < currentSolution.steps.length) {
          drawStep(currentSolution.steps[i], 1);
        }
      }
      
      // Draw current step with natural animation progress
      if (currentStep < currentSolution.steps.length) {
        drawStep(currentSolution.steps[currentStep], animationProgress);
      }
    }
  }, [currentSolution, currentStep, animationProgress, theme, boardColor]);

  return (
    <div className={`rounded-2xl p-6 h-full backdrop-blur-sm border transition-colors duration-300 ${
      theme === 'dark'
        ? 'bg-gray-800/80 border-gray-700'
        : 'bg-white/80 border-gray-200'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className={`text-lg font-semibold ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          Natural Handwriting Board
        </h2>
        
        {currentSolution && (
          <div className="flex items-center space-x-3">
            <div className={`text-sm px-3 py-1 rounded-full ${
              currentSolution.problemType === 'algebra' ? 'bg-blue-100 text-blue-700' :
              currentSolution.problemType === 'arithmetic' ? 'bg-green-100 text-green-700' :
              currentSolution.problemType === 'geometry' ? 'bg-purple-100 text-purple-700' :
              'bg-orange-100 text-orange-700'
            }`}>
              {currentSolution.problemType}
            </div>
            
            {isPlaying && (
              <div className={`text-xs px-2 py-1 rounded-full animate-pulse flex items-center space-x-1 ${
                theme === 'dark' ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700'
              }`}>
                <div className="w-2 h-2 bg-current rounded-full animate-ping"></div>
                <span>WRITING</span>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="relative w-full h-[calc(100%-4rem)] rounded-xl overflow-hidden shadow-inner">
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{ backgroundColor: getBoardBackground() }}
        />
        
        {!currentSolution && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className={`text-6xl mb-4 ${
                boardColor === 'white' 
                  ? (theme === 'dark' ? 'text-gray-400' : 'text-gray-300')
                  : 'text-white/30'
              }`}>
                ✍️
              </div>
              <p className={`text-lg ${
                boardColor === 'white' 
                  ? (theme === 'dark' ? 'text-gray-400' : 'text-gray-500')
                  : 'text-white/70'
              }`}>
                Enter a math problem to begin
              </p>
              <p className={`text-sm mt-2 ${
                boardColor === 'white' 
                  ? (theme === 'dark' ? 'text-gray-500' : 'text-gray-400')
                  : 'text-white/50'
              }`}>
                Watch natural handwriting with authentic variations
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}