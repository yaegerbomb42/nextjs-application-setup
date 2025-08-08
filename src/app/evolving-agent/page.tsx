"use client";

import React, { useState, useEffect, useRef } from "react";

import {
  initGridWorld,
  updateWorld,
  spawnObject,
  moveObject,
  removeObject,
  GridWorld,
  CellType,
} from "@/lib/simulation";

import { serializeInputs } from "@/lib/input-serializer";

import { AgentBrain } from "@/lib/agent-brain";

import {
  evolvePopulation,
  Individual,
} from "@/lib/evolution";

import { computeNoveltyScore } from "@/lib/novelty-detection";

import { Sandbox } from "@/lib/sandbox";

const GRID_SIZE = 10;

const EvolvingAgentPage: React.FC = () => {
  // Simulation state
  const [world, setWorld] = useState<GridWorld>(() => initGridWorld(GRID_SIZE));
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [hyperspeed, setHyperspeed] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [messageInput, setMessageInput] = useState("");

  // Population state
  const [population, setPopulation] = useState<Individual[]>([]);
  const [generation, setGeneration] = useState(0);

  // Sandbox instance
  const sandboxRef = useRef<Sandbox>(new Sandbox());

  // Initialize population on mount
  useEffect(() => {
    const initialPopulation: Individual[] = [];
    for (let i = 0; i < 10; i++) {
      const brain = new AgentBrain(
        GRID_SIZE * GRID_SIZE + 50 + 5,
        64,
        10
      );
      initialPopulation.push({ brain, fitness: 0, noveltyScore: 0 });
    }
    setPopulation(initialPopulation);
    addLog("Initialized population with 10 agents.");
  }, []);

  // Add log entry helper
  const addLog = (entry: string) => {
    setLogs((prev) => [...prev, entry]);
  };

  // Simulation loop reference
  const simulationInterval = useRef<NodeJS.Timeout | null>(null);

  // Simulation step function
  const simulationStep = () => {
    try {
      // For each agent in population, process inputs and generate decisions
      const newPopulation = population.map((individual, index) => {
        // Serialize inputs: vision grid, message text, scalars (dummy scalars for now)
        const vision = world.grid;
        const text = messageInput;
        const scalars = [Math.random(), Math.random(), Math.random(), 0, 0]; // placeholder scalars

        const inputVector = serializeInputs(vision, text, scalars);

        // Process input through agent brain
        const output = individual.brain.processInput(inputVector);

        // Self-modify brain parameters
        individual.brain.selfModify();

        // Compute fitness (placeholder: sum of output values)
        const fitness = output.reduce((a, b) => a + b, 0);

        // Compute novelty score (placeholder: use output as behavior embedding)
        const noveltyScore = computeNoveltyScore(output, []);

        return {
          brain: individual.brain,
          fitness,
          noveltyScore,
        };
      });

      // Evolve population every 10 generations
      if (generation > 0 && generation % 10 === 0) {
        const evolvedPopulation = evolvePopulation(newPopulation, 2, 0.05);
        setPopulation(evolvedPopulation);
        addLog(`Population evolved at generation ${generation}.`);
      } else {
        setPopulation(newPopulation);
      }

      // Update world state (placeholder)
      const updatedWorld = updateWorld(world);
      setWorld(updatedWorld);

      addLog(`Generation ${generation} simulation step executed.`);
    } catch (error) {
      addLog(`Error during simulation step: ${error}`);
    }
  };

  // Start simulation handler
  const startSimulation = () => {
    if (simulationRunning) return;
    setSimulationRunning(true);
    addLog("Simulation started.");
    simulationInterval.current = setInterval(() => {
      simulationStep();
      setGeneration((gen) => gen + 1);
    }, hyperspeed ? 10 : 1000);
  };

  // Stop simulation handler
  const stopSimulation = () => {
    if (!simulationRunning) return;
    setSimulationRunning(false);
    if (simulationInterval.current) {
      clearInterval(simulationInterval.current);
      simulationInterval.current = null;
    }
    addLog("Simulation stopped.");
  };

  // Toggle hyperspeed handler
  const toggleHyperspeed = () => {
    setHyperspeed((prev) => !prev);
    addLog(`Hyperspeed ${!hyperspeed ? "enabled" : "disabled"}.`);
    if (simulationRunning) {
      stopSimulation();
      startSimulation();
    }
  };

  // Handle message input change
  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);
  };

  // Handle message send
  const sendMessage = () => {
    if (messageInput.trim() === "") return;
    addLog(`User message sent: ${messageInput}`);
    setMessageInput("");
    // TODO: Send message as stimulus to agents
  };

  // Export brain state placeholder
  const exportBrain = () => {
    addLog("Export brain state triggered.");
    // TODO: Implement export functionality
  };

  // Import brain state placeholder
  const importBrain = () => {
    addLog("Import brain state triggered.");
    // TODO: Implement import functionality
  };

  return (
    <main className="min-h-screen bg-black text-white p-6 font-sans">
      <h1 className="text-3xl font-bold mb-4">Evolving Agent System</h1>
      <div className="flex flex-col md:flex-row gap-6">
        {/* World Grid Visualization */}
        <section className="flex-1 bg-gray-900 rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">World Grid</h2>
          <div className="grid grid-cols-10 gap-0.5">
            {world.grid.flatMap((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className="w-8 h-8 border border-gray-700"
                  style={{
                    backgroundColor:
                      cell === 0
                        ? "#111"
                        : cell === 1
                        ? "#4ade80"
                        : cell === 2
                        ? "#a3a3a3"
                        : "#f87171", // green, gray, red
                  }}
                />
              ))
            )}
          </div>
        </section>

        {/* Control Panel and Logs */}
        <section className="flex-1 flex flex-col gap-4">
          {/* Controls */}
          <div className="bg-gray-900 rounded-lg p-4 flex flex-col gap-3">
            <h2 className="text-xl font-semibold mb-2">Controls</h2>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={startSimulation}
                disabled={simulationRunning}
                className="bg-white text-black px-4 py-2 rounded disabled:opacity-50"
              >
                Start
              </button>
              <button
                onClick={stopSimulation}
                disabled={!simulationRunning}
                className="bg-white text-black px-4 py-2 rounded disabled:opacity-50"
              >
                Stop
              </button>
              <button
                onClick={toggleHyperspeed}
                className="bg-white text-black px-4 py-2 rounded"
              >
                {hyperspeed ? "Disable Hyperspeed" : "Enable Hyperspeed"}
              </button>
              <button
                onClick={exportBrain}
                className="bg-white text-black px-4 py-2 rounded"
              >
                Export Brain
              </button>
              <button
                onClick={importBrain}
                className="bg-white text-black px-4 py-2 rounded"
              >
                Import Brain
              </button>
            </div>
            <div className="mt-3 flex gap-2">
              <input
                type="text"
                value={messageInput}
                onChange={handleMessageChange}
                placeholder="Send message to agents"
                className="flex-1 px-3 py-2 rounded text-black"
              />
              <button
                onClick={sendMessage}
                className="bg-white text-black px-4 py-2 rounded"
              >
                Send
              </button>
            </div>
          </div>

          {/* Logs */}
          <div className="bg-gray-900 rounded-lg p-4 h-64 overflow-y-auto font-mono text-sm">
            <h2 className="text-xl font-semibold mb-2">Agent Logs</h2>
            <ul>
              {logs.map((log, idx) => (
                <li key={idx} className="mb-1">
                  {log}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
};

export default EvolvingAgentPage;
