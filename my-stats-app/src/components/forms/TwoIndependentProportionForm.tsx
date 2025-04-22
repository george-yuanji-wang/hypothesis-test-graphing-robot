// src/components/forms/TwoIndependentProportionForm.tsx
import React, { useState } from "react";
import { runTestFunction } from "../../pyodideLoader";
import { Button } from "@/components/ui/button";

export default function TwoIndependentProportionForm() {
  const defaultValues = {
    x1: 60,      // successes in group 1
    n1: 100,     // trials in group 1
    x2: 50,      // successes in group 2
    n2: 90,      // trials in group 2
    alpha: 0.05, // significance level
    tailType: 3, // default to Two-tailed
  };

  const [x1, setX1] = useState<number>(defaultValues.x1);
  const [n1, setN1] = useState<number>(defaultValues.n1);
  const [x2, setX2] = useState<number>(defaultValues.x2);
  const [n2, setN2] = useState<number>(defaultValues.n2);
  const [alpha, setAlpha] = useState<number>(defaultValues.alpha);
  const [tailType, setTailType] = useState<number>(defaultValues.tailType);
  const [imgB64, setImgB64] = useState<string>("");
  const [error, setError] = useState<string>("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (x1 < 0 || x1 > n1 || x2 < 0 || x2 > n2) {
      setError("Success counts must be between 0 and their respective trial counts.");
      return;
    }
    if (n1 < 1 || n2 < 1) {
      setError("Trial counts must be at least 1.");
      return;
    }
    if (alpha <= 0 || alpha >= 1) {
      setError("Significance level α must be between 0 and 1 (exclusive).");
      return;
    }

    try {
      const base64 = await runTestFunction("two_independent_proportion_z_test", {
        x1,
        x2,
        n1,
        n2,
        alpha,
        tail_type: tailType,
      });
      setImgB64(base64);
    } catch {
      setError("Unable to generate the two-sample proportion Z-test plot.");
    }
  }

  function handleClear() {
    setX1(defaultValues.x1);
    setN1(defaultValues.n1);
    setX2(defaultValues.x2);
    setN2(defaultValues.n2);
    setAlpha(defaultValues.alpha);
    setTailType(defaultValues.tailType);
    setImgB64("");
    setError("");
  }

  function handleDownload() {
    if (!imgB64) return;
    const link = document.createElement("a");
    link.href = `data:image/png;base64,${imgB64}`;
    link.download = "two_independent_proportion_z_test.png";
    link.click();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      {error && (
        <div className="bg-red-100 text-red-800 px-3 py-2 rounded">{error}</div>
      )}

      <div className="flex flex-col">
        <label className="mb-1">x₁ (successes):</label>
        <input
          type="number"
          value={x1}
          onChange={(e) => setX1(Number(e.target.value))}
          className="bg-gray-800 text-white rounded px-2 py-1"
        />
      </div>

      <div className="flex flex-col">
        <label className="mb-1">n₁ (trials):</label>
        <input
          type="number"
          value={n1}
          onChange={(e) => setN1(Number(e.target.value))}
          className="bg-gray-800 text-white rounded px-2 py-1"
        />
      </div>

      <div className="flex flex-col">
        <label className="mb-1">x₂ (successes):</label>
        <input
          type="number"
          value={x2}
          onChange={(e) => setX2(Number(e.target.value))}
          className="bg-gray-800 text-white rounded px-2 py-1"
        />
      </div>

      <div className="flex flex-col">
        <label className="mb-1">n₂ (trials):</label>
        <input
          type="number"
          value={n2}
          onChange={(e) => setN2(Number(e.target.value))}
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
          <option value={1}>Left-tailed (H₁: p₁ − p₂ &lt; 0)</option>
          <option value={2}>Right-tailed (H₁: p₁ − p₂ &gt; 0)</option>
          <option value={3}>Two-tailed (H₁: p₁ − p₂ ≠ 0)</option>
        </select>
      </div>

      <div className="flex flex-col space-y-2">
        <Button type="submit">Solve &amp; Graph</Button>
        <Button variant="outline" onClick={handleClear}>Clear Form</Button>
      </div>

      {imgB64 && (
        <div className="mt-4">
          <img
            src={`data:image/png;base64,${imgB64}`}  alt="Proportion Z-Test Plot"
            className="rounded"
          />
          <Button onClick={handleDownload} className="mt-2">Download Image</Button>
        </div>
      )}
    </form>
  );
}