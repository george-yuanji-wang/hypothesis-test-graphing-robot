// src/components/forms/OneSampleTForm.tsx
import React, { useState } from "react";
import { runTestFunction } from "../../pyodideLoader";
import { Button } from "@/components/ui/button";

export default function OneSampleTForm() {
  const defaultValues = {
    n: 25,               // sample size
    s: 8,                // sample standard deviation
    xBar: 52,            // sample mean
    mu: 50,              // hypothesized mean
    alpha: 0.05,         // significance level
    tailType: 3,         // default to Two-tailed
  };

  const [n, setN] = useState<number>(defaultValues.n);
  const [s, setS] = useState<number>(defaultValues.s);
  const [xBar, setXBar] = useState<number>(defaultValues.xBar);
  const [mu, setMu] = useState<number>(defaultValues.mu);
  const [alpha, setAlpha] = useState<number>(defaultValues.alpha);
  const [tailType, setTailType] = useState<number>(defaultValues.tailType);
  const [imgB64, setImgB64] = useState<string>("");
  const [error, setError] = useState<string>("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
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
    } catch {
      setError("Unable to generate the one-sample t-test plot.");
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
    setError("");
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
      {error && (
        <div className="bg-red-100 text-red-800 px-3 py-2 rounded">
          {error}
        </div>
      )}

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
        <label className="mb-1">s (sample SD):</label>
        <input
          type="number"
          step="0.01"
          value={s}
          onChange={(e) => setS(Number(e.target.value))}
          className="bg-gray-800 text-white rounded px-2 py-1"
        />
      </div>

      <div className="flex flex-col">
        <label className="mb-1">x̄ (sample mean):</label>
        <input
          type="number"
          step="0.01"
          value={xBar}
          onChange={(e) => setXBar(Number(e.target.value))}
          className="bg-gray-800 text-white rounded px-2 py-1"
        />
      </div>

      <div className="flex flex-col">
        <label className="mb-1">μ (hypothesized mean):</label>
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
        <label className="mb-1">Tail Type:</label>
        <select
          value={tailType}
          onChange={(e) => setTailType(Number(e.target.value))}
          className="bg-gray-800 text-white rounded px-2 py-1"
        >
          <option value={1}>Left-tailed (H₁: μ &lt; μ₀)</option>
          <option value={2}>Right-tailed (H₁: μ &gt; μ₀)</option>
          <option value={3}>Two-tailed (H₁: μ ≠ μ₀)</option>
        </select>
      </div>

      <div className="flex flex-col space-y-2">
        <Button type="submit">Solve &amp; Graph</Button>
        <Button variant="outline" onClick={handleClear}>Clear Form</Button>
      </div>

      {imgB64 && (
        <div className="mt-4">
          <img
            src={`data:image/png;base64,${imgB64}`}
            alt="T-Test Plot"
            className="rounded"
          />
          <Button onClick={handleDownload} className="mt-2">Download Image</Button>
        </div>
      )}
    </form>
  );
}