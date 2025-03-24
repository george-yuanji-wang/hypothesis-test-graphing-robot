import React, { useState } from "react";
import { runTestFunction } from "../../pyodideLoader";

export default function OneSampleZForm() {
  const defaultValues = { 
    n: 30, 
    sigma: 5, 
    xBar: 10, 
    mu: 0, 
    alpha: 0.05, 
    tailType: 1  // default to Left-tailed
  };

  const [n, setN] = useState<number>(defaultValues.n);
  const [sigma, setSigma] = useState<number>(defaultValues.sigma);
  const [xBar, setXBar] = useState<number>(defaultValues.xBar);
  const [mu, setMu] = useState<number>(defaultValues.mu);
  const [alpha, setAlpha] = useState<number>(defaultValues.alpha);
  const [tailType, setTailType] = useState<number>(defaultValues.tailType);
  const [imgB64, setImgB64] = useState<string>("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const base64 = await runTestFunction("one_sample_z_test", {
        n,
        sigma,
        x_bar: xBar,
        mu,
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
    setSigma(defaultValues.sigma);
    setXBar(defaultValues.xBar);
    setMu(defaultValues.mu);
    setAlpha(defaultValues.alpha);
    setTailType(defaultValues.tailType);
    setImgB64("");
  }

  function handleDownload() {
    if (!imgB64) return;
    const link = document.createElement("a");
    link.href = `data:image/png;base64,${imgB64}`;
    link.download = "one_sample_z_test.png";
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
      
      {/* σ */}
      <div className="flex flex-col">
        <label className="mb-1">σ:</label>
        <input
          type="number"
          step="0.01"
          value={sigma}
          onChange={(e) => setSigma(Number(e.target.value))}
          className="bg-gray-800 text-white rounded px-2 py-1"
        />
      </div>
      
      {/* x̄ */}
      <div className="flex flex-col">
        <label className="mb-1">x̄:</label>
        <input
          type="number"
          step="0.01"
          value={xBar}
          onChange={(e) => setXBar(Number(e.target.value))}
          className="bg-gray-800 text-white rounded px-2 py-1"
        />
      </div>
      
      {/* μ */}
      <div className="flex flex-col">
        <label className="mb-1">μ:</label>
        <input
          type="number"
          step="0.01"
          value={mu}
          onChange={(e) => setMu(Number(e.target.value))}
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
          <option value={1}>
            Left-tailed (H₁: μ &lt; μ₀)
          </option>
          <option value={2}>
            Right-tailed (H₁: μ &gt; μ₀)
          </option>
          <option value={3}>
            Two-tailed (H₁: μ &ne; μ₀)
          </option>
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
      
      {/* Plot Output and Download Button */}
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
