// src/components/forms/TwoIndependentZForm.tsx
import React, { useState } from "react";
import { runTestFunction } from "../../pyodideLoader";
import { Button } from "@/components/ui/button";

export default function TwoIndependentZForm() {
  const defaultValues = {
    n1: 50,        // sample size group 1
    n2: 50,        // sample size group 2
    sigma1: 5,     // known σ₁
    sigma2: 5,     // known σ₂
    xBar1: 100,    // mean group 1
    xBar2: 98.2,     // mean group 2
    alpha: 0.05,   // significance level
    tailType: 3,   // default to Two-tailed
  };

  const [n1, setN1] = useState<number>(defaultValues.n1);
  const [n2, setN2] = useState<number>(defaultValues.n2);
  const [sigma1, setSigma1] = useState<number>(defaultValues.sigma1);
  const [sigma2, setSigma2] = useState<number>(defaultValues.sigma2);
  const [xBar1, setXBar1] = useState<number>(defaultValues.xBar1);
  const [xBar2, setXBar2] = useState<number>(defaultValues.xBar2);
  const [alpha, setAlpha] = useState<number>(defaultValues.alpha);
  const [tailType, setTailType] = useState<number>(defaultValues.tailType);
  const [imgB64, setImgB64] = useState<string>("");
  const [error, setError] = useState<string>("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (n1 < 2 || n2 < 2) {
      setError("Both sample sizes must be at least 2.");
      return;
    }
    if (sigma1 <= 0 || sigma2 <= 0) {
      setError("Population standard deviations must be positive.");
      return;
    }
    if (alpha <= 0 || alpha >= 1) {
      setError("Significance level α must be between 0 and 1 (exclusive).");
      return;
    }

    try {
      const base64 = await runTestFunction("two_independent_z_test", {
        n1,
        n2,
        sigma1,
        sigma2,
        x_bar1: xBar1,
        x_bar2: xBar2,
        alpha,
        tail_type: tailType,
      });
      setImgB64(base64);
    } catch {
      setError("Unable to generate the two-sample Z-test plot.");
    }
  }

  function handleClear() {
    setN1(defaultValues.n1);
    setN2(defaultValues.n2);
    setSigma1(defaultValues.sigma1);
    setSigma2(defaultValues.sigma2);
    setXBar1(defaultValues.xBar1);
    setXBar2(defaultValues.xBar2);
    setAlpha(defaultValues.alpha);
    setTailType(defaultValues.tailType);
    setImgB64("");
    setError("");
  }

  function handleDownload() {
    if (!imgB64) return;
    const link = document.createElement("a");
    link.href = `data:image/png;base64,${imgB64}`;
    link.download = "two_independent_z_test.png";
    link.click();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      {error && (
        <div className="bg-red-100 text-red-800 px-3 py-2 rounded">{error}</div>
      )}

      <div className="flex flex-col">
        <label className="mb-1">n₁:</label>
        <input
          type="number"
          value={n1}
          onChange={(e) => setN1(Number(e.target.value))}
          className="bg-gray-800 text-white rounded px-2 py-1"
        />
      </div>
      <div className="flex flex-col">
        <label className="mb-1">n₂:</label>
        <input
          type="number"
          value={n2}
          onChange={(e) => setN2(Number(e.target.value))}
          className="bg-gray-800 text-white rounded px-2 py-1"
        />
      </div>

      <div className="flex flex-col">
        <label className="mb-1">σ₁:</label>
        <input
          type="number"
          step="0.01"
          value={sigma1}
          onChange={(e) => setSigma1(Number(e.target.value))}
          className="bg-gray-800 text-white rounded px-2 py-1"
        />
      </div>
      <div className="flex flex-col">
        <label className="mb-1">σ₂:</label>
        <input
          type="number"
          step="0.01"
          value={sigma2}
          onChange={(e) => setSigma2(Number(e.target.value))}
          className="bg-gray-800 text-white rounded px-2 py-1"
        />
      </div>

      <div className="flex flex-col">
        <label className="mb-1">x̄₁:</label>
        <input
          type="number"
          step="0.01"
          value={xBar1}
          onChange={(e) => setXBar1(Number(e.target.value))}
          className="bg-gray-800 text-white rounded px-2 py-1"
        />
      </div>
      <div className="flex flex-col">
        <label className="mb-1">x̄₂:</label>
        <input
          type="number"
          step="0.01"
          value={xBar2}
          onChange={(e) => setXBar2(Number(e.target.value))}
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
          <option value={1}>Left-tailed (H₁: μ₁ − μ₂ &lt; 0)</option>
          <option value={2}>Right-tailed (H₁: μ₁ − μ₂ &gt; 0)</option>
          <option value={3}>Two-tailed (H₁: μ₁ − μ₂ ≠ 0)</option>
        </select>
      </div>

      <div className="flex flex-col space-y-2">
        <Button type="submit">Solve &amp; Graph</Button>
        <Button variant="outline" onClick={handleClear}>Clear Form</Button>
      </div>

      {imgB64 && (
        <div className="mt-4">
          <img
            src={`data:image/png;base64,${imgB64}`}  alt="Two-Sample Z-Test Plot"
            className="rounded"
          />
          <Button onClick={handleDownload} className="mt-2">Download Image</Button>
        </div>
      )}
    </form>
  );
}
