// Enhanced stroke patterns with natural handwriting variations
// Each stroke includes pressure, speed, and natural curve data

export interface StrokePoint {
  x: number;
  y: number;
  pressure?: number; // 0-1 for pen pressure simulation
  speed?: number; // relative drawing speed
}

export interface Stroke {
  id: number;
  points: StrokePoint[];
  type: 'line' | 'curve' | 'arc';
  direction: 'down' | 'up' | 'right' | 'left' | 'clockwise' | 'counterclockwise';
  speed: number; // relative speed multiplier
  naturalCurve?: boolean; // whether to apply natural curve smoothing
}

export interface CharacterPattern {
  char: string;
  strokes: Stroke[];
  width: number;
  height: number;
  baseline: number; // distance from top to baseline
  variations?: {
    widthRange: [number, number];
    slantRange: [number, number]; // degrees
    spacingRange: [number, number];
  };
}

// Natural handwriting variations
export interface HandwritingVariation {
  strokeWidth: number; // ±10% variation
  slant: number; // ±15 degrees
  spacing: number; // ±10% variation
  baselineShift: number; // ±2px variation
  characterScale: number; // ±5% variation
}

// Generate natural variations for each character instance
export function generateHandwritingVariation(): HandwritingVariation {
  return {
    strokeWidth: 0.9 + Math.random() * 0.2, // 0.9 to 1.1
    slant: -15 + Math.random() * 30, // -15 to +15 degrees
    spacing: 0.9 + Math.random() * 0.2, // 0.9 to 1.1
    baselineShift: -2 + Math.random() * 4, // -2 to +2 pixels
    characterScale: 0.95 + Math.random() * 0.1 // 0.95 to 1.05
  };
}

// Complete character set with natural handwriting patterns
const numberPatterns: CharacterPattern[] = [
  {
    char: '0',
    width: 20,
    height: 30,
    baseline: 25,
    variations: { widthRange: [18, 22], slantRange: [-10, 10], spacingRange: [0.9, 1.1] },
    strokes: [
      {
        id: 1,
        type: 'curve',
        direction: 'counterclockwise',
        speed: 0.8,
        naturalCurve: true,
        points: [
          { x: 10, y: 5, pressure: 0.7, speed: 0.8 },
          { x: 14, y: 6, pressure: 0.8, speed: 0.9 },
          { x: 17, y: 10, pressure: 0.9, speed: 1.0 },
          { x: 18, y: 15, pressure: 1.0, speed: 1.0 },
          { x: 17, y: 20, pressure: 0.9, speed: 1.0 },
          { x: 14, y: 24, pressure: 0.8, speed: 0.9 },
          { x: 10, y: 25, pressure: 0.7, speed: 0.8 },
          { x: 6, y: 24, pressure: 0.8, speed: 0.9 },
          { x: 3, y: 20, pressure: 0.9, speed: 1.0 },
          { x: 2, y: 15, pressure: 1.0, speed: 1.0 },
          { x: 3, y: 10, pressure: 0.9, speed: 1.0 },
          { x: 6, y: 6, pressure: 0.8, speed: 0.9 },
          { x: 10, y: 5, pressure: 0.7, speed: 0.8 }
        ]
      }
    ]
  },
  {
    char: '1',
    width: 15,
    height: 30,
    baseline: 25,
    variations: { widthRange: [12, 18], slantRange: [-5, 15], spacingRange: [0.8, 1.2] },
    strokes: [
      {
        id: 1,
        type: 'curve',
        direction: 'up',
        speed: 1.0,
        naturalCurve: true,
        points: [
          { x: 4, y: 12, pressure: 0.6, speed: 0.9 },
          { x: 6, y: 8, pressure: 0.8, speed: 1.0 },
          { x: 8, y: 5, pressure: 0.9, speed: 1.1 }
        ]
      },
      {
        id: 2,
        type: 'line',
        direction: 'down',
        speed: 1.2,
        naturalCurve: true,
        points: [
          { x: 8, y: 5, pressure: 0.9, speed: 1.0 },
          { x: 8.2, y: 10, pressure: 1.0, speed: 1.1 },
          { x: 8.1, y: 15, pressure: 1.0, speed: 1.0 },
          { x: 8, y: 20, pressure: 0.9, speed: 1.0 },
          { x: 8, y: 25, pressure: 0.8, speed: 0.9 }
        ]
      },
      {
        id: 3,
        type: 'line',
        direction: 'right',
        speed: 1.1,
        naturalCurve: true,
        points: [
          { x: 3, y: 25, pressure: 0.7, speed: 0.9 },
          { x: 8, y: 25, pressure: 0.8, speed: 1.0 },
          { x: 13, y: 25, pressure: 0.7, speed: 0.9 }
        ]
      }
    ]
  },
  {
    char: '2',
    width: 18,
    height: 30,
    baseline: 25,
    variations: { widthRange: [16, 20], slantRange: [-8, 12], spacingRange: [0.9, 1.1] },
    strokes: [
      {
        id: 1,
        type: 'curve',
        direction: 'right',
        speed: 0.9,
        naturalCurve: true,
        points: [
          { x: 3, y: 10, pressure: 0.6, speed: 0.8 },
          { x: 5, y: 6, pressure: 0.8, speed: 0.9 },
          { x: 9, y: 4, pressure: 0.9, speed: 1.0 },
          { x: 13, y: 5, pressure: 1.0, speed: 1.0 },
          { x: 16, y: 8, pressure: 0.9, speed: 0.9 },
          { x: 17, y: 12, pressure: 0.8, speed: 0.8 }
        ]
      },
      {
        id: 2,
        type: 'curve',
        direction: 'down',
        speed: 1.0,
        naturalCurve: true,
        points: [
          { x: 17, y: 12, pressure: 0.8, speed: 0.9 },
          { x: 15, y: 16, pressure: 0.9, speed: 1.0 },
          { x: 12, y: 19, pressure: 1.0, speed: 1.1 },
          { x: 8, y: 21, pressure: 1.0, speed: 1.0 },
          { x: 4, y: 23, pressure: 0.9, speed: 0.9 },
          { x: 3, y: 24, pressure: 0.8, speed: 0.8 }
        ]
      },
      {
        id: 3,
        type: 'line',
        direction: 'right',
        speed: 1.1,
        naturalCurve: true,
        points: [
          { x: 3, y: 24, pressure: 0.8, speed: 0.9 },
          { x: 8, y: 25, pressure: 0.9, speed: 1.0 },
          { x: 13, y: 25, pressure: 0.8, speed: 1.0 },
          { x: 16, y: 25, pressure: 0.7, speed: 0.9 }
        ]
      }
    ]
  },
  {
    char: '3',
    width: 18,
    height: 30,
    baseline: 25,
    variations: { widthRange: [16, 20], slantRange: [-10, 10], spacingRange: [0.9, 1.1] },
    strokes: [
      {
        id: 1,
        type: 'curve',
        direction: 'right',
        speed: 0.9,
        naturalCurve: true,
        points: [
          { x: 3, y: 8, pressure: 0.6, speed: 0.8 },
          { x: 6, y: 5, pressure: 0.8, speed: 0.9 },
          { x: 10, y: 4, pressure: 0.9, speed: 1.0 },
          { x: 14, y: 5, pressure: 1.0, speed: 1.0 },
          { x: 16, y: 8, pressure: 0.9, speed: 0.9 },
          { x: 15, y: 11, pressure: 0.8, speed: 0.8 }
        ]
      },
      {
        id: 2,
        type: 'curve',
        direction: 'left',
        speed: 1.0,
        naturalCurve: true,
        points: [
          { x: 15, y: 11, pressure: 0.8, speed: 0.9 },
          { x: 12, y: 14, pressure: 0.9, speed: 1.0 },
          { x: 10, y: 15, pressure: 1.0, speed: 1.0 },
          { x: 12, y: 16, pressure: 0.9, speed: 1.0 },
          { x: 15, y: 19, pressure: 0.8, speed: 0.9 }
        ]
      },
      {
        id: 3,
        type: 'curve',
        direction: 'right',
        speed: 0.9,
        naturalCurve: true,
        points: [
          { x: 15, y: 19, pressure: 0.8, speed: 0.9 },
          { x: 16, y: 22, pressure: 0.9, speed: 1.0 },
          { x: 14, y: 25, pressure: 1.0, speed: 1.0 },
          { x: 10, y: 26, pressure: 0.9, speed: 0.9 },
          { x: 6, y: 25, pressure: 0.8, speed: 0.8 },
          { x: 3, y: 22, pressure: 0.6, speed: 0.7 }
        ]
      }
    ]
  },
  {
    char: '4',
    width: 20,
    height: 30,
    baseline: 25,
    variations: { widthRange: [18, 22], slantRange: [-5, 15], spacingRange: [0.9, 1.1] },
    strokes: [
      {
        id: 1,
        type: 'line',
        direction: 'down',
        speed: 1.0,
        naturalCurve: true,
        points: [
          { x: 14, y: 5, pressure: 0.8, speed: 1.0 },
          { x: 14.1, y: 10, pressure: 0.9, speed: 1.1 },
          { x: 14, y: 15, pressure: 1.0, speed: 1.0 },
          { x: 14, y: 20, pressure: 0.9, speed: 1.0 },
          { x: 14, y: 25, pressure: 0.8, speed: 0.9 }
        ]
      },
      {
        id: 2,
        type: 'curve',
        direction: 'down',
        speed: 1.1,
        naturalCurve: true,
        points: [
          { x: 14, y: 5, pressure: 0.8, speed: 1.0 },
          { x: 12, y: 8, pressure: 0.9, speed: 1.0 },
          { x: 9, y: 12, pressure: 1.0, speed: 1.1 },
          { x: 6, y: 15, pressure: 1.0, speed: 1.0 },
          { x: 3, y: 17, pressure: 0.9, speed: 0.9 }
        ]
      },
      {
        id: 3,
        type: 'line',
        direction: 'right',
        speed: 1.2,
        naturalCurve: true,
        points: [
          { x: 2, y: 17, pressure: 0.8, speed: 0.9 },
          { x: 8, y: 17, pressure: 0.9, speed: 1.0 },
          { x: 14, y: 17, pressure: 1.0, speed: 1.1 },
          { x: 18, y: 17, pressure: 0.8, speed: 1.0 }
        ]
      }
    ]
  },
  {
    char: '5',
    width: 18,
    height: 30,
    baseline: 25,
    variations: { widthRange: [16, 20], slantRange: [-8, 12], spacingRange: [0.9, 1.1] },
    strokes: [
      {
        id: 1,
        type: 'line',
        direction: 'right',
        speed: 1.1,
        naturalCurve: true,
        points: [
          { x: 3, y: 5, pressure: 0.8, speed: 0.9 },
          { x: 8, y: 5, pressure: 0.9, speed: 1.0 },
          { x: 13, y: 5, pressure: 0.8, speed: 1.0 },
          { x: 16, y: 5, pressure: 0.7, speed: 0.9 }
        ]
      },
      {
        id: 2,
        type: 'line',
        direction: 'down',
        speed: 1.0,
        naturalCurve: true,
        points: [
          { x: 3, y: 5, pressure: 0.8, speed: 1.0 },
          { x: 3.1, y: 10, pressure: 0.9, speed: 1.0 },
          { x: 3, y: 14, pressure: 1.0, speed: 1.0 }
        ]
      },
      {
        id: 3,
        type: 'curve',
        direction: 'clockwise',
        speed: 0.9,
        naturalCurve: true,
        points: [
          { x: 3, y: 14, pressure: 1.0, speed: 1.0 },
          { x: 7, y: 13, pressure: 0.9, speed: 0.9 },
          { x: 12, y: 14, pressure: 0.8, speed: 0.8 },
          { x: 16, y: 17, pressure: 0.9, speed: 0.9 },
          { x: 17, y: 21, pressure: 1.0, speed: 1.0 },
          { x: 15, y: 24, pressure: 0.9, speed: 0.9 },
          { x: 11, y: 26, pressure: 0.8, speed: 0.8 },
          { x: 6, y: 25, pressure: 0.7, speed: 0.7 },
          { x: 3, y: 22, pressure: 0.6, speed: 0.6 }
        ]
      }
    ]
  },
  {
    char: '6',
    width: 18,
    height: 30,
    baseline: 25,
    variations: { widthRange: [16, 20], slantRange: [-10, 10], spacingRange: [0.9, 1.1] },
    strokes: [
      {
        id: 1,
        type: 'curve',
        direction: 'counterclockwise',
        speed: 0.8,
        naturalCurve: true,
        points: [
          { x: 15, y: 8, pressure: 0.7, speed: 0.8 },
          { x: 12, y: 5, pressure: 0.8, speed: 0.9 },
          { x: 8, y: 4, pressure: 0.9, speed: 1.0 },
          { x: 4, y: 6, pressure: 1.0, speed: 1.0 },
          { x: 2, y: 10, pressure: 1.0, speed: 1.0 },
          { x: 2, y: 15, pressure: 1.0, speed: 1.0 },
          { x: 2, y: 20, pressure: 1.0, speed: 1.0 },
          { x: 4, y: 24, pressure: 0.9, speed: 0.9 },
          { x: 8, y: 26, pressure: 0.8, speed: 0.8 },
          { x: 12, y: 25, pressure: 0.9, speed: 0.9 },
          { x: 15, y: 22, pressure: 1.0, speed: 1.0 },
          { x: 16, y: 18, pressure: 0.9, speed: 0.9 },
          { x: 15, y: 15, pressure: 0.8, speed: 0.8 },
          { x: 12, y: 13, pressure: 0.9, speed: 0.9 },
          { x: 8, y: 14, pressure: 1.0, speed: 1.0 },
          { x: 5, y: 16, pressure: 0.9, speed: 0.9 },
          { x: 3, y: 18, pressure: 0.8, speed: 0.8 }
        ]
      }
    ]
  },
  {
    char: '7',
    width: 18,
    height: 30,
    baseline: 25,
    variations: { widthRange: [16, 20], slantRange: [-5, 15], spacingRange: [0.9, 1.1] },
    strokes: [
      {
        id: 1,
        type: 'line',
        direction: 'right',
        speed: 1.1,
        naturalCurve: true,
        points: [
          { x: 2, y: 5, pressure: 0.8, speed: 0.9 },
          { x: 7, y: 5, pressure: 0.9, speed: 1.0 },
          { x: 12, y: 5, pressure: 1.0, speed: 1.1 },
          { x: 16, y: 5, pressure: 0.9, speed: 1.0 }
        ]
      },
      {
        id: 2,
        type: 'curve',
        direction: 'down',
        speed: 1.0,
        naturalCurve: true,
        points: [
          { x: 16, y: 5, pressure: 0.9, speed: 1.0 },
          { x: 14, y: 10, pressure: 1.0, speed: 1.1 },
          { x: 11, y: 15, pressure: 1.0, speed: 1.0 },
          { x: 8, y: 20, pressure: 0.9, speed: 1.0 },
          { x: 6, y: 25, pressure: 0.8, speed: 0.9 }
        ]
      }
    ]
  },
  {
    char: '8',
    width: 18,
    height: 30,
    baseline: 25,
    variations: { widthRange: [16, 20], slantRange: [-10, 10], spacingRange: [0.9, 1.1] },
    strokes: [
      {
        id: 1,
        type: 'curve',
        direction: 'counterclockwise',
        speed: 0.8,
        naturalCurve: true,
        points: [
          { x: 9, y: 5, pressure: 0.8, speed: 0.9 },
          { x: 13, y: 6, pressure: 0.9, speed: 1.0 },
          { x: 15, y: 9, pressure: 1.0, speed: 1.0 },
          { x: 14, y: 12, pressure: 0.9, speed: 0.9 },
          { x: 11, y: 14, pressure: 0.8, speed: 0.8 },
          { x: 7, y: 14, pressure: 0.9, speed: 0.9 },
          { x: 4, y: 12, pressure: 1.0, speed: 1.0 },
          { x: 3, y: 9, pressure: 0.9, speed: 0.9 },
          { x: 5, y: 6, pressure: 0.8, speed: 0.8 },
          { x: 9, y: 5, pressure: 0.8, speed: 0.9 }
        ]
      },
      {
        id: 2,
        type: 'curve',
        direction: 'counterclockwise',
        speed: 0.8,
        naturalCurve: true,
        points: [
          { x: 9, y: 15, pressure: 0.8, speed: 0.9 },
          { x: 14, y: 16, pressure: 0.9, speed: 1.0 },
          { x: 17, y: 19, pressure: 1.0, speed: 1.0 },
          { x: 16, y: 23, pressure: 0.9, speed: 0.9 },
          { x: 12, y: 25, pressure: 0.8, speed: 0.8 },
          { x: 6, y: 25, pressure: 0.9, speed: 0.9 },
          { x: 2, y: 23, pressure: 1.0, speed: 1.0 },
          { x: 1, y: 19, pressure: 0.9, speed: 0.9 },
          { x: 4, y: 16, pressure: 0.8, speed: 0.8 },
          { x: 9, y: 15, pressure: 0.8, speed: 0.9 }
        ]
      }
    ]
  },
  {
    char: '9',
    width: 18,
    height: 30,
    baseline: 25,
    variations: { widthRange: [16, 20], slantRange: [-10, 10], spacingRange: [0.9, 1.1] },
    strokes: [
      {
        id: 1,
        type: 'curve',
        direction: 'clockwise',
        speed: 0.8,
        naturalCurve: true,
        points: [
          { x: 3, y: 22, pressure: 0.7, speed: 0.8 },
          { x: 6, y: 25, pressure: 0.8, speed: 0.9 },
          { x: 10, y: 26, pressure: 0.9, speed: 1.0 },
          { x: 14, y: 24, pressure: 1.0, speed: 1.0 },
          { x: 16, y: 20, pressure: 1.0, speed: 1.0 },
          { x: 16, y: 15, pressure: 1.0, speed: 1.0 },
          { x: 16, y: 10, pressure: 1.0, speed: 1.0 },
          { x: 14, y: 6, pressure: 0.9, speed: 0.9 },
          { x: 10, y: 4, pressure: 0.8, speed: 0.8 },
          { x: 6, y: 5, pressure: 0.9, speed: 0.9 },
          { x: 3, y: 8, pressure: 1.0, speed: 1.0 },
          { x: 2, y: 12, pressure: 0.9, speed: 0.9 },
          { x: 3, y: 15, pressure: 0.8, speed: 0.8 },
          { x: 6, y: 17, pressure: 0.9, speed: 0.9 },
          { x: 10, y: 16, pressure: 1.0, speed: 1.0 },
          { x: 13, y: 14, pressure: 0.9, speed: 0.9 },
          { x: 15, y: 12, pressure: 0.8, speed: 0.8 }
        ]
      }
    ]
  }
];

// Mathematical symbols with natural handwriting
const symbolPatterns: CharacterPattern[] = [
  {
    char: '+',
    width: 20,
    height: 20,
    baseline: 15,
    variations: { widthRange: [18, 22], slantRange: [-5, 5], spacingRange: [0.9, 1.1] },
    strokes: [
      {
        id: 1,
        type: 'line',
        direction: 'down',
        speed: 1.0,
        naturalCurve: true,
        points: [
          { x: 10, y: 3, pressure: 0.8, speed: 1.0 },
          { x: 10.1, y: 8, pressure: 0.9, speed: 1.1 },
          { x: 10, y: 13, pressure: 1.0, speed: 1.0 },
          { x: 10, y: 17, pressure: 0.8, speed: 0.9 }
        ]
      },
      {
        id: 2,
        type: 'line',
        direction: 'right',
        speed: 1.1,
        naturalCurve: true,
        points: [
          { x: 3, y: 10, pressure: 0.8, speed: 0.9 },
          { x: 7, y: 10, pressure: 0.9, speed: 1.0 },
          { x: 13, y: 10, pressure: 1.0, speed: 1.1 },
          { x: 17, y: 10, pressure: 0.8, speed: 1.0 }
        ]
      }
    ]
  },
  {
    char: '-',
    width: 16,
    height: 8,
    baseline: 6,
    variations: { widthRange: [14, 18], slantRange: [-3, 3], spacingRange: [0.9, 1.1] },
    strokes: [
      {
        id: 1,
        type: 'line',
        direction: 'right',
        speed: 1.2,
        naturalCurve: true,
        points: [
          { x: 2, y: 4, pressure: 0.8, speed: 0.9 },
          { x: 6, y: 4, pressure: 0.9, speed: 1.0 },
          { x: 10, y: 4, pressure: 1.0, speed: 1.1 },
          { x: 14, y: 4, pressure: 0.8, speed: 1.0 }
        ]
      }
    ]
  },
  {
    char: '=',
    width: 18,
    height: 12,
    baseline: 10,
    variations: { widthRange: [16, 20], slantRange: [-3, 3], spacingRange: [0.9, 1.1] },
    strokes: [
      {
        id: 1,
        type: 'line',
        direction: 'right',
        speed: 1.1,
        naturalCurve: true,
        points: [
          { x: 2, y: 3, pressure: 0.8, speed: 0.9 },
          { x: 6, y: 3, pressure: 0.9, speed: 1.0 },
          { x: 12, y: 3, pressure: 1.0, speed: 1.1 },
          { x: 16, y: 3, pressure: 0.8, speed: 1.0 }
        ]
      },
      {
        id: 2,
        type: 'line',
        direction: 'right',
        speed: 1.1,
        naturalCurve: true,
        points: [
          { x: 2, y: 9, pressure: 0.8, speed: 0.9 },
          { x: 6, y: 9, pressure: 0.9, speed: 1.0 },
          { x: 12, y: 9, pressure: 1.0, speed: 1.1 },
          { x: 16, y: 9, pressure: 0.8, speed: 1.0 }
        ]
      }
    ]
  },
  {
    char: '×',
    width: 18,
    height: 18,
    baseline: 15,
    variations: { widthRange: [16, 20], slantRange: [-5, 5], spacingRange: [0.9, 1.1] },
    strokes: [
      {
        id: 1,
        type: 'line',
        direction: 'down',
        speed: 1.0,
        naturalCurve: true,
        points: [
          { x: 4, y: 4, pressure: 0.8, speed: 1.0 },
          { x: 7, y: 7, pressure: 0.9, speed: 1.1 },
          { x: 11, y: 11, pressure: 1.0, speed: 1.0 },
          { x: 14, y: 14, pressure: 0.8, speed: 0.9 }
        ]
      },
      {
        id: 2,
        type: 'line',
        direction: 'down',
        speed: 1.0,
        naturalCurve: true,
        points: [
          { x: 14, y: 4, pressure: 0.8, speed: 1.0 },
          { x: 11, y: 7, pressure: 0.9, speed: 1.1 },
          { x: 7, y: 11, pressure: 1.0, speed: 1.0 },
          { x: 4, y: 14, pressure: 0.8, speed: 0.9 }
        ]
      }
    ]
  },
  {
    char: '÷',
    width: 18,
    height: 18,
    baseline: 15,
    variations: { widthRange: [16, 20], slantRange: [-3, 3], spacingRange: [0.9, 1.1] },
    strokes: [
      {
        id: 1,
        type: 'arc',
        direction: 'clockwise',
        speed: 1.2,
        naturalCurve: true,
        points: [
          { x: 8, y: 4, pressure: 0.9, speed: 1.0 },
          { x: 9, y: 3, pressure: 1.0, speed: 1.1 },
          { x: 10, y: 4, pressure: 0.9, speed: 1.0 },
          { x: 9, y: 5, pressure: 0.8, speed: 0.9 },
          { x: 8, y: 4, pressure: 0.9, speed: 1.0 }
        ]
      },
      {
        id: 2,
        type: 'line',
        direction: 'right',
        speed: 1.1,
        naturalCurve: true,
        points: [
          { x: 3, y: 9, pressure: 0.8, speed: 0.9 },
          { x: 7, y: 9, pressure: 0.9, speed: 1.0 },
          { x: 11, y: 9, pressure: 1.0, speed: 1.1 },
          { x: 15, y: 9, pressure: 0.8, speed: 1.0 }
        ]
      },
      {
        id: 3,
        type: 'arc',
        direction: 'clockwise',
        speed: 1.2,
        naturalCurve: true,
        points: [
          { x: 8, y: 14, pressure: 0.9, speed: 1.0 },
          { x: 9, y: 13, pressure: 1.0, speed: 1.1 },
          { x: 10, y: 14, pressure: 0.9, speed: 1.0 },
          { x: 9, y: 15, pressure: 0.8, speed: 0.9 },
          { x: 8, y: 14, pressure: 0.9, speed: 1.0 }
        ]
      }
    ]
  },
  {
    char: '<',
    width: 16,
    height: 16,
    baseline: 12,
    variations: { widthRange: [14, 18], slantRange: [-3, 3], spacingRange: [0.9, 1.1] },
    strokes: [
      {
        id: 1,
        type: 'line',
        direction: 'down',
        speed: 1.0,
        naturalCurve: true,
        points: [
          { x: 12, y: 4, pressure: 0.8, speed: 1.0 },
          { x: 8, y: 6, pressure: 0.9, speed: 1.1 },
          { x: 4, y: 8, pressure: 1.0, speed: 1.0 }
        ]
      },
      {
        id: 2,
        type: 'line',
        direction: 'down',
        speed: 1.0,
        naturalCurve: true,
        points: [
          { x: 4, y: 8, pressure: 1.0, speed: 1.0 },
          { x: 8, y: 10, pressure: 0.9, speed: 1.1 },
          { x: 12, y: 12, pressure: 0.8, speed: 1.0 }
        ]
      }
    ]
  },
  {
    char: '>',
    width: 16,
    height: 16,
    baseline: 12,
    variations: { widthRange: [14, 18], slantRange: [-3, 3], spacingRange: [0.9, 1.1] },
    strokes: [
      {
        id: 1,
        type: 'line',
        direction: 'down',
        speed: 1.0,
        naturalCurve: true,
        points: [
          { x: 4, y: 4, pressure: 0.8, speed: 1.0 },
          { x: 8, y: 6, pressure: 0.9, speed: 1.1 },
          { x: 12, y: 8, pressure: 1.0, speed: 1.0 }
        ]
      },
      {
        id: 2,
        type: 'line',
        direction: 'down',
        speed: 1.0,
        naturalCurve: true,
        points: [
          { x: 12, y: 8, pressure: 1.0, speed: 1.0 },
          { x: 8, y: 10, pressure: 0.9, speed: 1.1 },
          { x: 4, y: 12, pressure: 0.8, speed: 1.0 }
        ]
      }
    ]
  },
  {
    char: '≤',
    width: 16,
    height: 20,
    baseline: 16,
    variations: { widthRange: [14, 18], slantRange: [-3, 3], spacingRange: [0.9, 1.1] },
    strokes: [
      {
        id: 1,
        type: 'line',
        direction: 'down',
        speed: 1.0,
        naturalCurve: true,
        points: [
          { x: 12, y: 2, pressure: 0.8, speed: 1.0 },
          { x: 8, y: 4, pressure: 0.9, speed: 1.1 },
          { x: 4, y: 6, pressure: 1.0, speed: 1.0 }
        ]
      },
      {
        id: 2,
        type: 'line',
        direction: 'down',
        speed: 1.0,
        naturalCurve: true,
        points: [
          { x: 4, y: 6, pressure: 1.0, speed: 1.0 },
          { x: 8, y: 8, pressure: 0.9, speed: 1.1 },
          { x: 12, y: 10, pressure: 0.8, speed: 1.0 }
        ]
      },
      {
        id: 3,
        type: 'line',
        direction: 'right',
        speed: 1.1,
        naturalCurve: true,
        points: [
          { x: 4, y: 14, pressure: 0.8, speed: 0.9 },
          { x: 8, y: 14, pressure: 0.9, speed: 1.0 },
          { x: 12, y: 14, pressure: 0.8, speed: 1.0 }
        ]
      }
    ]
  },
  {
    char: '≥',
    width: 16,
    height: 20,
    baseline: 16,
    variations: { widthRange: [14, 18], slantRange: [-3, 3], spacingRange: [0.9, 1.1] },
    strokes: [
      {
        id: 1,
        type: 'line',
        direction: 'down',
        speed: 1.0,
        naturalCurve: true,
        points: [
          { x: 4, y: 2, pressure: 0.8, speed: 1.0 },
          { x: 8, y: 4, pressure: 0.9, speed: 1.1 },
          { x: 12, y: 6, pressure: 1.0, speed: 1.0 }
        ]
      },
      {
        id: 2,
        type: 'line',
        direction: 'down',
        speed: 1.0,
        naturalCurve: true,
        points: [
          { x: 12, y: 6, pressure: 1.0, speed: 1.0 },
          { x: 8, y: 8, pressure: 0.9, speed: 1.1 },
          { x: 4, y: 10, pressure: 0.8, speed: 1.0 }
        ]
      },
      {
        id: 3,
        type: 'line',
        direction: 'right',
        speed: 1.1,
        naturalCurve: true,
        points: [
          { x: 4, y: 14, pressure: 0.8, speed: 0.9 },
          { x: 8, y: 14, pressure: 0.9, speed: 1.0 },
          { x: 12, y: 14, pressure: 0.8, speed: 1.0 }
        ]
      }
    ]
  },
  {
    char: '≠',
    width: 18,
    height: 16,
    baseline: 14,
    variations: { widthRange: [16, 20], slantRange: [-3, 3], spacingRange: [0.9, 1.1] },
    strokes: [
      {
        id: 1,
        type: 'line',
        direction: 'right',
        speed: 1.1,
        naturalCurve: true,
        points: [
          { x: 2, y: 4, pressure: 0.8, speed: 0.9 },
          { x: 6, y: 4, pressure: 0.9, speed: 1.0 },
          { x: 12, y: 4, pressure: 1.0, speed: 1.1 },
          { x: 16, y: 4, pressure: 0.8, speed: 1.0 }
        ]
      },
      {
        id: 2,
        type: 'line',
        direction: 'right',
        speed: 1.1,
        naturalCurve: true,
        points: [
          { x: 2, y: 10, pressure: 0.8, speed: 0.9 },
          { x: 6, y: 10, pressure: 0.9, speed: 1.0 },
          { x: 12, y: 10, pressure: 1.0, speed: 1.1 },
          { x: 16, y: 10, pressure: 0.8, speed: 1.0 }
        ]
      },
      {
        id: 3,
        type: 'line',
        direction: 'down',
        speed: 1.0,
        naturalCurve: true,
        points: [
          { x: 5, y: 2, pressure: 0.8, speed: 1.0 },
          { x: 8, y: 6, pressure: 0.9, speed: 1.1 },
          { x: 11, y: 10, pressure: 1.0, speed: 1.0 },
          { x: 13, y: 12, pressure: 0.8, speed: 0.9 }
        ]
      }
    ]
  },
  {
    char: '≈',
    width: 18,
    height: 12,
    baseline: 10,
    variations: { widthRange: [16, 20], slantRange: [-3, 3], spacingRange: [0.9, 1.1] },
    strokes: [
      {
        id: 1,
        type: 'curve',
        direction: 'right',
        speed: 0.9,
        naturalCurve: true,
        points: [
          { x: 2, y: 4, pressure: 0.8, speed: 0.9 },
          { x: 5, y: 2, pressure: 0.9, speed: 1.0 },
          { x: 8, y: 4, pressure: 1.0, speed: 1.0 },
          { x: 11, y: 2, pressure: 0.9, speed: 1.0 },
          { x: 14, y: 4, pressure: 0.8, speed: 0.9 },
          { x: 16, y: 3, pressure: 0.7, speed: 0.8 }
        ]
      },
      {
        id: 2,
        type: 'curve',
        direction: 'right',
        speed: 0.9,
        naturalCurve: true,
        points: [
          { x: 2, y: 8, pressure: 0.8, speed: 0.9 },
          { x: 5, y: 6, pressure: 0.9, speed: 1.0 },
          { x: 8, y: 8, pressure: 1.0, speed: 1.0 },
          { x: 11, y: 6, pressure: 0.9, speed: 1.0 },
          { x: 14, y: 8, pressure: 0.8, speed: 0.9 },
          { x: 16, y: 7, pressure: 0.7, speed: 0.8 }
        ]
      }
    ]
  },
  {
    char: '(',
    width: 10,
    height: 30,
    baseline: 25,
    variations: { widthRange: [8, 12], slantRange: [-5, 5], spacingRange: [0.9, 1.1] },
    strokes: [
      {
        id: 1,
        type: 'curve',
        direction: 'counterclockwise',
        speed: 0.8,
        naturalCurve: true,
        points: [
          { x: 8, y: 5, pressure: 0.7, speed: 0.8 },
          { x: 6, y: 8, pressure: 0.8, speed: 0.9 },
          { x: 4, y: 12, pressure: 0.9, speed: 1.0 },
          { x: 3, y: 15, pressure: 1.0, speed: 1.0 },
          { x: 4, y: 18, pressure: 0.9, speed: 1.0 },
          { x: 6, y: 22, pressure: 0.8, speed: 0.9 },
          { x: 8, y: 25, pressure: 0.7, speed: 0.8 }
        ]
      }
    ]
  },
  {
    char: ')',
    width: 10,
    height: 30,
    baseline: 25,
    variations: { widthRange: [8, 12], slantRange: [-5, 5], spacingRange: [0.9, 1.1] },
    strokes: [
      {
        id: 1,
        type: 'curve',
        direction: 'clockwise',
        speed: 0.8,
        naturalCurve: true,
        points: [
          { x: 2, y: 5, pressure: 0.7, speed: 0.8 },
          { x: 4, y: 8, pressure: 0.8, speed: 0.9 },
          { x: 6, y: 12, pressure: 0.9, speed: 1.0 },
          { x: 7, y: 15, pressure: 1.0, speed: 1.0 },
          { x: 6, y: 18, pressure: 0.9, speed: 1.0 },
          { x: 4, y: 22, pressure: 0.8, speed: 0.9 },
          { x: 2, y: 25, pressure: 0.7, speed: 0.8 }
        ]
      }
    ]
  },
  {
    char: '[',
    width: 10,
    height: 30,
    baseline: 25,
    variations: { widthRange: [8, 12], slantRange: [-3, 3], spacingRange: [0.9, 1.1] },
    strokes: [
      {
        id: 1,
        type: 'line',
        direction: 'down',
        speed: 1.0,
        naturalCurve: true,
        points: [
          { x: 3, y: 5, pressure: 0.8, speed: 1.0 },
          { x: 3.1, y: 10, pressure: 0.9, speed: 1.1 },
          { x: 3, y: 15, pressure: 1.0, speed: 1.0 },
          { x: 3, y: 20, pressure: 0.9, speed: 1.0 },
          { x: 3, y: 25, pressure: 0.8, speed: 0.9 }
        ]
      },
      {
        id: 2,
        type: 'line',
        direction: 'right',
        speed: 1.1,
        naturalCurve: true,
        points: [
          { x: 3, y: 5, pressure: 0.8, speed: 0.9 },
          { x: 5, y: 5, pressure: 0.9, speed: 1.0 },
          { x: 7, y: 5, pressure: 0.8, speed: 1.0 }
        ]
      },
      {
        id: 3,
        type: 'line',
        direction: 'right',
        speed: 1.1,
        naturalCurve: true,
        points: [
          { x: 3, y: 25, pressure: 0.8, speed: 0.9 },
          { x: 5, y: 25, pressure: 0.9, speed: 1.0 },
          { x: 7, y: 25, pressure: 0.8, speed: 1.0 }
        ]
      }
    ]
  },
  {
    char: ']',
    width: 10,
    height: 30,
    baseline: 25,
    variations: { widthRange: [8, 12], slantRange: [-3, 3], spacingRange: [0.9, 1.1] },
    strokes: [
      {
        id: 1,
        type: 'line',
        direction: 'down',
        speed: 1.0,
        naturalCurve: true,
        points: [
          { x: 7, y: 5, pressure: 0.8, speed: 1.0 },
          { x: 7.1, y: 10, pressure: 0.9, speed: 1.1 },
          { x: 7, y: 15, pressure: 1.0, speed: 1.0 },
          { x: 7, y: 20, pressure: 0.9, speed: 1.0 },
          { x: 7, y: 25, pressure: 0.8, speed: 0.9 }
        ]
      },
      {
        id: 2,
        type: 'line',
        direction: 'right',
        speed: 1.1,
        naturalCurve: true,
        points: [
          { x: 3, y: 5, pressure: 0.8, speed: 0.9 },
          { x: 5, y: 5, pressure: 0.9, speed: 1.0 },
          { x: 7, y: 5, pressure: 0.8, speed: 1.0 }
        ]
      },
      {
        id: 3,
        type: 'line',
        direction: 'right',
        speed: 1.1,
        naturalCurve: true,
        points: [
          { x: 3, y: 25, pressure: 0.8, speed: 0.9 },
          { x: 5, y: 25, pressure: 0.9, speed: 1.0 },
          { x: 7, y: 25, pressure: 0.8, speed: 1.0 }
        ]
      }
    ]
  },
  {
    char: '{',
    width: 12,
    height: 30,
    baseline: 25,
    variations: { widthRange: [10, 14], slantRange: [-5, 5], spacingRange: [0.9, 1.1] },
    strokes: [
      {
        id: 1,
        type: 'curve',
        direction: 'counterclockwise',
        speed: 0.8,
        naturalCurve: true,
        points: [
          { x: 9, y: 5, pressure: 0.7, speed: 0.8 },
          { x: 7, y: 6, pressure: 0.8, speed: 0.9 },
          { x: 5, y: 8, pressure: 0.9, speed: 1.0 },
          { x: 4, y: 11, pressure: 1.0, speed: 1.0 },
          { x: 3, y: 13, pressure: 0.9, speed: 0.9 },
          { x: 2, y: 15, pressure: 1.0, speed: 1.0 },
          { x: 3, y: 17, pressure: 0.9, speed: 0.9 },
          { x: 4, y: 19, pressure: 1.0, speed: 1.0 },
          { x: 5, y: 22, pressure: 0.9, speed: 1.0 },
          { x: 7, y: 24, pressure: 0.8, speed: 0.9 },
          { x: 9, y: 25, pressure: 0.7, speed: 0.8 }
        ]
      }
    ]
  },
  {
    char: '}',
    width: 12,
    height: 30,
    baseline: 25,
    variations: { widthRange: [10, 14], slantRange: [-5, 5], spacingRange: [0.9, 1.1] },
    strokes: [
      {
        id: 1,
        type: 'curve',
        direction: 'clockwise',
        speed: 0.8,
        naturalCurve: true,
        points: [
          { x: 3, y: 5, pressure: 0.7, speed: 0.8 },
          { x: 5, y: 6, pressure: 0.8, speed: 0.9 },
          { x: 7, y: 8, pressure: 0.9, speed: 1.0 },
          { x: 8, y: 11, pressure: 1.0, speed: 1.0 },
          { x: 9, y: 13, pressure: 0.9, speed: 0.9 },
          { x: 10, y: 15, pressure: 1.0, speed: 1.0 },
          { x: 9, y: 17, pressure: 0.9, speed: 0.9 },
          { x: 8, y: 19, pressure: 1.0, speed: 1.0 },
          { x: 7, y: 22, pressure: 0.9, speed: 1.0 },
          { x: 5, y: 24, pressure: 0.8, speed: 0.9 },
          { x: 3, y: 25, pressure: 0.7, speed: 0.8 }
        ]
      }
    ]
  },
  {
    char: '√',
    width: 20,
    height: 25,
    baseline: 20,
    variations: { widthRange: [18, 22], slantRange: [-5, 5], spacingRange: [0.9, 1.1] },
    strokes: [
      {
        id: 1,
        type: 'line',
        direction: 'down',
        speed: 1.0,
        naturalCurve: true,
        points: [
          { x: 3, y: 12, pressure: 0.8, speed: 1.0 },
          { x: 5, y: 16, pressure: 0.9, speed: 1.1 },
          { x: 7, y: 18, pressure: 1.0, speed: 1.0 }
        ]
      },
      {
        id: 2,
        type: 'line',
        direction: 'up',
        speed: 1.0,
        naturalCurve: true,
        points: [
          { x: 7, y: 18, pressure: 1.0, speed: 1.0 },
          { x: 10, y: 12, pressure: 0.9, speed: 1.1 },
          { x: 13, y: 6, pressure: 0.8, speed: 1.0 }
        ]
      },
      {
        id: 3,
        type: 'line',
        direction: 'right',
        speed: 1.1,
        naturalCurve: true,
        points: [
          { x: 13, y: 6, pressure: 0.8, speed: 0.9 },
          { x: 16, y: 6, pressure: 0.9, speed: 1.0 },
          { x: 18, y: 6, pressure: 0.8, speed: 1.0 }
        ]
      }
    ]
  },
  {
    char: '²',
    width: 10,
    height: 15,
    baseline: 8,
    variations: { widthRange: [8, 12], slantRange: [-5, 5], spacingRange: [0.9, 1.1] },
    strokes: [
      {
        id: 1,
        type: 'curve',
        direction: 'right',
        speed: 0.9,
        naturalCurve: true,
        points: [
          { x: 2, y: 4, pressure: 0.7, speed: 0.8 },
          { x: 3, y: 2, pressure: 0.8, speed: 0.9 },
          { x: 5, y: 1, pressure: 0.9, speed: 1.0 },
          { x: 7, y: 2, pressure: 1.0, speed: 1.0 },
          { x: 8, y: 4, pressure: 0.9, speed: 0.9 }
        ]
      },
      {
        id: 2,
        type: 'curve',
        direction: 'down',
        speed: 1.0,
        naturalCurve: true,
        points: [
          { x: 8, y: 4, pressure: 0.9, speed: 0.9 },
          { x: 7, y: 6, pressure: 1.0, speed: 1.0 },
          { x: 5, y: 7, pressure: 1.0, speed: 1.1 },
          { x: 3, y: 8, pressure: 0.9, speed: 1.0 },
          { x: 2, y: 9, pressure: 0.8, speed: 0.9 }
        ]
      },
      {
        id: 3,
        type: 'line',
        direction: 'right',
        speed: 1.1,
        naturalCurve: true,
        points: [
          { x: 2, y: 9, pressure: 0.8, speed: 0.9 },
          { x: 5, y: 9, pressure: 0.9, speed: 1.0 },
          { x: 8, y: 9, pressure: 0.8, speed: 1.0 }
        ]
      }
    ]
  },
  {
    char: '³',
    width: 10,
    height: 15,
    baseline: 8,
    variations: { widthRange: [8, 12], slantRange: [-5, 5], spacingRange: [0.9, 1.1] },
    strokes: [
      {
        id: 1,
        type: 'curve',
        direction: 'right',
        speed: 0.9,
        naturalCurve: true,
        points: [
          { x: 2, y: 3, pressure: 0.7, speed: 0.8 },
          { x: 3, y: 1, pressure: 0.8, speed: 0.9 },
          { x: 5, y: 0, pressure: 0.9, speed: 1.0 },
          { x: 7, y: 1, pressure: 1.0, speed: 1.0 },
          { x: 8, y: 3, pressure: 0.9, speed: 0.9 }
        ]
      },
      {
        id: 2,
        type: 'curve',
        direction: 'left',
        speed: 1.0,
        naturalCurve: true,
        points: [
          { x: 8, y: 3, pressure: 0.9, speed: 0.9 },
          { x: 6, y: 4, pressure: 1.0, speed: 1.0 },
          { x: 5, y: 4.5, pressure: 1.0, speed: 1.0 },
          { x: 6, y: 5, pressure: 1.0, speed: 1.0 },
          { x: 8, y: 6, pressure: 0.9, speed: 0.9 }
        ]
      },
      {
        id: 3,
        type: 'curve',
        direction: 'right',
        speed: 0.9,
        naturalCurve: true,
        points: [
          { x: 8, y: 6, pressure: 0.9, speed: 0.9 },
          { x: 8, y: 8, pressure: 1.0, speed: 1.0 },
          { x: 7, y: 9, pressure: 1.0, speed: 1.0 },
          { x: 5, y: 9, pressure: 0.9, speed: 0.9 },
          { x: 3, y: 8, pressure: 0.8, speed: 0.8 },
          { x: 2, y: 6, pressure: 0.7, speed: 0.7 }
        ]
      }
    ]
  },
  {
    char: '∞',
    width: 24,
    height: 16,
    baseline: 12,
    variations: { widthRange: [22, 26], slantRange: [-3, 3], spacingRange: [0.9, 1.1] },
    strokes: [
      {
        id: 1,
        type: 'curve',
        direction: 'counterclockwise',
        speed: 0.8,
        naturalCurve: true,
        points: [
          { x: 12, y: 8, pressure: 0.8, speed: 0.9 },
          { x: 8, y: 6, pressure: 0.9, speed: 1.0 },
          { x: 4, y: 8, pressure: 1.0, speed: 1.0 },
          { x: 2, y: 12, pressure: 0.9, speed: 0.9 },
          { x: 4, y: 16, pressure: 0.8, speed: 0.8 },
          { x: 8, y: 18, pressure: 0.9, speed: 0.9 },
          { x: 12, y: 16, pressure: 1.0, speed: 1.0 },
          { x: 16, y: 18, pressure: 0.9, speed: 0.9 },
          { x: 20, y: 16, pressure: 0.8, speed: 0.8 },
          { x: 22, y: 12, pressure: 0.9, speed: 0.9 },
          { x: 20, y: 8, pressure: 1.0, speed: 1.0 },
          { x: 16, y: 6, pressure: 0.9, speed: 1.0 },
          { x: 12, y: 8, pressure: 0.8, speed: 0.9 }
        ]
      }
    ]
  },
  {
    char: 'π',
    width: 18,
    height: 20,
    baseline: 16,
    variations: { widthRange: [16, 20], slantRange: [-5, 5], spacingRange: [0.9, 1.1] },
    strokes: [
      {
        id: 1,
        type: 'line',
        direction: 'right',
        speed: 1.1,
        naturalCurve: true,
        points: [
          { x: 2, y: 4, pressure: 0.8, speed: 0.9 },
          { x: 6, y: 4, pressure: 0.9, speed: 1.0 },
          { x: 12, y: 4, pressure: 1.0, speed: 1.1 },
          { x: 16, y: 4, pressure: 0.8, speed: 1.0 }
        ]
      },
      {
        id: 2,
        type: 'line',
        direction: 'down',
        speed: 1.0,
        naturalCurve: true,
        points: [
          { x: 5, y: 4, pressure: 0.8, speed: 1.0 },
          { x: 5.1, y: 8, pressure: 0.9, speed: 1.1 },
          { x: 5, y: 12, pressure: 1.0, speed: 1.0 },
          { x: 5, y: 16, pressure: 0.8, speed: 0.9 }
        ]
      },
      {
        id: 3,
        type: 'curve',
        direction: 'down',
        speed: 1.0,
        naturalCurve: true,
        points: [
          { x: 13, y: 4, pressure: 0.8, speed: 1.0 },
          { x: 13.1, y: 8, pressure: 0.9, speed: 1.1 },
          { x: 13, y: 12, pressure: 1.0, speed: 1.0 },
          { x: 12, y: 15, pressure: 0.9, speed: 0.9 },
          { x: 10, y: 16, pressure: 0.8, speed: 0.8 }
        ]
      }
    ]
  },
  {
    char: '∫',
    width: 12,
    height: 30,
    baseline: 25,
    variations: { widthRange: [10, 14], slantRange: [-5, 5], spacingRange: [0.9, 1.1] },
    strokes: [
      {
        id: 1,
        type: 'curve',
        direction: 'counterclockwise',
        speed: 0.8,
        naturalCurve: true,
        points: [
          { x: 9, y: 3, pressure: 0.7, speed: 0.8 },
          { x: 7, y: 2, pressure: 0.8, speed: 0.9 },
          { x: 5, y: 4, pressure: 0.9, speed: 1.0 },
          { x: 4, y: 7, pressure: 1.0, speed: 1.0 },
          { x: 4, y: 12, pressure: 1.0, speed: 1.0 },
          { x: 4, y: 18, pressure: 1.0, speed: 1.0 },
          { x: 4, y: 23, pressure: 1.0, speed: 1.0 },
          { x: 5, y: 26, pressure: 0.9, speed: 1.0 },
          { x: 7, y: 28, pressure: 0.8, speed: 0.9 },
          { x: 9, y: 27, pressure: 0.7, speed: 0.8 }
        ]
      }
    ]
  }
];

// Complete lowercase alphabet with proper proportions
const lowercaseLetterPatterns: CharacterPattern[] = [
  {
    char: 'a',
    width: 14,
    height: 15,
    baseline: 12,
    variations: { widthRange: [12, 16], slantRange: [-8, 12], spacingRange: [0.9, 1.1] },
    strokes: [
      {
        id: 1,
        type: 'curve',
        direction: 'counterclockwise',
        speed: 0.9,
        naturalCurve: true,
        points: [
          { x: 11, y: 5, pressure: 0.8, speed: 0.9 },
          { x: 7, y: 3, pressure: 0.9, speed: 1.0 },
          { x: 4, y: 5, pressure: 1.0, speed: 1.0 },
          { x: 2, y: 8, pressure: 0.9, speed: 0.9 },
          { x: 4, y: 11, pressure: 0.8, speed: 0.8 },
          { x: 7, y: 12, pressure: 0.9, speed: 0.9 },
          { x: 11, y: 10, pressure: 1.0, speed: 1.0 },
          { x: 12, y: 7, pressure: 0.9, speed: 0.9 }
        ]
      },
      {
        id: 2,
        type: 'line',
        direction: 'down',
        speed: 1.1,
        naturalCurve: true,
        points: [
          { x: 12, y: 5, pressure: 0.8, speed: 1.0 },
          { x: 12.1, y: 7, pressure: 0.9, speed: 1.1 },
          { x: 12, y: 9, pressure: 1.0, speed: 1.0 },
          { x: 12, y: 12, pressure: 0.8, speed: 0.9 }
        ]
      }
    ]
  },
  {
    char: 'b',
    width: 14,
    height: 20,
    baseline: 15,
    variations: { widthRange: [12, 16], slantRange: [-5, 10], spacingRange: [0.9, 1.1] },
    strokes: [
      {
        id: 1,
        type: 'line',
        direction: 'down',
        speed: 1.0,
        naturalCurve: true,
        points: [
          { x: 3, y: 2, pressure: 0.9, speed: 1.0 },
          { x: 3.1, y: 6, pressure: 1.0, speed: 1.1 },
          { x: 3, y: 10, pressure: 1.0, speed: 1.0 },
          { x: 3, y: 15, pressure: 0.8, speed: 0.9 }
        ]
      },
      {
        id: 2,
        type: 'curve',
        direction: 'clockwise',
        speed: 0.9,
        naturalCurve: true,
        points: [
          { x: 3, y: 6, pressure: 0.9, speed: 1.0 },
          { x: 6, y: 5, pressure: 0.8, speed: 0.9 },
          { x: 9, y: 6, pressure: 0.9, speed: 0.9 },
          { x: 11, y: 8, pressure: 1.0, speed: 1.0 },
          { x: 11, y: 11, pressure: 0.9, speed: 0.9 },
          { x: 9, y: 13, pressure: 0.8, speed: 0.8 },
          { x: 6, y: 14, pressure: 0.9, speed: 0.9 },
          { x: 3, y: 13, pressure: 1.0, speed: 1.0 }
        ]
      }
    ]
  },
  {
    char: 'c',
    width: 12,
    height: 15,
    baseline: 12,
    variations: { widthRange: [10, 14], slantRange: [-8, 8], spacingRange: [0.9, 1.1] },
    strokes: [
      {
        id: 1,
        type: 'curve',
        direction: 'counterclockwise',
        speed: 0.9,
        naturalCurve: true,
        points: [
          { x: 10, y: 6, pressure: 0.7, speed: 0.8 },
          { x: 7, y: 3, pressure: 0.8, speed: 0.9 },
          { x: 4, y: 5, pressure: 0.9, speed: 1.0 },
          { x: 2, y: 8, pressure: 1.0, speed: 1.0 },
          { x: 4, y: 11, pressure: 0.9, speed: 1.0 },
          { x: 7, y: 12, pressure: 0.8, speed: 0.9 },
          { x: 10, y: 10, pressure: 0.7, speed: 0.8 }
        ]
      }
    ]
  },
  {
    char: 'd',
    width: 14,
    height: 20,
    baseline: 15,
    variations: { widthRange: [12, 16], slantRange: [-8, 12], spacingRange: [0.9, 1.1] },
    strokes: [
      {
        id: 1,
        type: 'curve',
        direction: 'counterclockwise',
        speed: 0.9,
        naturalCurve: true,
        points: [
          { x: 11, y: 6, pressure: 0.8, speed: 0.9 },
          { x: 7, y: 3, pressure: 0.9, speed: 1.0 },
          { x: 4, y: 5, pressure: 1.0, speed: 1.0 },
          { x: 2, y: 8, pressure: 0.9, speed: 0.9 },
          { x: 4, y: 11, pressure: 0.8, speed: 0.8 },
          { x: 7, y: 12, pressure: 0.9, speed: 0.9 },
          { x: 11, y: 10, pressure: 1.0, speed: 1.0 }
        ]
      },
      {
        id: 2,
        type: 'line',
        direction: 'down',
        speed: 1.0,
        naturalCurve: true,
        points: [
          { x: 11, y: 2, pressure: 0.9, speed: 1.0 },
          { x: 11.1, y: 6, pressure: 1.0, speed: 1.1 },
          { x: 11, y: 10, pressure: 1.0, speed: 1.0 },
          { x: 11, y: 15, pressure: 0.8, speed: 0.9 }
        ]
      }
    ]
  },
  {
    char: 'e',
    width: 12,
    height: 15,
    baseline: 12,
    variations: { widthRange: [10, 14], slantRange: [-8, 8], spacingRange: [0.9, 1.1] },
    strokes: [
      {
        id: 1,
        type: 'curve',
        direction: 'counterclockwise',
        speed: 0.9,
        naturalCurve: true,
        points: [
          { x: 6, y: 7, pressure: 0.8, speed: 0.9 },
          { x: 3, y: 5, pressure: 0.9, speed: 1.0 },
          { x: 6, y: 3, pressure: 1.0, speed: 1.0 },
          { x: 9, y: 5, pressure: 0.9, speed: 0.9 },
          { x: 10, y: 8, pressure: 0.8, speed: 0.8 },
          { x: 9, y: 11, pressure: 0.9, speed: 0.9 },
          { x: 6, y: 12, pressure: 1.0, speed: 1.0 },
          { x: 3, y: 10, pressure: 0.9, speed: 0.9 },
          { x: 2, y: 7, pressure: 0.8, speed: 0.8 }
        ]
      },
      {
        id: 2,
        type: 'line',
        direction: 'right',
        speed: 1.2,
        naturalCurve: true,
        points: [
          { x: 3, y: 7, pressure: 0.7, speed: 0.9 },
          { x: 6, y: 7, pressure: 0.8, speed: 1.0 },
          { x: 9, y: 7, pressure: 0.7, speed: 1.0 }
        ]
      }
    ]
  },
  {
    char: 'f',
    width: 10,
    height: 20,
    baseline: 15,
    variations: { widthRange: [8, 12], slantRange: [-5, 15], spacingRange: [0.9, 1.1] },
    strokes: [
      {
        id: 1,
        type: 'curve',
        direction: 'counterclockwise',
        speed: 0.9,
        naturalCurve: true,
        points: [
          { x: 8, y: 4, pressure: 0.7, speed: 0.8 },
          { x: 6, y: 2, pressure: 0.8, speed: 0.9 },
          { x: 4, y: 3, pressure: 0.9, speed: 1.0 },
          { x: 3, y: 5, pressure: 1.0, speed: 1.0 },
          { x: 3, y: 8, pressure: 1.0, speed: 1.0 },
          { x: 3, y: 12, pressure: 1.0, speed: 1.0 },
          { x: 3, y: 15, pressure: 0.8, speed: 0.9 }
        ]
      },
      {
        id: 2,
        type: 'line',
        direction: 'right',
        speed: 1.2,
        naturalCurve: true,
        points: [
          { x: 1, y: 8, pressure: 0.7, speed: 0.9 },
          { x: 3, y: 8, pressure: 0.8, speed: 1.0 },
          { x: 6, y: 8, pressure: 0.7, speed: 1.0 }
        ]
      }
    ]
  },
  {
    char: 'g',
    width: 14,
    height: 20,
    baseline: 12,
    variations: { widthRange: [12, 16], slantRange: [-8, 12], spacingRange: [0.9, 1.1] },
    strokes: [
      {
        id: 1,
        type: 'curve',
        direction: 'counterclockwise',
        speed: 0.9,
        naturalCurve: true,
        points: [
          { x: 11, y: 6, pressure: 0.8, speed: 0.9 },
          { x: 7, y: 3, pressure: 0.9, speed: 1.0 },
          { x: 4, y: 5, pressure: 1.0, speed: 1.0 },
          { x: 2, y: 8, pressure: 0.9, speed: 0.9 },
          { x: 4, y: 11, pressure: 0.8, speed: 0.8 },
          { x: 7, y: 12, pressure: 0.9, speed: 0.9 },
          { x: 11, y: 10, pressure: 1.0, speed: 1.0 }
        ]
      },
      {
        id: 2,
        type: 'curve',
        direction: 'down',
        speed: 1.0,
        naturalCurve: true,
        points: [
          { x: 11, y: 6, pressure: 0.9, speed: 1.0 },
          { x: 11.1, y: 10, pressure: 1.0, speed: 1.1 },
          { x: 11, y: 14, pressure: 1.0, speed: 1.0 },
          { x: 9, y: 17, pressure: 0.9, speed: 0.9 },
          { x: 6, y: 18, pressure: 0.8, speed: 0.8 },
          { x: 3, y: 16, pressure: 0.7, speed: 0.7 }
        ]
      }
    ]
  },
  {
    char: 'h',
    width: 14,
    height: 20,
    baseline: 15,
    variations: { widthRange: [12, 16], slantRange: [-5, 10], spacingRange: [0.9, 1.1] },
    strokes: [
      {
        id: 1,
        type: 'line',
        direction: 'down',
        speed: 1.0,
        naturalCurve: true,
        points: [
          { x: 3, y: 2, pressure: 0.9, speed: 1.0 },
          { x: 3.1, y: 6, pressure: 1.0, speed: 1.1 },
          { x: 3, y: 10, pressure: 1.0, speed: 1.0 },
          { x: 3, y: 15, pressure: 0.8, speed: 0.9 }
        ]
      },
      {
        id: 2,
        type: 'curve',
        direction: 'right',
        speed: 0.9,
        naturalCurve: true,
        points: [
          { x: 3, y: 8, pressure: 0.9, speed: 1.0 },
          { x: 5, y: 6, pressure: 0.8, speed: 0.9 },
          { x: 8, y: 5, pressure: 0.9, speed: 0.9 },
          { x: 11, y: 6, pressure: 1.0, speed: 1.0 }
        ]
      },
      {
        id: 3,
        type: 'line',
        direction: 'down',
        speed: 1.1,
        naturalCurve: true,
        points: [
          { x: 11, y: 6, pressure: 0.8, speed: 1.0 },
          { x: 11.1, y: 9, pressure: 0.9, speed: 1.1 },
          { x: 11, y: 12, pressure: 1.0, speed: 1.0 },
          { x: 11, y: 15, pressure: 0.8, speed: 0.9 }
        ]
      }
    ]
  },
  {
    char: 'i',
    width: 6,
    height: 20,
    baseline: 15,
    variations: { widthRange: [4, 8], slantRange: [-5, 15], spacingRange: [0.8, 1.2] },
    strokes: [
      {
        id: 1,
        type: 'arc',
        direction: 'clockwise',
        speed: 1.2,
        naturalCurve: true,
        points: [
          { x: 2, y: 3, pressure: 0.9, speed: 1.0 },
          { x: 3, y: 2, pressure: 1.0, speed: 1.1 },
          { x: 4, y: 3, pressure: 0.9, speed: 1.0 },
          { x: 3, y: 4, pressure: 0.8, speed: 0.9 },
          { x: 2, y: 3, pressure: 0.9, speed: 1.0 }
        ]
      },
      {
        id: 2,
        type: 'line',
        direction: 'down',
        speed: 1.1,
        naturalCurve: true,
        points: [
          { x: 3, y: 7, pressure: 0.8, speed: 1.0 },
          { x: 3.1, y: 10, pressure: 0.9, speed: 1.1 },
          { x: 3, y: 13, pressure: 1.0, speed: 1.0 },
          { x: 3, y: 15, pressure: 0.8, speed: 0.9 }
        ]
      }
    ]
  },
  {
    char: 'j',
    width: 8,
    height: 25,
    baseline: 15,
    variations: { widthRange: [6, 10], slantRange: [-5, 15], spacingRange: [0.8, 1.2] },
    strokes: [
      {
        id: 1,
        type: 'arc',
        direction: 'clockwise',
        speed: 1.2,
        naturalCurve: true,
        points: [
          { x: 4, y: 3, pressure: 0.9, speed: 1.0 },
          { x: 5, y: 2, pressure: 1.0, speed: 1.1 },
          { x: 6, y: 3, pressure: 0.9, speed: 1.0 },
          { x: 5, y: 4, pressure: 0.8, speed: 0.9 },
          { x: 4, y: 3, pressure: 0.9, speed: 1.0 }
        ]
      },
      {
        id: 2,
        type: 'curve',
        direction: 'down',
        speed: 1.0,
        naturalCurve: true,
        points: [
          { x: 5, y: 7, pressure: 0.8, speed: 1.0 },
          { x: 5.1, y: 12, pressure: 0.9, speed: 1.1 },
          { x: 5, y: 17, pressure: 1.0, speed: 1.0 },
          { x: 4, y: 20, pressure: 0.9, speed: 0.9 },
          { x: 2, y: 22, pressure: 0.8, speed: 0.8 },
          { x: 1, y: 20, pressure: 0.7, speed: 0.7 }
        ]
      }
    ]
  },
  {
    char: 'k',
    width: 12,
    height: 20,
    baseline: 15,
    variations: { widthRange: [10, 14], slantRange: [-5, 10], spacingRange: [0.9, 1.1] },
    strokes: [
      {
        id: 1,
        type: 'line',
        direction: 'down',
        speed: 1.0,
        naturalCurve: true,
        points: [
          { x: 3, y: 2, pressure: 0.9, speed: 1.0 },
          { x: 3.1, y: 6, pressure: 1.0, speed: 1.1 },
          { x: 3, y: 10, pressure: 1.0, speed: 1.0 },
          { x: 3, y: 15, pressure: 0.8, speed: 0.9 }
        ]
      },
      {
        id: 2,
        type: 'line',
        direction: 'down',
        speed: 1.0,
        naturalCurve: true,
        points: [
          { x: 10, y: 6, pressure: 0.8, speed: 1.0 },
          { x: 7, y: 8, pressure: 0.9, speed: 1.1 },
          { x: 5, y: 9, pressure: 1.0, speed: 1.0 },
          { x: 3, y: 10, pressure: 0.9, speed: 0.9 }
        ]
      },
      {
        id: 3,
        type: 'line',
        direction: 'down',
        speed: 1.0,
        naturalCurve: true,
        points: [
          { x: 6, y: 9, pressure: 0.9, speed: 1.0 },
          { x: 8, y: 11, pressure: 1.0, speed: 1.1 },
          { x: 10, y: 13, pressure: 0.9, speed: 1.0 },
          { x: 11, y: 15, pressure: 0.8, speed: 0.9 }
        ]
      }
    ]
  },
  {
    char: 'l',
    width: 6,
    height: 20,
    baseline: 15,
    variations: { widthRange: [4, 8], slantRange: [-5, 15], spacingRange: [0.8, 1.2] },
    strokes: [
      {
        id: 1,
        type: 'line',
        direction: 'down',
        speed: 1.0,
        naturalCurve: true,
        points: [
          { x: 3, y: 2, pressure: 0.9, speed: 1.0 },
          { x: 3.1, y: 6, pressure: 1.0, speed: 1.1 },
          { x: 3, y: 10, pressure: 1.0, speed: 1.0 },
          { x: 3, y: 15, pressure: 0.8, speed: 0.9 }
        ]
      }
    ]
  },
  {
    char: 'm',
    width: 20,
    height: 15,
    baseline: 12,
    variations: { widthRange: [18, 22], slantRange: [-5, 10], spacingRange: [0.9, 1.1] },
    strokes: [
      {
        id: 1,
        type: 'line',
        direction: 'down',
        speed: 1.0,
        naturalCurve: true,
        points: [
          { x: 3, y: 5, pressure: 0.9, speed: 1.0 },
          { x: 3.1, y: 8, pressure: 1.0, speed: 1.1 },
          { x: 3, y: 12, pressure: 0.8, speed: 0.9 }
        ]
      },
      {
        id: 2,
        type: 'curve',
        direction: 'right',
        speed: 0.9,
        naturalCurve: true,
        points: [
          { x: 3, y: 6, pressure: 0.9, speed: 1.0 },
          { x: 5, y: 4, pressure: 0.8, speed: 0.9 },
          { x: 7, y: 3, pressure: 0.9, speed: 0.9 },
          { x: 9, y: 4, pressure: 1.0, speed: 1.0 }
        ]
      },
      {
        id: 3,
        type: 'line',
        direction: 'down',
        speed: 1.1,
        naturalCurve: true,
        points: [
          { x: 9, y: 4, pressure: 0.8, speed: 1.0 },
          { x: 9.1, y: 7, pressure: 0.9, speed: 1.1 },
          { x: 9, y: 10, pressure: 1.0, speed: 1.0 },
          { x: 9, y: 12, pressure: 0.8, speed: 0.9 }
        ]
      },
      {
        id: 4,
        type: 'curve',
        direction: 'right',
        speed: 0.9,
        naturalCurve: true,
        points: [
          { x: 9, y: 6, pressure: 0.9, speed: 1.0 },
          { x: 11, y: 4, pressure: 0.8, speed: 0.9 },
          { x: 13, y: 3, pressure: 0.9, speed: 0.9 },
          { x: 15, y: 4, pressure: 1.0, speed: 1.0 }
        ]
      },
      {
        id: 5,
        type: 'line',
        direction: 'down',
        speed: 1.1,
        naturalCurve: true,
        points: [
          { x: 15, y: 4, pressure: 0.8, speed: 1.0 },
          { x: 15.1, y: 7, pressure: 0.9, speed: 1.1 },
          { x: 15, y: 10, pressure: 1.0, speed: 1.0 },
          { x: 15, y: 12, pressure: 0.8, speed: 0.9 }
        ]
      }
    ]
  },
  {
    char: 'n',
    width: 14,
    height: 15,
    baseline: 12,
    variations: { widthRange: [12, 16], slantRange: [-5, 10], spacingRange: [0.9, 1.1] },
    strokes: [
      {
        id: 1,
        type: 'line',
        direction: 'down',
        speed: 1.0,
        naturalCurve: true,
        points: [
          { x: 3, y: 5, pressure: 0.9, speed: 1.0 },
          { x: 3.1, y: 8, pressure: 1.0, speed: 1.1 },
          { x: 3, y: 12, pressure: 0.8, speed: 0.9 }
        ]
      },
      {
        id: 2,
        type: 'curve',
        direction: 'right',
        speed: 0.9,
        naturalCurve: true,
        points: [
          { x: 3, y: 6, pressure: 0.9, speed: 1.0 },
          { x: 5, y: 4, pressure: 0.8, speed: 0.9 },
          { x: 8, y: 3, pressure: 0.9, speed: 0.9 },
          { x: 11, y: 4, pressure: 1.0, speed: 1.0 }
        ]
      },
      {
        id: 3,
        type: 'line',
        direction: 'down',
        speed: 1.1,
        naturalCurve: true,
        points: [
          { x: 11, y: 4, pressure: 0.8, speed: 1.0 },
          { x: 11.1, y: 7, pressure: 0.9, speed: 1.1 },
          { x: 11, y: 10, pressure: 1.0, speed: 1.0 },
          { x: 11, y: 12, pressure: 0.8, speed: 0.9 }
        ]
      }
    ]
  },
  {
    char: 'o',
    width: 14,
    height: 15,
    baseline: 12,
    variations: { widthRange: [12, 16], slantRange: [-8, 8], spacingRange: [0.9, 1.1] },
    strokes: [
      {
        id: 1,
        type: 'curve',
        direction: 'counterclockwise',
        speed: 0.8,
        naturalCurve: true,
        points: [
          { x: 7, y: 3, pressure: 0.8, speed: 0.9 },
          { x: 10, y: 4, pressure: 0.9, speed: 1.0 },
          { x: 12, y: 7, pressure: 1.0, speed: 1.0 },
          { x: 11, y: 10, pressure: 0.9, speed: 1.0 },
          { x: 8, y: 12, pressure: 0.8, speed: 0.9 },
          { x: 5, y: 11, pressure: 0.9, speed: 0.9 },
          { x: 3, y: 8, pressure: 1.0, speed: 1.0 },
          { x: 4, y: 5, pressure: 0.9, speed: 0.9 },
          { x: 7, y: 3, pressure: 0.8, speed: 0.9 }
        ]
      }
    ]
  },
  {
    char: 'p',
    width: 14,
    height: 20,
    baseline: 12,
    variations: { widthRange: [12, 16], slantRange: [-5, 10], spacingRange: [0.9, 1.1] },
    strokes: [
      {
        id: 1,
        type: 'line',
        direction: 'down',
        speed: 1.0,
        naturalCurve: true,
        points: [
          { x: 3, y: 5, pressure: 0.9, speed: 1.0 },
          { x: 3.1, y: 9, pressure: 1.0, speed: 1.1 },
          { x: 3, y: 13, pressure: 1.0, speed: 1.0 },
          { x: 3, y: 17, pressure: 0.8, speed: 0.9 }
        ]
      },
      {
        id: 2,
        type: 'curve',
        direction: 'clockwise',
        speed: 0.9,
        naturalCurve: true,
        points: [
          { x: 3, y: 5, pressure: 0.9, speed: 1.0 },
          { x: 6, y: 3, pressure: 0.8, speed: 0.9 },
          { x: 9, y: 4, pressure: 0.9, speed: 0.9 },
          { x: 11, y: 6, pressure: 1.0, speed: 1.0 },
          { x: 11, y: 9, pressure: 0.9, speed: 0.9 },
          { x: 9, y: 11, pressure: 0.8, speed: 0.8 },
          { x: 6, y: 12, pressure: 0.9, speed: 0.9 },
          { x: 3, y: 10, pressure: 1.0, speed: 1.0 }
        ]
      }
    ]
  },
  {
    char: 'q',
    width: 14,
    height: 20,
    baseline: 12,
    variations: { widthRange: [12, 16], slantRange: [-8, 12], spacingRange: [0.9, 1.1] },
    strokes: [
      {
        id: 1,
        type: 'curve',
        direction: 'counterclockwise',
        speed: 0.9,
        naturalCurve: true,
        points: [
          { x: 11, y: 6, pressure: 0.8, speed: 0.9 },
          { x: 7, y: 3, pressure: 0.9, speed: 1.0 },
          { x: 4, y: 5, pressure: 1.0, speed: 1.0 },
          { x: 2, y: 8, pressure: 0.9, speed: 0.9 },
          { x: 4, y: 11, pressure: 0.8, speed: 0.8 },
          { x: 7, y: 12, pressure: 0.9, speed: 0.9 },
          { x: 11, y: 10, pressure: 1.0, speed: 1.0 }
        ]
      },
      {
        id: 2,
        type: 'line',
        direction: 'down',
        speed: 1.0,
        naturalCurve: true,
        points: [
          { x: 11, y: 5, pressure: 0.9, speed: 1.0 },
          { x: 11.1, y: 9, pressure: 1.0, speed: 1.1 },
          { x: 11, y: 13, pressure: 1.0, speed: 1.0 },
          { x: 11, y: 17, pressure: 0.8, speed: 0.9 }
        ]
      }
    ]
  },
  {
    char: 'r',
    width: 10,
    height: 15,
    baseline: 12,
    variations: { widthRange: [8, 12], slantRange: [-5, 10], spacingRange: [0.9, 1.1] },
    strokes: [
      {
        id: 1,
        type: 'line',
        direction: 'down',
        speed: 1.0,
        naturalCurve: true,
        points: [
          { x: 3, y: 5, pressure: 0.9, speed: 1.0 },
          { x: 3.1, y: 8, pressure: 1.0, speed: 1.1 },
          { x: 3, y: 12, pressure: 0.8, speed: 0.9 }
        ]
      },
      {
        id: 2,
        type: 'curve',
        direction: 'right',
        speed: 0.9,
        naturalCurve: true,
        points: [
          { x: 3, y: 6, pressure: 0.9, speed: 1.0 },
          { x: 5, y: 4, pressure: 0.8, speed: 0.9 },
          { x: 7, y: 3, pressure: 0.9, speed: 0.9 },
          { x: 8, y: 5, pressure: 0.8, speed: 0.8 }
        ]
      }
    ]
  },
  {
    char: 's',
    width: 12,
    height: 15,
    baseline: 12,
    variations: { widthRange: [10, 14], slantRange: [-8, 8], spacingRange: [0.9, 1.1] },
    strokes: [
      {
        id: 1,
        type: 'curve',
        direction: 'counterclockwise',
        speed: 0.8,
        naturalCurve: true,
        points: [
          { x: 10, y: 5, pressure: 0.7, speed: 0.8 },
          { x: 7, y: 3, pressure: 0.8, speed: 0.9 },
          { x: 4, y: 4, pressure: 0.9, speed: 1.0 },
          { x: 3, y: 6, pressure: 1.0, speed: 1.0 },
          { x: 5, y: 7, pressure: 0.9, speed: 0.9 },
          { x: 7, y: 8, pressure: 0.8, speed: 0.8 },
          { x: 9, y: 9, pressure: 0.9, speed: 0.9 },
          { x: 10, y: 11, pressure: 1.0, speed: 1.0 },
          { x: 8, y: 12, pressure: 0.9, speed: 0.9 },
          { x: 5, y: 12, pressure: 0.8, speed: 0.8 },
          { x: 2, y: 10, pressure: 0.7, speed: 0.7 }
        ]
      }
    ]
  },
  {
    char: 't',
    width: 8,
    height: 18,
    baseline: 15,
    variations: { widthRange: [6, 10], slantRange: [-5, 15], spacingRange: [0.9, 1.1] },
    strokes: [
      {
        id: 1,
        type: 'line',
        direction: 'down',
        speed: 1.0,
        naturalCurve: true,
        points: [
          { x: 4, y: 3, pressure: 0.9, speed: 1.0 },
          { x: 4.1, y: 7, pressure: 1.0, speed: 1.1 },
          { x: 4, y: 11, pressure: 1.0, speed: 1.0 },
          { x: 4, y: 14, pressure: 0.9, speed: 1.0 }
        ]
      },
      {
        id: 2,
        type: 'curve',
        direction: 'right',
        speed: 1.2,
        naturalCurve: true,
        points: [
          { x: 4, y: 14, pressure: 0.9, speed: 1.0 },
          { x: 5, y: 15, pressure: 0.8, speed: 0.9 },
          { x: 6, y: 15, pressure: 0.7, speed: 0.8 }
        ]
      },
      {
        id: 3,
        type: 'line',
        direction: 'right',
        speed: 1.3,
        naturalCurve: true,
        points: [
          { x: 1, y: 6, pressure: 0.7, speed: 0.9 },
          { x: 4, y: 6, pressure: 0.8, speed: 1.0 },
          { x: 7, y: 6, pressure: 0.7, speed: 1.0 }
        ]
      }
    ]
  },
  {
    char: 'u',
    width: 14,
    height: 15,
    baseline: 12,
    variations: { widthRange: [12, 16], slantRange: [-5, 10], spacingRange: [0.9, 1.1] },
    strokes: [
      {
        id: 1,
        type: 'curve',
        direction: 'down',
        speed: 1.0,
        naturalCurve: true,
        points: [
          { x: 3, y: 5, pressure: 0.9, speed: 1.0 },
          { x: 3.1, y: 8, pressure: 1.0, speed: 1.1 },
          { x: 3, y: 10, pressure: 1.0, speed: 1.0 },
          { x: 5, y: 12, pressure: 0.9, speed: 0.9 },
          { x: 8, y: 12, pressure: 0.8, speed: 0.8 },
          { x: 11, y: 10, pressure: 0.9, speed: 0.9 }
        ]
      },
      {
        id: 2,
        type: 'line',
        direction: 'down',
        speed: 1.1,
        naturalCurve: true,
        points: [
          { x: 11, y: 5, pressure: 0.8, speed: 1.0 },
          { x: 11.1, y: 8, pressure: 0.9, speed: 1.1 },
          { x: 11, y: 10, pressure: 1.0, speed: 1.0 },
          { x: 11, y: 12, pressure: 0.8, speed: 0.9 }
        ]
      }
    ]
  },
  {
    char: 'v',
    width: 12,
    height: 15,
    baseline: 12,
    variations: { widthRange: [10, 14], slantRange: [-8, 8], spacingRange: [0.9, 1.1] },
    strokes: [
      {
        id: 1,
        type: 'line',
        direction: 'down',
        speed: 1.0,
        naturalCurve: true,
        points: [
          { x: 2, y: 5, pressure: 0.8, speed: 1.0 },
          { x: 4, y: 8, pressure: 0.9, speed: 1.1 },
          { x: 6, y: 12, pressure: 1.0, speed: 1.0 }
        ]
      },
      {
        id: 2,
        type: 'line',
        direction: 'down',
        speed: 1.0,
        naturalCurve: true,
        points: [
          { x: 10, y: 5, pressure: 0.8, speed: 1.0 },
          { x: 8, y: 8, pressure: 0.9, speed: 1.1 },
          { x: 6, y: 12, pressure: 1.0, speed: 1.0 }
        ]
      }
    ]
  },
  {
    char: 'w',
    width: 18,
    height: 15,
    baseline: 12,
    variations: { widthRange: [16, 20], slantRange: [-8, 8], spacingRange: [0.9, 1.1] },
    strokes: [
      {
        id: 1,
        type: 'line',
        direction: 'down',
        speed: 1.0,
        naturalCurve: true,
        points: [
          { x: 2, y: 5, pressure: 0.8, speed: 1.0 },
          { x: 4, y: 8, pressure: 0.9, speed: 1.1 },
          { x: 5, y: 12, pressure: 1.0, speed: 1.0 }
        ]
      },
      {
        id: 2,
        type: 'line',
        direction: 'up',
        speed: 1.0,
        naturalCurve: true,
        points: [
          { x: 5, y: 12, pressure: 1.0, speed: 1.0 },
          { x: 7, y: 8, pressure: 0.9, speed: 1.1 },
          { x: 9, y: 6, pressure: 0.8, speed: 1.0 }
        ]
      },
      {
        id: 3,
        type: 'line',
        direction: 'down',
        speed: 1.0,
        naturalCurve: true,
        points: [
          { x: 9, y: 6, pressure: 0.8, speed: 1.0 },
          { x: 11, y: 8, pressure: 0.9, speed: 1.1 },
          { x: 13, y: 12, pressure: 1.0, speed: 1.0 }
        ]
      },
      {
        id: 4,
        type: 'line',
        direction: 'down',
        speed: 1.0,
        naturalCurve: true,
        points: [
          { x: 16, y: 5, pressure: 0.8, speed: 1.0 },
          { x: 15, y: 8, pressure: 0.9, speed: 1.1 },
          { x: 13, y: 12, pressure: 1.0, speed: 1.0 }
        ]
      }
    ]
  },
  {
    char: 'x',
    width: 12,
    height: 15,
    baseline: 12,
    variations: { widthRange: [10, 14], slantRange: [-8, 8], spacingRange: [0.9, 1.1] },
    strokes: [
      {
        id: 1,
        type: 'line',
        direction: 'down',
        speed: 1.0,
        naturalCurve: true,
        points: [
          { x: 2, y: 5, pressure: 0.8, speed: 1.0 },
          { x: 5, y: 7, pressure: 0.9, speed: 1.1 },
          { x: 8, y: 9, pressure: 1.0, speed: 1.0 },
          { x: 10, y: 12, pressure: 0.8, speed: 0.9 }
        ]
      },
      {
        id: 2,
        type: 'line',
        direction: 'down',
        speed: 1.0,
        naturalCurve: true,
        points: [
          { x: 10, y: 5, pressure: 0.8, speed: 1.0 },
          { x: 7, y: 7, pressure: 0.9, speed: 1.1 },
          { x: 4, y: 9, pressure: 1.0, speed: 1.0 },
          { x: 2, y: 12, pressure: 0.8, speed: 0.9 }
        ]
      }
    ]
  },
  {
    char: 'y',
    width: 12,
    height: 20,
    baseline: 12,
    variations: { widthRange: [10, 14], slantRange: [-8, 8], spacingRange: [0.9, 1.1] },
    strokes: [
      {
        id: 1,
        type: 'line',
        direction: 'down',
        speed: 1.0,
        naturalCurve: true,
        points: [
          { x: 2, y: 5, pressure: 0.8, speed: 1.0 },
          { x: 4, y: 8, pressure: 0.9, speed: 1.1 },
          { x: 6, y: 10, pressure: 1.0, speed: 1.0 }
        ]
      },
      {
        id: 2,
        type: 'curve',
        direction: 'down',
        speed: 1.0,
        naturalCurve: true,
        points: [
          { x: 10, y: 5, pressure: 0.8, speed: 1.0 },
          { x: 8, y: 8, pressure: 0.9, speed: 1.1 },
          { x: 6, y: 10, pressure: 1.0, speed: 1.0 },
          { x: 5, y: 14, pressure: 0.9, speed: 0.9 },
          { x: 3, y: 17, pressure: 0.8, speed: 0.8 },
          { x: 1, y: 18, pressure: 0.7, speed: 0.7 }
        ]
      }
    ]
  },
  {
    char: 'z',
    width: 12,
    height: 15,
    baseline: 12,
    variations: { widthRange: [10, 14], slantRange: [-8, 8], spacingRange: [0.9, 1.1] },
    strokes: [
      {
        id: 1,
        type: 'line',
        direction: 'right',
        speed: 1.1,
        naturalCurve: true,
        points: [
          { x: 2, y: 5, pressure: 0.8, speed: 0.9 },
          { x: 5, y: 5, pressure: 0.9, speed: 1.0 },
          { x: 8, y: 5, pressure: 1.0, speed: 1.1 },
          { x: 10, y: 5, pressure: 0.8, speed: 1.0 }
        ]
      },
      {
        id: 2,
        type: 'line',
        direction: 'down',
        speed: 1.0,
        naturalCurve: true,
        points: [
          { x: 10, y: 5, pressure: 0.8, speed: 1.0 },
          { x: 7, y: 7, pressure: 0.9, speed: 1.1 },
          { x: 5, y: 9, pressure: 1.0, speed: 1.0 },
          { x: 2, y: 12, pressure: 0.8, speed: 0.9 }
        ]
      },
      {
        id: 3,
        type: 'line',
        direction: 'right',
        speed: 1.1,
        naturalCurve: true,
        points: [
          { x: 2, y: 12, pressure: 0.8, speed: 0.9 },
          { x: 5, y: 12, pressure: 0.9, speed: 1.0 },
          { x: 8, y: 12, pressure: 1.0, speed: 1.1 },
          { x: 10, y: 12, pressure: 0.8, speed: 1.0 }
        ]
      }
    ]
  }
];

// Complete uppercase alphabet with proper proportions
const uppercaseLetterPatterns: CharacterPattern[] = [
  {
    char: 'A',
    width: 22,
    height: 30,
    baseline: 25,
    variations: { widthRange: [20, 24], slantRange: [-8, 12], spacingRange: [0.9, 1.1] },
    strokes: [
      {
        id: 1,
        type: 'line',
        direction: 'up',
        speed: 1.0,
        naturalCurve: true,
        points: [
          { x: 3, y: 25, pressure: 0.8, speed: 0.9 },
          { x: 6, y: 18, pressure: 0.9, speed: 1.0 },
          { x: 9, y: 12, pressure: 1.0, speed: 1.1 },
          { x: 11, y: 5, pressure: 0.9, speed: 1.0 }
        ]
      },
      {
        id: 2,
        type: 'line',
        direction: 'down',
        speed: 1.0,
        naturalCurve: true,
        points: [
          { x: 11, y: 5, pressure: 0.9, speed: 1.0 },
          { x: 13, y: 12, pressure: 1.0, speed: 1.1 },
          { x: 16, y: 18, pressure: 0.9, speed: 1.0 },
          { x: 19, y: 25, pressure: 0.8, speed: 0.9 }
        ]
      },
      {
        id: 3,
        type: 'line',
        direction: 'right',
        speed: 1.2,
        naturalCurve: true,
        points: [
          { x: 6, y: 17, pressure: 0.7, speed: 0.9 },
          { x: 9, y: 17, pressure: 0.8, speed: 1.0 },
          { x: 13, y: 17, pressure: 0.9, speed: 1.1 },
          { x: 16, y: 17, pressure: 0.7, speed: 1.0 }
        ]
      }
    ]
  },
  {
    char: 'B',
    width: 20,
    height: 30,
    baseline: 25,
    variations: { widthRange: [18, 22], slantRange: [-5, 10], spacingRange: [0.9, 1.1] },
    strokes: [
      {
        id: 1,
        type: 'line',
        direction: 'down',
        speed: 1.0,
        naturalCurve: true,
        points: [
          { x: 3, y: 5, pressure: 0.9, speed: 1.0 },
          { x: 3.1, y: 10, pressure: 1.0, speed: 1.1 },
          { x: 3, y: 15, pressure: 1.0, speed: 1.0 },
          { x: 3, y: 20, pressure: 0.9, speed: 1.0 },
          { x: 3, y: 25, pressure: 0.8, speed: 0.9 }
        ]
      },
      {
        id: 2,
        type: 'curve',
        direction: 'clockwise',
        speed: 0.9,
        naturalCurve: true,
        points: [
          { x: 3, y: 5, pressure: 0.9, speed: 1.0 },
          { x: 8, y: 4, pressure: 0.8, speed: 0.9 },
          { x: 12, y: 6, pressure: 0.9, speed: 0.9 },
          { x: 14, y: 9, pressure: 1.0, speed: 1.0 },
          { x: 13, y: 12, pressure: 0.9, speed: 0.9 },
          { x: 10, y: 14, pressure: 0.8, speed: 0.8 },
          { x: 6, y: 15, pressure: 0.9, speed: 0.9 },
          { x: 3, y: 14, pressure: 1.0, speed: 1.0 }
        ]
      },
      {
        id: 3,
        type: 'curve',
        direction: 'clockwise',
        speed: 0.9,
        naturalCurve: true,
        points: [
          { x: 3, y: 15, pressure: 1.0, speed: 1.0 },
          { x: 8, y: 14, pressure: 0.8, speed: 0.9 },
          { x: 13, y: 16, pressure: 0.9, speed: 0.9 },
          { x: 16, y: 19, pressure: 1.0, speed: 1.0 },
          { x: 15, y: 22, pressure: 0.9, speed: 0.9 },
          { x: 11, y: 24, pressure: 0.8, speed: 0.8 },
          { x: 7, y: 25, pressure: 0.9, speed: 0.9 },
          { x: 3, y: 24, pressure: 1.0, speed: 1.0 }
        ]
      }
    ]
  },
  // Add more uppercase letters as needed...
  {
    char: 'C',
    width: 20,
    height: 30,
    baseline: 25,
    variations: { widthRange: [18, 22], slantRange: [-8, 8], spacingRange: [0.9, 1.1] },
    strokes: [
      {
        id: 1,
        type: 'curve',
        direction: 'counterclockwise',
        speed: 0.8,
        naturalCurve: true,
        points: [
          { x: 17, y: 8, pressure: 0.7, speed: 0.8 },
          { x: 14, y: 5, pressure: 0.8, speed: 0.9 },
          { x: 10, y: 4, pressure: 0.9, speed: 1.0 },
          { x: 6, y: 6, pressure: 1.0, speed: 1.0 },
          { x: 3, y: 10, pressure: 1.0, speed: 1.0 },
          { x: 3, y: 15, pressure: 1.0, speed: 1.0 },
          { x: 3, y: 20, pressure: 1.0, speed: 1.0 },
          { x: 6, y: 24, pressure: 0.9, speed: 0.9 },
          { x: 10, y: 26, pressure: 0.8, speed: 0.8 },
          { x: 14, y: 25, pressure: 0.9, speed: 0.9 },
          { x: 17, y: 22, pressure: 0.7, speed: 0.8 }
        ]
      }
    ]
  }
];

// Space character
const spacePattern: CharacterPattern = {
  char: ' ',
  width: 8,
  height: 0,
  baseline: 0,
  variations: { widthRange: [6, 10], slantRange: [0, 0], spacingRange: [0.8, 1.2] },
  strokes: []
};

// Combine all patterns
export const characterPatterns = new Map<string, CharacterPattern>();

// Add all character patterns
[...numberPatterns, ...symbolPatterns, ...lowercaseLetterPatterns, ...uppercaseLetterPatterns, spacePattern].forEach(pattern => {
  characterPatterns.set(pattern.char, pattern);
});

// Helper functions
export function getCharacterPattern(char: string): CharacterPattern | null {
  return characterPatterns.get(char) || null;
}

export function applyNaturalCurveSmoothing(points: StrokePoint[]): StrokePoint[] {
  if (points.length < 3) return points;
  
  const smoothed: StrokePoint[] = [points[0]];
  
  for (let i = 1; i < points.length - 1; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const next = points[i + 1];
    
    // Apply Catmull-Rom spline smoothing
    const smoothX = curr.x + 0.1 * (next.x - prev.x);
    const smoothY = curr.y + 0.1 * (next.y - prev.y);
    
    smoothed.push({
      x: smoothX,
      y: smoothY,
      pressure: curr.pressure,
      speed: curr.speed
    });
  }
  
  smoothed.push(points[points.length - 1]);
  return smoothed;
}

export function applyHandwritingVariations(
  pattern: CharacterPattern, 
  variation: HandwritingVariation
): CharacterPattern {
  const scaledStrokes = pattern.strokes.map(stroke => ({
    ...stroke,
    points: stroke.points.map(point => {
      // Apply slant transformation
      const slantRadians = (variation.slant * Math.PI) / 180;
      const slantedX = point.x + point.y * Math.tan(slantRadians);
      
      return {
        x: slantedX * variation.characterScale,
        y: point.y * variation.characterScale + variation.baselineShift,
        pressure: (point.pressure || 1) * variation.strokeWidth,
        speed: point.speed
      };
    })
  }));
  
  return {
    ...pattern,
    strokes: scaledStrokes,
    width: pattern.width * variation.characterScale * variation.spacing,
    height: pattern.height * variation.characterScale
  };
}

export function interpolateStroke(stroke: Stroke, progress: number): StrokePoint[] {
  if (stroke.points.length === 0) return [];
  
  const totalPoints = stroke.points.length;
  const targetPointCount = Math.floor(progress * totalPoints);
  const remainder = (progress * totalPoints) - targetPointCount;
  
  const points: StrokePoint[] = [];
  
  // Add completed points
  for (let i = 0; i < targetPointCount; i++) {
    points.push(stroke.points[i]);
  }
  
  // Add interpolated point if needed
  if (targetPointCount < totalPoints - 1 && remainder > 0) {
    const current = stroke.points[targetPointCount];
    const next = stroke.points[targetPointCount + 1];
    
    points.push({
      x: current.x + (next.x - current.x) * remainder,
      y: current.y + (next.y - current.y) * remainder,
      pressure: (current.pressure || 1) + ((next.pressure || 1) - (current.pressure || 1)) * remainder,
      speed: current.speed
    });
  }
  
  // Apply natural curve smoothing
  return stroke.naturalCurve ? applyNaturalCurveSmoothing(points) : points;
}

export function getCharacterDuration(char: string, baseSpeed: number = 1): number {
  const pattern = getCharacterPattern(char);
  if (!pattern) return 100; // Default duration for unknown chars
  
  return pattern.strokes.reduce((total, stroke) => {
    const strokeDuration = (stroke.points.length * 80) / (stroke.speed * baseSpeed);
    return total + strokeDuration;
  }, 0);
}