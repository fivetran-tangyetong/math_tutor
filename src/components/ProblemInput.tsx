import React, { useState } from 'react';
import { Calculator, Upload, Zap, BookOpen, PenTool } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useSolution } from '../contexts/SolutionContext';
import { solveMathProblem } from '../utils/mathSolver';

const SAMPLE_PROBLEMS = [
  { text: '1 + 1', type: 'arithmetic' as const },
  { text: '2x + 5 = 13', type: 'algebra' as const },
  { text: '125 + 387', type: 'arithmetic' as const },
  { text: '15 × 24', type: 'arithmetic' as const },
  { text: 'x² - 5x + 6 = 0', type: 'algebra' as const },
  { text: 'Area of circle with radius 7', type: 'geometry' as const },
  { text: 'Triangle area with base 8 height 6', type: 'geometry' as const },
  { text: 'Derivative of x² + 3x', type: 'calculus' as const }
];

export default function ProblemInput() {
  const { theme } = useTheme();
  const { setSolution } = useSolution();
  const [input, setInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleSolve = () => {
    if (!input.trim()) return;
    
    const solution = solveMathProblem(input);
    setSolution(solution);
  };

  const handleSampleProblem = (problem: string) => {
    setInput(problem);
    const solution = solveMathProblem(problem);
    setSolution(solution);
  };

  const handleImageUpload = () => {
    setIsUploading(true);
    // Simulate image processing with OCR
    setTimeout(() => {
      setIsUploading(false);
      const problems = ['3x² - 6x + 2 = 0', '∫ x² dx', '2x + 7 = 15'];
      const randomProblem = problems[Math.floor(Math.random() * problems.length)];
      setInput(randomProblem);
      const solution = solveMathProblem(randomProblem);
      setSolution(solution);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSolve();
    }
  };

  return (
    <div className={`rounded-2xl p-6 h-full backdrop-blur-sm border transition-colors duration-300 ${
      theme === 'dark'
        ? 'bg-gray-800/80 border-gray-700'
        : 'bg-white/80 border-gray-200'
    }`}>
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg">
          <Calculator className="h-5 w-5 text-white" />
        </div>
        <h2 className={`text-lg font-semibold ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          Problem Input
        </h2>
      </div>

      {/* Text Input */}
      <div className="mb-6">
        <label className={`block text-sm font-medium mb-2 ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Enter Math Problem
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="e.g., 1+1, 2x + 5 = 13, x² - 4x + 3 = 0, or Area of circle with radius 5"
          className={`w-full h-24 px-4 py-3 rounded-xl border resize-none transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            theme === 'dark'
              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
          }`}
        />
        <button
          onClick={handleSolve}
          disabled={!input.trim()}
          className="mt-3 w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-4 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <div className="flex items-center justify-center space-x-2">
            <Zap className="h-4 w-4" />
            <span>Solve Problem</span>
          </div>
        </button>
      </div>

      {/* Image Upload */}
      <div className="mb-6">
        <label className={`block text-sm font-medium mb-2 ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Upload Image
        </label>
        <button
          onClick={handleImageUpload}
          disabled={isUploading}
          className={`w-full py-8 border-2 border-dashed rounded-xl transition-all duration-200 hover:border-blue-400 ${
            theme === 'dark'
              ? 'border-gray-600 bg-gray-700/50 hover:bg-gray-700'
              : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
          } ${isUploading ? 'animate-pulse' : ''}`}
        >
          <div className="flex flex-col items-center space-y-2">
            {isUploading ? (
              <PenTool className={`h-8 w-8 animate-bounce ${
                theme === 'dark' ? 'text-blue-400' : 'text-blue-500'
              }`} />
            ) : (
              <Upload className={`h-8 w-8 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`} />
            )}
            <p className={`text-sm ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {isUploading ? 'Processing with OCR...' : 'Click to upload or drag image'}
            </p>
            {isUploading && (
              <p className={`text-xs ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Extracting mathematical expressions...
              </p>
            )}
          </div>
        </button>
      </div>

      {/* Sample Problems */}
      <div>
        <div className="flex items-center space-x-2 mb-3">
          <BookOpen className={`h-4 w-4 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`} />
          <label className={`text-sm font-medium ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Sample Problems
          </label>
        </div>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {SAMPLE_PROBLEMS.map((problem, index) => (
            <button
              key={index}
              onClick={() => handleSampleProblem(problem.text)}
              className={`w-full text-left p-3 rounded-lg text-sm transition-all duration-200 hover:scale-[1.02] ${
                theme === 'dark'
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs sm:text-sm">{problem.text}</span>
                <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ml-2 ${
                  problem.type === 'algebra' ? 'bg-blue-100 text-blue-700' :
                  problem.type === 'arithmetic' ? 'bg-green-100 text-green-700' :
                  problem.type === 'geometry' ? 'bg-purple-100 text-purple-700' :
                  'bg-orange-100 text-orange-700'
                }`}>
                  {problem.type}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}