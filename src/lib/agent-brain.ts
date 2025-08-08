/**
 * Agent Brain Architecture Module
 * Implements a hybrid feedforward dense network combined with a lightweight transformer module
 * for context and sequence processing.
 * Supports introspective outputs for meta-learning and self-modification.
 */

type Vector = number[];

/**
 * Simple feedforward dense layer implementation.
 */
function denseLayer(input: Vector, weights: number[][], biases: number[]): Vector {
  const output: Vector = [];
  for (let i = 0; i < weights.length; i++) {
    let sum = biases[i];
    for (let j = 0; j < input.length; j++) {
      sum += input[j] * weights[i][j];
    }
    // Using ReLU activation
    output.push(Math.max(0, sum));
  }
  return output;
}

/**
 * Lightweight transformer module simulation.
 * For simplicity, this function simulates context processing by averaging input vectors.
 */
function transformerModule(inputs: Vector[]): Vector {
  if (inputs.length === 0) return [];
  const length = inputs[0].length;
  const output: Vector = new Array(length).fill(0);
  for (const vec of inputs) {
    for (let i = 0; i < length; i++) {
      output[i] += vec[i];
    }
  }
  for (let i = 0; i < length; i++) {
    output[i] /= inputs.length;
  }
  return output;
}

/**
 * AgentBrain class encapsulates the brain state and processing.
 */
export class AgentBrain {
  inputSize: number;
  hiddenSize: number;
  outputSize: number;

  // Weights and biases for feedforward layers
  weights1: number[][];
  biases1: number[];
  weights2: number[][];
  biases2: number[];

  // Memory for transformer context
  contextMemory: Vector[];

  constructor(inputSize: number, hiddenSize: number, outputSize: number) {
    this.inputSize = inputSize;
    this.hiddenSize = hiddenSize;
    this.outputSize = outputSize;

    // Initialize weights and biases randomly
    this.weights1 = this.randomMatrix(hiddenSize, inputSize);
    this.biases1 = this.randomVector(hiddenSize);
    this.weights2 = this.randomMatrix(outputSize, hiddenSize);
    this.biases2 = this.randomVector(outputSize);

    this.contextMemory = [];
  }

  /**
   * Generate a random matrix of given dimensions.
   */
  private randomMatrix(rows: number, cols: number): number[][] {
    const matrix: number[][] = [];
    for (let i = 0; i < rows; i++) {
      const row: number[] = [];
      for (let j = 0; j < cols; j++) {
        row.push(Math.random() * 2 - 1); // Random values between -1 and 1
      }
      matrix.push(row);
    }
    return matrix;
  }

  /**
   * Generate a random vector of given length.
   */
  private randomVector(length: number): number[] {
    const vector: number[] = [];
    for (let i = 0; i < length; i++) {
      vector.push(Math.random() * 2 - 1);
    }
    return vector;
  }

  /**
   * Process input vector through the brain to generate output.
   * Also updates context memory for transformer.
   */
  processInput(input: Vector): Vector {
    // Feedforward pass
    const hidden = denseLayer(input, this.weights1, this.biases1);

    // Add hidden state to context memory
    this.contextMemory.push(hidden);
    if (this.contextMemory.length > 5) {
      this.contextMemory.shift(); // Keep last 5 states
    }

    // Transformer context processing
    const contextOutput = transformerModule(this.contextMemory);

    // Combine hidden and context outputs
    const combinedInput = hidden.map((val, idx) => val + (contextOutput[idx] || 0));

    // Output layer
    const output = denseLayer(combinedInput, this.weights2, this.biases2);

    return output;
  }

  /**
   * Self-modification method to adjust weights slightly (meta-learning).
   */
  selfModify(): void {
    // Small random perturbations to weights and biases
    const perturb = (val: number) => val + (Math.random() * 0.02 - 0.01);

    this.weights1 = this.weights1.map(row => row.map(perturb));
    this.biases1 = this.biases1.map(perturb);
    this.weights2 = this.weights2.map(row => row.map(perturb));
    this.biases2 = this.biases2.map(perturb);
  }
}
