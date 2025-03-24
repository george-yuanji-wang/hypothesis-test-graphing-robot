import React, { useState } from "react";
import { runTestFunction } from "../../pyodideLoader";

export default function TwoDependentZForm() {
  const defaultValues = { n: 20, sigmaD: 3, dBar: 1.2, alpha: 0.01, tailType: 1 };
  const [n, setN] = useState<number>(defaultValues.n);
  const [sigmaD, setSigmaD] = useState<number>(defaultValues.sigmaD);
  const [dBar, setDBar] = useState<number>(defaultValues.dBar);
  const [alpha, setAlpha] = useState<number>(defaultValues.alpha);
  const [tailType, setTailType] = useState<number>(defaultValues.tailType);
  const [imgB64, setImgB64] = useState<string>("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const base64 = await runTestFunction("two_dependent_z_test", {
        n,
        sigma_d: sigmaD,
        d_bar: dBar,
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
    setSigmaD(defaultValues.sigmaD);
    setDBar(defaultValues.dBar);
    setAlpha(defaultValues.alpha);
    setTailType(defaultValues.tailType);
    setImgB64("");
  }

  function handleDownload() {
    if (!imgB64) return;
    const link = document.createElement("a");
    link.href = `data:image/png;base64,${imgB64}`;
    link.download = "two_dependent_z_test.png";
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
      
      {/* σ_d */}
      <div className="flex flex-col">
        <label className="mb-1">σ_d:</label>
        <input
          type="number"
          step="0.01"
          value={sigmaD}
          onChange={(e) => setSigmaD(Number(e.target.value))}
          className="bg-gray-800 text-white rounded px-2 py-1"
        />
      </div>
      
      {/* d̄ */}
      <div className="flex flex-col">
        <label className="mb-1">d̄:</label>
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
      
      {/* Tail Type Dropdown */}
      <div className="flex flex-col">
        <label className="mb-1">Tail Type:</label>
        <select
          value={tailType}
          onChange={(e) => setTailType(Number(e.target.value))}
          className="bg-gray-800 text-white rounded px-2 py-1"
        >
          <option value={1}>Left-tailed (H₁: d̄ &lt; 0)</option>
          <option value={2}>Right-tailed (H₁: d̄ &gt; 0)</option>
          <option value={3}>Two-tailed (H₁: d̄ &ne; 0)</option>
        </select>
      </div>
      
      {/* Form Buttons */}
      <div className="flex flex-col space-y-2">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Solve &amp; Graph
        </button>
        <button type="button" onClick={handleClear} className="bg-gray-600 text-white px-4 py-2 rounded">
          Clear Form
        </button>
      </div>
      
      {/* Image Output and Download Button */}
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
