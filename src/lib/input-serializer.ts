/**
 * Input Serializer Module
 * Converts heterogeneous inputs (vision grids, text messages, scalars)
 * into a fixed-length, normalized numeric vector suitable for neural input.
 */

const MAX_VISION_SIZE = 10 * 10; // Assuming 10x10 vision grid
const MAX_TEXT_LENGTH = 50; // Max characters for text input
const MAX_SCALARS = 5; // Number of scalar inputs supported

/**
 * Normalize a number between 0 and 1 given min and max.
 */
function normalize(value: number, min: number, max: number): number {
  if (max === min) return 0;
  return (value - min) / (max - min);
}

/**
 * Convert vision input (2D array) to flat normalized vector.
 * Assumes vision is a 2D array of numbers.
 */
function serializeVision(vision: number[][]): number[] {
  const flatVision: number[] = [];
  for (let row = 0; row < vision.length; row++) {
    for (let col = 0; col < vision[row].length; col++) {
      // Normalize cell value between 0 and 1 (assuming cell values 0-3)
      flatVision.push(normalize(vision[row][col], 0, 3));
    }
  }
  // Pad with zeros if smaller than MAX_VISION_SIZE
  while (flatVision.length < MAX_VISION_SIZE) {
    flatVision.push(0);
  }
  return flatVision.slice(0, MAX_VISION_SIZE);
}

/**
 * Convert text input to numeric vector using char codes normalized.
 */
function serializeText(text: string): number[] {
  const vector: number[] = [];
  for (let i = 0; i < text.length && i < MAX_TEXT_LENGTH; i++) {
    // Normalize char code between 32 and 126 (printable ASCII)
    const code = text.charCodeAt(i);
    vector.push(normalize(code, 32, 126));
  }
  // Pad with zeros if shorter than MAX_TEXT_LENGTH
  while (vector.length < MAX_TEXT_LENGTH) {
    vector.push(0);
  }
  return vector;
}

/**
 * Normalize scalar inputs array.
 */
function serializeScalars(scalars: number[]): number[] {
  const vector: number[] = [];
  for (let i = 0; i < MAX_SCALARS; i++) {
    if (i < scalars.length) {
      // Assuming scalars are already in a reasonable range, normalize between 0 and 1
      vector.push(normalize(scalars[i], 0, 1));
    } else {
      vector.push(0);
    }
  }
  return vector;
}

/**
 * Main function to serialize all inputs into a single fixed-length vector.
 */
export function serializeInputs(
  vision: number[][],
  text: string,
  scalars: number[]
): number[] {
  const visionVec = serializeVision(vision);
  const textVec = serializeText(text);
  const scalarVec = serializeScalars(scalars);
  return [...visionVec, ...textVec, ...scalarVec];
}
