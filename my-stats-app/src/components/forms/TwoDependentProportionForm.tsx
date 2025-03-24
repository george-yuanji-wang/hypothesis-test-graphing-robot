// src/components/forms/TwoDependentProportionForm.tsx
import React, { useState } from "react";
import { runTestFunction } from "../../pyodideLoader";

export default function TwoDependentProportionForm() {
  const defaultValues = { n10: 12, n01: 6, n11: 20, n00: 25, alpha: 0.05, tailType: 2 };
  const [n10, setN10] = useState<number>(defaultValues.n10);
  const [n01, setN01] = useState<number>(defaultValues.n01);
  const [n11, setN11] = useState<number>(defaultValues.n11);
  const [n00, setN00] = useState<number>(defaultValues.n00);
  const [alpha, setAlpha] = useState<number>(defaultValues.alpha);
  const [tailType, setTailType] = useState<number>(defaultValues.tailType);
  const [imgB64, setImgB64] = useState<string>("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const base64 = await runTestFunction("two_dependent_proportion_test", {
        n10,
        n01,
        n11,
        n00,
        alpha,
        tail_type: tailType,
      });
      setImgB64(base64);
    } catch (error) {
      console.error("Error generating plot:", error);
    }
  }

  function handleClear() {
    setN10(defaultValues.n10);
    setN01(defaultValues.n01);
    setN11(defaultValues.n11);
    setN00(defaultValues.n00);
    setAlpha(defaultValues.alpha);
    setTailType(defaultValues.tailType);
    setImgB64("");
  }

  function handleDownload() {
    if (!imgB64) return;
    const link = document.createElement("a");
    link.href = `data:image/png;base64,${imgB64}`;
    link.download = "two_dependent_proportion_test.png";
    link.click();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div className="flex flex-col">
        <label className="mb-1">n₁₀:</label>
        <input
          type="number"
          value={n10}
          onChange={(e) => setN10(Number(e.target.value))}
          className="bg-gray-800 text-white rounded px-2 py-1"
        />
      </div>
      <div className="flex flex-col">
        <label className="mb-1">n₀₁:</label>
        <input
          type="number"
          value={n01}
          onChange={(e) => setN01(Number(e.target.value))}
          className="bg-gray-800 text-white rounded px-2 py-1"
        />
      </div>
      <div className="flex flex-col">
        <label className="mb-1">n₁₁:</label>
        <input
          type="number"
          value={n11}
          onChange={(e) => setN11(Number(e.target.value))}
          className="bg-gray-800 text-white rounded px-2 py-1"
        />
      </div>
      <div className="flex flex-col">
        <label className="mb-1">n₀₀:</label>
        <input
          type="number"
          value={n00}
          onChange={(e) => setN00(Number(e.target.value))}
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
        <label className="mb-1">tailType (typically 2):</label>
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
        <button type="button" onClick={handleClear} className="bg-gray-600 text-white px-4 py-2 rounded">
          Clear Form
        </button>
      </div>
      {imgB64 && (
        <div className="mt-4">
          <img src={`data:image/png;base64,${imgB64}`} alt="Plot" className="border border-white" />
          <button type="button" onClick={handleDownload} className="bg-green-600 text-white px-4 py-2 rounded mt-2">
            Download Image
          </button>
        </div>
      )}
    </form>
  );
}
