import { createSignal, createMemo, For } from "solid-js";
import solidLogo from "./assets/solid.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { startFromFile, rawData } from "./audioSource";
import { arc } from "d3";
import type { Component } from "solid-js";

const arcBuilder = arc();

const RadialGraph: Component = () => {
  const paths = createMemo(() => {
    const data = rawData();
    let currentAngle = 0;

    const paths: {
      path: string;
      color: string;
    }[] = [];

    for (const d of data) {
      const path = arcBuilder({
        innerRadius: 50 - (d / 255) * 35,
        outerRadius: 50 + (d / 255) * 35,
        startAngle: currentAngle,
        endAngle: currentAngle + Math.PI * 0.1,
      })!;
      paths.push({
        path,
        color: "blue",
      });
      currentAngle += Math.PI * 0.1;
    }
    return paths;
  });

  return (
    <g>
      <For each={paths()}>{(p) => <path d={p.path} fill={p.color} />}</For>
    </g>
  );
};

function App() {
  const [isPlaying, setIsPlaying] = createSignal(false);

  const handleStart = async () => {
    if (isPlaying()) return;
    await startFromFile();
    setIsPlaying(true);
  };

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} class="logo" alt="Vite logo" />
        </a>
        <a href="https://solidjs.com" target="_blank">
          <img src={solidLogo} class="logo solid" alt="Solid logo" />
        </a>
      </div>
      <h1>Vite + Solid</h1>
      <div class="card">
        <button onClick={handleStart}>Play</button>
      </div>
      <div class="card">
        <svg
          width="100%"
          height="100%"
          viewBox="-100 -100 200 200"
          preserveAspectRatio="xMidYMid meet"
        >
          <RadialGraph />
        </svg>
      </div>
    </>
  );
}

export default App;
