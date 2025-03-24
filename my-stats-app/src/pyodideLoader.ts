// src/pyodideLoader.ts
let pyodide: any = null;

export async function initPyodide() {
  if (pyodide) return pyodide;

  const w = window as any;
  pyodide = await w.loadPyodide({
    indexURL: "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/",
  });

  // load micropip so we can install python packages
  await pyodide.loadPackage("micropip");
  const micropip = pyodide.pyimport("micropip");

  // install the packages we need (scipy, matplotlib, numpy)
  await micropip.install(["matplotlib", "numpy", "scipy"]);

  // fetch the stats_code.py
  const resp = await fetch("/stats_code.py");
  const code = await resp.text();
  pyodide.runPython(code);

  return pyodide;
}

/**
 * Runs one of the 9 test functions by name, passing the needed parameters.
 * We'll do a naive approach: pass a JSON of arguments to Python.
 */
export async function runTestFunction(fnName: string, args: Record<string, any>) {
  if (!pyodide) throw new Error("Pyodide not initialized. Call initPyodide() first.");

  // store arguments in pyodide globals
  pyodide.globals.set("args_json", JSON.stringify(args));
  pyodide.globals.set("fnName", fnName);

  const code = `
import json
params = json.loads(args_json)
# We assume each test function is in the global namespace or in a TESTS dict
# We'll do: res = TESTS[fnName](**params)
res = TESTS[fnName](**params)
res
`;
  const out = pyodide.runPython(code);
  // 'out' should be the base64 string
  return out;
}
