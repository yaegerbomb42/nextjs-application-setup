```markdown
# Detailed Implementation Plan for the Evolving Agent System

This plan outlines all required changes and additions to create a fully-functional, sandboxed, visually interactive evolving agent system. The plan covers simulation logic, multi-modal input serialization, hybrid neural/tranformer agent brain, evolution engine with intrinsic motivation, sandbox safety, and a modern, responsive UI.

---

## Global Styles & UI Enhancements

**File:** `src/app/globals.css`  
- **Changes:**
  - Add modern typography, spacing, and layout classes for the simulation page.
  - Create CSS classes for the grid visualization, control panel, and log panel.
  - Include responsive styles ensuring clear visual hierarchy and consistency.

---

## Main Simulation Page

**File:** `src/app/evolving-agent/page.tsx`  
- **Structure & Imports:**
  - Import React hooks, the UI components (`WorldGrid`, `ControlPanel`, `AgentLogs`).
  - Import simulation and agent modules from `src/lib/`.
- **Implementation Steps:**
  - Initialize states for simulation world data, agent brain state, messages, simulation speed, and logs.
  - Render an HTML5 Canvas element or styled div to display the grid world.
  - Layout UI into two main sections: visualization (grid) and interaction (controls and logs).
  - Wire button actions for “Start”, “Stop”, “Hyperspeed Toggle”, “Export”, and “Import” brain states.
  - Implement file export/import using browser file APIs with error handling for malformed JSON.
  - Handle text input for sending messages as stimuli; update simulation and logs accordingly.
- **Error Handling:**
  - Surround asynchronous simulation control functions with try-catch blocks and display user-friendly error messages in the logs.

---

## UI Components

### World Grid Visualization

**File:** `src/components/WorldGrid.tsx`  
- **Features:**
  - Render a 10x10 grid (or dynamic size) illustrating agents, food, hazards, and walls.
  - Use plain HTML elements or an HTML5 Canvas for drawing; apply CSS classes for styling (no external icons/SVGs).
- **Error Handling:**
  - Validate grid data before rendering; show a fallback message if data is missing or corrupt.

### Control Panel

**File:** `src/components/ControlPanel.tsx`  
- **Features:**
  - Display buttons for simulation actions (start, stop, toggle hyperspeed, export/import).
  - Include an input field for sending textual messages.
  - Use modern, clean styling with clear typography and spacing.
- **Error Handling:**
  - Ensure input validation and handle button click errors gracefully via status alerts.

### Agent Logs

**File:** `src/components/AgentLogs.tsx`  
- **Features:**
  - Show realtime log messages (agent decisions, brain state changes, simulation events) in a scrollable panel.
  - Automatically update with new entries and provide a clear visual hierarchy.
- **Error Handling:**
  - Prevent UI crashes due to excessively long logs; implement limits and scroll management.

---

## Core Simulation Modules (in `src/lib/`)

### Simulation Engine

**File:** `src/lib/simulation.ts`  
- **Features:**
  - Define data structures for grid cells, objects (food, walls, hazards), and agent positions.
  - Functions: `initGridWorld()`, `updateWorld()`, `spawnObject()`, `moveObject()`, and `removeObject()`.
- **Error Handling:**
  - Validate grid boundaries and object data; log errors if objects are placed out-of-bounds.

### Input Serializer

**File:** `src/lib/input-serializer.ts`  
- **Features:**
  - Implement a function that takes heterogeneous inputs (2D arrays for vision, text strings, scalars) and converts them into a fixed-length, normalized numeric vector.
- **Error Handling:**
  - Throw descriptive errors if input types are mismatched or missing required data.

### Agent Brain Architecture

**File:** `src/lib/agent-brain.ts`  
- **Features:**
  - Implement a hybrid brain with two modules: a feedforward network (using pure JS math) and a lightweight transformer (simulated context processing).
  - Functions: `processInput(inputVector)`, `generateDecision()`, and `selfModify()` for meta-learning.
  - Return introspective outputs for logging.
- **Error Handling:**
  - Validate input vector dimensions; fallback to safe action on errors.

### Evolution Engine

**File:** `src/lib/evolution.ts`  
- **Features:**
  - Implement genetic algorithm functions: selection, crossover, and mutation of agent brain parameters.
  - Track fitness scores and intrinsic novelty scores.
  - Include a fast forward “hyperspeed” evolution mode.
- **Error Handling:**
  - Ensure mutation parameters are within safe ranges; capture runtime errors during evolution cycles.

### Novelty Detection Module

**File:** `src/lib/novelty-detection.ts`  
- **Features:**
  - Compute novelty scores based on Euclidean distance or cosine similarity in a latent behavior space.
  - Provide thresholds to reward exploration.
- **Error Handling:**
  - Default score output if behavior embedding computation fails.

### Safety Sandbox

**File:** `src/lib/sandbox.ts`  
- **Features:**
  - Provide a sandboxed context to safely execute self-modifying agent code.
  - Use strict controls (e.g., limited scope, try-catch wrappers) to prevent external side effects.
- **Error Handling:**
  - Catch and report sandbox execution errors; prevent dangerous code mutations.

---

## Integration & Testing

- **Integration Steps:**
  - Wire UI components with simulation logic through React state updates.
  - Ensure functions from `src/lib/` are invoked from the main simulation page and return expected outputs.
- **Testing:**
  - Manually test simulation activities using browser developer tools.
  - Validate export/import functions using curl or browser console file read/write tests.
  - Check that error handling messages are displayed in the AgentLogs component.

---

## Documentation Update

**File:** `README.md`  
- **Changes:**
  - Add a section on the evolving agent system.
  - Document core features, controls, file export/import usage, and safety mechanisms.

---

## Summary

- Added global styles with modern typography and layout in `globals.css`.  
- Created a new simulation page (`src/app/evolving-agent/page.tsx`) that integrates grid visualization, control panel, and logs.  
- Developed UI components for grid rendering, control actions, and live logs with robust error handling.  
- Implemented core simulation, input serialization, hybrid agent brain, evolution engine, novelty detection, and sandbox safety in `src/lib/`.  
- Ensured clear separation between simulation logic and UI for maintainability and testing.  
- Updated documentation in `README.md` to guide users on usage and safety.
