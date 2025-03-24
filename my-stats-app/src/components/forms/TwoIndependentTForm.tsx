// src/components/forms/TwoIndependentTForm.tsx
import React, { useState } from "react";
import { runTestFunction } from "../../pyodideLoader";

export default function TwoIndependentTForm() {
  const defaultValues = { n1: 25, n2: 30, s1: 2.4, s2: 2.1, xBar1: 8.2, xBar2: 9.1, alpha: 0.05, tailType: 2 };
  const [n1, setN1] = useState<number>(defaultValues.n1);
  const [n2, setN2] = useState<number>(defaultValues.n2);
  const [s1, setS1] = useState<number>(defaultValues.s1);
  const [s2, setS2] = useState<number>(defaultValues.s2);
  const [xBar1, setXBar1] = useState<number>(defaultValues.xBar1);
  const [xBar2, setXBar2] = useState<number>(defaultValues.xBar2);
  const [alpha, setAlpha] = useState<number>(defaultValues.alpha);
  const [tailType, setTailType] = useState<number>(defaultValues.tailType);
  const [imgB64, setImgB64] = useState<string>("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
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
    } catch (error) {
      console.error("Error generating plot:", error);
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
        <label className="mb-1">s₁:</label>
        <input
          type="number"
          step="0.01"
          value={s1}
          onChange={(e) => setS1(Number(e.target.value))}
          className="bg-gray-800 text-white rounded px-2 py-1"
        />
      </div>
      <div className="flex flex-col">
        <label className="mb-1">s₂:</label>
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
