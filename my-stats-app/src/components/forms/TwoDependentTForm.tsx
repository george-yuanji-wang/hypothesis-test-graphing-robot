// src/components/forms/TwoDependentTForm.tsx
import React, { useState } from "react";
import { runTestFunction } from "../../pyodideLoader";
import { Button } from "@/components/ui/button";

export default function TwoDependentTForm() {
  const defaultValues = {
    n: 20,          // number of pairs
    s_d: 1.8,       // sd of differences
    dBar: 1,      // mean of differences
    alpha: 0.05,    // significance level
    tailType: 3,    // default to Two‑tailed
  };

  const [n, setN] = useState<number>(defaultValues.n);
  const [s_d, setSD] = useState<number>(defaultValues.s_d);
  const [dBar, setDBar] = useState<number>(defaultValues.dBar);
  const [alpha, setAlpha] = useState<number>(defaultValues.alpha);
  const [tailType, setTailType] = useState<number>(defaultValues.tailType);
  const [imgB64, setImgB64] = useState<string>("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const base64 = await runTestFunction("two_dependent_t_test", {
      n,
      s_d,
      d_bar: dBar,
      alpha,
      tail_type: tailType,
    });
    setImgB64(base64);
  }

  function handleClear() {
    setN(defaultValues.n);
    setSD(defaultValues.s_d);
    setDBar(defaultValues.dBar);
    setAlpha(defaultValues.alpha);
    setTailType(defaultValues.tailType);
    setImgB64("");
  }

  function handleDownload() {
    if (!imgB64) return;
    const link = document.createElement("a");
    link.href = `data:image/png;base64,${imgB64}`;
    link.download = "two_dependent_t_test.png";
    link.click();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      {/* n */}
      <div className="flex flex-col">
        <label className="mb-1">n:</label>
        <input
          type="number"
          value={n}
          onChange={(e) => setN(Number(e.target.value))}
          className="bg-gray-800 text-white rounded px-2 py-1"
        />
      </div>

      {/* sₙ (SD of paired differences) */}
      <div className="flex flex-col">
        <label className="mb-1">s_d (SD of differences):</label>
        <input
          type="number"
          step="0.01"
          value={s_d}
          onChange={(e) => setSD(Number(e.target.value))}
          className="bg-gray-800 text-white rounded px-2 py-1"
        />
      </div>

      {/* d̄ */}
      <div className="flex flex-col">
        <label className="mb-1">d̄ (mean difference):</label>
        <input
          type="number"
          step="0.01"
          value={dBar}
          onChange={(e) => setDBar(Number(e.target.value))}
          className="bg-gray-800 text-white rounded px-2 py-1"
        />
      </div>

      {/* α */}
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

      {/* Tail Type */}
      <div className="flex flex-col">
        <label className="mb-1">Tail Type:</label>
        <select
          value={tailType}
          onChange={(e) => setTailType(Number(e.target.value))}
          className="bg-gray-800 text-white rounded px-2 py-1"
        >
          <option value={1}>Left‑tailed (H₁: d̄ &lt; 0)</option>
          <option value={2}>Right‑tailed (H₁: d̄ &gt; 0)</option>
          <option value={3}>Two‑tailed (H₁: d̄ ≠ 0)</option>
        </select>
      </div>

      {/* Buttons */}
      <div className="flex flex-col space-y-2">
        <Button type="submit">Solve &amp; Graph</Button>
        <Button variant="outline" onClick={handleClear}>Clear Form</Button>
      </div>

      {/* Plot & Download */}
      {imgB64 && (
        <div className="mt-4">
          <img
            src={`data:image/png;base64,${imgB64}`}
            alt="Paired T‑Test Plot"
            className="rounded"
          />
          <Button onClick={handleDownload} className="mt-2">
            Download Image
          </Button>
        </div>
      )}
    </form>
  );
}
