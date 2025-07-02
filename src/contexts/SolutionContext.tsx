import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

export interface SolutionStep {
  id: string;
  content: string;
  type: 'expression' | 'explanation' | 'shape' | 'graph';
  position: { x: number; y: number };
  color: string;
  animation?: {
    duration: number;
    delay: number;
    type: 'fadeIn' | 'slideIn' | 'draw';
  };
}

export interface Solution {
  id: string;
  problem: string;
  steps: SolutionStep[];
  problemType: 'arithmetic' | 'algebra' | 'geometry' | 'calculus';
}

interface SolutionContextType {
  currentSolution: Solution | null;
  isPlaying: boolean;
  currentStep: number;
  speed: number;
  animationProgress: number;
  setSolution: (solution: Solution) => void;
  play: () => void;
  pause: () => void;
  reset: () => void;
  setSpeed: (speed: number) => void;
  nextStep: () => void;
  prevStep: () => void;
}

const SolutionContext = createContext<SolutionContextType | undefined>(undefined);

export function SolutionProvider({ children }: { children: React.ReactNode }) {
  const [currentSolution, setCurrentSolution] = useState<Solution | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [animationProgress, setAnimationProgress] = useState(0);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const setSolution = (solution: Solution) => {
    setCurrentSolution(solution);
    setCurrentStep(0);
    setIsPlaying(false);
    setAnimationProgress(0);
    startTimeRef.current = null;
  };

  const play = () => {
    if (!currentSolution) return;
    setIsPlaying(true);
    startTimeRef.current = null;
  };

  const pause = () => {
    setIsPlaying(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  };

  const reset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
    setAnimationProgress(0);
    startTimeRef.current = null;
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  };

  const nextStep = () => {
    if (currentSolution && currentStep < currentSolution.steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setAnimationProgress(0);
      startTimeRef.current = null;
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setAnimationProgress(0);
      startTimeRef.current = null;
    }
  };

  // Animation loop
  useEffect(() => {
    if (!isPlaying || !currentSolution) return;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const currentStepData = currentSolution.steps[currentStep];
      const stepDuration = (currentStepData?.animation?.duration || 1000) / speed;
      const stepDelay = (currentStepData?.animation?.delay || 0) / speed;

      if (elapsed >= stepDelay) {
        const animationTime = elapsed - stepDelay;
        const progress = Math.min(animationTime / stepDuration, 1);
        setAnimationProgress(progress);

        if (progress >= 1) {
          // Move to next step
          if (currentStep < currentSolution.steps.length - 1) {
            setCurrentStep(prev => prev + 1);
            setAnimationProgress(0);
            startTimeRef.current = timestamp;
          } else {
            // Animation complete
            setIsPlaying(false);
            setAnimationProgress(1);
            return;
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, currentStep, currentSolution, speed]);

  return (
    <SolutionContext.Provider value={{
      currentSolution,
      isPlaying,
      currentStep,
      speed,
      animationProgress,
      setSolution,
      play,
      pause,
      reset,
      setSpeed,
      nextStep,
      prevStep
    }}>
      {children}
    </SolutionContext.Provider>
  );
}

export function useSolution() {
  const context = useContext(SolutionContext);
  if (!context) {
    throw new Error('useSolution must be used within a SolutionProvider');
  }
  return context;
}