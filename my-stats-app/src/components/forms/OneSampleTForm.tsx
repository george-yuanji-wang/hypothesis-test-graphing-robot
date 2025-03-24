// src/components/forms/OneSampleTForm.tsx
import React, { useState } from "react";
import { runTestFunction } from "../../pyodideLoader";

export default function OneSampleTForm() {
  const defaultValues = {
    n: 30,
    s: 10,
    xBar: 5,
    mu: 0,
    alpha: 0.05,
    tailType: 1,
  };

  const [n, setN] = useState<number>(defaultValues.n);
  const [s, setS] = useState<number>(defaultValues.s);
  const [xBar, setXBar] = useState<number>(defaultValues.xBar);
  const [mu, setMu] = useState<number>(defaultValues.mu);
  const [alpha, setAlpha] = useState<number>(defaultValues.alpha);
  const [tailType, setTailType] = useState<number>(defaultValues.tailType);
  const [imgB64, setImgB64] = useState<string>("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const base64 = await runTestFunction("one_sample_t_test", {
        n,
        s,
        x_bar: xBar,
        mu,
        alpha,
        tail_type: tailType,
      });
      setImgB64(base64);
    } catch (error) {
      console.error("Error generating plot:", error);
    }
  }

  function handleClear() {
    setN(defaultValues.n);
    setS(defaultValues.s);
    setXBar(defaultValues.xBar);
    setMu(defaultValues.mu);
    setAlpha(defaultValues.alpha);
    setTailType(defaultValues.tailType);
    setImgB64("");
  }

  function handleDownload() {
    if (!imgB64) return;
    const link = document.createElement("a");
    link.href = `data:image/png;base64,${imgB64}`;
    link.download = "one_sample_t_test.png";
    link.click();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div className="flex flex-col">
        <label className="mb-1">n:</label>
        <input
          type="number"
          value={n}
          onChange={(e) => setN(Number(e.target.value))}
          className="bg-gray-800 text-white rounded px-2 py-1"
        />
      </div>
      <div className="flex flex-col">
        <label className="mb-1">s:</label>
        <input
          type="number"
          step="0.01"
          value={s}
          onChange={(e) => setS(Number(e.target.value))}
          className="bg-gray-800 text-white rounded px-2 py-1"
        />
      </div>
      <div className="flex flex-col">
        <label className="mb-1">x̄:</label>
        <input
          type="number"
          step="0.01"
          value={xBar}
          onChange={(e) => setXBar(Number(e.target.value))}
          className="bg-gray-800 text-white rounded px-2 py-1"
        />
      </div>
      <div className="flex flex-col">
        <label className="mb-1">μ:</label>
        <input
          type="number"
          step="0.01"
          value={mu}
          onChange={(e) => setMu(Number(e.target.value))}
          className="bg-gray-800 text-white rounded px-2 py-1"
        />
      </div>
      <div className="flex flex-col">
        <label className="mb-1">α:</label>
        <input
          type="number"
          step="0.001"
          value={alpha}
          onChange={(e) => setAlpha(Number(e.target.value))}
          className="bg-gray-800 text-white rounded px-2 py-1"
        />
      </div>
      <div className="flex flex-col">
        <label className="mb-1">tailType (1 or 2):</label>
        <input
          type="number"
          value={tailType}
          onChange={(e) => setTailType(Number(e.target.value))}
          className="bg-gray-800 text-white rounded px-2 py-1"
        />
      </div>
      <div className="flex flex-col space-y-2">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Solve &amp; Graph
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="bg-gray-600 text-white px-4 py-2 rounded"
        >
          Clear Form
        </button>
      </div>
      {imgB64 && (
        <div className="mt-4">
          <img src={`data:image/png;base64,${imgB64}`} alt="Plot" className="border border-white" />
          <button
            type="button"
            onClick={handleDownload}
            className="bg-green-600 text-white px-4 py-2 rounded mt-2"
          >
            Download Image
          </button>
        </div>
      )}
    </form>
  );
}
