import { createSignal, createMemo, For } from "solid-js";
import solidLogo from "./assets/solid.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { startFromFile, rawData } from "./audioSource";
import { arc, interpolateInferno } from "d3";
import type { Component } from "solid-js";

const arcBuilder = arc();

const RadialGraph: Component<{
  color: (value: number) => string;
}> = ({ color }) => {
  const computed = createMemo(() => {
    const data = rawData();

    const total = data.reduce((a, v) => a + v, 0);

    const paths: {
      path: string;
      color: string;
    }[] = [];

    const range = 2;
    const rangeInRadians = range * Math.PI;
    const startAngle = -(rangeInRadians / 2);
    let currentAngle = startAngle;

    for (const d of data) {
      const angle = rangeInRadians * (d / total);
      const path = arcBuilder({
        innerRadius: 0,
        outerRadius: 50 + ((d + 10) / 255) * 35,
        startAngle: currentAngle,
        endAngle: currentAngle + angle,
      })!;
      paths.push({
        path,
        color: color(d / 255),
      });
      currentAngle += angle;
    }

    return { paths };
  });
  return (
    <g>
      <For each={computed().paths}>
        {(p) => <path d={p.path} fill={p.color} />}
      </For>
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
      <div class="card" style={{ height: "50vh", width: "50vw" }}>
        <svg
          width="100%"
          height="100%"
          viewBox="-100 -100 200 200"
          preserveAspectRatio="xMidYMid meet"
        >
          <RadialGraph color={interpolateInferno} />
        </svg>
      </div>
    </>
  );
}

export default App;
