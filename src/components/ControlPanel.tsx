import React from 'react';
import { 
  Play, Pause, RotateCcw, SkipBack, SkipForward, 
  Download, Volume2, Palette, Gauge 
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useSolution } from '../contexts/SolutionContext';

const BOARD_COLORS = [
  { name: 'White', value: 'white' as const, bg: 'bg-white', border: 'border-gray-300' },
  { name: 'Black', value: 'black' as const, bg: 'bg-gray-900', border: 'border-gray-700' },
  { name: 'Green', value: 'green' as const, bg: 'bg-emerald-800', border: 'border-emerald-600' },
  { name: 'Blue', value: 'blue' as const, bg: 'bg-blue-800', border: 'border-blue-600' }
];

const SPEED_OPTIONS = [
  { label: '0.5x', value: 0.5 },
  { label: '1x', value: 1 },
  { label: '1.5x', value: 1.5 },
  { label: '2x', value: 2 }
];

export default function ControlPanel() {
  const { theme, boardColor, setBoardColor } = useTheme();
  const { 
    currentSolution, 
    isPlaying, 
    currentStep, 
    speed,
    play, 
    pause, 
    reset, 
    setSpeed,
    nextStep, 
    prevStep 
  } = useSolution();

  const handleExport = () => {
    // Mock export functionality
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = 'math-solution.png';
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  return (
    <div className={`rounded-2xl p-6 h-full backdrop-blur-sm border transition-colors duration-300 ${
      theme === 'dark'
        ? 'bg-gray-800/80 border-gray-700'
        : 'bg-white/80 border-gray-200'
    }`}>
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg">
          <Gauge className="h-5 w-5 text-white" />
        </div>
        <h2 className={`text-lg font-semibold ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          Controls
        </h2>
      </div>

      {/* Animation Controls */}
      <div className="mb-6">
        <h3 className={`text-sm font-medium mb-3 ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Animation
        </h3>
        
        <div className="grid grid-cols-3 gap-2 mb-4">
          <button
            onClick={prevStep}
            disabled={!currentSolution || currentStep === 0}
            className={`p-3 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 ${
              theme === 'dark'
                ? 'bg-gray-700 hover:bg-gray-600 text-white disabled:opacity-50'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-50'
            }`}
          >
            <SkipBack className="h-4 w-4 mx-auto" />
          </button>
          
          <button
            onClick={isPlaying ? pause : play}
            disabled={!currentSolution}
            className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            {isPlaying ? <Pause className="h-4 w-4 mx-auto" /> : <Play className="h-4 w-4 mx-auto" />}
          </button>
          
          <button
            onClick={nextStep}
            disabled={!currentSolution || currentStep >= (currentSolution?.steps.length || 0) - 1}
            className={`p-3 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 ${
              theme === 'dark'
                ? 'bg-gray-700 hover:bg-gray-600 text-white disabled:opacity-50'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-50'
            }`}
          >
            <SkipForward className="h-4 w-4 mx-auto" />
          </button>
        </div>

        <button
          onClick={reset}
          disabled={!currentSolution}
          className={`w-full p-3 rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
            theme === 'dark'
              ? 'bg-gray-700 hover:bg-gray-600 text-white disabled:opacity-50'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-50'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <RotateCcw className="h-4 w-4" />
            <span>Reset</span>
          </div>
        </button>
      </div>

      {/* Speed Control */}
      <div className="mb-6">
        <h3 className={`text-sm font-medium mb-3 ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Speed
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {SPEED_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => setSpeed(option.value)}
              className={`p-2 rounded-lg text-sm transition-all duration-200 hover:scale-105 ${
                speed === option.value
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                  : theme === 'dark'
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Board Color */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-3">
          <Palette className={`h-4 w-4 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`} />
          <h3 className={`text-sm font-medium ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Board Color
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {BOARD_COLORS.map((color) => (
            <button
              key={color.value}
              onClick={() => setBoardColor(color.value)}
              className={`p-3 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                color.bg
              } ${
                boardColor === color.value
                  ? 'border-blue-500 ring-2 ring-blue-500/20'
                  : color.border
              }`}
            >
              <div className="text-center">
                <div className={`w-6 h-6 rounded-full mx-auto mb-1 ${color.bg} ${
                  color.value === 'white' ? 'border border-gray-300' : ''
                }`}></div>
                <span className={`text-xs ${
                  color.value === 'white' 
                    ? (theme === 'dark' ? 'text-gray-800' : 'text-gray-600')
                    : 'text-white'
                }`}>
                  {color.name}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Progress */}
      {currentSolution && (
        <div className="mb-6">
          <h3 className={`text-sm font-medium mb-3 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Progress
          </h3>
          <div className={`w-full bg-gray-200 rounded-full h-2 mb-2 ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
          }`}>
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${((currentStep + 1) / currentSolution.steps.length) * 100}%` 
              }}
            ></div>
          </div>
          <p className={`text-xs ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Step {currentStep + 1} of {currentSolution.steps.length}
          </p>
        </div>
      )}

      {/* Export */}
      <div>
        <h3 className={`text-sm font-medium mb-3 ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Export
        </h3>
        <div className="space-y-2">
          <button
            onClick={handleExport}
            disabled={!currentSolution}
            className={`w-full p-3 rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
              theme === 'dark'
                ? 'bg-gray-700 hover:bg-gray-600 text-white disabled:opacity-50'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-50'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Save Image</span>
            </div>
          </button>
          
          <button
            disabled={!currentSolution}
            className={`w-full p-3 rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
              theme === 'dark'
                ? 'bg-gray-700 hover:bg-gray-600 text-white disabled:opacity-50'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-50'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Volume2 className="h-4 w-4" />
              <span>Audio Guide</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}