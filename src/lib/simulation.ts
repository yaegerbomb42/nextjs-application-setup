/**
 * Simulation Engine Module
 * Handles grid world initialization, updates, and object management
 */

export type CellType = 0 | 1 | 2 | 3; // 0: empty, 1: food, 2: wall, 3: hazard

export interface GridWorld {
  size: number;
  grid: CellType[][];
}

/**
 * Initialize a grid world with given size.
 * All cells start as empty (0).
 */
export function initGridWorld(size: number = 10): GridWorld {
  const grid: CellType[][] = [];
  for (let i = 0; i < size; i++) {
    const row: CellType[] = [];
    for (let j = 0; j < size; j++) {
      row.push(0);
    }
    grid.push(row);
  }
  return { size, grid };
}

/**
 * Update the grid world state.
 * Placeholder for simulation step logic.
 */
export function updateWorld(world: GridWorld): GridWorld {
  // TODO: Implement simulation update logic (agent moves, object interactions)
  return world;
}

/**
 * Spawn an object of given type at specified coordinates.
 * Returns true if successful, false if out of bounds or occupied.
 */
export function spawnObject(
  world: GridWorld,
  x: number,
  y: number,
  type: CellType
): boolean {
  if (
    x < 0 ||
    y < 0 ||
    x >= world.size ||
    y >= world.size ||
    world.grid[y][x] !== 0
  ) {
    return false;
  }
  world.grid[y][x] = type;
  return true;
}

/**
 * Remove object at specified coordinates.
 * Returns true if successful, false if out of bounds or already empty.
 */
export function removeObject(world: GridWorld, x: number, y: number): boolean {
  if (x < 0 || y < 0 || x >= world.size || y >= world.size) {
    return false;
  }
  if (world.grid[y][x] === 0) {
    return false;
  }
  world.grid[y][x] = 0;
  return true;
}

/**
 * Move object from (x1, y1) to (x2, y2).
 * Returns true if successful, false if invalid move.
 */
export function moveObject(
  world: GridWorld,
  x1: number,
  y1: number,
  x2: number,
  y2: number
): boolean {
  if (
    x1 < 0 ||
    y1 < 0 ||
    x1 >= world.size ||
    y1 >= world.size ||
    x2 < 0 ||
    y2 < 0 ||
    x2 >= world.size ||
    y2 >= world.size
  ) {
    return false;
  }
  if (world.grid[y1][x1] === 0 || world.grid[y2][x2] !== 0) {
    return false;
  }
  world.grid[y2][x2] = world.grid[y1][x1];
  world.grid[y1][x1] = 0;
  return true;
}
