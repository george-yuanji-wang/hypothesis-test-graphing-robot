// src/App.tsx
import { useEffect, useState } from "react";
import LoadingScreen from "./LoadingScreen";
import MainContent from "./MainContent";
import { initPyodide } from "./pyodideLoader";
import "./App.css";
export default function App() {
  const [pyReady, setPyReady] = useState(false);

  useEffect(() => {
    initPyodide().then(() => setPyReady(true));
  }, []);

  if (!pyReady) {
    return <LoadingScreen />;
  }

  return <MainContent />;
}
