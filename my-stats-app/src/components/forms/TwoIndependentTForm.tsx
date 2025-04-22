// src/components/forms/TwoIndependentTForm.tsx
import React, { useState } from "react";
import { runTestFunction } from "../../pyodideLoader";
import { Button } from "@/components/ui/button";

export default function TwoIndependentTForm() {
  const defaultValues = {
    n1: 20,
    n2: 25,
    s1: 4.2,
    s2: 4.5,
    xBar1: 100,
    xBar2: 103,
    alpha: 0.05,
    tailType: 3, // default to Two-tailed
  };

  const [n1, setN1] = useState<number>(defaultValues.n1);
  const [n2, setN2] = useState<number>(defaultValues.n2);
  const [s1, setS1] = useState<number>(defaultValues.s1);
  const [s2, setS2] = useState<number>(defaultValues.s2);
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
      setError("Sample sizes must be at least 2.");
      return;
    }
    if (s1 <= 0 || s2 <= 0) {
      setError("Standard deviations must be positive.");
      return;
    }
    if (alpha <= 0 || alpha >= 1) {
      setError("Significance level α must be between 0 and 1 (exclusive).");
      return;
    }

    try {
      const base64 = await runTestFunction("two_independent_t_test", {
        n1,
        n2,
        s1,
        s2,
        x_bar1: xBar1,
        x_bar2: xBar2,
        alpha,
        tail_type: tailType,
      });
      setImgB64(base64);
    } catch {
      setError("Unable to generate the two-sample t-test plot.");
    }
  }

  function handleClear() {
    setN1(defaultValues.n1);
    setN2(defaultValues.n2);
    setS1(defaultValues.s1);
    setS2(defaultValues.s2);
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
    link.download = "two_independent_t_test.png";
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
        <label className="mb-1">s₁ (SD₁):</label>
        <input
          type="number"
          step="0.01"
          value={s1}
          onChange={(e) => setS1(Number(e.target.value))}
          className="bg-gray-800 text-white rounded px-2 py-1"
        />
      </div>

      <div className="flex flex-col">
        <label className="mb-1">s₂ (SD₂):</label>
        <input
          type="number"
          step="0.01"
          value={s2}
          onChange={(e) => setS2(Number(e.target.value))}
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
            src={`data:image/png;base64,${imgB64}`}
            alt="Two-Sample T-Test Plot"
            className="rounded"
          />
          <Button onClick={handleDownload} className="mt-2">Download Image</Button>
        </div>
      )}
    </form>
  );
}
