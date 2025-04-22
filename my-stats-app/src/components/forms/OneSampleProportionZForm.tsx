// src/components/forms/OneSampleProportionZForm.tsx
import React, { useState } from "react";
import { runTestFunction } from "../../pyodideLoader";
import { Button } from "@/components/ui/button";

export default function OneSampleProportionZForm() {
  const defaultValues = {
    n: 150,
    pHat: 0.60,
    p: 0.50,
    alpha: 0.05,
    tailType: 3, // default to Two-tailed
  };

  const [n, setN] = useState<number>(defaultValues.n);
  const [pHat, setPHat] = useState<number>(defaultValues.pHat);
  const [p, setP] = useState<number>(defaultValues.p);
  const [alpha, setAlpha] = useState<number>(defaultValues.alpha);
  const [tailType, setTailType] = useState<number>(defaultValues.tailType);
  const [imgB64, setImgB64] = useState<string>("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const base64 = await runTestFunction("one_sample_proportion_z_test", {
      n,
      p_hat: pHat,
      p,
      alpha,
      tail_type: tailType,
    });
    setImgB64(base64);
  }

  function handleClear() {
    setN(defaultValues.n);
    setPHat(defaultValues.pHat);
    setP(defaultValues.p);
    setAlpha(defaultValues.alpha);
    setTailType(defaultValues.tailType);
    setImgB64("");
  }

  function handleDownload() {
    if (!imgB64) return;
    const link = document.createElement("a");
    link.href = `data:image/png;base64,${imgB64}`;
    link.download = "one_sample_proportion_z_test.png";
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

      {/* p̂ */}
      <div className="flex flex-col">
        <label className="mb-1">p̂:</label>
        <input
          type="number"
          step="0.01"
          value={pHat}
          onChange={(e) => setPHat(Number(e.target.value))}
          className="bg-gray-800 text-white rounded px-2 py-1"
        />
      </div>

      {/* p₀ */}
      <div className="flex flex-col">
        <label className="mb-1">p₀:</label>
        <input
          type="number"
          step="0.01"
          value={p}
          onChange={(e) => setP(Number(e.target.value))}
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
          <option value={1}>Left-tailed (H₁: p &lt; p₀)</option>
          <option value={2}>Right-tailed (H₁: p &gt; p₀)</option>
          <option value={3}>Two-tailed (H₁: p ≠ p₀)</option>
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
            alt="Proportion Z-Test Plot"
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