// src/components/forms/ChiSquareIndependenceForm.tsx
import React, { useState } from "react";
import { runTestFunction } from "../../pyodideLoader";
import { Button } from "@/components/ui/button";

export default function ChiSquareIndependenceForm() {
  const defaultValues = {
    table: "20,15,10;12,18,14;8,22,16",
    alpha: 0.05
  };

  const [table, setTable] = useState<string>(defaultValues.table);
  const [alpha, setAlpha] = useState<number>(defaultValues.alpha);
  const [imgB64, setImgB64] = useState<string>("");
  const [error, setError] = useState<string>("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const rows = table
      .split(";")
      .map((r) => r.split(",").map((v) => Number(v.trim())));

    if (rows.length < 2 || rows[0].length < 2) {
      setError("Independence test requires at least a 2×2 table.");
      return;
    }
    if (rows.some((r) => r.length !== rows[0].length || r.some(isNaN))) {
      setError("Each row must have the same number of numeric values.");
      return;
    }
    if (alpha <= 0 || alpha >= 1) {
      setError("Significance level α must be between 0 and 1.");
      return;
    }

    try {
      const base64 = await runTestFunction(
        "chi_square_independence_test",
        { observed_table: rows, alpha }
      );
      setImgB64(base64);
    } catch {
      setError("Unable to generate the independence test plot.");
    }
  }

  function handleClear() {
    setTable(defaultValues.table);
    setAlpha(defaultValues.alpha);
    setImgB64("");
    setError("");
  }

  function handleDownload() {
    if (!imgB64) return;
    const link = document.createElement("a");
    link.href = `data:image/png;base64,${imgB64}`;
    link.download = "chi_square_independence_test.png";
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
        <label className="mb-1">each row is separated by semicolons (;) and separate by commas (,) within a row:</label>
        <input
          type="text"
          value={table}
          onChange={(e) => setTable(e.target.value)}
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
            alt="Independence Plot"
            className="rounded"
          />
          <Button onClick={handleDownload} className="mt-2">Download Image</Button>
        </div>
      )}
    </form>
  );
}
