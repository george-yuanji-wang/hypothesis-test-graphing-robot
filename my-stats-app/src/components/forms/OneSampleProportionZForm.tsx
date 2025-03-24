// src/components/forms/OneSampleProportionZForm.tsx
import React, { useState } from "react";
import { runTestFunction } from "../../pyodideLoader";

export default function OneSampleProportionZForm() {
  const defaultValues = { n: 100, pHat: 0.55, p: 0.5, alpha: 0.05, tailType: 1 };
  const [n, setN] = useState<number>(defaultValues.n);
  const [pHat, setPHat] = useState<number>(defaultValues.pHat);
  const [p, setP] = useState<number>(defaultValues.p);
  const [alpha, setAlpha] = useState<number>(defaultValues.alpha);
  const [tailType, setTailType] = useState<number>(defaultValues.tailType);
  const [imgB64, setImgB64] = useState<string>("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const base64 = await runTestFunction("one_sample_proportion_z_test", {
        n,
        p_hat: pHat,
        p,
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
        <label className="mb-1">p̂:</label>
        <input
          type="number"
          step="0.01"
          value={pHat}
          onChange={(e) => setPHat(Number(e.target.value))}
          className="bg-gray-800 text-white rounded px-2 py-1"
        />
      </div>
      <div className="flex flex-col">
        <label className="mb-1">p:</label>
        <input
          type="number"
          step="0.01"
          value={p}
          onChange={(e) => setP(Number(e.target.value))}
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
