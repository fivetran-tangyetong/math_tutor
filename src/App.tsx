import React, { useState } from 'react';
import { BookOpen, Moon, Sun, GraduationCap } from 'lucide-react';
import Whiteboard from './components/Whiteboard';
import ProblemInput from './components/ProblemInput';
import ControlPanel from './components/ControlPanel';
import EducationalInterface from './components/EducationalInterface';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { SolutionProvider } from './contexts/SolutionContext';

type AppMode = 'tutoring' | 'educational';

function AppContent() {
  const { theme, toggleTheme } = useTheme();
  const [appMode, setAppMode] = useState<AppMode>('tutoring');

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50'
    }`}>
      {/* Header */}
      <header className={`backdrop-blur-md border-b transition-colors duration-300 ${
        theme === 'dark'
          ? 'bg-gray-900/70 border-gray-700'
          : 'bg-white/70 border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className={`text-xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  MathBoard
                </h1>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {appMode === 'tutoring' ? 'Interactive Math Tutoring' : 'Educational Handwriting System'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Mode Toggle */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setAppMode('tutoring')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    appMode === 'tutoring'
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                      : theme === 'dark'
                        ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-4 w-4" />
                    <span>Tutoring</span>
                  </div>
                </button>
                
                <button
                  onClick={() => setAppMode('educational')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    appMode === 'educational'
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white'
                      : theme === 'dark'
                        ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="h-4 w-4" />
                    <span>Educational</span>
                  </div>
                </button>
              </div>
              
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  theme === 'dark'
                    ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      {appMode === 'educational' ? (
        <EducationalInterface />
      ) : (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-8rem)]">
            {/* Left Sidebar - Problem Input */}
            <div className="lg:col-span-1">
              <ProblemInput />
            </div>
            
            {/* Main Whiteboard */}
            <div className="lg:col-span-2">
              <Whiteboard />
            </div>
            
            {/* Right Sidebar - Controls */}
            <div className="lg:col-span-1">
              <ControlPanel />
            </div>
          </div>
        </main>
      )}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <SolutionProvider>
        <AppContent />
      </SolutionProvider>
    </ThemeProvider>
  );
}

export default App;