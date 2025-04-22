// src/components/forms/ChiSquareGofForm.tsx
import React, { useState } from "react";
import { runTestFunction } from "../../pyodideLoader";
import { Button } from "@/components/ui/button";

export default function ChiSquareGofForm() {
  const defaultValues = {
    observed: "10,20,30",
    expected: "15,25,20",
    alpha: 0.05,
  };

  const [observed, setObserved] = useState<string>(defaultValues.observed);
  const [expected, setExpected] = useState<string>(defaultValues.expected);
  const [alpha, setAlpha] = useState<number>(defaultValues.alpha);
  const [imgB64, setImgB64] = useState<string>("");
  const [error, setError] = useState<string>("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const obsArr = observed.split(",").map((v) => Number(v.trim()));
    const expArr = expected.split(",").map((v) => Number(v.trim()));

    if (obsArr.length !== expArr.length) {
      setError("The number of observed and expected categories must match.");
      return;
    }
    if (obsArr.length < 2) {
      setError("At least two categories are required for goodness‑of‑fit.");
      return;
    }
    if (obsArr.some(isNaN) || expArr.some(isNaN)) {
      setError("All inputs must be valid numbers.");
      return;
    }
    if (expArr.some((v) => v <= 0)) {
      setError("Expected frequencies must be strictly positive.");
      return;
    }
    if (alpha <= 0 || alpha >= 1) {
      setError("Significance level α must be between 0 and 1 (exclusive).");
      return;
    }

    try {
      const base64 = await runTestFunction("chi_square_gof_test", { observed: obsArr, expected: expArr, alpha });
      setImgB64(base64);
    } catch {
      setError("Unable to generate the goodness‑of‑fit plot.");
    }
  }

  function handleClear() {
    setObserved(defaultValues.observed);
    setExpected(defaultValues.expected);
    setAlpha(defaultValues.alpha);
    setImgB64("");
    setError("");
  }

  function handleDownload() {
    if (!imgB64) return;
    const link = document.createElement("a");
    link.href = `data:image/png;base64,${imgB64}`;
    link.download = "chi_square_gof_test.png";
    link.click();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      {error && (
        <div className="bg-red-100 text-red-800 px-3 py-2 rounded">
          {error}
        </div>
      )}

      <div className="flex flex-col">
        <label className="mb-1">Observed (comma-separated):</label>
        <input
          type="text"
          value={observed}
          onChange={(e) => setObserved(e.target.value)}
          className="bg-gray-800 text-white rounded px-2 py-1"
        />
      </div>

      <div className="flex flex-col">
        <label className="mb-1">Expected (comma-separated):</label>
        <input
          type="text"
          value={expected}
          onChange={(e) => setExpected(e.target.value)}
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

      <div className="flex flex-col space-y-2">
        <Button type="submit">Solve &amp; Graph</Button>
        <Button variant="outline" onClick={handleClear}>Clear Form</Button>
      </div>

      {imgB64 && (
        <div className="mt-4">
          <img
            src={`data:image/png;base64,${imgB64}`}
            alt="GOF Plot"
            className="rounded"
          />
          <Button onClick={handleDownload} className="mt-2">Download Image</Button>
        </div>
      )}
    </form>
  );
}