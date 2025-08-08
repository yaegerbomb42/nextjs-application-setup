/**
 * Evolution Engine Module
 * Implements genetic algorithms for selection, crossover, mutation of agent brain parameters.
 * Tracks fitness via task success and intrinsic novelty scores.
 * Supports fast forward hyperspeed mode.
 */

import { AgentBrain } from "./agent-brain";

export interface Individual {
  brain: AgentBrain;
  fitness: number;
  noveltyScore: number;
}

/**
 * Select individuals based on fitness using roulette wheel selection.
 */
export function selectIndividuals(population: Individual[], count: number): Individual[] {
  const totalFitness = population.reduce((sum, ind) => sum + ind.fitness, 0);
  const selected: Individual[] = [];
  for (let i = 0; i < count; i++) {
    const pick = Math.random() * totalFitness;
    let cumulative = 0;
    for (const ind of population) {
      cumulative += ind.fitness;
      if (cumulative >= pick) {
        selected.push(ind);
        break;
      }
    }
  }
  return selected;
}

/**
 * Crossover two brains by averaging weights and biases.
 */
export function crossover(parentA: AgentBrain, parentB: AgentBrain): AgentBrain {
  const child = new AgentBrain(parentA.inputSize, parentA.hiddenSize, parentA.outputSize);

  function averageMatrices(matA: number[][], matB: number[][]): number[][] {
    return matA.map((row, i) =>
      row.map((val, j) => (val + matB[i][j]) / 2)
    );
  }

  function averageVectors(vecA: number[], vecB: number[]): number[] {
    return vecA.map((val, i) => (val + vecB[i]) / 2);
  }

  child.weights1 = averageMatrices(parentA.weights1, parentB.weights1);
  child.biases1 = averageVectors(parentA.biases1, parentB.biases1);
  child.weights2 = averageMatrices(parentA.weights2, parentB.weights2);
  child.biases2 = averageVectors(parentA.biases2, parentB.biases2);

  return child;
}

/**
 * Mutate brain parameters with small random perturbations.
 */
export function mutate(brain: AgentBrain, mutationRate: number = 0.05): void {
  function mutateMatrix(matrix: number[][]) {
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        if (Math.random() < mutationRate) {
          matrix[i][j] += (Math.random() * 0.2 - 0.1);
        }
      }
    }
  }

  function mutateVector(vector: number[]) {
    for (let i = 0; i < vector.length; i++) {
      if (Math.random() < mutationRate) {
        vector[i] += (Math.random() * 0.2 - 0.1);
      }
    }
  }

  mutateMatrix(brain.weights1);
  mutateVector(brain.biases1);
  mutateMatrix(brain.weights2);
  mutateVector(brain.biases2);
}

/**
 * Run one generation of evolution.
 */
export function evolvePopulation(population: Individual[], eliteCount: number, mutationRate: number): Individual[] {
  // Sort population by fitness descending
  population.sort((a, b) => b.fitness - a.fitness);

  // Keep elites
  const newPopulation: Individual[] = population.slice(0, eliteCount);

  // Select parents for crossover
  const parents = selectIndividuals(population, population.length - eliteCount);

  // Generate children
  while (newPopulation.length < population.length) {
    const parentA = parents[Math.floor(Math.random() * parents.length)].brain;
    const parentB = parents[Math.floor(Math.random() * parents.length)].brain;
    const childBrain = crossover(parentA, parentB);
    mutate(childBrain, mutationRate);
    newPopulation.push({ brain: childBrain, fitness: 0, noveltyScore: 0 });
  }

  return newPopulation;
}
