import React, { useState } from 'react';
import { BookOpen, Target, Zap, Eye, Hand, Link } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import NumberPatternModule from './NumberPatternModule';
import AlphabetModule from './AlphabetModule';
import MathSymbolModule from './MathSymbolModule';
import VisualGuidanceSystem from './VisualGuidanceSystem';
import PressureSensitivityDemo from './PressureSensitivityDemo';
import ConnectionVisualization from './ConnectionVisualization';

type ModuleType = 'numbers' | 'alphabet' | 'symbols' | 'guidance' | 'pressure' | 'connections';

export default function EducationalInterface() {
  const { theme } = useTheme();
  const [activeModule, setActiveModule] = useState<ModuleType>('numbers');

  const modules = [
    {
      id: 'numbers' as ModuleType,
      name: 'Number Patterns',
      icon: Target,
      description: 'Sequential patterns 4-9 with natural variations',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      id: 'alphabet' as ModuleType,
      name: 'Alphabet Training',
      icon: BookOpen,
      description: 'Complete letter set with stroke guidance',
      color: 'from-emerald-500 to-teal-600'
    },
    {
      id: 'symbols' as ModuleType,
      name: 'Math Symbols',
      icon: Zap,
      description: 'Mathematical operators and grouping symbols',
      color: 'from-purple-500 to-violet-600'
    },
    {
      id: 'guidance' as ModuleType,
      name: 'Visual Guidance',
      icon: Eye,
      description: 'Directional arrows and color-coded strokes',
      color: 'from-amber-500 to-orange-600'
    },
    {
      id: 'pressure' as ModuleType,
      name: 'Pressure Sensitivity',
      icon: Hand,
      description: 'Line thickness and pressure feedback',
      color: 'from-rose-500 to-pink-600'
    },
    {
      id: 'connections' as ModuleType,
      name: 'Connection Visualization',
      icon: Link,
      description: 'Step-by-step progression indicators',
      color: 'from-cyan-500 to-blue-600'
    }
  ];

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'numbers':
        return <NumberPatternModule />;
      case 'alphabet':
        return <AlphabetModule />;
      case 'symbols':
        return <MathSymbolModule />;
      case 'guidance':
        return <VisualGuidanceSystem />;
      case 'pressure':
        return <PressureSensitivityDemo />;
      case 'connections':
        return <ConnectionVisualization />;
      default:
        return <NumberPatternModule />;
    }
  };

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
                  Educational Handwriting Interface
                </h1>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Comprehensive stroke-by-stroke learning system
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Module Navigation */}
          <div className="lg:col-span-1">
            <div className={`rounded-2xl p-6 backdrop-blur-sm border transition-colors duration-300 ${
              theme === 'dark'
                ? 'bg-gray-800/80 border-gray-700'
                : 'bg-white/80 border-gray-200'
            }`}>
              <h2 className={`text-lg font-semibold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Learning Modules
              </h2>
              
              <div className="space-y-3">
                {modules.map((module) => {
                  const Icon = module.icon;
                  const isActive = activeModule === module.id;
                  
                  return (
                    <button
                      key={module.id}
                      onClick={() => setActiveModule(module.id)}
                      className={`w-full text-left p-4 rounded-xl transition-all duration-200 hover:scale-[1.02] ${
                        isActive
                          ? `bg-gradient-to-r ${module.color} text-white shadow-lg`
                          : theme === 'dark'
                            ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${
                          isActive ? 'bg-white/20' : 'bg-current/10'
                        }`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm mb-1">
                            {module.name}
                          </h3>
                          <p className={`text-xs ${
                            isActive ? 'text-white/80' : 'opacity-70'
                          }`}>
                            {module.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {renderActiveModule()}
          </div>
        </div>
      </div>
    </div>
  );
}