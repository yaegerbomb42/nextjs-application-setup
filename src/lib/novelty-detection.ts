/**
 * Novelty Detection Module
 * Computes intrinsic motivation scores based on agent behavior embeddings.
 */

type Vector = number[];

/**
 * Compute Euclidean distance between two vectors.
 */
function euclideanDistance(vecA: Vector, vecB: Vector): number {
  if (vecA.length !== vecB.length) return Infinity;
  let sum = 0;
  for (let i = 0; i < vecA.length; i++) {
    const diff = vecA[i] - vecB[i];
    sum += diff * diff;
  }
  return Math.sqrt(sum);
}

/**
 * Compute novelty score for a behavior embedding based on a set of previous embeddings.
 * Higher score means more novel.
 */
export function computeNoveltyScore(
  behaviorEmbedding: Vector,
  previousEmbeddings: Vector[],
  threshold: number = 0.5
): number {
  if (previousEmbeddings.length === 0) return 1;

  let minDistance = Infinity;
  for (const prev of previousEmbeddings) {
    const dist = euclideanDistance(behaviorEmbedding, prev);
    if (dist < minDistance) {
      minDistance = dist;
    }
  }

  // Reward novelty if minDistance exceeds threshold
  return minDistance > threshold ? minDistance : 0;
}
