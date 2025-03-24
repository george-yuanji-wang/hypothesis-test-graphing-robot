// src/components/forms/TwoIndependentZForm.tsx
import React, { useState } from "react";
import { runTestFunction } from "../../pyodideLoader";

export default function TwoIndependentZForm() {
  const defaultValues = { n1: 35, n2: 40, sigma1: 3.2, sigma2: 3.4, xBar1: 10.5, xBar2: 9.8, alpha: 0.05, tailType: 1 };
  const [n1, setN1] = useState<number>(defaultValues.n1);
  const [n2, setN2] = useState<number>(defaultValues.n2);
  const [sigma1, setSigma1] = useState<number>(defaultValues.sigma1);
  const [sigma2, setSigma2] = useState<number>(defaultValues.sigma2);
  const [xBar1, setXBar1] = useState<number>(defaultValues.xBar1);
  const [xBar2, setXBar2] = useState<number>(defaultValues.xBar2);
  const [alpha, setAlpha] = useState<number>(defaultValues.alpha);
  const [tailType, setTailType] = useState<number>(defaultValues.tailType);
  const [imgB64, setImgB64] = useState<string>("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
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
    } catch (error) {
      console.error("Error generating plot:", error);
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
