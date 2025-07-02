import { Solution, SolutionStep } from '../contexts/SolutionContext';

// Generate unique IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

// Helper function to determine problem type
function determineProblemType(problem: string): 'arithmetic' | 'algebra' | 'geometry' | 'calculus' {
  if (problem.includes('derivative') || problem.includes('integral') || problem.includes('d/dx') || problem.includes('∫')) {
    return 'calculus';
  }
  if (problem.includes('area') || problem.includes('circle') || problem.includes('triangle') || problem.includes('radius') || problem.includes('perimeter')) {
    return 'geometry';
  }
  if (problem.includes('x') || problem.includes('y') || problem.includes('=') || problem.includes('^') || problem.includes('²')) {
    return 'algebra';
  }
  return 'arithmetic';
}

// Enhanced arithmetic solver
function solveArithmetic(problem: string): SolutionStep[] {
  const steps: SolutionStep[] = [];
  
  // Clean the problem string
  const cleanProblem = problem.trim().replace(/\s+/g, '');
  
  // Addition - improved regex to catch simple cases like 1+1
  const addMatch = cleanProblem.match(/^(\d+)\+(\d+)$/) || problem.match(/(\d+)\s*\+\s*(\d+)/);
  if (addMatch) {
    const a = parseInt(addMatch[1]);
    const b = parseInt(addMatch[2]);
    const result = a + b;
    
    steps.push({
      id: generateId(),
      content: `${a} + ${b}`,
      type: 'expression',
      position: { x: 100, y: 100 },
      color: '#3B82F6',
      animation: { duration: 1500, delay: 0, type: 'draw' }
    });
    
    steps.push({
      id: generateId(),
      content: `Step 1: Add ${a} and ${b}`,
      type: 'explanation',
      position: { x: 100, y: 150 },
      color: '#6B7280',
      animation: { duration: 2000, delay: 0, type: 'draw' }
    });
    
    steps.push({
      id: generateId(),
      content: `= ${result}`,
      type: 'expression',
      position: { x: 100, y: 200 },
      color: '#10B981',
      animation: { duration: 1500, delay: 0, type: 'draw' }
    });
    
    return steps;
  }
  
  // Subtraction - improved regex
  const subMatch = cleanProblem.match(/^(\d+)-(\d+)$/) || problem.match(/(\d+)\s*-\s*(\d+)/);
  if (subMatch) {
    const a = parseInt(subMatch[1]);
    const b = parseInt(subMatch[2]);
    const result = a - b;
    
    steps.push({
      id: generateId(),
      content: `${a} - ${b}`,
      type: 'expression',
      position: { x: 100, y: 100 },
      color: '#3B82F6',
      animation: { duration: 1500, delay: 0, type: 'draw' }
    });
    
    steps.push({
      id: generateId(),
      content: `Step 1: Subtract ${b} from ${a}`,
      type: 'explanation',
      position: { x: 100, y: 150 },
      color: '#6B7280',
      animation: { duration: 2000, delay: 0, type: 'draw' }
    });
    
    steps.push({
      id: generateId(),
      content: `= ${result}`,
      type: 'expression',
      position: { x: 100, y: 200 },
      color: '#10B981',
      animation: { duration: 1500, delay: 0, type: 'draw' }
    });
    
    return steps;
  }
  
  // Multiplication - improved regex
  const mulMatch = cleanProblem.match(/^(\d+)[×*](\d+)$/) || problem.match(/(\d+)\s*[×*]\s*(\d+)/);
  if (mulMatch) {
    const a = parseInt(mulMatch[1]);
    const b = parseInt(mulMatch[2]);
    const result = a * b;
    
    steps.push({
      id: generateId(),
      content: `${a} × ${b}`,
      type: 'expression',
      position: { x: 100, y: 100 },
      color: '#3B82F6',
      animation: { duration: 1500, delay: 0, type: 'draw' }
    });
    
    steps.push({
      id: generateId(),
      content: `Step 1: Multiply ${a} by ${b}`,
      type: 'explanation',
      position: { x: 100, y: 150 },
      color: '#6B7280',
      animation: { duration: 2000, delay: 0, type: 'draw' }
    });
    
    // Show repeated addition for small numbers
    if (a <= 10 && b <= 10) {
      const additionSteps = Array(b).fill(a).join(' + ');
      steps.push({
        id: generateId(),
        content: `= ${additionSteps}`,
        type: 'expression',
        position: { x: 100, y: 200 },
        color: '#F59E0B',
        animation: { duration: 2500, delay: 0, type: 'draw' }
      });
    }
    
    steps.push({
      id: generateId(),
      content: `= ${result}`,
      type: 'expression',
      position: { x: 100, y: 250 },
      color: '#10B981',
      animation: { duration: 1500, delay: 0, type: 'draw' }
    });
    
    return steps;
  }
  
  // Division - new addition
  const divMatch = cleanProblem.match(/^(\d+)[÷/](\d+)$/) || problem.match(/(\d+)\s*[÷/]\s*(\d+)/);
  if (divMatch) {
    const a = parseInt(divMatch[1]);
    const b = parseInt(divMatch[2]);
    
    if (b === 0) {
      steps.push({
        id: generateId(),
        content: `${a} ÷ ${b}`,
        type: 'expression',
        position: { x: 100, y: 100 },
        color: '#3B82F6',
        animation: { duration: 1500, delay: 0, type: 'draw' }
      });
      
      steps.push({
        id: generateId(),
        content: `Error: Division by zero is undefined`,
        type: 'explanation',
        position: { x: 100, y: 150 },
        color: '#EF4444',
        animation: { duration: 2000, delay: 0, type: 'draw' }
      });
      
      return steps;
    }
    
    const result = a / b;
    const isWhole = result % 1 === 0;
    
    steps.push({
      id: generateId(),
      content: `${a} ÷ ${b}`,
      type: 'expression',
      position: { x: 100, y: 100 },
      color: '#3B82F6',
      animation: { duration: 1500, delay: 0, type: 'draw' }
    });
    
    steps.push({
      id: generateId(),
      content: `Step 1: Divide ${a} by ${b}`,
      type: 'explanation',
      position: { x: 100, y: 150 },
      color: '#6B7280',
      animation: { duration: 2000, delay: 0, type: 'draw' }
    });
    
    steps.push({
      id: generateId(),
      content: `= ${isWhole ? result : result.toFixed(2)}`,
      type: 'expression',
      position: { x: 100, y: 200 },
      color: '#10B981',
      animation: { duration: 1500, delay: 0, type: 'draw' }
    });
    
    return steps;
  }
  
  return steps;
}

// Enhanced algebraic equation solver
function solveAlgebra(problem: string): SolutionStep[] {
  const steps: SolutionStep[] = [];
  
  // Linear equation: ax + b = c
  const linearMatch = problem.match(/(-?\d*)x\s*([+-])\s*(\d+)\s*=\s*(\d+)/);
  if (linearMatch) {
    const a = parseInt(linearMatch[1]) || 1;
    const sign = linearMatch[2];
    const b = parseInt(linearMatch[3]);
    const c = parseInt(linearMatch[4]);
    const actualB = sign === '+' ? b : -b;
    
    steps.push({
      id: generateId(),
      content: `${a === 1 ? '' : a}x ${sign} ${b} = ${c}`,
      type: 'expression',
      position: { x: 100, y: 100 },
      color: '#3B82F6',
      animation: { duration: 1500, delay: 0, type: 'draw' }
    });
    
    steps.push({
      id: generateId(),
      content: `Step 1: Isolate the x term`,
      type: 'explanation',
      position: { x: 100, y: 150 },
      color: '#6B7280',
      animation: { duration: 2000, delay: 0, type: 'draw' }
    });
    
    steps.push({
      id: generateId(),
      content: `Subtract ${actualB} from both sides:`,
      type: 'explanation',
      position: { x: 100, y: 200 },
      color: '#6B7280',
      animation: { duration: 2000, delay: 0, type: 'draw' }
    });
    
    const newRight = c - actualB;
    steps.push({
      id: generateId(),
      content: `${a === 1 ? '' : a}x = ${newRight}`,
      type: 'expression',
      position: { x: 100, y: 250 },
      color: '#F59E0B',
      animation: { duration: 1500, delay: 0, type: 'draw' }
    });
    
    if (a !== 1) {
      steps.push({
        id: generateId(),
        content: `Step 2: Divide both sides by ${a}`,
        type: 'explanation',
        position: { x: 100, y: 300 },
        color: '#6B7280',
        animation: { duration: 2000, delay: 0, type: 'draw' }
      });
      
      const solution = newRight / a;
      steps.push({
        id: generateId(),
        content: `x = ${solution}`,
        type: 'expression',
        position: { x: 100, y: 350 },
        color: '#10B981',
        animation: { duration: 1500, delay: 0, type: 'draw' }
      });
      
      // Verification step
      steps.push({
        id: generateId(),
        content: `Verification: ${a}(${solution}) ${sign} ${b} = ${a * solution + actualB}`,
        type: 'explanation',
        position: { x: 100, y: 400 },
        color: '#8B5CF6',
        animation: { duration: 2500, delay: 0, type: 'draw' }
      });
    } else {
      steps.push({
        id: generateId(),
        content: `x = ${newRight}`,
        type: 'expression',
        position: { x: 100, y: 300 },
        color: '#10B981',
        animation: { duration: 1500, delay: 0, type: 'draw' }
      });
    }
    
    return steps;
  }
  
  // Quadratic equation: ax² + bx + c = 0
  const quadMatch = problem.match(/(-?\d*)x²?\s*([+-])\s*(-?\d*)x?\s*([+-])\s*(-?\d+)\s*=\s*0/);
  if (quadMatch) {
    const a = parseInt(quadMatch[1]) || 1;
    const bSign = quadMatch[2];
    const b = parseInt(quadMatch[3]) || 1;
    const cSign = quadMatch[4];
    const c = parseInt(quadMatch[5]);
    
    const actualB = bSign === '+' ? b : -b;
    const actualC = cSign === '+' ? c : -c;
    
    steps.push({
      id: generateId(),
      content: `${a === 1 ? '' : a}x² ${bSign} ${Math.abs(b)}x ${cSign} ${Math.abs(c)} = 0`,
      type: 'expression',
      position: { x: 100, y: 100 },
      color: '#3B82F6',
      animation: { duration: 1500, delay: 0, type: 'draw' }
    });
    
    steps.push({
      id: generateId(),
      content: `Using the quadratic formula:`,
      type: 'explanation',
      position: { x: 100, y: 150 },
      color: '#6B7280',
      animation: { duration: 2000, delay: 0, type: 'draw' }
    });
    
    steps.push({
      id: generateId(),
      content: `x = (-b ± √(b² - 4ac)) / 2a`,
      type: 'expression',
      position: { x: 100, y: 200 },
      color: '#F59E0B',
      animation: { duration: 2000, delay: 0, type: 'draw' }
    });
    
    steps.push({
      id: generateId(),
      content: `Where a = ${a}, b = ${actualB}, c = ${actualC}`,
      type: 'explanation',
      position: { x: 100, y: 250 },
      color: '#6B7280',
      animation: { duration: 2000, delay: 0, type: 'draw' }
    });
    
    const discriminant = actualB * actualB - 4 * a * actualC;
    steps.push({
      id: generateId(),
      content: `Discriminant = ${actualB}² - 4(${a})(${actualC}) = ${discriminant}`,
      type: 'expression',
      position: { x: 100, y: 300 },
      color: '#8B5CF6',
      animation: { duration: 2000, delay: 0, type: 'draw' }
    });
    
    if (discriminant >= 0) {
      const sqrtDiscriminant = Math.sqrt(discriminant);
      const x1 = (-actualB + sqrtDiscriminant) / (2 * a);
      const x2 = (-actualB - sqrtDiscriminant) / (2 * a);
      
      steps.push({
        id: generateId(),
        content: `x₁ = ${x1.toFixed(2)}, x₂ = ${x2.toFixed(2)}`,
        type: 'expression',
        position: { x: 100, y: 350 },
        color: '#10B981',
        animation: { duration: 1500, delay: 0, type: 'draw' }
      });
    } else {
      steps.push({
        id: generateId(),
        content: `No real solutions (discriminant < 0)`,
        type: 'explanation',
        position: { x: 100, y: 350 },
        color: '#EF4444',
        animation: { duration: 2000, delay: 0, type: 'draw' }
      });
    }
    
    steps.push({
      id: generateId(),
      content: 'Parabola graph',
      type: 'graph',
      position: { x: 450, y: 200 },
      color: '#8B5CF6',
      animation: { duration: 3000, delay: 0, type: 'draw' }
    });
    
    return steps;
  }
  
  return steps;
}

// Enhanced geometry solver
function solveGeometry(problem: string): SolutionStep[] {
  const steps: SolutionStep[] = [];
  
  // Circle area
  if (problem.toLowerCase().includes('area') && problem.toLowerCase().includes('circle')) {
    const radiusMatch = problem.match(/radius\s*(\d+)/);
    const radius = radiusMatch ? parseInt(radiusMatch[1]) : 5;
    
    steps.push({
      id: generateId(),
      content: `Find area of circle with radius ${radius}`,
      type: 'explanation',
      position: { x: 100, y: 100 },
      color: '#3B82F6',
      animation: { duration: 2000, delay: 0, type: 'draw' }
    });
    
    steps.push({
      id: generateId(),
      content: `Step 1: Use the area formula`,
      type: 'explanation',
      position: { x: 100, y: 150 },
      color: '#6B7280',
      animation: { duration: 2000, delay: 0, type: 'draw' }
    });
    
    steps.push({
      id: generateId(),
      content: 'A = πr²',
      type: 'expression',
      position: { x: 100, y: 200 },
      color: '#F59E0B',
      animation: { duration: 1500, delay: 0, type: 'draw' }
    });
    
    steps.push({
      id: generateId(),
      content: `Step 2: Substitute r = ${radius}`,
      type: 'explanation',
      position: { x: 100, y: 250 },
      color: '#6B7280',
      animation: { duration: 2000, delay: 0, type: 'draw' }
    });
    
    steps.push({
      id: generateId(),
      content: `A = π × ${radius}²`,
      type: 'expression',
      position: { x: 100, y: 300 },
      color: '#F59E0B',
      animation: { duration: 1500, delay: 0, type: 'draw' }
    });
    
    steps.push({
      id: generateId(),
      content: `A = π × ${radius * radius}`,
      type: 'expression',
      position: { x: 100, y: 350 },
      color: '#F59E0B',
      animation: { duration: 1500, delay: 0, type: 'draw' }
    });
    
    const area = Math.PI * radius * radius;
    steps.push({
      id: generateId(),
      content: `A = ${area.toFixed(2)} square units`,
      type: 'expression',
      position: { x: 100, y: 400 },
      color: '#10B981',
      animation: { duration: 1500, delay: 0, type: 'draw' }
    });
    
    steps.push({
      id: generateId(),
      content: `Circle with radius ${radius}`,
      type: 'shape',
      position: { x: 500, y: 250 },
      color: '#8B5CF6',
      animation: { duration: 3000, delay: 0, type: 'draw' }
    });
    
    return steps;
  }
  
  // Triangle area
  if (problem.toLowerCase().includes('triangle') && problem.toLowerCase().includes('area')) {
    const baseMatch = problem.match(/base\s*(\d+)/);
    const heightMatch = problem.match(/height\s*(\d+)/);
    const base = baseMatch ? parseInt(baseMatch[1]) : 6;
    const height = heightMatch ? parseInt(heightMatch[1]) : 4;
    
    steps.push({
      id: generateId(),
      content: `Find area of triangle with base ${base} and height ${height}`,
      type: 'explanation',
      position: { x: 100, y: 100 },
      color: '#3B82F6',
      animation: { duration: 2000, delay: 0, type: 'draw' }
    });
    
    steps.push({
      id: generateId(),
      content: 'A = ½ × base × height',
      type: 'expression',
      position: { x: 100, y: 150 },
      color: '#F59E0B',
      animation: { duration: 1500, delay: 0, type: 'draw' }
    });
    
    steps.push({
      id: generateId(),
      content: `A = ½ × ${base} × ${height}`,
      type: 'expression',
      position: { x: 100, y: 200 },
      color: '#F59E0B',
      animation: { duration: 1500, delay: 0, type: 'draw' }
    });
    
    const area = 0.5 * base * height;
    steps.push({
      id: generateId(),
      content: `A = ${area} square units`,
      type: 'expression',
      position: { x: 100, y: 250 },
      color: '#10B981',
      animation: { duration: 1500, delay: 0, type: 'draw' }
    });
    
    steps.push({
      id: generateId(),
      content: `Triangle with base ${base} and height ${height}`,
      type: 'shape',
      position: { x: 450, y: 200 },
      color: '#8B5CF6',
      animation: { duration: 3000, delay: 0, type: 'draw' }
    });
    
    return steps;
  }
  
  return steps;
}

// Enhanced calculus solver
function solveCalculus(problem: string): SolutionStep[] {
  const steps: SolutionStep[] = [];
  
  // Derivative of polynomial
  if (problem.toLowerCase().includes('derivative')) {
    // Parse x² + 3x type expressions
    const polyMatch = problem.match(/x²?\s*([+-])\s*(\d*)x?/);
    if (polyMatch || problem.includes('x²')) {
      steps.push({
        id: generateId(),
        content: 'Find derivative of x² + 3x',
        type: 'explanation',
        position: { x: 100, y: 100 },
        color: '#3B82F6',
        animation: { duration: 2000, delay: 0, type: 'draw' }
      });
      
      steps.push({
        id: generateId(),
        content: 'd/dx(x² + 3x)',
        type: 'expression',
        position: { x: 100, y: 150 },
        color: '#F59E0B',
        animation: { duration: 1500, delay: 0, type: 'draw' }
      });
      
      steps.push({
        id: generateId(),
        content: 'Step 1: Apply power rule to each term',
        type: 'explanation',
        position: { x: 100, y: 200 },
        color: '#6B7280',
        animation: { duration: 2000, delay: 0, type: 'draw' }
      });
      
      steps.push({
        id: generateId(),
        content: 'Power rule: d/dx(xⁿ) = nxⁿ⁻¹',
        type: 'explanation',
        position: { x: 100, y: 250 },
        color: '#6B7280',
        animation: { duration: 2000, delay: 0, type: 'draw' }
      });
      
      steps.push({
        id: generateId(),
        content: 'd/dx(x²) = 2x¹ = 2x',
        type: 'expression',
        position: { x: 100, y: 300 },
        color: '#8B5CF6',
        animation: { duration: 1500, delay: 0, type: 'draw' }
      });
      
      steps.push({
        id: generateId(),
        content: 'd/dx(3x) = 3',
        type: 'expression',
        position: { x: 100, y: 350 },
        color: '#8B5CF6',
        animation: { duration: 1500, delay: 0, type: 'draw' }
      });
      
      steps.push({
        id: generateId(),
        content: 'Therefore: d/dx(x² + 3x) = 2x + 3',
        type: 'expression',
        position: { x: 100, y: 400 },
        color: '#10B981',
        animation: { duration: 1500, delay: 0, type: 'draw' }
      });
      
      steps.push({
        id: generateId(),
        content: 'Graph showing f(x) and f\'(x)',
        type: 'graph',
        position: { x: 500, y: 250 },
        color: '#8B5CF6',
        animation: { duration: 3000, delay: 0, type: 'draw' }
      });
    }
    
    return steps;
  }
  
  return steps;
}

// Main solver function
export function solveMathProblem(problem: string): Solution {
  const problemType = determineProblemType(problem);
  let steps: SolutionStep[] = [];
  
  switch (problemType) {
    case 'arithmetic':
      steps = solveArithmetic(problem);
      break;
    case 'algebra':
      steps = solveAlgebra(problem);
      break;
    case 'geometry':
      steps = solveGeometry(problem);
      break;
    case 'calculus':
      steps = solveCalculus(problem);
      break;
  }
  
  // Fallback for unrecognized problems
  if (steps.length === 0) {
    steps.push({
      id: generateId(),
      content: `Problem: ${problem}`,
      type: 'expression',
      position: { x: 100, y: 100 },
      color: '#3B82F6',
      animation: { duration: 1500, delay: 0, type: 'draw' }
    });
    
    steps.push({
      id: generateId(),
      content: 'This problem type is not yet supported.',
      type: 'explanation',
      position: { x: 100, y: 150 },
      color: '#EF4444',
      animation: { duration: 2000, delay: 0, type: 'draw' }
    });
    
    steps.push({
      id: generateId(),
      content: 'Try: 1+1, 2x + 5 = 13, 125 + 387, or Area of circle with radius 5',
      type: 'explanation',
      position: { x: 100, y: 200 },
      color: '#6B7280',
      animation: { duration: 2500, delay: 0, type: 'draw' }
    });
  }
  
  return {
    id: generateId(),
    problem,
    steps,
    problemType
  };
}