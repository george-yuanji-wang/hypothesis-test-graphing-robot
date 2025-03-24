import React, { useState } from "react";
import { runTestFunction } from "../../pyodideLoader";

export default function TwoIndependentProportionForm() {
  const defaultValues = { 
    x1: 40, 
    x2: 30, 
    n1: 80, 
    n2: 70, 
    alpha: 0.05, 
    tailType: 2 
  };
  const [x1, setX1] = useState<number>(defaultValues.x1);
  const [x2, setX2] = useState<number>(defaultValues.x2);
  const [n1, setN1] = useState<number>(defaultValues.n1);
  const [n2, setN2] = useState<number>(defaultValues.n2);
  const [alpha, setAlpha] = useState<number>(defaultValues.alpha);
  const [tailType, setTailType] = useState<number>(defaultValues.tailType);
  const [imgB64, setImgB64] = useState<string>("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
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
    } catch (error) {
      console.error("Error generating plot:", error);
    }
  }

  function handleClear() {
    setX1(defaultValues.x1);
    setX2(defaultValues.x2);
    setN1(defaultValues.n1);
    setN2(defaultValues.n2);
    setAlpha(defaultValues.alpha);
    setTailType(defaultValues.tailType);
    setImgB64("");
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
      {/* x₁ */}
      <div className="flex flex-col">
        <label className="mb-1">x₁ (successes):</label>
        <input
          type="number"
          value={x1}
          onChange={(e) => setX1(Number(e.target.value))}
          className="bg-gray-800 text-white rounded px-2 py-1"
        />
      </div>
      
      {/* x₂ */}
      <div className="flex flex-col">
        <label className="mb-1">x₂ (successes):</label>
        <input
          type="number"
          value={x2}
          onChange={(e) => setX2(Number(e.target.value))}
          className="bg-gray-800 text-white rounded px-2 py-1"
        />
      </div>
      
      {/* n₁ */}
      <div className="flex flex-col">
        <label className="mb-1">n₁:</label>
        <input
          type="number"
          value={n1}
          onChange={(e) => setN1(Number(e.target.value))}
          className="bg-gray-800 text-white rounded px-2 py-1"
        />
      </div>
      
      {/* n₂ */}
      <div className="flex flex-col">
        <label className="mb-1">n₂:</label>
        <input
          type="number"
          value={n2}
          onChange={(e) => setN2(Number(e.target.value))}
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
          <option value={1}>Left-tailed (H₁: p₁ - p₂ &lt; 0)</option>
          <option value={2}>Right-tailed (H₁: p₁ - p₂ &gt; 0)</option>
          <option value={3}>Two-tailed (H₁: p₁ - p₂ &ne; 0)</option>
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
      
      {/* Image Output and Download */}
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
