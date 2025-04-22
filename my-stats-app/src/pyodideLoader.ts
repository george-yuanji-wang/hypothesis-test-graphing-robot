// src/pyodideLoader.ts
let pyodide: any = null;

export async function initPyodide() {
  if (pyodide) return pyodide;

  const w = window as any;
  pyodide = await w.loadPyodide({
    indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.23.4/full/',
  });

  await pyodide.loadPackage(['numpy', 'scipy', 'matplotlib']);


  // caches
  /*
  if (!statsCode) {
    let code = localStorage.getItem(STORAGE_KEY);
    if (!code) {
      const resp = await fetch('/stats_code.py', { cache: 'force-cache' });
      code = await resp.text();
      localStorage.setItem(STORAGE_KEY, code);
    }
    statsCode = code;
  }
  await pyodide.runPythonAsync(statsCode!);
  */

  //bypass caching
  const resp = await fetch(`/stats_code.py?ts=${Date.now()}`, { cache: 'no-store' });
  const code = await resp.text();
  await pyodide.runPythonAsync(code);

  try {
    const proxy = pyodide.runPython('list(TESTS.keys())');
    const keys = proxy.toJs ? proxy.toJs() : proxy;
    console.log('🐍 TESTS keys:', keys);
    proxy.destroy?.();
  } catch (e) {
    console.error('Could not inspect TESTS.keys():', e);
  }

  return pyodide;
}

export async function runTestFunction(
  fnName: string,
  args: Record<string, any>
) {
  if (!pyodide) throw new Error('Pyodide not initialized. Call initPyodide() first.');

  pyodide.globals.set('args_json', JSON.stringify(args));
  pyodide.globals.set('fnName', fnName);

  const code = `
import json
params = json.loads(args_json)
res = TESTS[fnName](**params)
res
`;

  return pyodide.runPython(code);
}
